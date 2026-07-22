import type { FastifyInstance } from "fastify";

import { AppError } from "../../lib/errors.js";

type DefinitionRow = Readonly<{
  id: string;
  code: string;
  name: string;
  cadence: "weekly" | "monthly" | "seasonal";
  metric: "points_earned" | "surveys_completed" | "streak_days";
  max_entries: number;
  configuration: Record<string, unknown>;
}>;

function periodFor(board: DefinitionRow): {
  startsAt: Date;
  endsAt: Date;
} {
  const now = new Date();
  let period: { startsAt: Date; endsAt: Date };
  if (board.cadence === "weekly") {
    const day = now.getUTCDay();
    const daysFromMonday = (day + 6) % 7;
    const startsAt = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() - daysFromMonday,
      ),
    );
    period = {
      startsAt,
      endsAt: new Date(startsAt.getTime() + 7 * 86_400_000),
    };
  } else if (board.cadence === "monthly") {
    const startsAt = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1),
    );
    period = {
      startsAt,
      endsAt: new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1),
      ),
    };
  } else {
    const startsAt = board.configuration.seasonStartsAt;
    const endsAt = board.configuration.seasonEndsAt;
    if (
      typeof startsAt !== "string" ||
      typeof endsAt !== "string" ||
      Number.isNaN(Date.parse(startsAt)) ||
      Number.isNaN(Date.parse(endsAt)) ||
      now < new Date(startsAt) ||
      now >= new Date(endsAt)
    ) {
      throw new AppError(
        409,
        "LEADERBOARD_PERIOD_UNAVAILABLE",
        "This seasonal leaderboard has no active period.",
      );
    }
    period = { startsAt: new Date(startsAt), endsAt: new Date(endsAt) };
  }
  const resetAfter = board.configuration.resetAfter;
  if (typeof resetAfter === "string" && !Number.isNaN(Date.parse(resetAfter))) {
    const resetAt = new Date(resetAfter);
    if (resetAt > period.startsAt && resetAt < period.endsAt) {
      period.startsAt = resetAt;
    }
  }
  return period;
}

export async function listLeaderboards(app: FastifyInstance) {
  const result = await app.db.query<DefinitionRow>(
    `SELECT id, code, name, cadence, metric, max_entries, configuration
     FROM leaderboard_definitions WHERE enabled = TRUE ORDER BY name`,
  );
  return result.rows.map((row) => ({
    code: row.code,
    name: row.name,
    cadence: row.cadence,
    metric: row.metric,
  }));
}

export async function getCurrentLeaderboard(
  app: FastifyInstance,
  code: string,
  currentUserId: string,
) {
  const definition = await app.db.query<DefinitionRow>(
    `SELECT id, code, name, cadence, metric, max_entries, configuration
     FROM leaderboard_definitions WHERE code = $1 AND enabled = TRUE`,
    [code],
  );
  const board = definition.rows[0];
  if (!board)
    throw new AppError(404, "LEADERBOARD_NOT_FOUND", "Leaderboard not found.");
  const period = periodFor(board);
  const result = await app.db.query<{
    user_id: string;
    display_name: string;
    rank: number;
    points_earned: string;
    surveys_completed: number;
    metric_value: string;
  }>(
    `WITH reward_totals AS (
       SELECT user_id, COALESCE(SUM(amount_points), 0)::BIGINT AS points_earned
       FROM wallet_transactions
       WHERE created_at >= $2 AND created_at < $3
         AND kind = 'survey_earning'
         AND current_bucket NOT IN ('rejected', 'reversed')
       GROUP BY user_id
     ), survey_totals AS (
       SELECT user_id, COUNT(*)::INTEGER AS surveys_completed
       FROM survey_participations
       WHERE provider_confirmed_at >= $2 AND provider_confirmed_at < $3
         AND status = 'validated'
       GROUP BY user_id
     ), earnings AS (
       SELECT u.id AS user_id, u.display_name,
         COALESCE(rt.points_earned, 0)::BIGINT AS points_earned,
         COALESCE(st.surveys_completed, 0)::INTEGER AS surveys_completed
       FROM users u
       LEFT JOIN reward_totals rt ON rt.user_id = u.id
       LEFT JOIN survey_totals st ON st.user_id = u.id
       LEFT JOIN leaderboard_exclusions le
         ON le.leaderboard_id = $1 AND le.user_id = u.id
       WHERE u.deleted_at IS NULL
         AND u.account_status_code IN ('active', 'limited')
         AND le.user_id IS NULL
     ), ranked AS (
       SELECT *, ROW_NUMBER() OVER (
         ORDER BY
           CASE WHEN $4 = 'points_earned' THEN points_earned END DESC,
           CASE WHEN $4 = 'surveys_completed' THEN surveys_completed END DESC,
           user_id
       )::INTEGER AS rank
       FROM earnings
       WHERE points_earned > 0 OR surveys_completed > 0
     )
     SELECT user_id, display_name, rank, points_earned::TEXT,
       surveys_completed,
       CASE WHEN $4 = 'surveys_completed'
         THEN surveys_completed::TEXT ELSE points_earned::TEXT END AS metric_value
     FROM ranked
     WHERE rank <= $5 OR user_id = $6
     ORDER BY rank`,
    [
      board.id,
      period.startsAt,
      period.endsAt,
      board.metric,
      board.max_entries,
      currentUserId,
    ],
  );
  const mapEntry = (row: (typeof result.rows)[number]) => ({
    rank: row.rank,
    displayName: row.display_name,
    metricValue: row.metric_value,
    pointsEarned: row.points_earned,
    surveysCompleted: row.surveys_completed,
    isCurrentUser: row.user_id === currentUserId,
  });
  const current = result.rows.find((row) => row.user_id === currentUserId);
  return {
    code: board.code,
    name: board.name,
    cadence: board.cadence,
    metric: board.metric,
    period: {
      startsAt: period.startsAt.toISOString(),
      endsAt: period.endsAt.toISOString(),
      status: "open",
    },
    entries: result.rows
      .filter((row) => row.rank <= board.max_entries)
      .map(mapEntry),
    currentUserEntry: current ? mapEntry(current) : null,
  };
}

export async function getLeaderboardHistory(
  app: FastifyInstance,
  code: string,
  currentUserId: string,
  limit: number,
) {
  const definition = await app.db.query<{ id: string }>(
    `SELECT id FROM leaderboard_definitions WHERE code=$1 AND enabled=TRUE`,
    [code],
  );
  const leaderboardId = definition.rows[0]?.id;
  if (!leaderboardId) {
    throw new AppError(404, "LEADERBOARD_NOT_FOUND", "Leaderboard not found.");
  }
  const periods = await app.db.query<{
    id: string;
    starts_at: Date;
    ends_at: Date;
    status: string;
    finalized_at: Date | null;
  }>(
    `SELECT id, starts_at, ends_at, status, finalized_at
     FROM leaderboard_periods
     WHERE leaderboard_id=$1 AND status IN ('finalized','cancelled')
     ORDER BY ends_at DESC LIMIT $2`,
    [leaderboardId, limit],
  );
  const result = [];
  for (const period of periods.rows) {
    const entries = await app.db.query<{
      user_id: string;
      display_name: string;
      rank: number;
      metric_value: string;
      points_earned: string;
      surveys_completed: number;
    }>(
      `SELECT e.user_id, u.display_name, e.rank, e.metric_value::TEXT,
        e.points_earned::TEXT, e.surveys_completed
       FROM leaderboard_entries e JOIN users u ON u.id=e.user_id
       WHERE e.period_id=$1 AND e.hidden=FALSE
       ORDER BY e.rank LIMIT 100`,
      [period.id],
    );
    result.push({
      id: period.id,
      startsAt: period.starts_at.toISOString(),
      endsAt: period.ends_at.toISOString(),
      status: period.status,
      finalizedAt: period.finalized_at?.toISOString() ?? null,
      entries: entries.rows.map((entry) => ({
        rank: entry.rank,
        displayName: entry.display_name,
        metricValue: entry.metric_value,
        pointsEarned: entry.points_earned,
        surveysCompleted: entry.surveys_completed,
        isCurrentUser: entry.user_id === currentUserId,
      })),
    });
  }
  return { code, periods: result };
}
