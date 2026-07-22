import {
  SupportCategorySchema,
  SupportReplyBodySchema,
  SupportTicketCreateBodySchema,
  SupportTicketSchema,
} from "@earnpearls/contracts";
import { Type } from "@sinclair/typebox";
import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";

import {
  createTicket,
  getTicket,
  listCategories,
  listTickets,
  replyToTicket,
} from "./service.js";

export const supportRoutes: FastifyPluginAsyncTypebox = async (app) => {
  app.get(
    "/categories",
    {
      preHandler: [app.authenticate, app.authorize("support.read")],
      schema: {
        tags: ["Support"],
        security: [{ cookieAuth: [] }],
        response: { 200: Type.Array(SupportCategorySchema) },
      },
    },
    async () => listCategories(app),
  );

  app.get(
    "/tickets",
    {
      preHandler: [app.authenticate, app.authorize("support.read")],
      schema: {
        tags: ["Support"],
        security: [{ cookieAuth: [] }],
        response: { 200: Type.Array(SupportTicketSchema) },
      },
    },
    async (request) => listTickets(app, request.auth!.user.id),
  );

  app.get(
    "/tickets/:ticketId",
    {
      preHandler: [app.authenticate, app.authorize("support.read")],
      schema: {
        tags: ["Support"],
        security: [{ cookieAuth: [] }],
        params: Type.Object({ ticketId: Type.String({ format: "uuid" }) }),
        response: { 200: SupportTicketSchema },
      },
    },
    async (request) =>
      getTicket(app, request.auth!.user.id, request.params.ticketId),
  );

  app.post(
    "/tickets",
    {
      preHandler: [
        app.authenticate,
        app.verifyCsrf,
        app.authorize("support.create", { requireVerifiedEmail: true }),
      ],
      schema: {
        tags: ["Support"],
        security: [{ cookieAuth: [], csrfToken: [] }],
        body: SupportTicketCreateBodySchema,
        response: { 201: SupportTicketSchema },
      },
    },
    async (request, reply) =>
      reply.code(201).send(await createTicket(app, request, request.body)),
  );

  app.post(
    "/tickets/:ticketId/replies",
    {
      preHandler: [
        app.authenticate,
        app.verifyCsrf,
        app.authorize("support.reply", { requireVerifiedEmail: true }),
      ],
      schema: {
        tags: ["Support"],
        security: [{ cookieAuth: [], csrfToken: [] }],
        params: Type.Object({ ticketId: Type.String({ format: "uuid" }) }),
        body: SupportReplyBodySchema,
        response: { 200: SupportTicketSchema },
      },
    },
    async (request) =>
      replyToTicket(app, request, request.params.ticketId, request.body),
  );
};
