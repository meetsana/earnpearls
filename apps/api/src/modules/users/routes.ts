import {
  ChangePasswordBodySchema,
  MessageSchema,
  NotificationPreferencesSchema,
  UserActivitySchema,
  UserProfileSchema,
  UserProfileUpdateBodySchema,
} from "@earnpearls/contracts";
import { Type } from "@sinclair/typebox";
import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";

import {
  changePassword,
  getPreferences,
  getProfile,
  listActivity,
  updatePreferences,
  updateProfile,
} from "./service.js";

export const userRoutes: FastifyPluginAsyncTypebox = async (app) => {
  app.get(
    "/me",
    {
      preHandler: [app.authenticate, app.authorize("profile.read")],
      schema: {
        tags: ["Users"],
        security: [{ cookieAuth: [] }],
        response: { 200: UserProfileSchema },
      },
    },
    async (request) => getProfile(app, request.auth!.user.id),
  );

  app.patch(
    "/me",
    {
      preHandler: [
        app.authenticate,
        app.verifyCsrf,
        app.authorize("profile.edit"),
      ],
      schema: {
        tags: ["Users"],
        security: [{ cookieAuth: [], csrfToken: [] }],
        body: UserProfileUpdateBodySchema,
        response: { 200: UserProfileSchema },
      },
    },
    async (request) => updateProfile(app, request, request.body),
  );

  app.get(
    "/me/preferences",
    {
      preHandler: [app.authenticate, app.authorize("notification.manage")],
      schema: {
        tags: ["Users"],
        security: [{ cookieAuth: [] }],
        response: { 200: NotificationPreferencesSchema },
      },
    },
    async (request) => getPreferences(app, request.auth!.user.id),
  );

  app.put(
    "/me/preferences",
    {
      preHandler: [
        app.authenticate,
        app.verifyCsrf,
        app.authorize("notification.manage"),
      ],
      schema: {
        tags: ["Users"],
        security: [{ cookieAuth: [], csrfToken: [] }],
        body: NotificationPreferencesSchema,
        response: { 200: NotificationPreferencesSchema },
      },
    },
    async (request) => updatePreferences(app, request, request.body),
  );

  app.post(
    "/me/change-password",
    {
      config: { rateLimit: { max: 5, timeWindow: "1 hour" } },
      preHandler: [
        app.authenticate,
        app.verifyCsrf,
        app.authorize("security.password.change"),
      ],
      schema: {
        tags: ["Users"],
        security: [{ cookieAuth: [], csrfToken: [] }],
        body: ChangePasswordBodySchema,
        response: { 200: MessageSchema },
      },
    },
    async (request) => {
      await changePassword(app, request, request.body);
      return { message: "Password changed. Other sessions were signed out." };
    },
  );

  app.get(
    "/me/activity",
    {
      preHandler: [app.authenticate, app.authorize("profile.read")],
      schema: {
        tags: ["Users"],
        security: [{ cookieAuth: [] }],
        querystring: Type.Object({
          limit: Type.Optional(
            Type.Integer({ minimum: 1, maximum: 100, default: 25 }),
          ),
        }),
        response: { 200: Type.Array(UserActivitySchema) },
      },
    },
    async (request) =>
      listActivity(app, request.auth!.user.id, request.query.limit ?? 25),
  );
};
