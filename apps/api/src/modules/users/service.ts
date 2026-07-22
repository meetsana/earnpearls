import type {
  ChangePasswordBodySchema,
  NotificationPreferencesSchema,
  UserProfileUpdateBodySchema,
} from "@earnpearls/contracts";
import type { Static } from "@sinclair/typebox";
import type { FastifyInstance, FastifyRequest } from "fastify";

import { writeUserActivity } from "../../lib/activity.js";
import { writeAudit, writeSecurityEvent } from "../../lib/audit.js";
import { hashIp, hashPassword, verifyPassword } from "../../lib/crypto.js";
import { AppError } from "../../lib/errors.js";
import { validatePassword } from "../auth/service.js";
import { createNotification } from "../notifications/service.js";

type ProfileUpdate = Static<typeof UserProfileUpdateBodySchema>;
type Preferences = Static<typeof NotificationPreferencesSchema>;
type ChangePassword = Static<typeof ChangePasswordBodySchema>;

type ProfileRow = Readonly<{
  id: string;
  email: string;
  display_name: string;
  country_code: string;
  account_status_code:
    "active" | "limited" | "suspended" | "disabled" | "archived";
  email_verified_at: Date | null;
  timezone: string;
  display_currency: string;
  bio: string;
  marketing_opt_in: boolean;
  last_login_at: Date | null;
  created_at: Date;
}>;

function profileCompletion(row: ProfileRow): number {
  let value = 0;
  if (row.email_verified_at) value += 40;
  if (row.display_name.trim()) value += 20;
  if (row.country_code) value += 20;
  if (row.timezone && row.timezone !== "UTC") value += 10;
  if (row.bio.trim()) value += 10;
  return value;
}

function projectProfile(row: ProfileRow) {
  return {
    user: {
      id: row.id,
      email: row.email,
      displayName: row.display_name,
      countryCode: row.country_code,
      accountStatus: row.account_status_code,
      emailVerified: Boolean(row.email_verified_at),
      createdAt: row.created_at.toISOString(),
    },
    timezone: row.timezone,
    displayCurrency: row.display_currency,
    bio: row.bio,
    marketingOptIn: row.marketing_opt_in,
    lastLoginAt: row.last_login_at?.toISOString() ?? null,
    profileCompletion: profileCompletion(row),
  };
}

export async function getProfile(app: FastifyInstance, userId: string) {
  const result = await app.db.query<ProfileRow>(
    `SELECT id, email, display_name, country_code, account_status_code,
      email_verified_at, timezone, display_currency, bio, marketing_opt_in,
      last_login_at, created_at
     FROM users WHERE id = $1 AND deleted_at IS NULL`,
    [userId],
  );
  const row = result.rows[0];
  if (!row) throw new AppError(404, "USER_NOT_FOUND", "User not found.");
  return projectProfile(row);
}

function assertTimezone(timezone: string): void {
  try {
    new Intl.DateTimeFormat("en", { timeZone: timezone }).format();
  } catch {
    throw new AppError(
      400,
      "TIMEZONE_INVALID",
      "Choose a valid IANA timezone.",
    );
  }
}

export async function updateProfile(
  app: FastifyInstance,
  request: FastifyRequest,
  body: ProfileUpdate,
) {
  const auth = request.auth!;
  assertTimezone(body.timezone);
  const result = await app.db.transaction(async (client) => {
    const updated = await client.query<ProfileRow>(
      `UPDATE users SET
        display_name = $2,
        timezone = $3,
        display_currency = $4,
        bio = $5,
        marketing_opt_in = $6
       WHERE id = $1 AND deleted_at IS NULL
       RETURNING id, email, display_name, country_code, account_status_code,
        email_verified_at, timezone, display_currency, bio, marketing_opt_in,
        last_login_at, created_at`,
      [
        auth.user.id,
        body.displayName.trim(),
        body.timezone,
        body.displayCurrency,
        body.bio.trim(),
        body.marketingOptIn,
      ],
    );
    const row = updated.rows[0];
    if (!row) throw new AppError(404, "USER_NOT_FOUND", "User not found.");
    await writeUserActivity(client, {
      userId: auth.user.id,
      eventType: "profile.updated",
      summary: "Profile details updated",
      targetType: "user",
      targetId: auth.user.id,
    });
    await writeAudit(client, {
      actorType: "user",
      actorId: auth.user.id,
      action: "profile.updated",
      targetType: "user",
      targetId: auth.user.id,
      outcome: "success",
      requestId: request.id,
      ipHash: hashIp(request.ip, app.config.ipHashSecret),
    });
    return row;
  });
  return projectProfile(result);
}

const defaultPreferences: Preferences = {
  emailRewardUpdates: true,
  emailWithdrawalUpdates: true,
  emailSecurityAlerts: true,
  emailSupportUpdates: true,
  emailPlatformAnnouncements: true,
  emailMarketing: false,
  inAppRewardUpdates: true,
  inAppWithdrawalUpdates: true,
  inAppSecurityAlerts: true,
  inAppSupportUpdates: true,
  inAppPlatformAnnouncements: true,
};

type PreferenceRow = Readonly<{
  email_reward_updates: boolean;
  email_withdrawal_updates: boolean;
  email_security_alerts: boolean;
  email_support_updates: boolean;
  email_platform_announcements: boolean;
  email_marketing: boolean;
  in_app_reward_updates: boolean;
  in_app_withdrawal_updates: boolean;
  in_app_security_alerts: boolean;
  in_app_support_updates: boolean;
  in_app_platform_announcements: boolean;
}>;

function projectPreferences(row: PreferenceRow | undefined): Preferences {
  if (!row) return defaultPreferences;
  return {
    emailRewardUpdates: row.email_reward_updates,
    emailWithdrawalUpdates: row.email_withdrawal_updates,
    emailSecurityAlerts: row.email_security_alerts,
    emailSupportUpdates: row.email_support_updates,
    emailPlatformAnnouncements: row.email_platform_announcements,
    emailMarketing: row.email_marketing,
    inAppRewardUpdates: row.in_app_reward_updates,
    inAppWithdrawalUpdates: row.in_app_withdrawal_updates,
    inAppSecurityAlerts: row.in_app_security_alerts,
    inAppSupportUpdates: row.in_app_support_updates,
    inAppPlatformAnnouncements: row.in_app_platform_announcements,
  };
}

export async function getPreferences(app: FastifyInstance, userId: string) {
  const result = await app.db.query<PreferenceRow>(
    "SELECT * FROM user_preferences WHERE user_id = $1",
    [userId],
  );
  return projectPreferences(result.rows[0]);
}

export async function updatePreferences(
  app: FastifyInstance,
  request: FastifyRequest,
  body: Preferences,
) {
  const userId = request.auth!.user.id;
  const row = await app.db.transaction(async (client) => {
    const result = await client.query<PreferenceRow>(
      `INSERT INTO user_preferences (
        user_id, email_reward_updates, email_withdrawal_updates,
        email_security_alerts, email_support_updates,
        email_platform_announcements, email_marketing,
        in_app_reward_updates, in_app_withdrawal_updates,
        in_app_security_alerts, in_app_support_updates,
        in_app_platform_announcements
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      ON CONFLICT (user_id) DO UPDATE SET
        email_reward_updates = EXCLUDED.email_reward_updates,
        email_withdrawal_updates = EXCLUDED.email_withdrawal_updates,
        email_security_alerts = EXCLUDED.email_security_alerts,
        email_support_updates = EXCLUDED.email_support_updates,
        email_platform_announcements = EXCLUDED.email_platform_announcements,
        email_marketing = EXCLUDED.email_marketing,
        in_app_reward_updates = EXCLUDED.in_app_reward_updates,
        in_app_withdrawal_updates = EXCLUDED.in_app_withdrawal_updates,
        in_app_security_alerts = EXCLUDED.in_app_security_alerts,
        in_app_support_updates = EXCLUDED.in_app_support_updates,
        in_app_platform_announcements = EXCLUDED.in_app_platform_announcements
      RETURNING *`,
      [
        userId,
        body.emailRewardUpdates,
        body.emailWithdrawalUpdates,
        body.emailSecurityAlerts,
        body.emailSupportUpdates,
        body.emailPlatformAnnouncements,
        body.emailMarketing,
        body.inAppRewardUpdates,
        body.inAppWithdrawalUpdates,
        body.inAppSecurityAlerts,
        body.inAppSupportUpdates,
        body.inAppPlatformAnnouncements,
      ],
    );
    await writeAudit(client, {
      actorType: "user",
      actorId: userId,
      action: "notification.preferences.updated",
      targetType: "user_preferences",
      targetId: userId,
      outcome: "success",
      requestId: request.id,
      ipHash: hashIp(request.ip, app.config.ipHashSecret),
    });
    return result.rows[0]!;
  });
  return projectPreferences(row);
}

export async function changePassword(
  app: FastifyInstance,
  request: FastifyRequest,
  body: ChangePassword,
): Promise<void> {
  const userId = request.auth!.user.id;
  validatePassword(body.newPassword, request.auth!.user.email);
  const current = await app.db.query<{ password_hash: string }>(
    "SELECT password_hash FROM users WHERE id = $1 AND deleted_at IS NULL",
    [userId],
  );
  const row = current.rows[0];
  if (
    !row ||
    !(await verifyPassword(
      body.currentPassword,
      row.password_hash,
      app.config.passwordPepper,
    ))
  ) {
    throw new AppError(
      400,
      "CURRENT_PASSWORD_INVALID",
      "The current password is incorrect.",
    );
  }
  if (
    await verifyPassword(
      body.newPassword,
      row.password_hash,
      app.config.passwordPepper,
    )
  ) {
    throw new AppError(
      400,
      "PASSWORD_UNCHANGED",
      "Choose a password you have not just used.",
    );
  }
  const passwordHash = await hashPassword(
    body.newPassword,
    app.config.passwordPepper,
  );
  await app.db.transaction(async (client) => {
    await client.query("UPDATE users SET password_hash = $2 WHERE id = $1", [
      userId,
      passwordHash,
    ]);
    await client.query(
      `UPDATE sessions SET revoked_at = NOW(), revoke_reason = 'password_changed'
       WHERE user_id = $1 AND id <> $2 AND revoked_at IS NULL`,
      [userId, request.auth!.sessionId],
    );
    await writeUserActivity(client, {
      userId,
      eventType: "security.password_changed",
      summary: "Password changed and other sessions signed out",
      targetType: "user",
      targetId: userId,
    });
    await writeAudit(client, {
      actorType: "user",
      actorId: userId,
      action: "security.password_changed",
      targetType: "user",
      targetId: userId,
      outcome: "success",
      requestId: request.id,
      ipHash: hashIp(request.ip, app.config.ipHashSecret),
    });
    await writeSecurityEvent(client, {
      userId,
      eventType: "security.password_changed",
      severity: "info",
      outcome: "success",
      requestId: request.id,
      ipHash: hashIp(request.ip, app.config.ipHashSecret),
      userAgent: request.headers["user-agent"] ?? null,
    });
    await createNotification(client, {
      userId,
      category: "security",
      title: "Password changed",
      body: "Your password was changed and your other sessions were signed out.",
      actionUrl: "/app/security",
    });
  });
}

export async function listActivity(
  app: FastifyInstance,
  userId: string,
  limit: number,
) {
  const result = await app.db.query<{
    id: string;
    event_type: string;
    summary: string;
    target_type: string | null;
    target_id: string | null;
    created_at: Date;
  }>(
    `SELECT id, event_type, summary, target_type, target_id, created_at
     FROM user_activity_events
     WHERE user_id = $1
     ORDER BY created_at DESC, id DESC LIMIT $2`,
    [userId, limit],
  );
  return result.rows.map((row) => ({
    id: row.id,
    eventType: row.event_type,
    summary: row.summary,
    targetType: row.target_type,
    targetId: row.target_id,
    createdAt: row.created_at.toISOString(),
  }));
}
