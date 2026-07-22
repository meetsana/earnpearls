import {
  AdminAnalyticsSchema,
  AdminAnnouncementSchema,
  AdminAnnouncementWriteBodySchema,
  AdminBroadcastBodySchema,
  AdminEmailTemplateSchema,
  AdminEmailTemplateUpdateBodySchema,
  MessageSchema,
  ProviderSyncRunSchema,
  SecurityEventSchema,
  UuidSchema,
} from "@earnpearls/contracts";
import { Type } from "@sinclair/typebox";
import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";

import {
  getAdminAnalytics,
  listAnnouncements,
  listEmailTemplates,
  listProviderSyncRuns,
  listSecurityEvents,
  queueBroadcast,
  saveAnnouncement,
  updateEmailTemplate,
} from "./insights-service.js";

export const adminInsightsRoutes: FastifyPluginAsyncTypebox = async (app) => {
  app.get(
    "/analytics",
    {
      preHandler: [app.authenticate, app.authorize("admin.reports.read")],
      schema: {
        tags: ["Admin"],
        security: [{ cookieAuth: [] }],
        querystring: Type.Object({
          rangeDays: Type.Optional(
            Type.Integer({ minimum: 1, maximum: 365, default: 30 }),
          ),
        }),
        response: { 200: AdminAnalyticsSchema },
      },
    },
    async (request) => getAdminAnalytics(app, request.query.rangeDays ?? 30),
  );

  app.get(
    "/security-events",
    {
      preHandler: [app.authenticate, app.authorize("admin.security.read")],
      schema: {
        tags: ["Admin"],
        security: [{ cookieAuth: [] }],
        querystring: Type.Object({
          severity: Type.Optional(
            Type.Union([
              Type.Literal("info"),
              Type.Literal("warning"),
              Type.Literal("high"),
              Type.Literal("critical"),
            ]),
          ),
          limit: Type.Optional(
            Type.Integer({ minimum: 1, maximum: 500, default: 100 }),
          ),
        }),
        response: { 200: Type.Array(SecurityEventSchema) },
      },
    },
    async (request) =>
      listSecurityEvents(
        app,
        request.query.limit ?? 100,
        request.query.severity,
      ),
  );

  app.get(
    "/provider-sync-runs",
    {
      preHandler: [app.authenticate, app.authorize("admin.providers.read")],
      schema: {
        tags: ["Admin"],
        security: [{ cookieAuth: [] }],
        querystring: Type.Object({
          limit: Type.Optional(
            Type.Integer({ minimum: 1, maximum: 500, default: 100 }),
          ),
        }),
        response: { 200: Type.Array(ProviderSyncRunSchema) },
      },
    },
    async (request) => listProviderSyncRuns(app, request.query.limit ?? 100),
  );

  app.get(
    "/announcements",
    {
      preHandler: [app.authenticate, app.authorize("admin.content.read")],
      schema: {
        tags: ["Admin"],
        security: [{ cookieAuth: [] }],
        response: { 200: Type.Array(AdminAnnouncementSchema) },
      },
    },
    async () => listAnnouncements(app),
  );

  app.post(
    "/announcements",
    {
      preHandler: [
        app.authenticate,
        app.verifyCsrf,
        app.authorize("admin.content.manage"),
      ],
      schema: {
        tags: ["Admin"],
        security: [{ cookieAuth: [], csrfToken: [] }],
        body: AdminAnnouncementWriteBodySchema,
        response: { 201: AdminAnnouncementSchema },
      },
    },
    async (request, reply) =>
      reply
        .code(201)
        .send(await saveAnnouncement(app, request, undefined, request.body)),
  );

  app.put(
    "/announcements/:announcementId",
    {
      preHandler: [
        app.authenticate,
        app.verifyCsrf,
        app.authorize("admin.content.manage"),
      ],
      schema: {
        tags: ["Admin"],
        security: [{ cookieAuth: [], csrfToken: [] }],
        params: Type.Object({ announcementId: UuidSchema }),
        body: AdminAnnouncementWriteBodySchema,
        response: { 200: AdminAnnouncementSchema },
      },
    },
    async (request) =>
      saveAnnouncement(
        app,
        request,
        request.params.announcementId,
        request.body,
      ),
  );

  app.post(
    "/notifications/broadcast",
    {
      preHandler: [
        app.authenticate,
        app.verifyCsrf,
        app.authorize("admin.notifications.manage"),
      ],
      schema: {
        tags: ["Admin"],
        security: [{ cookieAuth: [], csrfToken: [] }],
        body: AdminBroadcastBodySchema,
        response: { 202: MessageSchema },
      },
    },
    async (request, reply) => {
      const jobId = await queueBroadcast(app, request, request.body);
      return reply
        .code(202)
        .send({ message: `Notification broadcast queued as job ${jobId}.` });
    },
  );

  app.get(
    "/email-templates",
    {
      preHandler: [
        app.authenticate,
        app.authorize("admin.notifications.manage"),
      ],
      schema: {
        tags: ["Admin"],
        security: [{ cookieAuth: [] }],
        response: { 200: Type.Array(AdminEmailTemplateSchema) },
      },
    },
    async () => listEmailTemplates(app),
  );

  app.put(
    "/email-templates/:code",
    {
      preHandler: [
        app.authenticate,
        app.verifyCsrf,
        app.authorize("admin.notifications.manage"),
      ],
      schema: {
        tags: ["Admin"],
        security: [{ cookieAuth: [], csrfToken: [] }],
        params: Type.Object({
          code: Type.String({ pattern: "^[a-z][a-z0-9_]{2,63}$" }),
        }),
        body: AdminEmailTemplateUpdateBodySchema,
        response: { 200: AdminEmailTemplateSchema },
      },
    },
    async (request) =>
      updateEmailTemplate(app, request, request.params.code, request.body),
  );
};
