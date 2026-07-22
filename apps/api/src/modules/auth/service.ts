import { randomUUID } from "node:crypto";

import type {
  LoginBodySchema,
  RegisterBodySchema,
} from "@earnpearls/contracts";
import type { Static } from "@sinclair/typebox";
import type { FastifyInstance, FastifyRequest } from "fastify";

import type { Queryable } from "../../db/database.js";
import { writeUserActivity } from "../../lib/activity.js";
import { writeAudit, writeSecurityEvent } from "../../lib/audit.js";
import {
  encryptSensitive,
  hashIp,
  hashPassword,
  hashToken,
  randomToken,
  verifyPassword,
} from "../../lib/crypto.js";
import { AppError, isUniqueViolation } from "../../lib/errors.js";
import type { AuthenticatedUser } from "../../types/auth.js";
import { createNotification } from "../notifications/service.js";

type RegisterBody = Static<typeof RegisterBodySchema>;
type LoginBody = Static<typeof LoginBodySchema>;

type LoginRow = Readonly<{
  id: string;
  email: string;
  password_hash: string;
  display_name: string;
  country_code: string;
  account_status_code: AuthenticatedUser["accountStatus"];
  blocks_login: boolean;
  email_verified_at: Date | null;
  created_at: Date;
}>;

export type IssuedSession = Readonly<{
  token: string;
  csrfToken: string;
  expiresAt: Date;
  user: AuthenticatedUser;
}>;

const weakPasswords = new Set([
  "password1234",
  "password123!",
  "qwerty123456",
  "123456789012",
  "letmein12345",
]);

export function validatePassword(password: string, email?: string): void {
  const normalized = password.toLowerCase();
  if (weakPasswords.has(normalized)) {
    throw new AppError(400, "PASSWORD_WEAK", "Choose a less common password.");
  }
  const localPart = email?.split("@")[0]?.toLowerCase();
  if (localPart && localPart.length >= 4 && normalized.includes(localPart)) {
    throw new AppError(
      400,
      "PASSWORD_WEAK",
      "The password must not contain your email name.",
    );
  }
}

function userFromRow(row: LoginRow): AuthenticatedUser {
  return {
    id: row.id,
    email: row.email,
    displayName: row.display_name,
    countryCode: row.country_code,
    accountStatus: row.account_status_code,
    emailVerifiedAt: row.email_verified_at,
    createdAt: row.created_at,
  };
}

async function queueAuthToken(
  app: FastifyInstance,
  queryable: Queryable,
  userId: string,
  email: string,
  purpose: "verify_email" | "reset_password",
): Promise<void> {
  const token = randomToken(32);
  const tokenId = randomUUID();
  const expiresAt = new Date(
    Date.now() + app.config.authTokenTtlMinutes * 60_000,
  );
  await queryable.query(
    `UPDATE auth_tokens SET consumed_at = NOW()
     WHERE user_id = $1 AND purpose = $2 AND consumed_at IS NULL`,
    [userId, purpose],
  );
  await queryable.query(
    `INSERT INTO auth_tokens (id, user_id, purpose, token_hash, expires_at)
     VALUES ($1, $2, $3, $4, $5)`,
    [tokenId, userId, purpose, hashToken(token), expiresAt],
  );
  await queryable.query(
    `INSERT INTO email_outbox (
      id, user_id, recipient, template_code, template_data
    ) VALUES ($1, $2, $3, $4, $5)`,
    [
      randomUUID(),
      userId,
      email,
      purpose,
      JSON.stringify({
        tokenCiphertext: encryptSensitive(token, app.config.dataEncryptionKey),
        expiresAt: expiresAt.toISOString(),
      }),
    ],
  );
}

export async function registerUser(
  app: FastifyInstance,
  request: FastifyRequest,
  body: RegisterBody,
): Promise<void> {
  const email = body.email.trim().toLowerCase();
  const countryCode = body.countryCode.toUpperCase();
  validatePassword(body.password, email);

  const policy = await app.db.query<{
    enabled: boolean;
    country_enabled: boolean;
  }>(
    `SELECT
      COALESCE((SELECT (value->>'enabled')::BOOLEAN FROM system_settings WHERE key = 'registration'), FALSE) AS enabled,
      EXISTS(SELECT 1 FROM country_availability WHERE country_code = $1 AND status = 'enabled') AS country_enabled`,
    [countryCode],
  );
  if (!policy.rows[0]?.enabled)
    throw new AppError(
      503,
      "REGISTRATION_DISABLED",
      "Registration is unavailable.",
    );
  if (!policy.rows[0].country_enabled) {
    throw new AppError(
      403,
      "COUNTRY_NOT_AVAILABLE",
      "EarnPearls is not available in this country.",
    );
  }

  const passwordHash = await hashPassword(
    body.password,
    app.config.passwordPepper,
  );
  try {
    await app.db.transaction(async (client) => {
      const userId = randomUUID();
      await client.query(
        `INSERT INTO users (
          id, email, password_hash, display_name, country_code
        ) VALUES ($1, $2, $3, $4, $5)`,
        [userId, email, passwordHash, body.displayName.trim(), countryCode],
      );
      await client.query(
        `INSERT INTO user_roles (user_id, role_code) VALUES ($1, 'user')`,
        [userId],
      );
      await queueAuthToken(app, client, userId, email, "verify_email");
      await writeUserActivity(client, {
        userId,
        eventType: "account.registered",
        summary: "EarnPearls account created",
        targetType: "user",
        targetId: userId,
      });
      await writeAudit(client, {
        actorType: "user",
        actorId: userId,
        action: "auth.register",
        targetType: "user",
        targetId: userId,
        outcome: "success",
        requestId: request.id,
        ipHash: hashIp(request.ip, app.config.ipHashSecret),
      });
    });
  } catch (error) {
    if (!isUniqueViolation(error)) throw error;
  }
}

export async function loginUser(
  app: FastifyInstance,
  request: FastifyRequest,
  body: LoginBody,
): Promise<IssuedSession> {
  const email = body.email.trim().toLowerCase();
  const result = await app.db.query<LoginRow>(
    `SELECT u.id, u.email, u.password_hash, u.display_name, u.country_code,
      u.account_status_code, a.blocks_login, u.email_verified_at, u.created_at
     FROM users u
     JOIN account_states a ON a.code = u.account_status_code
     WHERE u.email = $1 AND u.deleted_at IS NULL`,
    [email],
  );
  const row = result.rows[0];
  const validPassword = row
    ? await verifyPassword(
        body.password,
        row.password_hash,
        app.config.passwordPepper,
      )
    : (await hashPassword(body.password, app.config.passwordPepper), false);
  const ipHash = hashIp(request.ip, app.config.ipHashSecret);

  if (!row || !validPassword || row.blocks_login) {
    await writeSecurityEvent(app.db.pool, {
      userId: row?.id ?? null,
      eventType: "auth.login_failed",
      severity: "warning",
      outcome: "denied",
      requestId: request.id,
      ipHash,
      userAgent: request.headers["user-agent"] ?? null,
    });
    throw new AppError(
      401,
      "INVALID_CREDENTIALS",
      "The email or password is incorrect.",
    );
  }

  const token = randomToken(32);
  const csrfToken = randomToken(24);
  const expiresAt = new Date(
    Date.now() + app.config.sessionTtlHours * 60 * 60_000,
  );
  await app.db.transaction(async (client) => {
    await client.query(
      `INSERT INTO sessions (
        id, user_id, token_hash, csrf_token_hash, user_agent, ip_hash, expires_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        randomUUID(),
        row.id,
        hashToken(token),
        hashToken(csrfToken),
        request.headers["user-agent"] ?? "",
        ipHash,
        expiresAt,
      ],
    );
    await client.query("UPDATE users SET last_login_at = NOW() WHERE id = $1", [
      row.id,
    ]);
    await writeUserActivity(client, {
      userId: row.id,
      eventType: "security.login",
      summary: "Signed in to EarnPearls",
      targetType: "session",
      targetId: row.id,
    });
    await writeAudit(client, {
      actorType: "user",
      actorId: row.id,
      action: "auth.login",
      targetType: "session",
      targetId: row.id,
      outcome: "success",
      requestId: request.id,
      ipHash,
    });
  });
  return { token, csrfToken, expiresAt, user: userFromRow(row) };
}

export async function consumeEmailVerification(
  app: FastifyInstance,
  token: string,
): Promise<void> {
  await app.db.transaction(async (client) => {
    const result = await client.query<{ id: string; user_id: string }>(
      `SELECT id, user_id FROM auth_tokens
       WHERE token_hash = $1 AND purpose = 'verify_email'
         AND consumed_at IS NULL AND expires_at > NOW()
       FOR UPDATE`,
      [hashToken(token)],
    );
    const authToken = result.rows[0];
    if (!authToken)
      throw new AppError(
        400,
        "TOKEN_INVALID",
        "The verification link is invalid or expired.",
      );
    await client.query(
      "UPDATE users SET email_verified_at = COALESCE(email_verified_at, NOW()) WHERE id = $1",
      [authToken.user_id],
    );
    await client.query(
      "UPDATE auth_tokens SET consumed_at = NOW() WHERE id = $1",
      [authToken.id],
    );
    await writeUserActivity(client, {
      userId: authToken.user_id,
      eventType: "account.email_verified",
      summary: "Email address verified",
      targetType: "user",
      targetId: authToken.user_id,
    });
    await writeAudit(client, {
      actorType: "user",
      actorId: authToken.user_id,
      action: "auth.email_verified",
      targetType: "user",
      targetId: authToken.user_id,
      outcome: "success",
    });
    await createNotification(client, {
      userId: authToken.user_id,
      category: "security",
      title: "Email verified",
      body: "Your EarnPearls email address is now verified.",
      actionUrl: "/app",
    });
  });
}

export async function requestPasswordReset(
  app: FastifyInstance,
  emailInput: string,
): Promise<void> {
  const email = emailInput.trim().toLowerCase();
  const user = await app.db.query<{ id: string }>(
    "SELECT id FROM users WHERE email = $1 AND deleted_at IS NULL",
    [email],
  );
  if (!user.rows[0]) return;
  await app.db.transaction((client) =>
    queueAuthToken(app, client, user.rows[0]!.id, email, "reset_password"),
  );
}

export async function resetPassword(
  app: FastifyInstance,
  token: string,
  password: string,
): Promise<void> {
  validatePassword(password);
  const passwordHash = await hashPassword(password, app.config.passwordPepper);
  await app.db.transaction(async (client) => {
    const result = await client.query<{ id: string; user_id: string }>(
      `SELECT id, user_id FROM auth_tokens
       WHERE token_hash = $1 AND purpose = 'reset_password'
         AND consumed_at IS NULL AND expires_at > NOW()
       FOR UPDATE`,
      [hashToken(token)],
    );
    const authToken = result.rows[0];
    if (!authToken)
      throw new AppError(
        400,
        "TOKEN_INVALID",
        "The reset link is invalid or expired.",
      );
    await client.query("UPDATE users SET password_hash = $1 WHERE id = $2", [
      passwordHash,
      authToken.user_id,
    ]);
    await client.query(
      "UPDATE auth_tokens SET consumed_at = NOW() WHERE id = $1",
      [authToken.id],
    );
    await client.query(
      `UPDATE sessions SET revoked_at = NOW(), revoke_reason = 'password_reset'
       WHERE user_id = $1 AND revoked_at IS NULL`,
      [authToken.user_id],
    );
    await writeUserActivity(client, {
      userId: authToken.user_id,
      eventType: "security.password_reset",
      summary: "Password reset completed",
      targetType: "user",
      targetId: authToken.user_id,
    });
    await writeAudit(client, {
      actorType: "user",
      actorId: authToken.user_id,
      action: "auth.password_reset",
      targetType: "user",
      targetId: authToken.user_id,
      outcome: "success",
    });
    await createNotification(client, {
      userId: authToken.user_id,
      category: "security",
      title: "Password reset completed",
      body: "Your password was reset and all existing sessions were signed out.",
      actionUrl: "/login",
    });
  });
}
