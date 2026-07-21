import { createHmac, timingSafeEqual } from "node:crypto";

import type { AppConfig } from "../../config.js";
import { AppError } from "../../lib/errors.js";

export type ProviderSurveyLaunch = Readonly<{
  baseUrl: string;
  participationId: string;
  userId: string;
}>;

export type NormalizedProviderEvent = Readonly<{
  externalEventId: string;
  participationId: string;
  outcome: "pending" | "validated" | "rejected";
  reason: string;
  evidenceReference: string;
  estimatedMaturityAt?: Date | null;
}>;

export interface ProviderAdapter {
  readonly code: string;
  buildLaunchUrl(input: ProviderSurveyLaunch): Promise<string>;
  verifyAndNormalizeWebhook(input: {
    payload: unknown;
    signature: string | undefined;
  }): Promise<NormalizedProviderEvent>;
}

type DemoPayload = Readonly<{
  eventId: string;
  participationId: string;
  outcome: "pending" | "validated" | "rejected";
  reason?: string;
  estimatedMaturityAt?: string;
}>;

function isDemoPayload(value: unknown): value is DemoPayload {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<DemoPayload>;
  return (
    typeof candidate.eventId === "string" &&
    typeof candidate.participationId === "string" &&
    ["pending", "validated", "rejected"].includes(candidate.outcome ?? "")
  );
}

class DemoProviderAdapter implements ProviderAdapter {
  readonly code = "demo";

  constructor(private readonly secret: string) {}

  async buildLaunchUrl(input: ProviderSurveyLaunch): Promise<string> {
    const url = new URL(input.baseUrl);
    url.searchParams.set("participation_id", input.participationId);
    return url.toString();
  }

  async verifyAndNormalizeWebhook(input: {
    payload: unknown;
    signature: string | undefined;
  }): Promise<NormalizedProviderEvent> {
    if (!input.signature || !isDemoPayload(input.payload)) {
      throw new AppError(
        401,
        "PROVIDER_SIGNATURE_INVALID",
        "Provider signature is invalid.",
      );
    }
    const expected = createHmac("sha256", this.secret)
      .update(JSON.stringify(input.payload))
      .digest("hex");
    const left = Buffer.from(expected);
    const right = Buffer.from(input.signature);
    if (left.length !== right.length || !timingSafeEqual(left, right)) {
      throw new AppError(
        401,
        "PROVIDER_SIGNATURE_INVALID",
        "Provider signature is invalid.",
      );
    }
    const estimatedMaturityAt = input.payload.estimatedMaturityAt
      ? new Date(input.payload.estimatedMaturityAt)
      : null;
    if (estimatedMaturityAt && Number.isNaN(estimatedMaturityAt.getTime())) {
      throw new AppError(
        400,
        "PROVIDER_PAYLOAD_INVALID",
        "Provider maturity timestamp is invalid.",
      );
    }
    return {
      externalEventId: input.payload.eventId,
      participationId: input.payload.participationId,
      outcome: input.payload.outcome,
      reason:
        input.payload.reason ??
        `Demo provider reported ${input.payload.outcome}`,
      evidenceReference: `demo:${input.payload.eventId}`,
      estimatedMaturityAt,
    };
  }
}

export class ProviderRegistry {
  private readonly adapters = new Map<string, ProviderAdapter>();

  constructor(config: AppConfig) {
    if (config.allowDemoData)
      this.adapters.set(
        "demo",
        new DemoProviderAdapter(config.providerWebhookSecret),
      );
  }

  get(code: string): ProviderAdapter {
    const adapter = this.adapters.get(code);
    if (!adapter) {
      throw new AppError(
        503,
        "PROVIDER_ADAPTER_UNAVAILABLE",
        "The survey provider is temporarily unavailable.",
      );
    }
    return adapter;
  }
}
