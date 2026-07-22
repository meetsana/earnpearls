import { randomUUID } from "node:crypto";

import type { AdminSupportReplyBodySchema } from "@earnpearls/contracts";
import type { Static } from "@sinclair/typebox";
import type { FastifyInstance, FastifyRequest } from "fastify";

import { writeAudit } from "../../lib/audit.js";
import { hashIp } from "../../lib/crypto.js";
import { AppError } from "../../lib/errors.js";
import { createNotification } from "../notifications/service.js";

type ReplyBody = Static<typeof AdminSupportReplyBodySchema>;
type TicketStatus = ReplyBody["status"];
type TicketPriority = ReplyBody["priority"];

type AdminTicketRow = Readonly<{
  id: string;
  ticket_number: string;
  user_id: string;
  user_email: string;
  user_display_name: string;
  category_code: string;
  category_name: string;
  subject: string;
  priority: Exclude<TicketPriority, undefined>;
  status: Exclude<TicketStatus, undefined>;
  assigned_to: string | null;
  last_message_at: Date;
  created_at: Date;
  updated_at: Date;
}>;

const selectTicket = `SELECT t.id, t.ticket_number::TEXT, t.user_id,
  u.email AS user_email, u.display_name AS user_display_name,
  t.category_code, c.name AS category_name, t.subject, t.priority,
  t.status, t.assigned_to, t.last_message_at, t.created_at, t.updated_at
 FROM support_tickets t
 JOIN users u ON u.id = t.user_id
 JOIN support_ticket_categories c ON c.code = t.category_code`;

function projectTicket(row: AdminTicketRow) {
  return {
    id: row.id,
    ticketNumber: row.ticket_number,
    userId: row.user_id,
    userEmail: row.user_email,
    userDisplayName: row.user_display_name,
    categoryCode: row.category_code,
    categoryName: row.category_name,
    subject: row.subject,
    priority: row.priority,
    status: row.status,
    assignedTo: row.assigned_to,
    lastMessageAt: row.last_message_at.toISOString(),
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

export async function listAdminTickets(
  app: FastifyInstance,
  options: Readonly<{ status?: string; priority?: string; limit: number }>,
) {
  const result = await app.db.query<AdminTicketRow>(
    `${selectTicket}
     WHERE ($1::TEXT IS NULL OR t.status = $1)
       AND ($2::TEXT IS NULL OR t.priority = $2)
     ORDER BY
       CASE t.priority WHEN 'urgent' THEN 1 WHEN 'high' THEN 2
         WHEN 'normal' THEN 3 ELSE 4 END,
       t.last_message_at ASC
     LIMIT $3`,
    [options.status ?? null, options.priority ?? null, options.limit],
  );
  return result.rows.map(projectTicket);
}

export async function getAdminTicket(app: FastifyInstance, ticketId: string) {
  const [ticket, messages] = await Promise.all([
    app.db.query<AdminTicketRow>(`${selectTicket} WHERE t.id = $1`, [ticketId]),
    app.db.query<{
      id: string;
      author_type: "user" | "admin";
      author_name: string;
      body: string;
      internal_note: boolean;
      created_at: Date;
    }>(
      `SELECT m.id, m.author_type, u.display_name AS author_name,
        m.body, m.internal_note, m.created_at
       FROM support_messages m
       JOIN users u ON u.id = m.author_user_id
       WHERE m.ticket_id = $1 ORDER BY m.created_at, m.id`,
      [ticketId],
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
      internalNote: message.internal_note,
      createdAt: message.created_at.toISOString(),
    })),
  };
}

export async function adminReplyToTicket(
  app: FastifyInstance,
  request: FastifyRequest,
  ticketId: string,
  body: ReplyBody,
) {
  const actorId = request.auth!.user.id;
  await app.db.transaction(async (client) => {
    const result = await client.query<{
      user_id: string;
      subject: string;
      status: Exclude<TicketStatus, undefined>;
      priority: Exclude<TicketPriority, undefined>;
      assigned_to: string | null;
    }>(
      `SELECT user_id, subject, status, priority, assigned_to
       FROM support_tickets WHERE id = $1 FOR UPDATE`,
      [ticketId],
    );
    const ticket = result.rows[0];
    if (!ticket)
      throw new AppError(
        404,
        "SUPPORT_TICKET_NOT_FOUND",
        "Support ticket not found.",
      );
    if (ticket.status === "closed" && body.status !== "open")
      throw new AppError(
        409,
        "SUPPORT_TICKET_CLOSED",
        "Reopen the ticket before adding a reply.",
      );
    if (body.assignedTo) {
      const administrator = await client.query(
        `SELECT 1 FROM user_roles ur JOIN roles r ON r.code = ur.role_code
         WHERE ur.user_id = $1 AND r.administrative = TRUE LIMIT 1`,
        [body.assignedTo],
      );
      if (!administrator.rows[0])
        throw new AppError(
          400,
          "SUPPORT_ASSIGNEE_INVALID",
          "Tickets can only be assigned to an administrator.",
        );
    }

    const internalNote = body.internalNote ?? false;
    const nextStatus =
      body.status ?? (internalNote ? ticket.status : "waiting_for_user");
    const nextPriority = body.priority ?? ticket.priority;
    const nextAssignee =
      body.assignedTo === undefined ? ticket.assigned_to : body.assignedTo;
    await client.query(
      `INSERT INTO support_messages (
        id, ticket_id, author_user_id, author_type, body, internal_note
       ) VALUES ($1, $2, $3, 'admin', $4, $5)`,
      [randomUUID(), ticketId, actorId, body.message.trim(), internalNote],
    );
    await client.query(
      `UPDATE support_tickets SET
        status = $2,
        priority = $3,
        assigned_to = $4,
        last_message_at = NOW(),
        resolved_at = CASE WHEN $2 = 'resolved' THEN NOW() ELSE NULL END,
        closed_at = CASE WHEN $2 = 'closed' THEN NOW() ELSE NULL END
       WHERE id = $1`,
      [ticketId, nextStatus, nextPriority, nextAssignee],
    );
    await client.query(
      `INSERT INTO support_ticket_events (
        id, ticket_id, actor_id, event_type, from_status, to_status,
        reason, metadata
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        randomUUID(),
        ticketId,
        actorId,
        internalNote ? "message.internal_note" : "message.admin",
        ticket.status,
        nextStatus,
        body.reason,
        JSON.stringify({
          previousPriority: ticket.priority,
          priority: nextPriority,
          assignedTo: nextAssignee,
        }),
      ],
    );
    await writeAudit(client, {
      actorType: "admin",
      actorId,
      action: internalNote
        ? "admin.support.internal_note"
        : "admin.support.replied",
      targetType: "support_ticket",
      targetId: ticketId,
      reason: body.reason,
      outcome: "success",
      requestId: request.id,
      ipHash: hashIp(request.ip, app.config.ipHashSecret),
      metadata: { status: nextStatus, priority: nextPriority },
    });
    if (!internalNote) {
      await createNotification(client, {
        userId: ticket.user_id,
        category: "support",
        title: "Support replied",
        body: `There is a new reply on “${ticket.subject}”.`,
        actionUrl: `/app/support/${ticketId}`,
      });
    }
  });
  return getAdminTicket(app, ticketId);
}
