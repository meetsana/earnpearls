import { CSRF_HEADER_NAME, readCsrfToken } from "../lib/csrf";
import type { ErrorEnvelope } from "./types";

export const API_BASE = "/v1";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

const MUTATING_METHODS = new Set<HttpMethod>([
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
]);

export type ApiErrorKind =
  | "validation"
  | "unauthenticated"
  | "forbidden"
  | "notFound"
  | "conflict"
  | "rateLimited"
  | "server"
  | "network";

export interface ApiError {
  kind: ApiErrorKind;
  status: number | null;
  code: string;
  message: string;
  requestId: string | null;
  details?: unknown;
  retryAfterSeconds?: number | null;
}

export class ApiFailure extends Error {
  constructor(public readonly error: ApiError) {
    super(error.message);
    this.name = "ApiFailure";
  }
}

export interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  idempotencyKey?: string;
  signal?: AbortSignal;
}

function isErrorEnvelope(value: unknown): value is ErrorEnvelope {
  if (typeof value !== "object" || value === null || !("error" in value))
    return false;
  const error = (value as { error?: unknown }).error;
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    "message" in error &&
    "requestId" in error
  );
}

function kindForStatus(status: number): ApiErrorKind {
  if (status === 400) return "validation";
  if (status === 401) return "unauthenticated";
  if (status === 403) return "forbidden";
  if (status === 404) return "notFound";
  if (status === 409) return "conflict";
  if (status === 429) return "rateLimited";
  return "server";
}

async function parseError(response: Response): Promise<ApiError> {
  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  const envelope = isErrorEnvelope(payload) ? payload.error : null;
  const retryAfter = response.headers.get("Retry-After");
  const parsedRetryAfter =
    retryAfter === null ? null : Number.parseInt(retryAfter, 10);

  return {
    kind: kindForStatus(response.status),
    status: response.status,
    code: envelope?.code ?? "HTTP_ERROR",
    message: envelope?.message ?? "The request could not be completed.",
    requestId: envelope?.requestId ?? null,
    ...(envelope?.details === undefined ? {} : { details: envelope.details }),
    ...(response.status === 429
      ? {
          retryAfterSeconds: Number.isFinite(parsedRetryAfter)
            ? parsedRetryAfter
            : null,
        }
      : {}),
  };
}

/** Single request boundary. No request is automatically retried. */
export async function request<TResponse>(
  path: string,
  options: RequestOptions = {},
): Promise<TResponse> {
  const method = options.method ?? "GET";
  const headers: Record<string, string> = { Accept: "application/json" };

  if (options.body !== undefined) headers["Content-Type"] = "application/json";
  if (MUTATING_METHODS.has(method)) {
    const csrfToken = readCsrfToken();
    if (csrfToken !== null) headers[CSRF_HEADER_NAME] = csrfToken;
  }
  if (options.idempotencyKey !== undefined) {
    headers["Idempotency-Key"] = options.idempotencyKey;
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method,
      credentials: "include",
      headers,
      ...(options.body === undefined
        ? {}
        : { body: JSON.stringify(options.body) }),
      ...(options.signal === undefined ? {} : { signal: options.signal }),
    });
  } catch {
    throw new ApiFailure({
      kind: "network",
      status: null,
      code: "NETWORK_ERROR",
      message:
        "We could not reach EarnPearls. Check your connection and try again.",
      requestId: null,
    });
  }

  if (!response.ok) throw new ApiFailure(await parseError(response));
  if (response.status === 204) return undefined as TResponse;
  return (await response.json()) as TResponse;
}
