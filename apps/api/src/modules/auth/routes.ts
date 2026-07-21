import {
  LoginBodySchema,
  LoginResponseSchema,
  MessageSchema,
  PasswordResetBodySchema,
  PasswordResetRequestBodySchema,
  RegisterBodySchema,
  SessionDeviceSchema,
  SessionSchema,
  VerifyEmailBodySchema,
} from "@earnpearls/contracts";
import { Type } from "@sinclair/typebox";
import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";

import { writeAudit } from "../../lib/audit.js";
import { hashIp } from "../../lib/crypto.js";
import {
  consumeEmailVerification,
  loginUser,
  registerUser,
  requestPasswordReset,
  resetPassword,
} from "./service.js";

export const authRoutes: FastifyPluginAsyncTypebox = async (app) => {
  app.post(
    "/register",
    {
      config: { rateLimit: { max: 5, timeWindow: "15 minutes" } },
      schema: {
        tags: ["Auth"],
        body: RegisterBodySchema,
        response: { 202: MessageSchema },
      },
    },
    async (request, reply) => {
      await registerUser(app, request, request.body);
      return reply.code(202).send({
        message:
          "If registration was accepted, a verification email has been queued.",
      });
    },
  );

  app.get(
    "/sessions",
    {
      preHandler: [app.authenticate, app.authorize("security.sessions.manage")],
      schema: {
        tags: ["Auth"],
        security: [{ cookieAuth: [] }],
        response: { 200: Type.Array(SessionDeviceSchema) },
      },
    },
    async (request) => {
      const result = await app.db.query<{
        id: string;
        user_agent: string;
        created_at: Date;
        last_seen_at: Date;
        expires_at: Date;
      }>(
        `SELECT id, user_agent, created_at, last_seen_at, expires_at
         FROM sessions
         WHERE user_id = $1 AND revoked_at IS NULL AND expires_at > NOW()
         ORDER BY last_seen_at DESC`,
        [request.auth!.user.id],
      );
      return result.rows.map((row) => ({
        id: row.id,
        current: row.id === request.auth!.sessionId,
        userAgent: row.user_agent,
        createdAt: row.created_at.toISOString(),
        lastSeenAt: row.last_seen_at.toISOString(),
        expiresAt: row.expires_at.toISOString(),
      }));
    },
  );

  app.delete(
    "/sessions/:sessionId",
    {
      preHandler: [
        app.authenticate,
        app.verifyCsrf,
        app.authorize("security.sessions.manage"),
      ],
      schema: {
        tags: ["Auth"],
        security: [{ cookieAuth: [], csrfToken: [] }],
        params: Type.Object({ sessionId: Type.String({ format: "uuid" }) }),
        response: { 200: MessageSchema },
      },
    },
    async (request, reply) => {
      const auth = request.auth!;
      const result = await app.db.transaction(async (client) => {
        const revoked = await client.query<{ id: string }>(
          `UPDATE sessions SET revoked_at = NOW(), revoke_reason = 'user_session_revoked'
           WHERE id = $1 AND user_id = $2 AND revoked_at IS NULL
           RETURNING id`,
          [request.params.sessionId, auth.user.id],
        );
        if (revoked.rows[0]) {
          await writeAudit(client, {
            actorType: "user",
            actorId: auth.user.id,
            action: "auth.session_revoked",
            targetType: "session",
            targetId: request.params.sessionId,
            outcome: "success",
            requestId: request.id,
            ipHash: hashIp(request.ip, app.config.ipHashSecret),
          });
        }
        return revoked;
      });
      if (request.params.sessionId === auth.sessionId && result.rows[0])
        app.clearSessionCookies(reply);
      return { message: "Session revoked." };
    },
  );

  app.post(
    "/login",
    {
      config: { rateLimit: { max: 8, timeWindow: "15 minutes" } },
      schema: {
        tags: ["Auth"],
        body: LoginBodySchema,
        response: { 200: LoginResponseSchema },
      },
    },
    async (request, reply) => {
      const issued = await loginUser(app, request, request.body);
      app.setSessionCookies(
        reply,
        issued.token,
        issued.csrfToken,
        issued.expiresAt,
      );
      return {
        authenticated: true as const,
        user: {
          id: issued.user.id,
          email: issued.user.email,
          displayName: issued.user.displayName,
          countryCode: issued.user.countryCode,
          accountStatus: issued.user.accountStatus,
          emailVerified: Boolean(issued.user.emailVerifiedAt),
          createdAt: issued.user.createdAt.toISOString(),
        },
      };
    },
  );

  app.post(
    "/verify-email",
    {
      schema: {
        tags: ["Auth"],
        body: VerifyEmailBodySchema,
        response: { 200: MessageSchema },
      },
    },
    async (request) => {
      await consumeEmailVerification(app, request.body.token);
      return { message: "Email verified." };
    },
  );

  app.post(
    "/password-reset/request",
    {
      config: { rateLimit: { max: 5, timeWindow: "15 minutes" } },
      schema: {
        tags: ["Auth"],
        body: PasswordResetRequestBodySchema,
        response: { 202: MessageSchema },
      },
    },
    async (request, reply) => {
      await requestPasswordReset(app, request.body.email);
      return reply.code(202).send({
        message:
          "If the account exists, a password reset email has been queued.",
      });
    },
  );

  app.post(
    "/password-reset/confirm",
    {
      schema: {
        tags: ["Auth"],
        body: PasswordResetBodySchema,
        response: { 200: MessageSchema },
      },
    },
    async (request) => {
      await resetPassword(app, request.body.token, request.body.password);
      return { message: "Password reset. Sign in again." };
    },
  );

  app.get(
    "/session",
    {
      preHandler: [app.authenticate],
      schema: {
        tags: ["Auth"],
        security: [{ cookieAuth: [] }],
        response: { 200: SessionSchema },
      },
    },
    async (request) => {
      const auth = request.auth!;
      return {
        authenticated: true as const,
        user: {
          id: auth.user.id,
          email: auth.user.email,
          displayName: auth.user.displayName,
          countryCode: auth.user.countryCode,
          accountStatus: auth.user.accountStatus,
          emailVerified: Boolean(auth.user.emailVerifiedAt),
          createdAt: auth.user.createdAt.toISOString(),
        },
        capabilities: [...auth.capabilities].sort(),
      };
    },
  );

  app.post(
    "/logout",
    {
      preHandler: [app.authenticate, app.verifyCsrf],
      schema: {
        tags: ["Auth"],
        security: [{ cookieAuth: [], csrfToken: [] }],
        response: { 200: MessageSchema },
      },
    },
    async (request, reply) => {
      const auth = request.auth!;
      await app.db.transaction(async (client) => {
        await client.query(
          `UPDATE sessions SET revoked_at = NOW(), revoke_reason = 'user_logout'
           WHERE id = $1 AND revoked_at IS NULL`,
          [auth.sessionId],
        );
        await writeAudit(client, {
          actorType: "user",
          actorId: auth.user.id,
          action: "auth.logout",
          targetType: "session",
          targetId: auth.sessionId,
          outcome: "success",
          requestId: request.id,
          ipHash: hashIp(request.ip, app.config.ipHashSecret),
        });
      });
      app.clearSessionCookies(reply);
      return { message: "Signed out." };
    },
  );

  app.post(
    "/logout-all",
    {
      preHandler: [app.authenticate, app.verifyCsrf],
      schema: {
        tags: ["Auth"],
        security: [{ cookieAuth: [], csrfToken: [] }],
        response: { 200: MessageSchema },
      },
    },
    async (request, reply) => {
      const auth = request.auth!;
      await app.db.transaction(async (client) => {
        await client.query(
          `UPDATE sessions SET revoked_at = NOW(), revoke_reason = 'user_logout_all'
           WHERE user_id = $1 AND revoked_at IS NULL`,
          [auth.user.id],
        );
        await writeAudit(client, {
          actorType: "user",
          actorId: auth.user.id,
          action: "auth.logout_all",
          targetType: "user",
          targetId: auth.user.id,
          outcome: "success",
          requestId: request.id,
          ipHash: hashIp(request.ip, app.config.ipHashSecret),
        });
      });
      app.clearSessionCookies(reply);
      return { message: "All sessions were signed out." };
    },
  );
};
