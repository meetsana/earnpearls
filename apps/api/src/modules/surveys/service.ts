import { randomUUID } from "node:crypto";

import type { Survey, SurveyStartResponseSchema } from "@earnpearls/contracts";
import type { Static } from "@sinclair/typebox";
import type { FastifyInstance, FastifyRequest } from "fastify";

import { writeAudit } from "../../lib/audit.js";
import { hashIp } from "../../lib/crypto.js";
import { AppError } from "../../lib/errors.js";
import { toMoney } from "../../lib/money.js";
import {
  createInitialWalletCredit,
  transitionWalletTransaction,
} from "../wallet/service.js";
import type { NormalizedProviderEvent } from "./provider.js";
import { ProviderRegistry } from "./provider.js";

type StartResponse = Static<typeof SurveyStartResponseSchema>;
type SurveyRow = Readonly<{
  id: string;
  provider_id: string;
  provider_code: string;
  title: string;
  reward_points: string;
  reward_usd_micros: string;
  estimated_minutes: number | null;
  difficulty: string | null;
  category: string | null;
  country_codes: string[];
  device_types: string[];
  launch_url: string;
  active: boolean;
  provider_enabled: boolean;
}>;

export async function listAvailableSurveys(
  app: FastifyInstance,
  countryCode: string,
): Promise<Survey[]> {
  const result = await app.db.query<SurveyRow>(
    `SELECT s.id, s.provider_id, p.code AS provider_code, s.title,
      s.reward_points::TEXT, s.reward_usd_micros::TEXT,
      s.estimated_minutes, s.difficulty, s.category,
      s.country_codes, s.device_types, s.launch_url,
      s.active, p.enabled AS provider_enabled
     FROM surveys s
     JOIN providers p ON p.id = s.provider_id
     WHERE s.active = TRUE AND p.enabled = TRUE
       AND (s.available_from IS NULL OR s.available_from <= NOW())
       AND (s.available_until IS NULL OR s.available_until > NOW())
       AND (CARDINALITY(s.country_codes) = 0 OR $1 = ANY(s.country_codes))
     ORDER BY s.reward_points DESC, s.created_at DESC
     LIMIT 200`,
    [countryCode],
  );
  return result.rows.map((row) => ({
    id: row.id,
    title: row.title,
    reward: toMoney(BigInt(row.reward_points), BigInt(row.reward_usd_micros)),
    estimatedMinutes: row.estimated_minutes,
    difficulty: row.difficulty,
    category: row.category,
    deviceCompatibility: row.device_types,
    countryEligible:
      row.country_codes.length === 0 || row.country_codes.includes(countryCode),
    available: row.active && row.provider_enabled,
  }));
}

export async function startSurvey(
  app: FastifyInstance,
  registry: ProviderRegistry,
  request: FastifyRequest,
  surveyId: string,
): Promise<StartResponse> {
  const auth = request.auth!;
  const result = await app.db.query<SurveyRow>(
    `SELECT s.id, s.provider_id, p.code AS provider_code, s.title,
      s.reward_points::TEXT, s.reward_usd_micros::TEXT,
      s.estimated_minutes, s.difficulty, s.category,
      s.country_codes, s.device_types, s.launch_url,
      s.active, p.enabled AS provider_enabled
     FROM surveys s
     JOIN providers p ON p.id = s.provider_id
     WHERE s.id = $1
       AND s.active = TRUE AND p.enabled = TRUE
       AND (s.available_from IS NULL OR s.available_from <= NOW())
       AND (s.available_until IS NULL OR s.available_until > NOW())`,
    [surveyId],
  );
  const survey = result.rows[0];
  if (!survey)
    throw new AppError(
      404,
      "SURVEY_NOT_AVAILABLE",
      "This survey is no longer available.",
    );
  if (
    survey.country_codes.length > 0 &&
    !survey.country_codes.includes(auth.user.countryCode)
  ) {
    throw new AppError(
      403,
      "SURVEY_NOT_ELIGIBLE",
      "This survey is not available in your country.",
    );
  }

  const participationId = randomUUID();
  const adapter = registry.get(survey.provider_code);
  const launchUrl = await adapter.buildLaunchUrl({
    baseUrl: survey.launch_url,
    participationId,
    userId: auth.user.id,
  });
  await app.db.transaction(async (client) => {
    await client.query(
      `INSERT INTO survey_participations (
        id, user_id, survey_id, provider_id, external_participation_id,
        status, reward_points, reward_usd_micros
      ) VALUES ($1, $2, $3, $4, $1, 'started', $5, $6)`,
      [
        participationId,
        auth.user.id,
        survey.id,
        survey.provider_id,
        survey.reward_points,
        survey.reward_usd_micros,
      ],
    );
    await writeAudit(client, {
      actorType: "user",
      actorId: auth.user.id,
      action: "survey.started",
      targetType: "survey_participation",
      targetId: participationId,
      outcome: "success",
      requestId: request.id,
      ipHash: hashIp(request.ip, app.config.ipHashSecret),
      metadata: { surveyId: survey.id },
    });
  });
  return { participationId, launchUrl, status: "started" };
}

export async function processProviderEvent(
  app: FastifyInstance,
  providerCode: string,
  rawPayload: unknown,
  event: NormalizedProviderEvent,
): Promise<void> {
  const providerResult = await app.db.query<{ id: string }>(
    "SELECT id FROM providers WHERE code = $1 AND enabled = TRUE",
    [providerCode],
  );
  const provider = providerResult.rows[0];
  if (!provider)
    throw new AppError(
      404,
      "PROVIDER_NOT_FOUND",
      "Provider integration is unavailable.",
    );

  await app.db.transaction(async (client) => {
    const providerEventId = randomUUID();
    const insertedEvent = await client.query<{ id: string }>(
      `INSERT INTO provider_events (
          id, provider_id, external_event_id, event_type, payload, signature_valid
        ) VALUES ($1, $2, $3, $4, $5, TRUE)
        ON CONFLICT (provider_id, external_event_id) DO NOTHING
        RETURNING id`,
      [
        providerEventId,
        provider.id,
        event.externalEventId,
        event.outcome,
        JSON.stringify(rawPayload),
      ],
    );
    if (!insertedEvent.rows[0]) return;

    const participationResult = await client.query<{
      id: string;
      user_id: string;
      provider_id: string;
      status: "started" | "completed" | "pending" | "validated" | "rejected";
      reward_points: string;
      reward_usd_micros: string;
    }>(
      `SELECT id, user_id, provider_id, status,
          reward_points::TEXT, reward_usd_micros::TEXT
         FROM survey_participations
         WHERE id = $1 AND provider_id = $2
         FOR UPDATE`,
      [event.participationId, provider.id],
    );
    const participation = participationResult.rows[0];
    if (!participation)
      throw new AppError(
        404,
        "PARTICIPATION_NOT_FOUND",
        "Survey participation was not found.",
      );

    const repeatedOutcome = participation.status === event.outcome;
    const staleOutcome =
      (participation.status === "validated" && event.outcome === "pending") ||
      (participation.status === "rejected" && event.outcome !== "rejected");
    if (repeatedOutcome || staleOutcome) {
      await client.query(
        `UPDATE provider_events SET processing_status = 'ignored', processed_at = NOW()
           WHERE id = $1`,
        [providerEventId],
      );
      await writeAudit(client, {
        actorType: "provider",
        action: "survey.provider_event_ignored",
        targetType: "survey_participation",
        targetId: participation.id,
        reason: repeatedOutcome
          ? "Outcome already applied"
          : "Stale provider outcome",
        outcome: "success",
        metadata: {
          providerEventId,
          reportedOutcome: event.outcome,
          currentStatus: participation.status,
        },
      });
      return;
    }

    let walletTransactionId: string | undefined;
    if (
      ["started", "completed"].includes(participation.status) &&
      event.outcome !== "rejected"
    ) {
      walletTransactionId = await createInitialWalletCredit(client, {
        userId: participation.user_id,
        kind: "survey_earning",
        bucket: "pending",
        points: BigInt(participation.reward_points),
        usdMicros: BigInt(participation.reward_usd_micros),
        description: "Survey earning",
        providerId: provider.id,
        referenceType: "survey_participation",
        referenceId: participation.id,
        estimatedMaturityAt: event.estimatedMaturityAt ?? null,
        idempotencyKey: `participation:${participation.id}`,
        actorType: "provider",
        reason: "Provider reported survey completion",
        evidenceReference: event.evidenceReference,
      });
      await client.query(
        `UPDATE survey_participations
           SET status = 'pending', completed_at = NOW(), estimated_maturity_at = $2
           WHERE id = $1`,
        [participation.id, event.estimatedMaturityAt ?? null],
      );
    }

    if (
      !walletTransactionId &&
      !["started", "completed"].includes(participation.status)
    ) {
      const walletResult = await client.query<{ id: string }>(
        `SELECT id FROM wallet_transactions
           WHERE reference_type = 'survey_participation' AND reference_id = $1
           FOR UPDATE`,
        [participation.id],
      );
      walletTransactionId = walletResult.rows[0]?.id;
    }

    if (event.outcome === "validated") {
      if (!walletTransactionId)
        throw new AppError(
          409,
          "WALLET_TRANSACTION_MISSING",
          "Earning transaction is missing.",
        );
      await transitionWalletTransaction(client, {
        transactionId: walletTransactionId,
        toBucket: "validated",
        actorType: "provider",
        eventType: "provider_validated",
        reason: event.reason,
        evidenceReference: event.evidenceReference,
      });
      await client.query(
        `UPDATE survey_participations
           SET status = 'validated', provider_confirmed_at = NOW(), estimated_maturity_at = $2
           WHERE id = $1`,
        [participation.id, event.estimatedMaturityAt ?? null],
      );
    } else if (event.outcome === "rejected") {
      if (walletTransactionId && participation.status !== "rejected") {
        await transitionWalletTransaction(client, {
          transactionId: walletTransactionId,
          toBucket: "rejected",
          actorType: "provider",
          eventType: "provider_rejected",
          reason: event.reason,
          evidenceReference: event.evidenceReference,
        });
      }
      await client.query(
        `UPDATE survey_participations
           SET status = 'rejected', rejected_at = NOW(), rejection_reason = $2
           WHERE id = $1`,
        [participation.id, event.reason],
      );
    }

    await client.query(
      `UPDATE provider_events SET processing_status = 'processed', processed_at = NOW()
         WHERE id = $1`,
      [providerEventId],
    );
    await writeAudit(client, {
      actorType: "provider",
      action: `survey.provider_${event.outcome}`,
      targetType: "survey_participation",
      targetId: participation.id,
      reason: event.reason,
      outcome: "success",
      metadata: { providerEventId, evidenceReference: event.evidenceReference },
    });
  });
}
