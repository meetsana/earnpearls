import {
  CursorPageSchema,
  MessageSchema,
  NotificationCountSchema,
  NotificationSchema,
  NotificationStatusBodySchema,
  NotificationStatusSchema,
} from "@earnpearls/contracts";
import { Type } from "@sinclair/typebox";
import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";

import {
  listNotifications,
  markAllRead,
  unreadCount,
  updateNotificationStatus,
} from "./service.js";

export const notificationRoutes: FastifyPluginAsyncTypebox = async (app) => {
  app.get(
    "/",
    {
      preHandler: [app.authenticate, app.authorize("notification.read")],
      schema: {
        tags: ["Notifications"],
        security: [{ cookieAuth: [] }],
        querystring: Type.Object({
          status: Type.Optional(NotificationStatusSchema),
          cursor: Type.Optional(Type.String({ maxLength: 500 })),
          limit: Type.Optional(
            Type.Integer({ minimum: 1, maximum: 100, default: 25 }),
          ),
        }),
        response: { 200: CursorPageSchema(NotificationSchema) },
      },
    },
    async (request) =>
      listNotifications(app, request.auth!.user.id, {
        ...(request.query.status ? { status: request.query.status } : {}),
        ...(request.query.cursor ? { cursor: request.query.cursor } : {}),
        limit: request.query.limit ?? 25,
      }),
  );

  app.get(
    "/unread-count",
    {
      preHandler: [app.authenticate, app.authorize("notification.read")],
      schema: {
        tags: ["Notifications"],
        security: [{ cookieAuth: [] }],
        response: { 200: NotificationCountSchema },
      },
    },
    async (request) => unreadCount(app, request.auth!.user.id),
  );

  app.patch(
    "/:notificationId",
    {
      preHandler: [
        app.authenticate,
        app.verifyCsrf,
        app.authorize("notification.manage"),
      ],
      schema: {
        tags: ["Notifications"],
        security: [{ cookieAuth: [], csrfToken: [] }],
        params: Type.Object({
          notificationId: Type.String({ format: "uuid" }),
        }),
        body: NotificationStatusBodySchema,
        response: { 200: NotificationSchema },
      },
    },
    async (request) =>
      updateNotificationStatus(
        app,
        request,
        request.params.notificationId,
        request.body.status,
      ),
  );

  app.post(
    "/mark-all-read",
    {
      preHandler: [
        app.authenticate,
        app.verifyCsrf,
        app.authorize("notification.manage"),
      ],
      schema: {
        tags: ["Notifications"],
        security: [{ cookieAuth: [], csrfToken: [] }],
        response: { 200: MessageSchema },
      },
    },
    async (request) => {
      const count = await markAllRead(app, request);
      return {
        message: `${count} notification${count === 1 ? "" : "s"} marked read.`,
      };
    },
  );
};
