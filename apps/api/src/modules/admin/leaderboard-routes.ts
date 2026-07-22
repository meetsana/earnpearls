import {
  AdminLeaderboardDefinitionSchema,
  AdminLeaderboardExclusionSchema,
  AdminLeaderboardWriteBodySchema,
  MessageSchema,
  UuidSchema,
} from "@earnpearls/contracts";
import { Type } from "@sinclair/typebox";
import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";

import {
  listAdminLeaderboards,
  listLeaderboardExclusions,
  resetLeaderboardPeriod,
  setLeaderboardExclusion,
  updateAdminLeaderboard,
} from "./leaderboard-service.js";

const reasonBody = Type.Object({
  reason: Type.String({ minLength: 3, maxLength: 1000 }),
});

export const adminLeaderboardRoutes: FastifyPluginAsyncTypebox = async (
  app,
) => {
  app.get(
    "/leaderboards",
    {
      preHandler: [
        app.authenticate,
        app.authorize("admin.leaderboards.manage"),
      ],
      schema: {
        tags: ["Admin"],
        security: [{ cookieAuth: [] }],
        response: { 200: Type.Array(AdminLeaderboardDefinitionSchema) },
      },
    },
    async () => listAdminLeaderboards(app),
  );

  app.put(
    "/leaderboards/:leaderboardId",
    {
      preHandler: [
        app.authenticate,
        app.verifyCsrf,
        app.authorize("admin.leaderboards.manage"),
      ],
      schema: {
        tags: ["Admin"],
        security: [{ cookieAuth: [], csrfToken: [] }],
        params: Type.Object({ leaderboardId: UuidSchema }),
        body: AdminLeaderboardWriteBodySchema,
        response: { 200: AdminLeaderboardDefinitionSchema },
      },
    },
    async (request) =>
      updateAdminLeaderboard(
        app,
        request,
        request.params.leaderboardId,
        request.body,
      ),
  );

  app.post(
    "/leaderboards/:leaderboardId/reset",
    {
      preHandler: [
        app.authenticate,
        app.verifyCsrf,
        app.authorize("admin.leaderboards.manage"),
      ],
      schema: {
        tags: ["Admin"],
        security: [{ cookieAuth: [], csrfToken: [] }],
        params: Type.Object({ leaderboardId: UuidSchema }),
        body: reasonBody,
        response: { 200: MessageSchema },
      },
    },
    async (request) => {
      await resetLeaderboardPeriod(
        app,
        request,
        request.params.leaderboardId,
        request.body.reason,
      );
      return { message: "Leaderboard period reset and recalculation queued." };
    },
  );

  app.get(
    "/leaderboards/:leaderboardId/exclusions",
    {
      preHandler: [
        app.authenticate,
        app.authorize("admin.leaderboards.manage"),
      ],
      schema: {
        tags: ["Admin"],
        security: [{ cookieAuth: [] }],
        params: Type.Object({ leaderboardId: UuidSchema }),
        response: { 200: Type.Array(AdminLeaderboardExclusionSchema) },
      },
    },
    async (request) =>
      listLeaderboardExclusions(app, request.params.leaderboardId),
  );

  app.post(
    "/leaderboards/:leaderboardId/exclusions",
    {
      preHandler: [
        app.authenticate,
        app.verifyCsrf,
        app.authorize("admin.leaderboards.manage"),
      ],
      schema: {
        tags: ["Admin"],
        security: [{ cookieAuth: [], csrfToken: [] }],
        params: Type.Object({ leaderboardId: UuidSchema }),
        body: Type.Object({ userId: UuidSchema, ...reasonBody.properties }),
        response: { 200: MessageSchema },
      },
    },
    async (request) => {
      await setLeaderboardExclusion(
        app,
        request,
        request.params.leaderboardId,
        request.body.userId,
        request.body.reason,
        true,
      );
      return { message: "User hidden from this leaderboard." };
    },
  );

  app.delete(
    "/leaderboards/:leaderboardId/exclusions/:userId",
    {
      preHandler: [
        app.authenticate,
        app.verifyCsrf,
        app.authorize("admin.leaderboards.manage"),
      ],
      schema: {
        tags: ["Admin"],
        security: [{ cookieAuth: [], csrfToken: [] }],
        params: Type.Object({ leaderboardId: UuidSchema, userId: UuidSchema }),
        body: reasonBody,
        response: { 200: MessageSchema },
      },
    },
    async (request) => {
      await setLeaderboardExclusion(
        app,
        request,
        request.params.leaderboardId,
        request.params.userId,
        request.body.reason,
        false,
      );
      return { message: "User restored to this leaderboard." };
    },
  );
};
