import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import fp from "fastify-plugin";

import { AppError } from "../lib/errors.js";

export const securityPlugin = fp(async (app) => {
  await app.register(cookie);
  await app.register(cors, {
    credentials: true,
    methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "content-type",
      "x-csrf-token",
      "idempotency-key",
      "x-provider-signature",
    ],
    origin(origin, callback) {
      if (!origin || app.config.appOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(
        new AppError(
          403,
          "ORIGIN_NOT_ALLOWED",
          "The request origin is not allowed.",
        ),
        false,
      );
    },
  });
  await app.register(helmet, {
    global: true,
    crossOriginResourcePolicy: { policy: "same-site" },
    referrerPolicy: { policy: "no-referrer" },
  });
  await app.register(rateLimit, {
    global: true,
    max: 120,
    timeWindow: "1 minute",
    ban: 3,
    keyGenerator: (request) => request.ip,
    errorResponseBuilder: (request, context) => ({
      error: {
        code: "RATE_LIMITED",
        message: `Too many requests. Retry in ${Math.ceil(context.ttl / 1000)} seconds.`,
        requestId: request.id,
      },
    }),
  });
});
