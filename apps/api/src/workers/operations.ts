import { randomUUID } from "node:crypto";
import { setTimeout as delay } from "node:timers/promises";

import type { PoolClient } from "pg";

import { loadConfig } from "../config.js";
import { Database } from "../db/database.js";
import { createNotification } from "../modules/notifications/service.js";

type JobRow = Readonly<{
  id: string;
  job_type:
    | "publish_scheduled_content"
    | "analytics_daily_rollup"
    | "leaderboard_snapshot"
    | "broadcast_notifications"
    | "retention_cleanup";
  payload: Record<string, unknown>;
  attempt_count: number;
}>;

const config = loadConfig();
const database = new Database(config);
const runOnce = process.env.OPERATIONS_WORKER_RUN_ONCE === "true";
let stopping = false;

function hourKey(now: Date): string {
  return now.toISOString().slice(0, 13);
}

function dateKey(now: Date): string {
  return now.toISOString().slice(0, 10);
}

async function ensureRecurringJobs(now = new Date()): Promise<void> {
  const yesterday = new Date(now.getTime() - 86_400_000);
  const jobs = [
    {
      type: "publish_scheduled_content",
      key: hourKey(now),
      payload: {},
    },
    {
      type: "leaderboard_snapshot",
      key: hourKey(now),
      payload: {},
    },
    {
      type: "analytics_daily_rollup",
      key: dateKey(yesterday),
      payload: { metricDate: dateKey(yesterday) },
    },
    {
      type: "retention_cleanup",
      key: dateKey(now),
      payload: {},
    },
  ] as const;
  for (const job of jobs) {
    await database.query(
      `INSERT INTO background_job_runs (
        id, job_type, deduplication_key, status, payload, scheduled_for
       ) VALUES ($1,$2,$3,'queued',$4,NOW())
       ON CONFLICT (job_type, deduplication_key) DO NOTHING`,
      [randomUUID(), job.type, job.key, JSON.stringify(job.payload)],
    );
  }
}

async function claimJob(): Promise<JobRow | null> {
  return database.transaction(async (client) => {
    await client.query(
      `UPDATE background_job_runs SET status='failed',
        last_error='stale running lease', finished_at=NOW()
       WHERE status='running'
         AND started_at < NOW() - INTERVAL '30 minutes'`,
    );
    const result = await client.query<JobRow>(
      `SELECT id, job_type, payload, attempt_count
       FROM background_job_runs
       WHERE status IN ('queued','failed') AND scheduled_for <= NOW()
         AND attempt_count < 5
         AND job_type IN (
           'publish_scheduled_content',
           'analytics_daily_rollup',
           'leaderboard_snapshot',
           'broadcast_notifications',
           'retention_cleanup'
         )
       ORDER BY scheduled_for, created_at
       LIMIT 1 FOR UPDATE SKIP LOCKED`,
    );
    const job = result.rows[0];
    if (!job) return null;
    await client.query(
      `UPDATE background_job_runs SET status='running',
        attempt_count=attempt_count+1, started_at=NOW(),
        finished_at=NULL, last_error=NULL WHERE id=$1`,
      [job.id],
    );
    return job;
  });
}

async function publishScheduledContent(): Promise<Record<string, number>> {
  return database.transaction(async (client) => {
    const pages = await client.query(
      `UPDATE cms_pages SET status='published',
        published_at=COALESCE(published_at,NOW()), scheduled_for=NULL
       WHERE status='scheduled' AND scheduled_for <= NOW()`,
    );
    const posts = await client.query(
      `UPDATE blog_posts SET status='published',
        published_at=COALESCE(published_at,NOW()), scheduled_for=NULL
       WHERE status='scheduled' AND scheduled_for <= NOW()`,
    );
    return {
      pagesPublished: pages.rowCount ?? 0,
      postsPublished: posts.rowCount ?? 0,
    };
  });
}

async function analyticsDailyRollup(
  metricDate: string,
): Promise<Record<string, string | number>> {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(metricDate)) {
    throw new Error("analytics_daily_rollup requires a YYYY-MM-DD metricDate");
  }
  return database.transaction(async (client) => {
    const result = await client.query<{
      registrations: number;
      validated_surveys: number;
      reward_points: string;
      withdrawals_requested: number;
      withdrawals_paid: number;
    }>(
      `SELECT
        (SELECT COUNT(*)::INTEGER FROM users
          WHERE created_at >= $1::DATE AND created_at < $1::DATE + 1)
          AS registrations,
        (SELECT COUNT(*)::INTEGER FROM survey_participations
          WHERE provider_confirmed_at >= $1::DATE
            AND provider_confirmed_at < $1::DATE + 1
            AND status='validated') AS validated_surveys,
        (SELECT COALESCE(SUM(amount_points),0)::TEXT FROM wallet_transactions
          WHERE created_at >= $1::DATE AND created_at < $1::DATE + 1
            AND kind='survey_earning'
            AND current_bucket NOT IN ('rejected','reversed')) AS reward_points,
        (SELECT COUNT(*)::INTEGER FROM withdrawals
          WHERE requested_at >= $1::DATE AND requested_at < $1::DATE + 1)
          AS withdrawals_requested,
        (SELECT COUNT(*)::INTEGER FROM withdrawals
          WHERE processed_at >= $1::DATE AND processed_at < $1::DATE + 1
            AND status='paid') AS withdrawals_paid`,
      [metricDate],
    );
    const row = result.rows[0]!;
    const metrics = {
      registrations: row.registrations,
      validated_surveys: row.validated_surveys,
      // Keep point totals exact even after the platform grows beyond the
      // JavaScript safe-integer range. PostgreSQL NUMERIC accepts this string.
      reward_points: row.reward_points,
      withdrawals_requested: row.withdrawals_requested,
      withdrawals_paid: row.withdrawals_paid,
    };
    for (const [code, value] of Object.entries(metrics)) {
      await client.query(
        `INSERT INTO analytics_daily (
          metric_date, metric_code, dimension, value_numeric, calculated_at
         ) VALUES ($1,$2,'{}'::JSONB,$3,NOW())
         ON CONFLICT (metric_date, metric_code, dimension) DO UPDATE SET
          value_numeric=EXCLUDED.value_numeric,
          calculated_at=EXCLUDED.calculated_at`,
        [metricDate, code, value],
      );
    }
    return metrics;
  });
}

function periodFor(
  definition: Readonly<{
    cadence: "weekly" | "monthly" | "seasonal";
    configuration: Record<string, unknown>;
  }>,
  now: Date,
): { startsAt: Date; endsAt: Date } {
  let period: { startsAt: Date; endsAt: Date };
  if (definition.cadence === "weekly") {
    const daysFromMonday = (now.getUTCDay() + 6) % 7;
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
  } else if (definition.cadence === "monthly") {
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
    const startsAt = definition.configuration.seasonStartsAt;
    const endsAt = definition.configuration.seasonEndsAt;
    if (
      typeof startsAt !== "string" ||
      typeof endsAt !== "string" ||
      Number.isNaN(Date.parse(startsAt)) ||
      Number.isNaN(Date.parse(endsAt)) ||
      now < new Date(startsAt) ||
      now >= new Date(endsAt)
    ) {
      throw new Error("seasonal leaderboard has no active period");
    }
    period = { startsAt: new Date(startsAt), endsAt: new Date(endsAt) };
  }
  const resetAfter = definition.configuration.resetAfter;
  if (typeof resetAfter === "string" && !Number.isNaN(Date.parse(resetAfter))) {
    const resetAt = new Date(resetAfter);
    if (resetAt > period.startsAt && resetAt < period.endsAt) {
      period.startsAt = resetAt;
    }
  }
  return period;
}

async function snapshotDefinition(
  client: PoolClient,
  definition: Readonly<{
    id: string;
    cadence: "weekly" | "monthly" | "seasonal";
    metric: "points_earned" | "surveys_completed";
    max_entries: number;
    configuration: Record<string, unknown>;
  }>,
  now: Date,
): Promise<number> {
  const period = periodFor(definition, now);
  const periodId = randomUUID();
  const storedPeriod = await client.query<{ id: string }>(
    `INSERT INTO leaderboard_periods (
      id, leaderboard_id, starts_at, ends_at, status
     ) VALUES ($1,$2,$3,$4,'open')
     ON CONFLICT (leaderboard_id, starts_at, ends_at) DO UPDATE SET
      status=CASE WHEN leaderboard_periods.status='finalized'
        THEN 'finalized' ELSE 'open' END
     RETURNING id`,
    [periodId, definition.id, period.startsAt, period.endsAt],
  );
  const activePeriodId = storedPeriod.rows[0]!.id;
  await client.query("DELETE FROM leaderboard_entries WHERE period_id=$1", [
    activePeriodId,
  ]);
  const inserted = await client.query(
    `WITH reward_totals AS (
       SELECT user_id, COALESCE(SUM(amount_points),0)::BIGINT AS points_earned
       FROM wallet_transactions
       WHERE created_at >= $2 AND created_at < $3
        AND kind='survey_earning'
        AND current_bucket NOT IN ('rejected','reversed')
       GROUP BY user_id
     ), survey_totals AS (
       SELECT user_id, COUNT(*)::INTEGER AS surveys_completed
       FROM survey_participations
       WHERE provider_confirmed_at >= $2 AND provider_confirmed_at < $3
        AND status='validated'
       GROUP BY user_id
     ), earnings AS (
       SELECT u.id AS user_id,
        COALESCE(rt.points_earned,0)::BIGINT AS points_earned,
        COALESCE(st.surveys_completed,0)::INTEGER AS surveys_completed
       FROM users u
       LEFT JOIN reward_totals rt ON rt.user_id=u.id
       LEFT JOIN survey_totals st ON st.user_id=u.id
       LEFT JOIN leaderboard_exclusions le
        ON le.leaderboard_id=$1 AND le.user_id=u.id
       WHERE u.deleted_at IS NULL
        AND u.account_status_code IN ('active','limited')
        AND le.user_id IS NULL
     ), ranked AS (
       SELECT *, ROW_NUMBER() OVER (
        ORDER BY
          CASE WHEN $4='points_earned' THEN points_earned END DESC,
          CASE WHEN $4='surveys_completed' THEN surveys_completed END DESC,
          user_id
       )::INTEGER AS rank
       FROM earnings WHERE points_earned > 0 OR surveys_completed > 0
     )
     INSERT INTO leaderboard_entries (
      id, period_id, user_id, rank, metric_value,
      points_earned, surveys_completed
     ) SELECT md5($5::TEXT || user_id::TEXT)::UUID, $5, user_id, rank,
      CASE WHEN $4='surveys_completed' THEN surveys_completed
        ELSE points_earned END,
      points_earned, surveys_completed
     FROM ranked WHERE rank <= $6`,
    [
      definition.id,
      period.startsAt,
      period.endsAt,
      definition.metric,
      activePeriodId,
      definition.max_entries,
    ],
  );
  return inserted.rowCount ?? 0;
}

async function snapshotLeaderboards(): Promise<Record<string, number>> {
  return database.transaction(async (client) => {
    await client.query(
      `UPDATE leaderboard_periods SET status='finalized', finalized_at=NOW()
       WHERE status IN ('open','calculating') AND ends_at <= NOW()`,
    );
    const definitions = await client.query<{
      id: string;
      cadence: "weekly" | "monthly" | "seasonal";
      metric: "points_earned" | "surveys_completed" | "streak_days";
      max_entries: number;
      configuration: Record<string, unknown>;
    }>(
      `SELECT id, cadence, metric, max_entries, configuration
       FROM leaderboard_definitions
       WHERE enabled=TRUE`,
    );
    let entries = 0;
    let boards = 0;
    for (const definition of definitions.rows) {
      if (definition.metric === "streak_days") {
        continue;
      }
      try {
        entries += await snapshotDefinition(
          client,
          {
            id: definition.id,
            cadence: definition.cadence,
            metric: definition.metric,
            max_entries: definition.max_entries,
            configuration: definition.configuration,
          },
          new Date(),
        );
      } catch (error) {
        if (
          definition.cadence === "seasonal" &&
          error instanceof Error &&
          error.message === "seasonal leaderboard has no active period"
        ) {
          continue;
        }
        throw error;
      }
      boards += 1;
    }
    return { boards, entries };
  });
}

async function broadcastNotifications(
  payload: Record<string, unknown>,
): Promise<Record<string, number>> {
  const category = payload.category;
  const title = payload.title;
  const body = payload.body;
  const actionUrl = payload.actionUrl;
  const audience = payload.audience;
  if (
    !["announcement", "promotion", "system"].includes(String(category)) ||
    typeof title !== "string" ||
    typeof body !== "string" ||
    (actionUrl !== null && typeof actionUrl !== "string") ||
    typeof audience !== "object" ||
    audience === null ||
    !("type" in audience)
  ) {
    throw new Error("broadcast notification payload is invalid");
  }
  const typedAudience = audience as {
    type: unknown;
    countryCode?: unknown;
    userId?: unknown;
  };
  if (!["all", "country", "user"].includes(String(typedAudience.type))) {
    throw new Error("broadcast notification audience is invalid");
  }
  return database.transaction(async (client) => {
    const users = await client.query<{ id: string }>(
      `SELECT id FROM users
       WHERE deleted_at IS NULL AND account_status_code IN ('active','limited')
         AND ($1::TEXT <> 'country' OR country_code=$2)
         AND ($1::TEXT <> 'user' OR id=$3::UUID)
       ORDER BY id`,
      [
        String(typedAudience.type),
        typeof typedAudience.countryCode === "string"
          ? typedAudience.countryCode
          : null,
        typeof typedAudience.userId === "string" ? typedAudience.userId : null,
      ],
    );
    for (const user of users.rows) {
      await createNotification(client, {
        userId: user.id,
        category: category as "announcement" | "promotion" | "system",
        title,
        body,
        actionUrl: actionUrl as string | null,
      });
    }
    return { recipients: users.rows.length };
  });
}

async function cleanupRetainedData(): Promise<Record<string, number>> {
  return database.transaction(async (client) => {
    const setting = await client.query<{
      value: {
        expiredSessionsDays?: number;
        deletedNotificationsDays?: number;
        sentEmailDays?: number;
      };
    }>("SELECT value FROM system_settings WHERE key='data_retention'");
    const policy = setting.rows[0]?.value ?? {};
    const positiveDays = (value: unknown, fallback: number) =>
      typeof value === "number" &&
      Number.isInteger(value) &&
      value >= 1 &&
      value <= 3_650
        ? value
        : fallback;
    const sessionDays = positiveDays(policy.expiredSessionsDays, 30);
    const notificationDays = positiveDays(policy.deletedNotificationsDays, 30);
    const emailDays = positiveDays(policy.sentEmailDays, 90);
    const sessions = await client.query(
      `DELETE FROM sessions
       WHERE (expires_at < NOW() OR revoked_at IS NOT NULL)
        AND last_seen_at < NOW()-($1::TEXT || ' days')::INTERVAL`,
      [sessionDays],
    );
    const authTokens = await client.query(
      `DELETE FROM auth_tokens
       WHERE expires_at < NOW()-INTERVAL '7 days'
        OR consumed_at < NOW()-INTERVAL '7 days'`,
    );
    const idempotency = await client.query(
      "DELETE FROM idempotency_records WHERE expires_at < NOW()",
    );
    const notifications = await client.query(
      `DELETE FROM notifications WHERE status='deleted'
       AND deleted_at < NOW()-($1::TEXT || ' days')::INTERVAL`,
      [notificationDays],
    );
    const email = await client.query(
      `DELETE FROM email_outbox WHERE status IN ('sent','dead')
       AND updated_at < NOW()-($1::TEXT || ' days')::INTERVAL`,
      [emailDays],
    );
    return {
      sessions: sessions.rowCount ?? 0,
      authTokens: authTokens.rowCount ?? 0,
      idempotencyRecords: idempotency.rowCount ?? 0,
      notifications: notifications.rowCount ?? 0,
      emailOutbox: email.rowCount ?? 0,
    };
  });
}

async function execute(job: JobRow): Promise<Record<string, unknown>> {
  if (job.job_type === "publish_scheduled_content") {
    return publishScheduledContent();
  }
  if (job.job_type === "leaderboard_snapshot") {
    return snapshotLeaderboards();
  }
  if (job.job_type === "broadcast_notifications") {
    return broadcastNotifications(job.payload);
  }
  if (job.job_type === "retention_cleanup") {
    return cleanupRetainedData();
  }
  const metricDate = job.payload.metricDate;
  if (typeof metricDate !== "string") {
    throw new Error("analytics job payload is missing metricDate");
  }
  return analyticsDailyRollup(metricDate);
}

async function processJob(job: JobRow): Promise<void> {
  try {
    const result = await execute(job);
    await database.query(
      `UPDATE background_job_runs SET status='succeeded', result=$2,
        finished_at=NOW(), last_error=NULL WHERE id=$1`,
      [job.id, JSON.stringify(result)],
    );
  } catch (error) {
    const attempts = job.attempt_count + 1;
    await database.query(
      `UPDATE background_job_runs SET status=$2, last_error=$3,
        finished_at=NOW(),
        scheduled_for=NOW() + ($4::TEXT || ' seconds')::INTERVAL
       WHERE id=$1`,
      [
        job.id,
        attempts >= 5 ? "dead" : "failed",
        (error instanceof Error ? error.message : "Unknown error").slice(
          0,
          4_000,
        ),
        Math.min(3_600, 30 * 2 ** attempts),
      ],
    );
    if (runOnce) throw error;
  }
}

async function run(): Promise<void> {
  while (!stopping) {
    await ensureRecurringJobs();
    let processed = 0;
    for (;;) {
      const job = await claimJob();
      if (!job || stopping) break;
      await processJob(job);
      processed += 1;
      if (processed >= 25) break;
    }
    if (runOnce) {
      process.stdout.write(
        `Operations worker one-shot: passed (${processed} jobs)\n`,
      );
      return;
    }
    if (!stopping) await delay(config.operationsWorkerPollMs);
  }
}

async function shutdown(): Promise<void> {
  stopping = true;
}

process.once("SIGTERM", () => void shutdown());
process.once("SIGINT", () => void shutdown());

try {
  await run();
} finally {
  stopping = true;
  await database.close();
}
