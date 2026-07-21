import { randomUUID } from "node:crypto";

import type {
  WalletBucketSchema,
  WalletSummary,
  WalletTransaction,
} from "@earnpearls/contracts";
import type { Static } from "@sinclair/typebox";
import type { PoolClient } from "pg";

import type { Database, Queryable } from "../../db/database.js";
import { AppError } from "../../lib/errors.js";
import { toMoney } from "../../lib/money.js";

export type WalletBucket = Static<typeof WalletBucketSchema>;
type ActorType = "system" | "user" | "admin" | "provider";

type BalanceRow = Readonly<{
  bucket: WalletBucket;
  points: string;
  usd_micros: string;
}>;
type TransactionRow = Readonly<{
  id: string;
  kind: string;
  current_bucket: WalletBucket;
  amount_points: string;
  amount_usd_micros: string;
  description: string;
  provider_label: string | null;
  estimated_maturity_at: Date | null;
  created_at: Date;
  updated_at: Date;
}>;

const allowedTransitions: Readonly<
  Record<WalletBucket, readonly WalletBucket[]>
> = Object.freeze({
  pending: ["validated", "rejected", "reversed"],
  validated: ["mature", "rejected", "reversed"],
  mature: ["withdrawable", "reversed"],
  withdrawable: ["reserved", "reversed"],
  reserved: ["paid", "withdrawable", "reversed"],
  paid: ["reversed"],
  rejected: [],
  reversed: [],
});

export function canTransitionWalletBucket(
  from: WalletBucket,
  to: WalletBucket,
): boolean {
  return allowedTransitions[from]?.includes(to) ?? false;
}

export async function lockUserWallet(
  client: PoolClient,
  userId: string,
): Promise<void> {
  await client.query("SELECT pg_advisory_xact_lock(hashtext($1))", [
    `wallet:${userId}`,
  ]);
}

export async function getBucketBalance(
  queryable: Queryable,
  userId: string,
  bucket: WalletBucket,
): Promise<{ points: bigint; usdMicros: bigint }> {
  const result = await queryable.query<BalanceRow>(
    `SELECT bucket, points::TEXT, usd_micros::TEXT
     FROM wallet_balances WHERE user_id = $1 AND bucket = $2`,
    [userId, bucket],
  );
  return {
    points: BigInt(result.rows[0]?.points ?? "0"),
    usdMicros: BigInt(result.rows[0]?.usd_micros ?? "0"),
  };
}

export async function createInitialWalletCredit(
  client: PoolClient,
  input: Readonly<{
    userId: string;
    kind: "survey_earning" | "adjustment";
    bucket: WalletBucket;
    points: bigint;
    usdMicros: bigint;
    description: string;
    providerId?: string | null;
    referenceType: string;
    referenceId: string;
    estimatedMaturityAt?: Date | null;
    idempotencyKey?: string | null;
    actorType: ActorType;
    actorId?: string | null;
    reason: string;
    evidenceReference?: string | null;
  }>,
): Promise<string> {
  if (input.points === 0n || input.usdMicros === 0n)
    throw new Error("Wallet credits cannot be zero");
  const transactionId = randomUUID();
  const eventId = randomUUID();
  await client.query(
    `INSERT INTO wallet_transactions (
      id, user_id, kind, current_bucket, amount_points, amount_usd_micros,
      description, provider_id, reference_type, reference_id,
      estimated_maturity_at, idempotency_key
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
    [
      transactionId,
      input.userId,
      input.kind,
      input.bucket,
      input.points.toString(),
      input.usdMicros.toString(),
      input.description,
      input.providerId ?? null,
      input.referenceType,
      input.referenceId,
      input.estimatedMaturityAt ?? null,
      input.idempotencyKey ?? null,
    ],
  );
  await client.query(
    `INSERT INTO wallet_transaction_events (
      id, transaction_id, from_bucket, to_bucket, event_type,
      actor_type, actor_id, reason, evidence_reference
    ) VALUES ($1, $2, NULL, $3, 'created', $4, $5, $6, $7)`,
    [
      eventId,
      transactionId,
      input.bucket,
      input.actorType,
      input.actorId ?? null,
      input.reason,
      input.evidenceReference ?? null,
    ],
  );
  await client.query(
    `INSERT INTO wallet_entries (
      id, user_id, transaction_id, event_id, bucket, points_delta, usd_micros_delta
    ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      randomUUID(),
      input.userId,
      transactionId,
      eventId,
      input.bucket,
      input.points.toString(),
      input.usdMicros.toString(),
    ],
  );
  return transactionId;
}

export async function transitionWalletTransaction(
  client: PoolClient,
  input: Readonly<{
    transactionId: string;
    toBucket: WalletBucket;
    actorType: ActorType;
    actorId?: string | null;
    eventType: string;
    reason: string;
    evidenceReference?: string | null;
  }>,
): Promise<void> {
  const result = await client.query<{
    user_id: string;
    current_bucket: WalletBucket;
    amount_points: string;
    amount_usd_micros: string;
  }>(
    `SELECT user_id, current_bucket, amount_points::TEXT, amount_usd_micros::TEXT
     FROM wallet_transactions WHERE id = $1 FOR UPDATE`,
    [input.transactionId],
  );
  const transaction = result.rows[0];
  if (!transaction)
    throw new AppError(
      404,
      "WALLET_TRANSACTION_NOT_FOUND",
      "Wallet transaction not found.",
    );
  if (!canTransitionWalletBucket(transaction.current_bucket, input.toBucket)) {
    throw new AppError(
      409,
      "WALLET_TRANSITION_INVALID",
      `Cannot transition ${transaction.current_bucket} to ${input.toBucket}.`,
    );
  }
  await lockUserWallet(client, transaction.user_id);
  const points = BigInt(transaction.amount_points);
  const usdMicros = BigInt(transaction.amount_usd_micros);
  const eventId = randomUUID();
  await client.query(
    `INSERT INTO wallet_transaction_events (
      id, transaction_id, from_bucket, to_bucket, event_type,
      actor_type, actor_id, reason, evidence_reference
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [
      eventId,
      input.transactionId,
      transaction.current_bucket,
      input.toBucket,
      input.eventType,
      input.actorType,
      input.actorId ?? null,
      input.reason,
      input.evidenceReference ?? null,
    ],
  );
  await client.query(
    `INSERT INTO wallet_entries (
      id, user_id, transaction_id, event_id, bucket, points_delta, usd_micros_delta
    ) VALUES
      ($1, $2, $3, $4, $5, $6, $7),
      ($8, $2, $3, $4, $9, $10, $11)`,
    [
      randomUUID(),
      transaction.user_id,
      input.transactionId,
      eventId,
      transaction.current_bucket,
      (-points).toString(),
      (-usdMicros).toString(),
      randomUUID(),
      input.toBucket,
      points.toString(),
      usdMicros.toString(),
    ],
  );
  await client.query(
    `UPDATE wallet_transactions SET current_bucket = $1 WHERE id = $2`,
    [input.toBucket, input.transactionId],
  );
}

export async function getWalletSummary(
  database: Database,
  userId: string,
): Promise<WalletSummary> {
  const [balancesResult, earningsResult, conversionResult] = await Promise.all([
    database.query<BalanceRow>(
      `SELECT bucket, points::TEXT, usd_micros::TEXT FROM wallet_balances WHERE user_id = $1`,
      [userId],
    ),
    database.query<{ points: string; usd_micros: string }>(
      `SELECT
        COALESCE(SUM(amount_points), 0)::TEXT AS points,
        COALESCE(SUM(amount_usd_micros), 0)::TEXT AS usd_micros
       FROM wallet_transactions
       WHERE user_id = $1 AND kind = 'survey_earning'
         AND current_bucket NOT IN ('rejected', 'reversed')`,
      [userId],
    ),
    database.query<{ points_per_usd: string }>(
      `SELECT COALESCE(value->>'value', '1000') AS points_per_usd
       FROM system_settings WHERE key = 'points_per_usd'`,
    ),
  ]);
  const balances = new Map(
    balancesResult.rows.map((row) => [
      row.bucket,
      { points: BigInt(row.points), usdMicros: BigInt(row.usd_micros) },
    ]),
  );
  const read = (bucket: WalletBucket) =>
    balances.get(bucket) ?? { points: 0n, usdMicros: 0n };
  const earnings = earningsResult.rows[0] ?? { points: "0", usd_micros: "0" };
  return {
    pending: toMoney(read("pending").points, read("pending").usdMicros),
    validated: toMoney(read("validated").points, read("validated").usdMicros),
    mature: toMoney(read("mature").points, read("mature").usdMicros),
    withdrawable: toMoney(
      read("withdrawable").points,
      read("withdrawable").usdMicros,
    ),
    reserved: toMoney(read("reserved").points, read("reserved").usdMicros),
    paid: toMoney(read("paid").points, read("paid").usdMicros),
    rejected: toMoney(read("rejected").points, read("rejected").usdMicros),
    reversed: toMoney(read("reversed").points, read("reversed").usdMicros),
    totalEarnings: toMoney(
      BigInt(earnings.points),
      BigInt(earnings.usd_micros),
    ),
    conversion: {
      pointsPerUsd: conversionResult.rows[0]?.points_per_usd ?? "1000",
      sourceCurrency: "USD",
      localCurrencyEstimate: null,
    },
  };
}

function encodeCursor(row: TransactionRow): string {
  return Buffer.from(
    `${row.created_at.toISOString()}|${row.id}`,
    "utf8",
  ).toString("base64url");
}

function decodeCursor(cursor: string): { createdAt: string; id: string } {
  try {
    const [createdAt, id] = Buffer.from(cursor, "base64url")
      .toString("utf8")
      .split("|");
    if (!createdAt || !id || Number.isNaN(Date.parse(createdAt)))
      throw new Error("invalid");
    return { createdAt, id };
  } catch {
    throw new AppError(
      400,
      "CURSOR_INVALID",
      "The pagination cursor is invalid.",
    );
  }
}

export async function listWalletTransactions(
  database: Database,
  userId: string,
  options: Readonly<{ cursor?: string; limit: number }>,
): Promise<{ items: WalletTransaction[]; nextCursor: string | null }> {
  const cursor = options.cursor ? decodeCursor(options.cursor) : null;
  const result = await database.query<TransactionRow>(
    `SELECT wt.id, wt.kind, wt.current_bucket,
      wt.amount_points::TEXT, wt.amount_usd_micros::TEXT, wt.description,
      CASE WHEN p.user_visible THEN p.display_name ELSE NULL END AS provider_label,
      wt.estimated_maturity_at, wt.created_at, wt.updated_at
     FROM wallet_transactions wt
     LEFT JOIN providers p ON p.id = wt.provider_id
     WHERE wt.user_id = $1
       AND ($2::TIMESTAMPTZ IS NULL OR (wt.created_at, wt.id) < ($2::TIMESTAMPTZ, $3::UUID))
     ORDER BY wt.created_at DESC, wt.id DESC
     LIMIT $4`,
    [userId, cursor?.createdAt ?? null, cursor?.id ?? null, options.limit + 1],
  );
  const hasMore = result.rows.length > options.limit;
  const rows = result.rows.slice(0, options.limit);
  return {
    items: rows.map((row) => ({
      id: row.id,
      kind: row.kind,
      currentBucket: row.current_bucket,
      amount: toMoney(BigInt(row.amount_points), BigInt(row.amount_usd_micros)),
      description: row.description,
      ...(row.provider_label ? { providerLabel: row.provider_label } : {}),
      estimatedMaturityAt: row.estimated_maturity_at?.toISOString() ?? null,
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString(),
    })),
    nextCursor: hasMore && rows.at(-1) ? encodeCursor(rows.at(-1)!) : null,
  };
}
