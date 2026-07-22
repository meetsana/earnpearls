import { randomUUID } from "node:crypto";

import type { AdminLeaderboardWriteBodySchema } from "@earnpearls/contracts";
import type { Static } from "@sinclair/typebox";
import type { FastifyInstance, FastifyRequest } from "fastify";

import { writeAudit } from "../../lib/audit.js";
import { hashIp } from "../../lib/crypto.js";
import { AppError } from "../../lib/errors.js";

type LeaderboardWrite = Static<typeof AdminLeaderboardWriteBodySchema>;

function validateConfiguration(body: LeaderboardWrite): void {
  if (
    typeof body.configuration !== "object" ||
    body.configuration === null ||
    Array.isArray(body.configuration)
  ) {
    throw new AppError(
      400,
      "LEADERBOARD_CONFIGURATION_INVALID",
      "Leaderboard configuration must be a JSON object.",
    );
  }
  if (body.metric === "streak_days") {
    throw new AppError(
      409,
      "LEADERBOARD_METRIC_NOT_AVAILABLE",
      "Streak tracking is future-ready but is not active in Version 1.",
    );
  }
  if (body.cadence === "seasonal") {
    const configuration = body.configuration as Record<string, unknown>;
    const startsAt = configuration.seasonStartsAt;
    const endsAt = configuration.seasonEndsAt;
    if (
      typeof startsAt !== "string" ||
      typeof endsAt !== "string" ||
      Number.isNaN(Date.parse(startsAt)) ||
      Number.isNaN(Date.parse(endsAt)) ||
      new Date(endsAt) <= new Date(startsAt)
    ) {
      throw new AppError(
        400,
        "LEADERBOARD_SEASON_INVALID",
        "Seasonal rankings require valid seasonStartsAt and seasonEndsAt values.",
      );
    }
  }
}

export async function listAdminLeaderboards(app: FastifyInstance) {
  const result = await app.db.query<{
    id: string;
    code: string;
    name: string;
    cadence: "weekly" | "monthly" | "seasonal";
    metric: "points_earned" | "surveys_completed" | "streak_days";
    enabled: boolean;
    max_entries: number;
    configuration: unknown;
    exclusion_count: number;
    updated_at: Date;
  }>(
    `SELECT d.id, d.code, d.name, d.cadence, d.metric, d.enabled,
      d.max_entries, d.configuration,
      COUNT(e.user_id)::INTEGER AS exclusion_count, d.updated_at
     FROM leaderboard_definitions d
     LEFT JOIN leaderboard_exclusions e ON e.leaderboard_id=d.id
     GROUP BY d.id ORDER BY d.name`,
  );
  return result.rows.map((row) => ({
    id: row.id,
    code: row.code,
    name: row.name,
    cadence: row.cadence,
    metric: row.metric,
    enabled: row.enabled,
    maxEntries: row.max_entries,
    configuration: row.configuration,
    exclusionCount: row.exclusion_count,
    updatedAt: row.updated_at.toISOString(),
  }));
}

export async function updateAdminLeaderboard(
  app: FastifyInstance,
  request: FastifyRequest,
  leaderboardId: string,
  body: LeaderboardWrite,
) {
  validateConfiguration(body);
  const actorId = request.auth!.user.id;
  await app.db.transaction(async (client) => {
    const updated = await client.query(
      `UPDATE leaderboard_definitions SET name=$2, cadence=$3, metric=$4,
        enabled=$5, max_entries=$6, configuration=$7
       WHERE id=$1`,
      [
        leaderboardId,
        body.name.trim(),
        body.cadence,
        body.metric,
        body.enabled,
        body.maxEntries,
        JSON.stringify(body.configuration),
      ],
    );
    if (!updated.rowCount) {
      throw new AppError(
        404,
        "LEADERBOARD_NOT_FOUND",
        "Leaderboard not found.",
      );
    }
    await writeAudit(client, {
      actorType: "admin",
      actorId,
      action: "admin.leaderboard.updated",
      targetType: "leaderboard",
      targetId: leaderboardId,
      reason: body.reason,
      outcome: "success",
      requestId: request.id,
      ipHash: hashIp(request.ip, app.config.ipHashSecret),
      metadata: {
        enabled: body.enabled,
        cadence: body.cadence,
        metric: body.metric,
      },
    });
  });
  return (await listAdminLeaderboards(app)).find(
    (definition) => definition.id === leaderboardId,
  )!;
}

export async function resetLeaderboardPeriod(
  app: FastifyInstance,
  request: FastifyRequest,
  leaderboardId: string,
  reason: string,
): Promise<void> {
  const actorId = request.auth!.user.id;
  await app.db.transaction(async (client) => {
    const resetAt = new Date().toISOString();
    const updated = await client.query(
      `UPDATE leaderboard_definitions
       SET configuration=jsonb_set(configuration,'{resetAfter}',$2::JSONB,TRUE)
       WHERE id=$1`,
      [leaderboardId, JSON.stringify(resetAt)],
    );
    if (!updated.rowCount) {
      throw new AppError(
        404,
        "LEADERBOARD_NOT_FOUND",
        "Leaderboard not found.",
      );
    }
    await client.query(
      `UPDATE leaderboard_periods SET status='cancelled'
       WHERE leaderboard_id=$1 AND status IN ('open','calculating')`,
      [leaderboardId],
    );
    await client.query(
      `INSERT INTO background_job_runs (
        id, job_type, status, payload, scheduled_for
       ) VALUES ($1,'leaderboard_snapshot','queued','{}'::JSONB,NOW())`,
      [randomUUID()],
    );
    await writeAudit(client, {
      actorType: "admin",
      actorId,
      action: "admin.leaderboard.period_reset",
      targetType: "leaderboard",
      targetId: leaderboardId,
      reason,
      outcome: "success",
      requestId: request.id,
      ipHash: hashIp(request.ip, app.config.ipHashSecret),
    });
  });
}

export async function listLeaderboardExclusions(
  app: FastifyInstance,
  leaderboardId: string,
) {
  const result = await app.db.query<{
    leaderboard_id: string;
    user_id: string;
    display_name: string;
    email: string;
    reason: string;
    created_at: Date;
  }>(
    `SELECT e.leaderboard_id, e.user_id, u.display_name, u.email,
      e.reason, e.created_at
     FROM leaderboard_exclusions e JOIN users u ON u.id=e.user_id
     WHERE e.leaderboard_id=$1 ORDER BY e.created_at DESC`,
    [leaderboardId],
  );
  return result.rows.map((row) => ({
    leaderboardId: row.leaderboard_id,
    userId: row.user_id,
    displayName: row.display_name,
    email: row.email,
    reason: row.reason,
    createdAt: row.created_at.toISOString(),
  }));
}

export async function setLeaderboardExclusion(
  app: FastifyInstance,
  request: FastifyRequest,
  leaderboardId: string,
  userId: string,
  reason: string,
  excluded: boolean,
): Promise<void> {
  const actorId = request.auth!.user.id;
  await app.db.transaction(async (client) => {
    const board = await client.query(
      "SELECT 1 FROM leaderboard_definitions WHERE id=$1",
      [leaderboardId],
    );
    const user = await client.query("SELECT 1 FROM users WHERE id=$1", [
      userId,
    ]);
    if (!board.rows[0] || !user.rows[0]) {
      throw new AppError(
        404,
        "LEADERBOARD_TARGET_NOT_FOUND",
        "Leaderboard or user not found.",
      );
    }
    if (excluded) {
      await client.query(
        `INSERT INTO leaderboard_exclusions (
          leaderboard_id, user_id, reason, hidden_by
         ) VALUES ($1,$2,$3,$4)
         ON CONFLICT (leaderboard_id,user_id) DO UPDATE SET
          reason=EXCLUDED.reason, hidden_by=EXCLUDED.hidden_by,
          created_at=NOW()`,
        [leaderboardId, userId, reason, actorId],
      );
    } else {
      const deleted = await client.query(
        `DELETE FROM leaderboard_exclusions
         WHERE leaderboard_id=$1 AND user_id=$2`,
        [leaderboardId, userId],
      );
      if (!deleted.rowCount) {
        throw new AppError(
          404,
          "LEADERBOARD_EXCLUSION_NOT_FOUND",
          "Leaderboard exclusion not found.",
        );
      }
    }
    await writeAudit(client, {
      actorType: "admin",
      actorId,
      action: excluded
        ? "admin.leaderboard.user_hidden"
        : "admin.leaderboard.user_restored",
      targetType: "user",
      targetId: userId,
      reason,
      outcome: "success",
      requestId: request.id,
      ipHash: hashIp(request.ip, app.config.ipHashSecret),
      metadata: { leaderboardId },
    });
  });
}
