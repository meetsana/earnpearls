import type { ReactNode } from "react";

import { ApiFailure } from "../api/client";

export function LoadingState({ label = "Loading" }: { label?: string }) {
  return (
    <div className="state-panel" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <p>{label}…</p>
    </div>
  );
}

export function EmptyState({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      className="state-panel state-panel--empty"
      aria-labelledby="empty-title"
    >
      <h2 id="empty-title">{title}</h2>
      <div>{children}</div>
    </section>
  );
}

export function ErrorNotice({
  error,
  onRetry,
}: {
  error: unknown;
  onRetry?: () => void;
}) {
  const apiError = error instanceof ApiFailure ? error.error : null;
  const title =
    apiError?.kind === "forbidden"
      ? "Access denied"
      : apiError?.kind === "rateLimited"
        ? "Please slow down"
        : apiError?.kind === "network"
          ? "Connection problem"
          : "Something went wrong";

  return (
    <div className="alert alert--danger" role="alert">
      <strong>{title}</strong>
      <p>{apiError?.message ?? "The request could not be completed."}</p>
      {apiError?.requestId ? (
        <p className="request-id">Support reference: {apiError.requestId}</p>
      ) : null}
      {onRetry ? (
        <button
          className="button button--secondary"
          type="button"
          onClick={onRetry}
        >
          Try again
        </button>
      ) : null}
    </div>
  );
}

export function InlineSuccess({ children }: { children: ReactNode }) {
  return (
    <div className="alert alert--success" role="status">
      {children}
    </div>
  );
}
