import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { TypeBoxValidatorCompiler } from "@fastify/type-provider-typebox";
import Fastify from "fastify";
import type { FastifyError } from "fastify";

import { loadConfig, type AppConfig } from "./config.js";
import { Database } from "./db/database.js";
import {
  AppError,
  isSerializationFailure,
  isUniqueViolation,
} from "./lib/errors.js";
import { adminRoutes } from "./modules/admin/routes.js";
import { authRoutes } from "./modules/auth/routes.js";
import { dashboardRoutes } from "./modules/dashboard/routes.js";
import { surveyRoutes } from "./modules/surveys/routes.js";
import { walletRoutes } from "./modules/wallet/routes.js";
import { withdrawalRoutes } from "./modules/withdrawals/routes.js";
import { authenticationPlugin } from "./plugins/authentication.js";
import { securityPlugin } from "./plugins/security.js";
import { healthRoutes } from "./routes/health.js";

export type BuildAppOptions = Readonly<{
  config?: AppConfig;
  database?: Database;
}>;

export async function buildApp(options: BuildAppOptions = {}) {
  const config = options.config ?? loadConfig();
  const database = options.database ?? new Database(config);
  const app = Fastify({
    logger: {
      level: config.logLevel,
      redact: {
        paths: [
          "req.headers.cookie",
          "req.headers.authorization",
          "req.headers.x-provider-signature",
          "password",
          "*.password",
          "*.token",
          "*.destination",
        ],
        censor: "[REDACTED]",
      },
    },
    trustProxy: config.trustProxy,
    bodyLimit: 1_048_576,
    requestTimeout: 30_000,
    keepAliveTimeout: 72_000,
    maxRequestsPerSocket: 1_000,
  });

  app.setValidatorCompiler(TypeBoxValidatorCompiler);
  app.decorate("config", config);
  app.decorate("db", database);

  await app.register(swagger, {
    openapi: {
      info: {
        title: "EarnPearls API",
        description:
          "Version 1 API for authentication, surveys, wallet, withdrawals, and administration.",
        version: "0.1.0",
      },
      servers: [{ url: "/v1", description: "Current origin" }],
      components: {
        securitySchemes: {
          cookieAuth: {
            type: "apiKey",
            in: "cookie",
            name: config.sessionCookieName,
            description: "Opaque, revocable HttpOnly session cookie.",
          },
          csrfToken: {
            type: "apiKey",
            in: "header",
            name: "X-CSRF-Token",
            description:
              "Session-bound token required for authenticated state changes.",
          },
          providerSignature: {
            type: "apiKey",
            in: "header",
            name: "X-Provider-Signature",
            description: "Provider-adapter-specific webhook signature.",
          },
        },
      },
      tags: [
        { name: "Auth" },
        { name: "Dashboard" },
        { name: "Wallet" },
        { name: "Surveys" },
        { name: "Withdrawals" },
        { name: "Admin" },
        { name: "Provider Webhooks" },
        { name: "Health" },
      ],
    },
  });
  if (config.enableSwagger) {
    await app.register(swaggerUi, {
      routePrefix: "/documentation",
      uiConfig: { docExpansion: "list", deepLinking: false },
      staticCSP: true,
    });
  }

  await app.register(securityPlugin);
  await app.register(authenticationPlugin);
  await app.register(healthRoutes);
  await app.register(authRoutes, { prefix: "/v1/auth" });
  await app.register(dashboardRoutes, { prefix: "/v1/dashboard" });
  await app.register(walletRoutes, { prefix: "/v1/wallet" });
  await app.register(surveyRoutes, { prefix: "/v1/surveys" });
  await app.register(withdrawalRoutes, { prefix: "/v1/withdrawals" });
  await app.register(adminRoutes, { prefix: "/v1/admin" });

  app.setNotFoundHandler(async (request, reply) => {
    return reply.code(404).send({
      error: {
        code: "ROUTE_NOT_FOUND",
        message: "The requested route does not exist.",
        requestId: request.id,
      },
    });
  });

  app.setErrorHandler(async (error, request, reply) => {
    const fastifyError = error as FastifyError;
    let statusCode = 500;
    let code = "INTERNAL_ERROR";
    let message = "An unexpected error occurred.";
    let details: unknown;

    if (error instanceof AppError) {
      statusCode = error.statusCode;
      code = error.code;
      message = error.message;
      details = error.details;
    } else if (fastifyError.validation) {
      statusCode = 400;
      code = "VALIDATION_ERROR";
      message = "The request payload is invalid.";
      details =
        config.nodeEnv === "production" ? undefined : fastifyError.validation;
    } else if (isSerializationFailure(error)) {
      statusCode = 409;
      code = "CONCURRENT_UPDATE";
      message =
        "The request conflicted with another update. Retry with the same idempotency key.";
    } else if (isUniqueViolation(error)) {
      statusCode = 409;
      code = "RESOURCE_CONFLICT";
      message = "A resource with the same unique value already exists.";
    }

    if (statusCode >= 500) request.log.error({ err: error }, "request failed");
    else request.log.info({ err: error, code }, "request rejected");
    return reply.code(statusCode).send({
      error: {
        code,
        message,
        requestId: request.id,
        ...(details === undefined ? {} : { details }),
      },
    });
  });

  app.addHook("onClose", async () => {
    await database.close();
  });

  return app;
}
