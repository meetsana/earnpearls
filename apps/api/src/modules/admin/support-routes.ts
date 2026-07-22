import {
  AdminSupportReplyBodySchema,
  AdminSupportTicketSchema,
  SupportTicketPrioritySchema,
  SupportTicketStatusSchema,
  UuidSchema,
} from "@earnpearls/contracts";
import { Type } from "@sinclair/typebox";
import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";

import {
  adminReplyToTicket,
  getAdminTicket,
  listAdminTickets,
} from "./support-service.js";

export const adminSupportRoutes: FastifyPluginAsyncTypebox = async (app) => {
  app.get(
    "/support/tickets",
    {
      preHandler: [app.authenticate, app.authorize("admin.support.read")],
      schema: {
        tags: ["Admin"],
        security: [{ cookieAuth: [] }],
        querystring: Type.Object({
          status: Type.Optional(SupportTicketStatusSchema),
          priority: Type.Optional(SupportTicketPrioritySchema),
          limit: Type.Optional(
            Type.Integer({ minimum: 1, maximum: 200, default: 50 }),
          ),
        }),
        response: { 200: Type.Array(AdminSupportTicketSchema) },
      },
    },
    async (request) =>
      listAdminTickets(app, {
        ...(request.query.status ? { status: request.query.status } : {}),
        ...(request.query.priority ? { priority: request.query.priority } : {}),
        limit: request.query.limit ?? 50,
      }),
  );

  app.get(
    "/support/tickets/:ticketId",
    {
      preHandler: [app.authenticate, app.authorize("admin.support.read")],
      schema: {
        tags: ["Admin"],
        security: [{ cookieAuth: [] }],
        params: Type.Object({ ticketId: UuidSchema }),
        response: { 200: AdminSupportTicketSchema },
      },
    },
    async (request) => getAdminTicket(app, request.params.ticketId),
  );

  app.post(
    "/support/tickets/:ticketId/replies",
    {
      preHandler: [
        app.authenticate,
        app.verifyCsrf,
        app.authorize("admin.support.manage"),
      ],
      schema: {
        tags: ["Admin"],
        security: [{ cookieAuth: [], csrfToken: [] }],
        params: Type.Object({ ticketId: UuidSchema }),
        body: AdminSupportReplyBodySchema,
        response: { 200: AdminSupportTicketSchema },
      },
    },
    async (request) =>
      adminReplyToTicket(app, request, request.params.ticketId, request.body),
  );
};
