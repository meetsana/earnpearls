import { timingSafeEqual } from "node:crypto";

import fp from "fastify-plugin";

import { writeSecurityEvent } from "../lib/audit.js";
import { hashIp, hashToken } from "../lib/crypto.js";
import { AppError } from "../lib/errors.js";
import type { AuthenticatedUser, AuthContext } from "../types/auth.js";

type SessionRow = Readonly<{
  session_id: string;
  csrf_token_hash: string;
  last_seen_at: Date;
  user_id: string;
  email: string;
  display_name: string;
  country_code: string;
  account_status_code: AuthenticatedUser["accountStatus"];
  blocks_login: boolean;
  email_verified_at: Date | null;
  created_at: Date;
  limit_template_id: string | null;
}>;

function safeEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return (
    leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(leftBuffer, rightBuffer)
  );
}

export const authenticationPlugin = fp(async (app) => {
  const csrfCookieName = `${app.config.sessionCookieName}_csrf`;
  app.decorateRequest("auth", null);

  app.decorate(
    "setSessionCookies",
    (reply, sessionToken, csrfToken, expiresAt) => {
      const shared = {
        path: "/",
        secure: app.config.nodeEnv === "production",
        sameSite: "lax" as const,
        expires: expiresAt,
      };
      reply.setCookie(app.config.sessionCookieName, sessionToken, {
        ...shared,
        httpOnly: true,
      });
      reply.setCookie(csrfCookieName, csrfToken, {
        ...shared,
        httpOnly: false,
      });
    },
  );

  app.decorate("clearSessionCookies", (reply) => {
    const options = {
      path: "/",
      secure: app.config.nodeEnv === "production",
      sameSite: "lax" as const,
    };
    reply.clearCookie(app.config.sessionCookieName, options);
    reply.clearCookie(csrfCookieName, options);
  });

  app.decorate("authenticate", async (request) => {
    const token = request.cookies[app.config.sessionCookieName];
    if (!token)
      throw new AppError(
        401,
        "AUTHENTICATION_REQUIRED",
        "Authentication is required.",
      );

    const result = await app.db.query<SessionRow>(
      `SELECT
        s.id AS session_id, s.csrf_token_hash, s.last_seen_at,
        u.id AS user_id, u.email, u.display_name, u.country_code,
        u.account_status_code, a.blocks_login, u.email_verified_at,
        u.created_at, u.limit_template_id
       FROM sessions s
       JOIN users u ON u.id = s.user_id
       JOIN account_states a ON a.code = u.account_status_code
       WHERE s.token_hash = $1
         AND s.revoked_at IS NULL
         AND s.expires_at > NOW()
         AND u.deleted_at IS NULL`,
      [hashToken(token)],
    );
    const row = result.rows[0];
    if (!row || row.blocks_login) {
      throw new AppError(
        401,
        "SESSION_INVALID",
        "The session is invalid or has expired.",
      );
    }

    const permissions = await app.db.query<{
      code: string;
      template_allowed: boolean | null;
    }>(
      `SELECT DISTINCT p.code, ltp.allowed AS template_allowed
       FROM user_roles ur
       JOIN role_permissions rp ON rp.role_code = ur.role_code
       JOIN permissions p ON p.code = rp.permission_code
       LEFT JOIN limit_template_permissions ltp
         ON ltp.permission_code = p.code AND ltp.limit_template_id = $2
       WHERE ur.user_id = $1`,
      [row.user_id, row.limit_template_id],
    );
    const capabilities = new Set(
      permissions.rows
        .filter((permission) => permission.template_allowed !== false)
        .map((permission) => permission.code),
    );
    const user: AuthenticatedUser = {
      id: row.user_id,
      email: row.email,
      displayName: row.display_name,
      countryCode: row.country_code,
      accountStatus: row.account_status_code,
      emailVerifiedAt: row.email_verified_at,
      createdAt: row.created_at,
    };
    const auth: AuthContext = {
      sessionId: row.session_id,
      csrfTokenHash: row.csrf_token_hash,
      user,
      capabilities,
    };
    request.auth = auth;

    if (Date.now() - new Date(row.last_seen_at).getTime() > 5 * 60_000) {
      await app.db.query(
        "UPDATE sessions SET last_seen_at = NOW() WHERE id = $1",
        [row.session_id],
      );
    }
  });

  app.decorate("verifyCsrf", async (request) => {
    if (!request.auth)
      throw new AppError(
        401,
        "AUTHENTICATION_REQUIRED",
        "Authentication is required.",
      );
    const header = request.headers["x-csrf-token"];
    const cookieValue = request.cookies[csrfCookieName];
    if (
      typeof header !== "string" ||
      !cookieValue ||
      !safeEqual(header, cookieValue)
    ) {
      throw new AppError(
        403,
        "CSRF_INVALID",
        "The request security token is invalid.",
      );
    }
    if (!safeEqual(hashToken(header), request.auth.csrfTokenHash)) {
      throw new AppError(
        403,
        "CSRF_INVALID",
        "The request security token is invalid.",
      );
    }
  });

  app.decorate("authorize", (permission, options = {}) => async (request) => {
    const auth = request.auth;
    if (!auth)
      throw new AppError(
        401,
        "AUTHENTICATION_REQUIRED",
        "Authentication is required.",
      );
    if (options.requireVerifiedEmail && !auth.user.emailVerifiedAt) {
      throw new AppError(
        403,
        "EMAIL_VERIFICATION_REQUIRED",
        "Verify your email before using this feature.",
      );
    }
    if (!auth.capabilities.has(permission)) {
      await writeSecurityEvent(app.db.pool, {
        userId: auth.user.id,
        eventType: "authorization.denied",
        severity: "warning",
        outcome: "denied",
        requestId: request.id,
        ipHash: hashIp(request.ip, app.config.ipHashSecret),
        userAgent: request.headers["user-agent"] ?? null,
        metadata: { permission },
      });
      throw new AppError(
        403,
        "PERMISSION_DENIED",
        "You do not have permission to perform this action.",
      );
    }
  });
});
