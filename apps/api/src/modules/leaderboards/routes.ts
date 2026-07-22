import {
  LeaderboardDefinitionSchema,
  LeaderboardHistorySchema,
  LeaderboardSchema,
} from "@earnpearls/contracts";
import { Type } from "@sinclair/typebox";
import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";

import {
  getCurrentLeaderboard,
  getLeaderboardHistory,
  listLeaderboards,
} from "./service.js";

export const leaderboardRoutes: FastifyPluginAsyncTypebox = async (app) => {
  app.get(
    "/",
    {
      preHandler: [app.authenticate, app.authorize("leaderboard.read")],
      schema: {
        tags: ["Leaderboards"],
        security: [{ cookieAuth: [] }],
        response: { 200: Type.Array(LeaderboardDefinitionSchema) },
      },
    },
    async () => listLeaderboards(app),
  );

  app.get(
    "/:code/history",
    {
      preHandler: [app.authenticate, app.authorize("leaderboard.read")],
      schema: {
        tags: ["Leaderboards"],
        security: [{ cookieAuth: [] }],
        params: Type.Object({
          code: Type.String({
            minLength: 1,
            maxLength: 100,
            pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$",
          }),
        }),
        querystring: Type.Object({
          limit: Type.Optional(
            Type.Integer({ minimum: 1, maximum: 24, default: 12 }),
          ),
        }),
        response: { 200: LeaderboardHistorySchema },
      },
    },
    async (request) =>
      getLeaderboardHistory(
        app,
        request.params.code,
        request.auth!.user.id,
        request.query.limit ?? 12,
      ),
  );

  app.get(
    "/:code",
    {
      preHandler: [app.authenticate, app.authorize("leaderboard.read")],
      schema: {
        tags: ["Leaderboards"],
        security: [{ cookieAuth: [] }],
        params: Type.Object({
          code: Type.String({
            minLength: 1,
            maxLength: 100,
            pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$",
          }),
        }),
        response: { 200: LeaderboardSchema },
      },
    },
    async (request) =>
      getCurrentLeaderboard(app, request.params.code, request.auth!.user.id),
  );
};
