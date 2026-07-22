import { randomUUID } from "node:crypto";

import type {
  SupportReplyBodySchema,
  SupportTicketCreateBodySchema,
} from "@earnpearls/contracts";
import type { Static } from "@sinclair/typebox";
import type { FastifyInstance, FastifyRequest } from "fastify";

import { writeUserActivity } from "../../lib/activity.js";
import { writeAudit } from "../../lib/audit.js";
import { hashIp } from "../../lib/crypto.js";
import { AppError } from "../../lib/errors.js";
import { createNotification } from "../notifications/service.js";

type TicketCreate = Static<typeof SupportTicketCreateBodySchema>;
type Reply = Static<typeof SupportReplyBodySchema>;

type TicketRow = Readonly<{
  id: string;
  ticket_number: string;
  category_code: string;
  category_name: string;
  subject: string;
  priority: "low" | "normal" | "high" | "urgent";
  status:
    "open" | "waiting_for_support" | "waiting_for_user" | "resolved" | "closed";
  last_message_at: Date;
  created_at: Date;
  updated_at: Date;
}>;

function projectTicket(row: TicketRow) {
  return {
    id: row.id,
    ticketNumber: row.ticket_number,
    categoryCode: row.category_code,
    categoryName: row.category_name,
    subject: row.subject,
    priority: row.priority,
    status: row.status,
    lastMessageAt: row.last_message_at.toISOString(),
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

const ticketSelect = `SELECT t.id, t.ticket_number::TEXT, t.category_code,
  c.name AS category_name, t.subject, t.priority, t.status,
  t.last_message_at, t.created_at, t.updated_at
 FROM support_tickets t
 JOIN support_ticket_categories c ON c.code = t.category_code`;

export async function listCategories(app: FastifyInstance) {
  const result = await app.db.query<{
    code: string;
    name: string;
    description: string;
  }>(
    `SELECT code, name, description FROM support_ticket_categories
     WHERE active = TRUE ORDER BY sort_order, name`,
  );
  return result.rows;
}

export async function listTickets(app: FastifyInstance, userId: string) {
  const result = await app.db.query<TicketRow>(
    `${ticketSelect}
     WHERE t.user_id = $1
     ORDER BY t.updated_at DESC, t.id DESC LIMIT 100`,
    [userId],
  );
  return result.rows.map(projectTicket);
}

export async function getTicket(
  app: FastifyInstance,
  userId: string,
  ticketId: string,
) {
  const [ticket, messages] = await Promise.all([
    app.db.query<TicketRow>(
      `${ticketSelect} WHERE t.id = $1 AND t.user_id = $2`,
      [ticketId, userId],
    ),
    app.db.query<{
      id: string;
      author_type: "user" | "admin";
      author_name: string;
      body: string;
      created_at: Date;
    }>(
      `SELECT m.id, m.author_type, u.display_name AS author_name,
        m.body, m.created_at
       FROM support_messages m
       JOIN support_tickets t ON t.id = m.ticket_id
       JOIN users u ON u.id = m.author_user_id
       WHERE m.ticket_id = $1 AND t.user_id = $2 AND m.internal_note = FALSE
       ORDER BY m.created_at, m.id`,
      [ticketId, userId],
    ),
  ]);
  const row = ticket.rows[0];
  if (!row)
    throw new AppError(
      404,
      "SUPPORT_TICKET_NOT_FOUND",
      "Support ticket not found.",
    );
  return {
    ...projectTicket(row),
    messages: messages.rows.map((message) => ({
      id: message.id,
      authorType: message.author_type,
      authorName: message.author_name,
      body: message.body,
      createdAt: message.created_at.toISOString(),
    })),
  };
}

export async function createTicket(
  app: FastifyInstance,
  request: FastifyRequest,
  body: TicketCreate,
) {
  const userId = request.auth!.user.id;
  const ticketId = randomUUID();
  await app.db.transaction(async (client) => {
    const policy = await client.query<{
      max_open: number;
      open_count: number;
      category_active: boolean;
    }>(
      `SELECT
        COALESCE((SELECT CASE
          WHEN (value->>'maxOpenTicketsPerUser') ~ '^[0-9]+$'
            AND (value->>'maxOpenTicketsPerUser')::INTEGER BETWEEN 1 AND 50
          THEN (value->>'maxOpenTicketsPerUser')::INTEGER ELSE 5 END
          FROM system_settings WHERE key = 'support'), 5) AS max_open,
        (SELECT COUNT(*)::INTEGER FROM support_tickets
          WHERE user_id = $1 AND status NOT IN ('resolved', 'closed')) AS open_count,
        EXISTS(SELECT 1 FROM support_ticket_categories
          WHERE code = $2 AND active = TRUE) AS category_active`,
      [userId, body.categoryCode],
    );
    const settings = policy.rows[0]!;
    if (!settings.category_active)
      throw new AppError(
        400,
        "SUPPORT_CATEGORY_INVALID",
        "Choose an available support category.",
      );
    if (settings.open_count >= settings.max_open)
      throw new AppError(
        409,
        "SUPPORT_OPEN_LIMIT",
        "Resolve an existing support ticket before creating another.",
      );

    await client.query(
      `INSERT INTO support_tickets (
        id, user_id, category_code, subject, priority, status
       ) VALUES ($1, $2, $3, $4, $5, 'waiting_for_support')`,
      [
        ticketId,
        userId,
        body.categoryCode,
        body.subject.trim(),
        body.priority ?? "normal",
      ],
    );
    await client.query(
      `INSERT INTO support_messages (
        id, ticket_id, author_user_id, author_type, body
       ) VALUES ($1, $2, $3, 'user', $4)`,
      [randomUUID(), ticketId, userId, body.message.trim()],
    );
    await client.query(
      `INSERT INTO support_ticket_events (
        id, ticket_id, actor_id, event_type, from_status, to_status
       ) VALUES ($1, $2, $3, 'ticket.created', NULL, 'waiting_for_support')`,
      [randomUUID(), ticketId, userId],
    );
    await writeUserActivity(client, {
      userId,
      eventType: "support.ticket_created",
      summary: `Support ticket created: ${body.subject.trim()}`,
      targetType: "support_ticket",
      targetId: ticketId,
    });
    await writeAudit(client, {
      actorType: "user",
      actorId: userId,
      action: "support.ticket_created",
      targetType: "support_ticket",
      targetId: ticketId,
      outcome: "success",
      requestId: request.id,
      ipHash: hashIp(request.ip, app.config.ipHashSecret),
    });
  });
  return getTicket(app, userId, ticketId);
}

export async function replyToTicket(
  app: FastifyInstance,
  request: FastifyRequest,
  ticketId: string,
  body: Reply,
) {
  const userId = request.auth!.user.id;
  await app.db.transaction(async (client) => {
    const ticket = await client.query<{ status: TicketRow["status"] }>(
      `SELECT status FROM support_tickets
       WHERE id = $1 AND user_id = $2 FOR UPDATE`,
      [ticketId, userId],
    );
    const row = ticket.rows[0];
    if (!row)
      throw new AppError(
        404,
        "SUPPORT_TICKET_NOT_FOUND",
        "Support ticket not found.",
      );
    if (row.status === "closed")
      throw new AppError(
        409,
        "SUPPORT_TICKET_CLOSED",
        "Closed tickets cannot receive new replies.",
      );
    await client.query(
      `INSERT INTO support_messages (
        id, ticket_id, author_user_id, author_type, body
       ) VALUES ($1, $2, $3, 'user', $4)`,
      [randomUUID(), ticketId, userId, body.message.trim()],
    );
    await client.query(
      `UPDATE support_tickets SET status = 'waiting_for_support',
        last_message_at = NOW(), resolved_at = NULL
       WHERE id = $1`,
      [ticketId],
    );
    await client.query(
      `INSERT INTO support_ticket_events (
        id, ticket_id, actor_id, event_type, from_status, to_status
       ) VALUES ($1, $2, $3, 'message.user', $4, 'waiting_for_support')`,
      [randomUUID(), ticketId, userId, row.status],
    );
    await writeUserActivity(client, {
      userId,
      eventType: "support.ticket_replied",
      summary: "Reply added to support ticket",
      targetType: "support_ticket",
      targetId: ticketId,
    });
    await writeAudit(client, {
      actorType: "user",
      actorId: userId,
      action: "support.ticket_replied",
      targetType: "support_ticket",
      targetId: ticketId,
      outcome: "success",
      requestId: request.id,
      ipHash: hashIp(request.ip, app.config.ipHashSecret),
    });
    if (row.status === "resolved") {
      await createNotification(client, {
        userId,
        category: "support",
        title: "Support ticket reopened",
        body: "Your reply reopened the support ticket.",
        actionUrl: `/app/support/${ticketId}`,
      });
    }
  });
  return getTicket(app, userId, ticketId);
}
