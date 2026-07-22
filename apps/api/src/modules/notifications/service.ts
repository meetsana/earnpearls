import { randomUUID } from "node:crypto";

import type {
  NotificationCategorySchema,
  NotificationStatusSchema,
} from "@earnpearls/contracts";
import type { Static } from "@sinclair/typebox";
import type { FastifyInstance, FastifyRequest } from "fastify";

import type { Queryable } from "../../db/database.js";
import { writeAudit } from "../../lib/audit.js";
import { hashIp } from "../../lib/crypto.js";
import { AppError } from "../../lib/errors.js";

type Category = Static<typeof NotificationCategorySchema>;
type Status = Static<typeof NotificationStatusSchema>;

type NotificationRow = Readonly<{
  id: string;
  category: Category;
  title: string;
  body: string;
  action_url: string | null;
  status: Status;
  read_at: Date | null;
  created_at: Date;
  updated_at: Date;
}>;

function project(row: NotificationRow) {
  return {
    id: row.id,
    category: row.category,
    title: row.title,
    body: row.body,
    actionUrl: row.action_url,
    status: row.status,
    readAt: row.read_at?.toISOString() ?? null,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

export async function createNotification(
  queryable: Queryable,
  input: Readonly<{
    userId: string;
    category: Category;
    title: string;
    body: string;
    actionUrl?: string | null;
  }>,
): Promise<string> {
  const id = randomUUID();
  const deliveryPreferences = await queryable.query<{
    email: string;
    email_enabled: boolean;
    in_app_enabled: boolean;
  }>(
    `SELECT u.email,
      CASE $2
        WHEN 'reward' THEN COALESCE(p.email_reward_updates, TRUE)
        WHEN 'survey' THEN COALESCE(p.email_reward_updates, TRUE)
        WHEN 'withdrawal' THEN COALESCE(p.email_withdrawal_updates, TRUE)
        WHEN 'security' THEN TRUE
        WHEN 'support' THEN COALESCE(p.email_support_updates, TRUE)
        WHEN 'promotion' THEN COALESCE(p.email_marketing, FALSE)
        ELSE COALESCE(p.email_platform_announcements, TRUE)
      END AS email_enabled,
      CASE $2
        WHEN 'reward' THEN COALESCE(p.in_app_reward_updates, TRUE)
        WHEN 'survey' THEN COALESCE(p.in_app_reward_updates, TRUE)
        WHEN 'withdrawal' THEN COALESCE(p.in_app_withdrawal_updates, TRUE)
        WHEN 'security' THEN TRUE
        WHEN 'support' THEN COALESCE(p.in_app_support_updates, TRUE)
        WHEN 'promotion' THEN FALSE
        ELSE COALESCE(p.in_app_platform_announcements, TRUE)
      END AS in_app_enabled
     FROM users u LEFT JOIN user_preferences p ON p.user_id = u.id
     WHERE u.id = $1`,
    [input.userId, input.category],
  );
  await queryable.query(
    `INSERT INTO notifications (
      id, user_id, category, title, body, action_url, in_app_visible
     ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      id,
      input.userId,
      input.category,
      input.title,
      input.body,
      input.actionUrl ?? null,
      deliveryPreferences.rows[0]?.in_app_enabled ?? true,
    ],
  );
  await queryable.query(
    `INSERT INTO notification_deliveries (
      id, notification_id, channel, status, delivered_at
     ) VALUES ($1, $2, 'in_app', $3,
      CASE WHEN $3='delivered' THEN NOW() ELSE NULL END)`,
    [
      randomUUID(),
      id,
      deliveryPreferences.rows[0]?.in_app_enabled === false
        ? "suppressed"
        : "delivered",
    ],
  );
  const delivery = deliveryPreferences.rows[0];
  if (delivery?.email_enabled) {
    await queryable.query(
      `INSERT INTO notification_deliveries (
        id, notification_id, channel, status
       ) VALUES ($1, $2, 'email', 'queued')`,
      [randomUUID(), id],
    );
    await queryable.query(
      `INSERT INTO email_outbox (
        id, user_id, recipient, template_code, template_data
       ) VALUES ($1, $2, $3, 'notification', $4)`,
      [
        randomUUID(),
        input.userId,
        delivery.email,
        JSON.stringify({
          notificationId: id,
          title: input.title,
          body: input.body,
          actionUrl: input.actionUrl ?? null,
        }),
      ],
    );
  }
  return id;
}

function encodeCursor(row: NotificationRow): string {
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

export async function listNotifications(
  app: FastifyInstance,
  userId: string,
  options: Readonly<{ status?: Status; cursor?: string; limit: number }>,
) {
  const cursor = options.cursor ? decodeCursor(options.cursor) : null;
  const result = await app.db.query<NotificationRow>(
    `SELECT id, category, title, body, action_url, status, read_at,
      created_at, updated_at
     FROM notifications
     WHERE user_id = $1
       AND in_app_visible = TRUE
       AND status <> 'deleted'
       AND ($2::TEXT IS NULL OR status = $2)
       AND ($3::TIMESTAMPTZ IS NULL OR (created_at, id) < ($3::TIMESTAMPTZ, $4::UUID))
     ORDER BY created_at DESC, id DESC LIMIT $5`,
    [
      userId,
      options.status ?? null,
      cursor?.createdAt ?? null,
      cursor?.id ?? null,
      options.limit + 1,
    ],
  );
  const hasMore = result.rows.length > options.limit;
  const rows = result.rows.slice(0, options.limit);
  return {
    items: rows.map(project),
    nextCursor: hasMore && rows.at(-1) ? encodeCursor(rows.at(-1)!) : null,
  };
}

export async function unreadCount(app: FastifyInstance, userId: string) {
  const result = await app.db.query<{ count: number }>(
    `SELECT COUNT(*)::INTEGER AS count FROM notifications
     WHERE user_id = $1 AND in_app_visible = TRUE AND status = 'unread'`,
    [userId],
  );
  return { unread: result.rows[0]?.count ?? 0 };
}

export async function updateNotificationStatus(
  app: FastifyInstance,
  request: FastifyRequest,
  notificationId: string,
  status: Exclude<Status, "unread">,
) {
  const userId = request.auth!.user.id;
  const result = await app.db.transaction(async (client) => {
    const updated = await client.query<NotificationRow>(
      `UPDATE notifications SET
        status = $3,
        read_at = CASE WHEN $3 = 'read' THEN COALESCE(read_at, NOW()) ELSE read_at END,
        archived_at = CASE WHEN $3 = 'archived' THEN NOW() ELSE archived_at END,
        deleted_at = CASE WHEN $3 = 'deleted' THEN NOW() ELSE deleted_at END
       WHERE id = $1 AND user_id = $2 AND in_app_visible = TRUE
        AND status <> 'deleted'
       RETURNING id, category, title, body, action_url, status, read_at,
        created_at, updated_at`,
      [notificationId, userId, status],
    );
    const row = updated.rows[0];
    if (!row)
      throw new AppError(
        404,
        "NOTIFICATION_NOT_FOUND",
        "Notification not found.",
      );
    await writeAudit(client, {
      actorType: "user",
      actorId: userId,
      action: `notification.${status}`,
      targetType: "notification",
      targetId: notificationId,
      outcome: "success",
      requestId: request.id,
      ipHash: hashIp(request.ip, app.config.ipHashSecret),
    });
    return row;
  });
  return project(result);
}

export async function markAllRead(
  app: FastifyInstance,
  request: FastifyRequest,
): Promise<number> {
  const userId = request.auth!.user.id;
  return app.db.transaction(async (client) => {
    const result = await client.query(
      `UPDATE notifications SET status = 'read', read_at = COALESCE(read_at, NOW())
       WHERE user_id = $1 AND in_app_visible = TRUE AND status = 'unread'`,
      [userId],
    );
    await writeAudit(client, {
      actorType: "user",
      actorId: userId,
      action: "notification.mark_all_read",
      targetType: "notification",
      targetId: userId,
      outcome: "success",
      requestId: request.id,
      ipHash: hashIp(request.ip, app.config.ipHashSecret),
      metadata: { count: result.rowCount ?? 0 },
    });
    return result.rowCount ?? 0;
  });
}
