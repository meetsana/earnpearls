import { createHash, randomUUID } from "node:crypto";

import type { Withdrawal, WithdrawalMethodSchema } from "@earnpearls/contracts";
import type { Static } from "@sinclair/typebox";
import type { FastifyInstance, FastifyRequest } from "fastify";

import { writeAudit } from "../../lib/audit.js";
import { encryptSensitive, hashIp, maskDestination } from "../../lib/crypto.js";
import { AppError } from "../../lib/errors.js";
import { pointsToUsdMicros, toMoney } from "../../lib/money.js";
import { getBucketBalance, lockUserWallet } from "../wallet/service.js";

type WithdrawalMethod = Static<typeof WithdrawalMethodSchema>;
type MethodRow = Readonly<{
  code: string;
  display_name: string;
  enabled: boolean;
  minimum_points: string;
  fee_points: string;
  country_codes: string[];
  withdrawals_enabled: boolean;
  points_per_usd: string;
}>;
type WithdrawalRow = Readonly<{
  id: string;
  method_code: string;
  amount_points: string;
  amount_usd_micros: string;
  fee_points: string;
  fee_usd_micros: string;
  status: Withdrawal["status"];
  destination_masked: string;
  requested_at: Date;
  updated_at: Date;
  processed_at: Date | null;
  rejection_reason: string | null;
}>;

function mapWithdrawal(row: WithdrawalRow): Withdrawal {
  return {
    id: row.id,
    methodCode: row.method_code,
    amount: toMoney(BigInt(row.amount_points), BigInt(row.amount_usd_micros)),
    fee: toMoney(BigInt(row.fee_points), BigInt(row.fee_usd_micros)),
    status: row.status,
    destinationMasked: row.destination_masked,
    requestedAt: row.requested_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
    processedAt: row.processed_at?.toISOString() ?? null,
    rejectionReason: row.rejection_reason,
  };
}

export async function listWithdrawalMethods(
  app: FastifyInstance,
  countryCode: string,
): Promise<WithdrawalMethod[]> {
  const result = await app.db.query<MethodRow>(
    `SELECT wm.code, wm.display_name, wm.enabled,
      wm.minimum_points::TEXT, wm.fee_points::TEXT, wm.country_codes,
      COALESCE((SELECT (value->>'enabled')::BOOLEAN FROM system_settings WHERE key = 'withdrawals'), FALSE) AS withdrawals_enabled,
      COALESCE((SELECT value->>'value' FROM system_settings WHERE key = 'points_per_usd'), '1000') AS points_per_usd
     FROM withdrawal_methods wm ORDER BY wm.display_name`,
  );
  return result.rows.map((row) => {
    const pointsPerUsd = BigInt(row.points_per_usd);
    const supportedForUser =
      row.country_codes.length === 0 || row.country_codes.includes(countryCode);
    return {
      code: row.code,
      displayName: row.display_name,
      enabled: row.withdrawals_enabled && row.enabled,
      minimum: toMoney(
        BigInt(row.minimum_points),
        pointsToUsdMicros(BigInt(row.minimum_points), pointsPerUsd),
      ),
      fee: toMoney(
        BigInt(row.fee_points),
        pointsToUsdMicros(BigInt(row.fee_points), pointsPerUsd),
      ),
      supportedForUser,
    };
  });
}

export async function createWithdrawal(
  app: FastifyInstance,
  request: FastifyRequest,
  input: Readonly<{
    methodCode: string;
    points: string;
    destination: string;
    idempotencyKey: string;
  }>,
): Promise<Withdrawal> {
  const auth = request.auth!;
  const points = BigInt(input.points);
  const methodResult = await app.db.query<MethodRow>(
    `SELECT wm.code, wm.display_name, wm.enabled,
      wm.minimum_points::TEXT, wm.fee_points::TEXT, wm.country_codes,
      COALESCE((SELECT (value->>'enabled')::BOOLEAN FROM system_settings WHERE key = 'withdrawals'), FALSE) AS withdrawals_enabled,
      COALESCE((SELECT value->>'value' FROM system_settings WHERE key = 'points_per_usd'), '1000') AS points_per_usd
     FROM withdrawal_methods wm WHERE wm.code = $1`,
    [input.methodCode],
  );
  const method = methodResult.rows[0];
  if (!method || !method.enabled || !method.withdrawals_enabled) {
    throw new AppError(
      409,
      "WITHDRAWAL_METHOD_UNAVAILABLE",
      "This withdrawal method is unavailable.",
    );
  }
  if (
    method.country_codes.length > 0 &&
    !method.country_codes.includes(auth.user.countryCode)
  ) {
    throw new AppError(
      403,
      "WITHDRAWAL_METHOD_NOT_SUPPORTED",
      "This method is not supported in your country.",
    );
  }
  if (points < BigInt(method.minimum_points)) {
    throw new AppError(
      400,
      "WITHDRAWAL_BELOW_MINIMUM",
      "The withdrawal amount is below the configured minimum.",
    );
  }

  const feePoints = BigInt(method.fee_points);
  const totalPoints = points + feePoints;
  const pointsPerUsd = BigInt(method.points_per_usd);
  const amountUsdMicros = pointsToUsdMicros(points, pointsPerUsd);
  const feeUsdMicros = pointsToUsdMicros(feePoints, pointsPerUsd);
  const withdrawalId = randomUUID();
  const transactionId = randomUUID();
  const eventId = randomUUID();
  const encryptedDestination = encryptSensitive(
    input.destination,
    app.config.dataEncryptionKey,
  );
  const maskedDestination = maskDestination(input.destination);
  const requestHash = createHash("sha256")
    .update(
      JSON.stringify({
        methodCode: input.methodCode,
        points: input.points,
        destination: input.destination,
      }),
    )
    .digest("hex");

  return app.db.transaction(async (client) => {
    await lockUserWallet(client, auth.user.id);
    const idempotencyScope = `withdrawal.create:${auth.user.id}`;
    const idempotency = await client.query<{ request_hash: string }>(
      `INSERT INTO idempotency_records (
        scope, idempotency_key, user_id, request_hash, locked_until, expires_at
      ) VALUES ($1, $2, $3, $4, NOW() + INTERVAL '30 seconds', NOW() + INTERVAL '24 hours')
      ON CONFLICT (scope, idempotency_key) DO UPDATE SET idempotency_key = EXCLUDED.idempotency_key
      RETURNING request_hash`,
      [idempotencyScope, input.idempotencyKey, auth.user.id, requestHash],
    );
    if (idempotency.rows[0]?.request_hash !== requestHash) {
      throw new AppError(
        409,
        "IDEMPOTENCY_KEY_REUSED",
        "The idempotency key was used with a different request.",
      );
    }

    const existing = await client.query<WithdrawalRow>(
      `SELECT id, method_code, amount_points::TEXT, amount_usd_micros::TEXT,
        fee_points::TEXT, fee_usd_micros::TEXT, status, destination_masked,
        requested_at, updated_at, processed_at, rejection_reason
       FROM withdrawals WHERE user_id = $1 AND idempotency_key = $2`,
      [auth.user.id, input.idempotencyKey],
    );
    if (existing.rows[0]) return mapWithdrawal(existing.rows[0]);

    const balance = await getBucketBalance(
      client,
      auth.user.id,
      "withdrawable",
    );
    const totalUsdMicros = amountUsdMicros + feeUsdMicros;
    if (balance.points < totalPoints || balance.usdMicros < totalUsdMicros) {
      throw new AppError(
        409,
        "INSUFFICIENT_WITHDRAWABLE_BALANCE",
        "The withdrawable balance is insufficient.",
      );
    }
    await client.query(
      `INSERT INTO wallet_transactions (
        id, user_id, kind, current_bucket, amount_points, amount_usd_micros,
        description, reference_type, reference_id, idempotency_key
      ) VALUES ($1, $2, 'withdrawal', 'reserved', $3, $4,
        'Withdrawal reservation', 'withdrawal', $5, $6)`,
      [
        transactionId,
        auth.user.id,
        totalPoints.toString(),
        totalUsdMicros.toString(),
        withdrawalId,
        input.idempotencyKey,
      ],
    );
    await client.query(
      `INSERT INTO wallet_transaction_events (
        id, transaction_id, from_bucket, to_bucket, event_type,
        actor_type, actor_id, reason
      ) VALUES ($1, $2, 'withdrawable', 'reserved', 'withdrawal_requested', 'user', $3, $4)`,
      [
        eventId,
        transactionId,
        auth.user.id,
        "User submitted withdrawal request",
      ],
    );
    await client.query(
      `INSERT INTO wallet_entries (
        id, user_id, transaction_id, event_id, bucket, points_delta, usd_micros_delta
      ) VALUES
        ($1, $2, $3, $4, 'withdrawable', $5, $6),
        ($7, $2, $3, $4, 'reserved', $8, $9)`,
      [
        randomUUID(),
        auth.user.id,
        transactionId,
        eventId,
        (-totalPoints).toString(),
        (-totalUsdMicros).toString(),
        randomUUID(),
        totalPoints.toString(),
        totalUsdMicros.toString(),
      ],
    );
    const withdrawal = await client.query<WithdrawalRow>(
      `INSERT INTO withdrawals (
        id, user_id, method_code, wallet_transaction_id,
        amount_points, amount_usd_micros, fee_points, fee_usd_micros,
        destination_ciphertext, destination_masked, idempotency_key
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING id, method_code, amount_points::TEXT, amount_usd_micros::TEXT,
        fee_points::TEXT, fee_usd_micros::TEXT, status, destination_masked,
        requested_at, updated_at, processed_at, rejection_reason`,
      [
        withdrawalId,
        auth.user.id,
        method.code,
        transactionId,
        points.toString(),
        amountUsdMicros.toString(),
        feePoints.toString(),
        feeUsdMicros.toString(),
        encryptedDestination,
        maskedDestination,
        input.idempotencyKey,
      ],
    );
    await writeAudit(client, {
      actorType: "user",
      actorId: auth.user.id,
      action: "withdrawal.requested",
      targetType: "withdrawal",
      targetId: withdrawalId,
      outcome: "success",
      requestId: request.id,
      ipHash: hashIp(request.ip, app.config.ipHashSecret),
      metadata: {
        methodCode: method.code,
        points: points.toString(),
        feePoints: feePoints.toString(),
      },
    });
    return mapWithdrawal(withdrawal.rows[0]!);
  }, "SERIALIZABLE");
}

export async function listWithdrawals(
  app: FastifyInstance,
  userId: string,
): Promise<Withdrawal[]> {
  const result = await app.db.query<WithdrawalRow>(
    `SELECT id, method_code, amount_points::TEXT, amount_usd_micros::TEXT,
      fee_points::TEXT, fee_usd_micros::TEXT, status, destination_masked,
      requested_at, updated_at, processed_at, rejection_reason
     FROM withdrawals WHERE user_id = $1
     ORDER BY requested_at DESC LIMIT 100`,
    [userId],
  );
  return result.rows.map(mapWithdrawal);
}
