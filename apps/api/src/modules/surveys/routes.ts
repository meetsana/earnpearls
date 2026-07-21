import {
  MessageSchema,
  SurveySchema,
  SurveyStartResponseSchema,
  UuidSchema,
} from "@earnpearls/contracts";
import { Type } from "@sinclair/typebox";
import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";

import { writeSecurityEvent } from "../../lib/audit.js";
import { hashIp } from "../../lib/crypto.js";
import { ProviderRegistry } from "./provider.js";
import {
  listAvailableSurveys,
  processProviderEvent,
  startSurvey,
} from "./service.js";

export const surveyRoutes: FastifyPluginAsyncTypebox = async (app) => {
  const registry = new ProviderRegistry(app.config);

  app.get(
    "/",
    {
      preHandler: [
        app.authenticate,
        app.authorize("survey.read", { requireVerifiedEmail: true }),
      ],
      schema: {
        tags: ["Surveys"],
        security: [{ cookieAuth: [] }],
        response: { 200: Type.Array(SurveySchema) },
      },
    },
    async (request) =>
      listAvailableSurveys(app, request.auth!.user.countryCode),
  );

  app.post(
    "/:surveyId/start",
    {
      preHandler: [
        app.authenticate,
        app.verifyCsrf,
        app.authorize("survey.start", { requireVerifiedEmail: true }),
      ],
      schema: {
        tags: ["Surveys"],
        security: [{ cookieAuth: [], csrfToken: [] }],
        params: Type.Object({ surveyId: UuidSchema }),
        response: { 201: SurveyStartResponseSchema },
      },
    },
    async (request, reply) => {
      const started = await startSurvey(
        app,
        registry,
        request,
        request.params.surveyId,
      );
      return reply.code(201).send(started);
    },
  );

  app.post(
    "/providers/:providerCode/webhook",
    {
      config: { rateLimit: { max: 300, timeWindow: "1 minute" } },
      schema: {
        tags: ["Provider Webhooks"],
        security: [{ providerSignature: [] }],
        params: Type.Object({
          providerCode: Type.String({ minLength: 1, maxLength: 64 }),
        }),
        headers: Type.Object({
          "x-provider-signature": Type.Optional(
            Type.String({ maxLength: 500 }),
          ),
        }),
        body: Type.Unknown(),
        response: { 202: MessageSchema },
      },
    },
    async (request, reply) => {
      const adapter = registry.get(request.params.providerCode);
      const signature = request.headers["x-provider-signature"];
      let event;
      try {
        event = await adapter.verifyAndNormalizeWebhook({
          payload: request.body,
          signature: typeof signature === "string" ? signature : undefined,
        });
      } catch (error) {
        await writeSecurityEvent(app.db.pool, {
          eventType: "provider.webhook_rejected",
          severity: "high",
          outcome: "denied",
          requestId: request.id,
          ipHash: hashIp(request.ip, app.config.ipHashSecret),
          userAgent: request.headers["user-agent"] ?? null,
          metadata: { providerCode: request.params.providerCode },
        });
        throw error;
      }
      await processProviderEvent(
        app,
        request.params.providerCode,
        request.body,
        event,
      );
      return reply.code(202).send({ message: "Provider event accepted." });
    },
  );
};
