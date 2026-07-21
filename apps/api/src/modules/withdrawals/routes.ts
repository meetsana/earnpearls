import {
  WithdrawalCreateBodySchema,
  WithdrawalMethodSchema,
  WithdrawalSchema,
} from "@earnpearls/contracts";
import { Type } from "@sinclair/typebox";
import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";

import { AppError } from "../../lib/errors.js";
import {
  createWithdrawal,
  listWithdrawalMethods,
  listWithdrawals,
} from "./service.js";

export const withdrawalRoutes: FastifyPluginAsyncTypebox = async (app) => {
  app.get(
    "/methods",
    {
      preHandler: [
        app.authenticate,
        app.authorize("withdrawal.read", { requireVerifiedEmail: true }),
      ],
      schema: {
        tags: ["Withdrawals"],
        security: [{ cookieAuth: [] }],
        response: { 200: Type.Array(WithdrawalMethodSchema) },
      },
    },
    async (request) =>
      listWithdrawalMethods(app, request.auth!.user.countryCode),
  );

  app.get(
    "/",
    {
      preHandler: [
        app.authenticate,
        app.authorize("withdrawal.read", { requireVerifiedEmail: true }),
      ],
      schema: {
        tags: ["Withdrawals"],
        security: [{ cookieAuth: [] }],
        response: { 200: Type.Array(WithdrawalSchema) },
      },
    },
    async (request) => listWithdrawals(app, request.auth!.user.id),
  );

  app.post(
    "/",
    {
      preHandler: [
        app.authenticate,
        app.verifyCsrf,
        app.authorize("withdrawal.create", { requireVerifiedEmail: true }),
      ],
      schema: {
        tags: ["Withdrawals"],
        security: [{ cookieAuth: [], csrfToken: [] }],
        headers: Type.Object({
          "idempotency-key": Type.String({ minLength: 16, maxLength: 200 }),
        }),
        body: WithdrawalCreateBodySchema,
        response: { 201: WithdrawalSchema },
      },
    },
    async (request, reply) => {
      const idempotencyKey = request.headers["idempotency-key"];
      if (typeof idempotencyKey !== "string") {
        throw new AppError(
          400,
          "IDEMPOTENCY_KEY_REQUIRED",
          "An Idempotency-Key header is required.",
        );
      }
      const withdrawal = await createWithdrawal(app, request, {
        ...request.body,
        idempotencyKey,
      });
      return reply.code(201).send(withdrawal);
    },
  );
};
