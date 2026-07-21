import {
  CursorPageSchema,
  WalletSummarySchema,
  WalletTransactionSchema,
} from "@earnpearls/contracts";
import { Type } from "@sinclair/typebox";
import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";

import { getWalletSummary, listWalletTransactions } from "./service.js";

export const walletRoutes: FastifyPluginAsyncTypebox = async (app) => {
  app.get(
    "/",
    {
      preHandler: [
        app.authenticate,
        app.authorize("wallet.read", { requireVerifiedEmail: true }),
      ],
      schema: {
        tags: ["Wallet"],
        security: [{ cookieAuth: [] }],
        response: { 200: WalletSummarySchema },
      },
    },
    async (request) => getWalletSummary(app.db, request.auth!.user.id),
  );

  app.get(
    "/transactions",
    {
      preHandler: [
        app.authenticate,
        app.authorize("wallet.read", { requireVerifiedEmail: true }),
      ],
      schema: {
        tags: ["Wallet"],
        security: [{ cookieAuth: [] }],
        querystring: Type.Object({
          cursor: Type.Optional(Type.String({ maxLength: 500 })),
          limit: Type.Optional(
            Type.Integer({ minimum: 1, maximum: 100, default: 25 }),
          ),
        }),
        response: { 200: CursorPageSchema(WalletTransactionSchema) },
      },
    },
    async (request) =>
      listWalletTransactions(app.db, request.auth!.user.id, {
        ...(request.query.cursor ? { cursor: request.query.cursor } : {}),
        limit: request.query.limit ?? 25,
      }),
  );
};
