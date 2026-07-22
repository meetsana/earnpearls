import { randomUUID } from "node:crypto";

import type {
  AdminAnnouncementWriteBodySchema,
  AdminBroadcastBodySchema,
  AdminEmailTemplateUpdateBodySchema,
} from "@earnpearls/contracts";
import type { Static } from "@sinclair/typebox";
import type { FastifyInstance, FastifyRequest } from "fastify";

import { writeAudit } from "../../lib/audit.js";
import { hashIp } from "../../lib/crypto.js";
import { AppError } from "../../lib/errors.js";

type AnnouncementWrite = Static<typeof AdminAnnouncementWriteBodySchema>;
type BroadcastWrite = Static<typeof AdminBroadcastBodySchema>;
type EmailTemplateWrite = Static<typeof AdminEmailTemplateUpdateBodySchema>;

function percentage(numerator: number, denominator: number): number {
  if (denominator <= 0) return 0;
  return Math.round((numerator / denominator) * 10_000) / 100;
}

export async function getAdminAnalytics(
  app: FastifyInstance,
  rangeDays: number,
) {
  const [summary, supportResponse, daily] = await Promise.all([
    app.db.query<{
      daily_active: number;
      weekly_active: number;
      monthly_active: number;
      registrations: number;
      verified: number;
      surveys_started: number;
      surveys_validated: number;
      reward_points: string;
      withdrawals_requested: number;
      withdrawals_paid: number;
      withdrawals_rejected: number;
      support_opened: number;
      support_resolved: number;
    }>(
      `SELECT
        (SELECT COUNT(DISTINCT user_id)::INTEGER FROM sessions
          WHERE last_seen_at >= NOW()-INTERVAL '1 day') AS daily_active,
        (SELECT COUNT(DISTINCT user_id)::INTEGER FROM sessions
          WHERE last_seen_at >= NOW()-INTERVAL '7 days') AS weekly_active,
        (SELECT COUNT(DISTINCT user_id)::INTEGER FROM sessions
          WHERE last_seen_at >= NOW()-INTERVAL '30 days') AS monthly_active,
        (SELECT COUNT(*)::INTEGER FROM users
          WHERE created_at >= NOW()-($1::TEXT || ' days')::INTERVAL)
          AS registrations,
        (SELECT COUNT(*)::INTEGER FROM users
          WHERE created_at >= NOW()-($1::TEXT || ' days')::INTERVAL
            AND email_verified_at IS NOT NULL) AS verified,
        (SELECT COUNT(*)::INTEGER FROM survey_participations
          WHERE started_at >= NOW()-($1::TEXT || ' days')::INTERVAL)
          AS surveys_started,
        (SELECT COUNT(*)::INTEGER FROM survey_participations
          WHERE started_at >= NOW()-($1::TEXT || ' days')::INTERVAL
            AND status='validated') AS surveys_validated,
        (SELECT COALESCE(SUM(amount_points),0)::TEXT FROM wallet_transactions
          WHERE created_at >= NOW()-($1::TEXT || ' days')::INTERVAL
            AND kind='survey_earning'
            AND current_bucket NOT IN ('rejected','reversed')) AS reward_points,
        (SELECT COUNT(*)::INTEGER FROM withdrawals
          WHERE requested_at >= NOW()-($1::TEXT || ' days')::INTERVAL)
          AS withdrawals_requested,
        (SELECT COUNT(*)::INTEGER FROM withdrawals
          WHERE requested_at >= NOW()-($1::TEXT || ' days')::INTERVAL
            AND status='paid') AS withdrawals_paid,
        (SELECT COUNT(*)::INTEGER FROM withdrawals
          WHERE requested_at >= NOW()-($1::TEXT || ' days')::INTERVAL
            AND status='rejected') AS withdrawals_rejected,
        (SELECT COUNT(*)::INTEGER FROM support_tickets
          WHERE created_at >= NOW()-($1::TEXT || ' days')::INTERVAL)
          AS support_opened,
        (SELECT COUNT(*)::INTEGER FROM support_tickets
          WHERE created_at >= NOW()-($1::TEXT || ' days')::INTERVAL
            AND status IN ('resolved','closed')) AS support_resolved`,
      [rangeDays],
    ),
    app.db.query<{ average_minutes: number | null }>(
      `WITH first_responses AS (
         SELECT t.id, EXTRACT(EPOCH FROM (MIN(m.created_at)-t.created_at))/60
          AS minutes
         FROM support_tickets t
         JOIN support_messages m ON m.ticket_id=t.id
          AND m.author_type='admin' AND m.internal_note=FALSE
         WHERE t.created_at >= NOW()-($1::TEXT || ' days')::INTERVAL
         GROUP BY t.id
       ) SELECT ROUND(AVG(minutes)::NUMERIC,2)::FLOAT AS average_minutes
         FROM first_responses`,
      [rangeDays],
    ),
    app.db.query<{
      metric_date: Date | string;
      metric_code: string;
      value_numeric: string;
    }>(
      `SELECT metric_date, metric_code, value_numeric::TEXT
       FROM analytics_daily
       WHERE metric_date >= CURRENT_DATE-$1::INTEGER
       ORDER BY metric_date, metric_code`,
      [rangeDays],
    ),
  ]);
  const row = summary.rows[0]!;
  return {
    generatedAt: new Date().toISOString(),
    rangeDays,
    users: {
      dailyActive: row.daily_active,
      weeklyActive: row.weekly_active,
      monthlyActive: row.monthly_active,
      registrations: row.registrations,
      verificationRate: percentage(row.verified, row.registrations),
    },
    surveys: {
      started: row.surveys_started,
      validated: row.surveys_validated,
      completionRate: percentage(row.surveys_validated, row.surveys_started),
      rewardPoints: row.reward_points,
    },
    withdrawals: {
      requested: row.withdrawals_requested,
      paid: row.withdrawals_paid,
      rejected: row.withdrawals_rejected,
    },
    support: {
      opened: row.support_opened,
      resolved: row.support_resolved,
      averageFirstResponseMinutes:
        supportResponse.rows[0]?.average_minutes ?? null,
    },
    daily: daily.rows.map((metric) => ({
      metricDate:
        metric.metric_date instanceof Date
          ? metric.metric_date.toISOString().slice(0, 10)
          : String(metric.metric_date).slice(0, 10),
      metricCode: metric.metric_code,
      value: metric.value_numeric,
    })),
  };
}

export async function listSecurityEvents(
  app: FastifyInstance,
  limit: number,
  severity?: string,
) {
  const result = await app.db.query<{
    id: string;
    user_id: string | null;
    event_type: string;
    severity: "info" | "warning" | "high" | "critical";
    outcome: string;
    request_id: string | null;
    created_at: Date;
  }>(
    `SELECT id, user_id, event_type, severity, outcome, request_id, created_at
     FROM security_events
     WHERE ($1::TEXT IS NULL OR severity=$1)
     ORDER BY created_at DESC, id DESC LIMIT $2`,
    [severity ?? null, limit],
  );
  return result.rows.map((row) => ({
    id: row.id,
    userId: row.user_id,
    eventType: row.event_type,
    severity: row.severity,
    outcome: row.outcome,
    requestId: row.request_id,
    createdAt: row.created_at.toISOString(),
  }));
}

export async function listProviderSyncRuns(
  app: FastifyInstance,
  limit: number,
) {
  const result = await app.db.query<{
    id: string;
    provider_code: string;
    provider_name: string;
    operation: string;
    status: string;
    attempt_count: number;
    records_received: number;
    records_changed: number;
    duration_ms: number | null;
    error_code: string | null;
    error_message: string | null;
    started_at: Date | null;
    finished_at: Date | null;
    created_at: Date;
  }>(
    `SELECT r.id, p.code AS provider_code, p.display_name AS provider_name,
      r.operation, r.status, r.attempt_count, r.records_received,
      r.records_changed, r.duration_ms, r.error_code, r.error_message,
      r.started_at, r.finished_at, r.created_at
     FROM provider_sync_runs r JOIN providers p ON p.id=r.provider_id
     ORDER BY r.created_at DESC, r.id DESC LIMIT $1`,
    [limit],
  );
  return result.rows.map((row) => ({
    id: row.id,
    providerCode: row.provider_code,
    providerName: row.provider_name,
    operation: row.operation,
    status: row.status,
    attemptCount: row.attempt_count,
    recordsReceived: row.records_received,
    recordsChanged: row.records_changed,
    durationMs: row.duration_ms,
    errorCode: row.error_code,
    errorMessage: row.error_message,
    startedAt: row.started_at?.toISOString() ?? null,
    finishedAt: row.finished_at?.toISOString() ?? null,
    createdAt: row.created_at.toISOString(),
  }));
}

type AnnouncementRow = Readonly<{
  id: string;
  title: string;
  body: string;
  severity: "info" | "success" | "warning" | "danger";
  active: boolean;
  country_codes: string[];
  starts_at: Date;
  ends_at: Date | null;
  created_at: Date;
  updated_at: Date;
}>;

function projectAnnouncement(row: AnnouncementRow) {
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    severity: row.severity,
    active: row.active,
    countryCodes: row.country_codes,
    startsAt: row.starts_at.toISOString(),
    endsAt: row.ends_at?.toISOString() ?? null,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

export async function listAnnouncements(app: FastifyInstance) {
  const result = await app.db.query<AnnouncementRow>(
    `SELECT id, title, body, severity, active, country_codes, starts_at,
      ends_at, created_at, updated_at
     FROM announcements ORDER BY created_at DESC, id DESC`,
  );
  return result.rows.map(projectAnnouncement);
}

export async function saveAnnouncement(
  app: FastifyInstance,
  request: FastifyRequest,
  announcementId: string | undefined,
  body: AnnouncementWrite,
) {
  const startsAt = new Date(body.startsAt);
  const endsAt = body.endsAt ? new Date(body.endsAt) : null;
  if (endsAt && endsAt <= startsAt) {
    throw new AppError(
      400,
      "ANNOUNCEMENT_WINDOW_INVALID",
      "Announcement end time must be after its start time.",
    );
  }
  const id = announcementId ?? randomUUID();
  const row = await app.db.transaction(async (client) => {
    if (announcementId) {
      const exists = await client.query(
        "SELECT 1 FROM announcements WHERE id=$1 FOR UPDATE",
        [id],
      );
      if (!exists.rows[0]) {
        throw new AppError(
          404,
          "ANNOUNCEMENT_NOT_FOUND",
          "Announcement not found.",
        );
      }
    }
    const result = await client.query<AnnouncementRow>(
      `INSERT INTO announcements (
        id, title, body, severity, active, country_codes, starts_at,
        ends_at, created_by
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title,
        body=EXCLUDED.body, severity=EXCLUDED.severity,
        active=EXCLUDED.active, country_codes=EXCLUDED.country_codes,
        starts_at=EXCLUDED.starts_at, ends_at=EXCLUDED.ends_at
       RETURNING id, title, body, severity, active, country_codes,
        starts_at, ends_at, created_at, updated_at`,
      [
        id,
        body.title.trim(),
        body.body.trim(),
        body.severity,
        body.active,
        body.countryCodes,
        startsAt,
        endsAt,
        request.auth!.user.id,
      ],
    );
    await writeAudit(client, {
      actorType: "admin",
      actorId: request.auth!.user.id,
      action: announcementId
        ? "admin.announcement.updated"
        : "admin.announcement.created",
      targetType: "announcement",
      targetId: id,
      reason: body.reason,
      outcome: "success",
      requestId: request.id,
      ipHash: hashIp(request.ip, app.config.ipHashSecret),
    });
    return result.rows[0]!;
  });
  return projectAnnouncement(row);
}

export async function queueBroadcast(
  app: FastifyInstance,
  request: FastifyRequest,
  body: BroadcastWrite,
): Promise<string> {
  if (
    body.actionUrl &&
    !body.actionUrl.startsWith("/") &&
    !body.actionUrl.startsWith(app.config.publicAppUrl)
  ) {
    throw new AppError(
      400,
      "NOTIFICATION_ACTION_URL_INVALID",
      "Notification links must stay within EarnPearls.",
    );
  }
  const jobId = randomUUID();
  await app.db.transaction(async (client) => {
    await client.query(
      `INSERT INTO background_job_runs (
        id, job_type, status, payload, scheduled_for
       ) VALUES ($1,'broadcast_notifications','queued',$2,NOW())`,
      [
        jobId,
        JSON.stringify({
          category: body.category,
          title: body.title.trim(),
          body: body.body.trim(),
          actionUrl: body.actionUrl,
          audience: body.audience,
        }),
      ],
    );
    await writeAudit(client, {
      actorType: "admin",
      actorId: request.auth!.user.id,
      action: "admin.notification.broadcast_queued",
      targetType: "background_job",
      targetId: jobId,
      reason: body.reason,
      outcome: "success",
      requestId: request.id,
      ipHash: hashIp(request.ip, app.config.ipHashSecret),
      metadata: { audienceType: body.audience.type, category: body.category },
    });
  });
  return jobId;
}

type EmailTemplateRow = Readonly<{
  code: string;
  display_name: string;
  subject_template: string;
  text_template: string;
  html_template: string;
  enabled: boolean;
  variables: string[];
  updated_at: Date;
}>;

function projectEmailTemplate(row: EmailTemplateRow) {
  return {
    code: row.code,
    displayName: row.display_name,
    subjectTemplate: row.subject_template,
    textTemplate: row.text_template,
    htmlTemplate: row.html_template,
    enabled: row.enabled,
    variables: row.variables,
    updatedAt: row.updated_at.toISOString(),
  };
}

export async function listEmailTemplates(app: FastifyInstance) {
  const result = await app.db.query<EmailTemplateRow>(
    `SELECT code, display_name, subject_template, text_template,
      html_template, enabled, variables, updated_at
     FROM email_templates ORDER BY code`,
  );
  return result.rows.map(projectEmailTemplate);
}

function templateVariables(source: string): string[] {
  return [...source.matchAll(/\{\{([a-z_]+)\}\}/g)].map((match) => match[1]!);
}

function validateEmailTemplate(
  row: EmailTemplateRow,
  body: EmailTemplateWrite,
) {
  const combined = [
    body.subjectTemplate,
    body.textTemplate,
    body.htmlTemplate,
  ].join("\n");
  const withoutValidVariables = combined.replace(/\{\{[a-z_]+\}\}/g, "");
  if (
    withoutValidVariables.includes("{{") ||
    withoutValidVariables.includes("}}")
  ) {
    throw new AppError(
      400,
      "EMAIL_TEMPLATE_VARIABLE_INVALID",
      "Template variables must use the exact {{variable_name}} format.",
    );
  }
  const unsupported = templateVariables(combined).filter(
    (variable) => !row.variables.includes(variable),
  );
  if (unsupported.length > 0) {
    throw new AppError(
      400,
      "EMAIL_TEMPLATE_VARIABLE_INVALID",
      `Unsupported template variable: ${unsupported[0]}.`,
    );
  }
  const required =
    row.code === "notification"
      ? ["title", "body", "action_url"]
      : ["action_url", "expires_at"];
  for (const variable of required) {
    const token = `{{${variable}}}`;
    if (
      (variable === "title" && !body.subjectTemplate.includes(token)) ||
      (variable !== "title" &&
        (!body.textTemplate.includes(token) ||
          !body.htmlTemplate.includes(token)))
    ) {
      throw new AppError(
        400,
        "EMAIL_TEMPLATE_VARIABLE_REQUIRED",
        `Template must preserve ${token} in its required fields.`,
      );
    }
  }
  if (
    /[\r\n]/.test(body.subjectTemplate) ||
    /<(?:script|style|iframe|object|embed|form)\b|\son[a-z]+\s*=|javascript:|data:/i.test(
      body.htmlTemplate,
    )
  ) {
    throw new AppError(
      400,
      "EMAIL_TEMPLATE_UNSAFE",
      "Email subject or HTML contains a prohibited pattern.",
    );
  }
  if (["verify_email", "reset_password"].includes(row.code) && !body.enabled) {
    throw new AppError(
      409,
      "SECURITY_EMAIL_REQUIRED",
      "Email verification and password-reset templates cannot be disabled.",
    );
  }
}

export async function updateEmailTemplate(
  app: FastifyInstance,
  request: FastifyRequest,
  code: string,
  body: EmailTemplateWrite,
) {
  const updated = await app.db.transaction(async (client) => {
    const currentResult = await client.query<EmailTemplateRow>(
      `SELECT code, display_name, subject_template, text_template,
        html_template, enabled, variables, updated_at
       FROM email_templates WHERE code=$1 FOR UPDATE`,
      [code],
    );
    const current = currentResult.rows[0];
    if (!current) {
      throw new AppError(
        404,
        "EMAIL_TEMPLATE_NOT_FOUND",
        "Email template not found.",
      );
    }
    validateEmailTemplate(current, body);
    await client.query(
      `INSERT INTO email_template_revisions (
        id, template_code, previous_subject_template,
        previous_text_template, previous_html_template, previous_enabled,
        new_subject_template, new_text_template, new_html_template,
        new_enabled, actor_id, reason
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
      [
        randomUUID(),
        code,
        current.subject_template,
        current.text_template,
        current.html_template,
        current.enabled,
        body.subjectTemplate.trim(),
        body.textTemplate.trim(),
        body.htmlTemplate.trim(),
        body.enabled,
        request.auth!.user.id,
        body.reason,
      ],
    );
    const result = await client.query<EmailTemplateRow>(
      `UPDATE email_templates SET subject_template=$2, text_template=$3,
        html_template=$4, enabled=$5, updated_by=$6
       WHERE code=$1
       RETURNING code, display_name, subject_template, text_template,
        html_template, enabled, variables, updated_at`,
      [
        code,
        body.subjectTemplate.trim(),
        body.textTemplate.trim(),
        body.htmlTemplate.trim(),
        body.enabled,
        request.auth!.user.id,
      ],
    );
    await writeAudit(client, {
      actorType: "admin",
      actorId: request.auth!.user.id,
      action: "admin.email_template.updated",
      targetType: "email_template",
      targetId: code,
      reason: body.reason,
      outcome: "success",
      requestId: request.id,
      ipHash: hashIp(request.ip, app.config.ipHashSecret),
      metadata: { enabled: body.enabled },
    });
    return result.rows[0]!;
  });
  return projectEmailTemplate(updated);
}
