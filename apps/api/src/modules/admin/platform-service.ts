import { randomUUID } from "node:crypto";

import type {
  AdminProviderUpdateBodySchema,
  AdminRoleAssignmentBodySchema,
  AdminSettingUpdateBodySchema,
  AdminWithdrawalMethodWriteBodySchema,
  CountryAvailabilityUpdateBodySchema,
} from "@earnpearls/contracts";
import type { Static } from "@sinclair/typebox";
import type { FastifyInstance, FastifyRequest } from "fastify";

import { writeAudit } from "../../lib/audit.js";
import { hashIp } from "../../lib/crypto.js";
import { AppError } from "../../lib/errors.js";
import { requestPasswordReset } from "../auth/service.js";
import { ProviderRegistry } from "../surveys/provider.js";
import { getWalletSummary } from "../wallet/service.js";

type SettingUpdate = Static<typeof AdminSettingUpdateBodySchema>;
type CountryUpdate = Static<typeof CountryAvailabilityUpdateBodySchema>;
type ProviderUpdate = Static<typeof AdminProviderUpdateBodySchema>;
type RoleAssignment = Static<typeof AdminRoleAssignmentBodySchema>;
type WithdrawalMethodWrite = Static<
  typeof AdminWithdrawalMethodWriteBodySchema
>;

const explicitlyBlockedLaunchCountries = new Set(["PK", "IN", "BD", "CN"]);
const publicSettingKeys = new Set([
  "content",
  "currency_display",
  "features",
  "leaderboards",
  "maintenance",
  "points_per_usd",
  "provider_visibility",
  "registration",
  "support",
  "withdrawals",
]);

function settingObject(key: string, value: unknown): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new AppError(
      400,
      "SETTING_VALUE_INVALID",
      `${key} must be a JSON object.`,
    );
  }
  return value as Record<string, unknown>;
}

function requireBoolean(
  key: string,
  value: Record<string, unknown>,
  field: string,
): void {
  if (typeof value[field] !== "boolean") {
    throw new AppError(
      400,
      "SETTING_VALUE_INVALID",
      `${key}.${field} must be true or false.`,
    );
  }
}

export function validateSettingValue(key: string, rawValue: unknown): void {
  const value = settingObject(key, rawValue);
  if (key === "points_per_usd") {
    if (
      typeof value.value !== "string" ||
      !/^[1-9][0-9]{0,8}$/.test(value.value)
    ) {
      throw new AppError(
        400,
        "SETTING_VALUE_INVALID",
        "points_per_usd.value must be a positive integer string with at most 9 digits.",
      );
    }
    return;
  }
  if (key === "features") {
    for (const feature of [
      "surveys",
      "wallet",
      "withdrawals",
      "leaderboards",
      "support",
      "blog",
      "referrals",
      "offerwalls",
      "cashback",
      "games",
    ]) {
      requireBoolean(key, value, feature);
    }
    for (const futureFeature of [
      "referrals",
      "offerwalls",
      "cashback",
      "games",
    ]) {
      if (value[futureFeature] !== false) {
        throw new AppError(
          409,
          "FEATURE_NOT_IMPLEMENTED",
          `${futureFeature} is future-ready but cannot be enabled in Version 1.`,
        );
      }
    }
    return;
  }
  if (key === "registration") {
    requireBoolean(key, value, "enabled");
    requireBoolean(key, value, "requireCountryEnabled");
    if (value.requireCountryEnabled !== true) {
      throw new AppError(
        409,
        "COUNTRY_ENFORCEMENT_REQUIRED",
        "Country launch enforcement cannot be disabled in Version 1.",
      );
    }
    return;
  }
  if (key === "maintenance") {
    requireBoolean(key, value, "enabled");
    if (
      typeof value.message !== "string" ||
      value.message.trim().length < 10 ||
      value.message.length > 500
    ) {
      throw new AppError(
        400,
        "SETTING_VALUE_INVALID",
        "maintenance.message must contain 10 to 500 characters.",
      );
    }
    return;
  }
  if (key === "support") {
    requireBoolean(key, value, "enabled");
    requireBoolean(key, value, "attachmentsEnabled");
    if (value.attachmentsEnabled === true) {
      throw new AppError(
        409,
        "ATTACHMENT_STORAGE_REQUIRED",
        "Support attachments require configured object storage and malware scanning.",
      );
    }
    if (
      !Number.isInteger(value.maxOpenTicketsPerUser) ||
      Number(value.maxOpenTicketsPerUser) < 1 ||
      Number(value.maxOpenTicketsPerUser) > 50
    ) {
      throw new AppError(
        400,
        "SETTING_VALUE_INVALID",
        "support.maxOpenTicketsPerUser must be an integer from 1 to 50.",
      );
    }
    return;
  }
  if (key === "currency_display") {
    if (value.base !== "USD") {
      throw new AppError(
        409,
        "BASE_CURRENCY_IMMUTABLE",
        "USD is the accounting source of truth in Version 1.",
      );
    }
    requireBoolean(key, value, "localEstimatesEnabled");
    if (value.rates !== undefined) {
      const rates = settingObject("currency_display.rates", value.rates);
      for (const [currency, rate] of Object.entries(rates)) {
        if (
          !/^[A-Z]{3}$/.test(currency) ||
          typeof rate !== "string" ||
          !/^[0-9]+(?:\.[0-9]{1,6})?$/.test(rate) ||
          BigInt(rate.replace(".", "")) <= 0n
        ) {
          throw new AppError(
            400,
            "SETTING_VALUE_INVALID",
            "Currency rates require ISO codes and positive decimal strings with at most 6 decimal places.",
          );
        }
      }
    }
    if (
      value.localEstimatesEnabled === true &&
      (typeof value.asOf !== "string" || Number.isNaN(Date.parse(value.asOf)))
    ) {
      throw new AppError(
        400,
        "SETTING_VALUE_INVALID",
        "Enabled local estimates require a valid asOf timestamp.",
      );
    }
    return;
  }
  if (key === "data_retention") {
    for (const field of [
      "expiredSessionsDays",
      "deletedNotificationsDays",
      "sentEmailDays",
    ]) {
      if (
        !Number.isInteger(value[field]) ||
        Number(value[field]) < 1 ||
        Number(value[field]) > 3_650
      ) {
        throw new AppError(
          400,
          "SETTING_VALUE_INVALID",
          `data_retention.${field} must be an integer from 1 to 3650.`,
        );
      }
    }
    return;
  }
  if (["withdrawals", "wallet_adjustments"].includes(key)) {
    requireBoolean(key, value, "enabled");
    if (
      value.enabled === true &&
      (typeof value.approvalEvidence !== "string" ||
        value.approvalEvidence.trim().length < 3)
    ) {
      throw new AppError(
        409,
        "APPROVAL_EVIDENCE_REQUIRED",
        `${key} requires an approvalEvidence reference before activation.`,
      );
    }
    return;
  }
  if (key === "leaderboards") {
    requireBoolean(key, value, "enabled");
    return;
  }
  if (key === "content") {
    requireBoolean(key, value, "blogEnabled");
    return;
  }
  if (key === "security_policy") {
    if (
      !Number.isInteger(value.passwordMinimumLength) ||
      Number(value.passwordMinimumLength) < 12 ||
      Number(value.passwordMinimumLength) > 128 ||
      !Number.isInteger(value.sessionDays) ||
      Number(value.sessionDays) < 1 ||
      Number(value.sessionDays) > 90
    ) {
      throw new AppError(
        400,
        "SETTING_VALUE_INVALID",
        "Security policy requires a password length of 12–128 and session duration of 1–90 days.",
      );
    }
    requireBoolean(key, value, "requireVerifiedEmailToEarn");
    return;
  }
  if (key === "provider_visibility") {
    if (!new Set(["hidden", "visible"]).has(String(value.mode))) {
      throw new AppError(
        400,
        "SETTING_VALUE_INVALID",
        "provider_visibility.mode must be hidden or visible.",
      );
    }
  }
}

export async function listSettings(app: FastifyInstance) {
  const result = await app.db.query<{
    key: string;
    value: unknown;
    public: boolean;
    updated_at: Date;
  }>(
    `SELECT key, value, public, updated_at FROM system_settings
     ORDER BY key`,
  );
  return result.rows.map((row) => ({
    key: row.key,
    value: row.value,
    public: row.public,
    updatedAt: row.updated_at.toISOString(),
  }));
}

export async function updateSetting(
  app: FastifyInstance,
  request: FastifyRequest,
  key: string,
  body: SettingUpdate,
) {
  validateSettingValue(key, body.value);
  if (body.public && !publicSettingKeys.has(key)) {
    throw new AppError(
      400,
      "SETTING_VISIBILITY_INVALID",
      "This setting is restricted to authenticated administrators.",
    );
  }
  const actorId = request.auth!.user.id;
  const row = await app.db.transaction(async (client) => {
    const current = await client.query<{
      value: unknown;
      public: boolean;
    }>("SELECT value, public FROM system_settings WHERE key = $1 FOR UPDATE", [
      key,
    ]);
    if (!current.rows[0])
      throw new AppError(404, "SETTING_NOT_FOUND", "Setting not found.");
    const updated = await client.query<{
      key: string;
      value: unknown;
      public: boolean;
      updated_at: Date;
    }>(
      `UPDATE system_settings SET value = $2, public = $3, updated_by = $4
       WHERE key = $1 RETURNING key, value, public, updated_at`,
      [key, JSON.stringify(body.value), body.public, actorId],
    );
    await client.query(
      `INSERT INTO system_setting_revisions (
        id, setting_key, previous_value, new_value, actor_id, reason
       ) VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        randomUUID(),
        key,
        JSON.stringify(current.rows[0].value),
        JSON.stringify(body.value),
        actorId,
        body.reason,
      ],
    );
    await writeAudit(client, {
      actorType: "admin",
      actorId,
      action: "admin.setting.updated",
      targetType: "system_setting",
      targetId: key,
      reason: body.reason,
      outcome: "success",
      requestId: request.id,
      ipHash: hashIp(request.ip, app.config.ipHashSecret),
      metadata: { public: body.public },
    });
    return updated.rows[0]!;
  });
  return {
    key: row.key,
    value: row.value,
    public: row.public,
    updatedAt: row.updated_at.toISOString(),
  };
}

export async function listCountries(app: FastifyInstance) {
  const result = await app.db.query<{
    country_code: string;
    status: "enabled" | "blocked" | "future" | "review";
    reason: string;
    updated_at: Date;
  }>(
    `SELECT country_code, status, reason, updated_at
     FROM country_availability ORDER BY country_code`,
  );
  return result.rows.map((row) => ({
    countryCode: row.country_code,
    status: row.status,
    reason: row.reason,
    updatedAt: row.updated_at.toISOString(),
  }));
}

export async function updateCountry(
  app: FastifyInstance,
  request: FastifyRequest,
  countryCode: string,
  body: CountryUpdate,
) {
  if (
    body.status === "enabled" &&
    explicitlyBlockedLaunchCountries.has(countryCode)
  ) {
    throw new AppError(
      409,
      "COUNTRY_LAUNCH_BLOCKED",
      "This country is explicitly excluded from the initial EarnPearls launch.",
    );
  }
  const actorId = request.auth!.user.id;
  const row = await app.db.transaction(async (client) => {
    const updated = await client.query<{
      country_code: string;
      status: "enabled" | "blocked" | "future" | "review";
      reason: string;
      updated_at: Date;
    }>(
      `INSERT INTO country_availability (
        country_code, status, reason, updated_by
       ) VALUES ($1, $2, $3, $4)
       ON CONFLICT (country_code) DO UPDATE SET
        status = EXCLUDED.status,
        reason = EXCLUDED.reason,
        updated_by = EXCLUDED.updated_by,
        updated_at = NOW()
       RETURNING country_code, status, reason, updated_at`,
      [countryCode, body.status, body.reason, actorId],
    );
    await writeAudit(client, {
      actorType: "admin",
      actorId,
      action: "admin.country.updated",
      targetType: "country_availability",
      targetId: countryCode,
      reason: body.reason,
      outcome: "success",
      requestId: request.id,
      ipHash: hashIp(request.ip, app.config.ipHashSecret),
      metadata: { status: body.status },
    });
    return updated.rows[0]!;
  });
  return {
    countryCode: row.country_code,
    status: row.status,
    reason: row.reason,
    updatedAt: row.updated_at.toISOString(),
  };
}

export async function listProviders(app: FastifyInstance) {
  const result = await app.db.query<{
    id: string;
    code: string;
    display_name: string;
    enabled: boolean;
    user_visible: boolean;
    health_status: "unknown" | "healthy" | "degraded" | "down";
    configuration: unknown;
    last_health_check_at: Date | null;
    updated_at: Date;
  }>(
    `SELECT id, code, display_name, enabled, user_visible, health_status,
      configuration, last_health_check_at, updated_at
     FROM providers ORDER BY display_name`,
  );
  return result.rows.map((row) => ({
    id: row.id,
    code: row.code,
    displayName: row.display_name,
    enabled: row.enabled,
    userVisible: row.user_visible,
    healthStatus: row.health_status,
    configuration: row.configuration,
    lastHealthCheckAt: row.last_health_check_at?.toISOString() ?? null,
    updatedAt: row.updated_at.toISOString(),
  }));
}

export async function updateProvider(
  app: FastifyInstance,
  request: FastifyRequest,
  providerId: string,
  body: ProviderUpdate,
) {
  const configuration = settingObject(
    "provider.configuration",
    body.configuration,
  );
  if (
    configuration.processingDays !== undefined &&
    (!Number.isInteger(configuration.processingDays) ||
      Number(configuration.processingDays) < 1 ||
      Number(configuration.processingDays) > 30)
  ) {
    throw new AppError(
      400,
      "PROVIDER_CONFIGURATION_INVALID",
      "processingDays must be an integer from 1 to 30.",
    );
  }
  const actorId = request.auth!.user.id;
  const row = await app.db.transaction(async (client) => {
    const current = await client.query<{
      code: string;
      secret_reference: string | null;
    }>(
      "SELECT code, secret_reference FROM providers WHERE id = $1 FOR UPDATE",
      [providerId],
    );
    const provider = current.rows[0];
    if (!provider)
      throw new AppError(404, "PROVIDER_NOT_FOUND", "Provider not found.");
    if (body.enabled) {
      const registry = new ProviderRegistry(app.config);
      if (!registry.has(provider.code)) {
        throw new AppError(
          409,
          "PROVIDER_ADAPTER_REQUIRED",
          "An installed, server-side provider adapter is required before activation.",
        );
      }
    }
    const updated = await client.query<{
      id: string;
      code: string;
      display_name: string;
      enabled: boolean;
      user_visible: boolean;
      health_status: "unknown" | "healthy" | "degraded" | "down";
      configuration: unknown;
      last_health_check_at: Date | null;
      updated_at: Date;
    }>(
      `UPDATE providers SET display_name = $2, enabled = $3,
        user_visible = $4, configuration = $5
       WHERE id = $1
       RETURNING id, code, display_name, enabled, user_visible, health_status,
        configuration, last_health_check_at, updated_at`,
      [
        providerId,
        body.displayName.trim(),
        body.enabled,
        body.userVisible,
        JSON.stringify(body.configuration),
      ],
    );
    await writeAudit(client, {
      actorType: "admin",
      actorId,
      action: "admin.provider.updated",
      targetType: "provider",
      targetId: providerId,
      reason: body.reason,
      outcome: "success",
      requestId: request.id,
      ipHash: hashIp(request.ip, app.config.ipHashSecret),
      metadata: { enabled: body.enabled, userVisible: body.userVisible },
    });
    return updated.rows[0]!;
  });
  return {
    id: row.id,
    code: row.code,
    displayName: row.display_name,
    enabled: row.enabled,
    userVisible: row.user_visible,
    healthStatus: row.health_status,
    configuration: row.configuration,
    lastHealthCheckAt: row.last_health_check_at?.toISOString() ?? null,
    updatedAt: row.updated_at.toISOString(),
  };
}

type AdminWithdrawalMethodRow = Readonly<{
  code: string;
  display_name: string;
  enabled: boolean;
  minimum_points: string;
  fee_points: string;
  country_codes: string[];
  destination_type: "email" | "crypto_address" | "account_reference";
  processing_days: number;
  processing_mode: "manual";
  evidence_reference: string | null;
  updated_at: Date;
}>;

const withdrawalMethodSelect = `SELECT code, display_name, enabled,
  minimum_points::TEXT, fee_points::TEXT, country_codes,
  CASE WHEN destination_schema->>'type' IN (
    'email','crypto_address','account_reference'
  ) THEN destination_schema->>'type' ELSE 'account_reference' END
    AS destination_type,
  CASE WHEN (configuration->>'processingDays') ~ '^[0-9]+$'
    AND (configuration->>'processingDays')::INTEGER BETWEEN 1 AND 30
    THEN (configuration->>'processingDays')::INTEGER ELSE 5 END
    AS processing_days,
  'manual'::TEXT AS processing_mode,
  configuration->>'evidenceReference' AS evidence_reference,
  updated_at
 FROM withdrawal_methods`;

function projectWithdrawalMethod(row: AdminWithdrawalMethodRow) {
  return {
    code: row.code,
    displayName: row.display_name,
    enabled: row.enabled,
    minimumPoints: row.minimum_points,
    feePoints: row.fee_points,
    countryCodes: row.country_codes,
    destinationType: row.destination_type,
    processingDays: row.processing_days,
    processingMode: row.processing_mode,
    evidenceReference: row.evidence_reference,
    updatedAt: row.updated_at.toISOString(),
  };
}

export async function listAdminWithdrawalMethods(app: FastifyInstance) {
  const result = await app.db.query<AdminWithdrawalMethodRow>(
    `${withdrawalMethodSelect} ORDER BY display_name, code`,
  );
  return result.rows.map(projectWithdrawalMethod);
}

export async function saveAdminWithdrawalMethod(
  app: FastifyInstance,
  request: FastifyRequest,
  existingCode: string | undefined,
  body: WithdrawalMethodWrite,
) {
  if (existingCode && existingCode !== body.code) {
    throw new AppError(
      409,
      "WITHDRAWAL_METHOD_CODE_IMMUTABLE",
      "A withdrawal method code cannot be renamed.",
    );
  }
  if (
    body.countryCodes.some((code) => explicitlyBlockedLaunchCountries.has(code))
  ) {
    throw new AppError(
      409,
      "WITHDRAWAL_COUNTRY_BLOCKED",
      "A payout method cannot target a country excluded from the initial launch.",
    );
  }
  if (
    body.enabled &&
    body.code.startsWith("demo_") &&
    !app.config.allowDemoData
  ) {
    throw new AppError(
      409,
      "DEMO_METHOD_DISABLED",
      "Demo payout methods cannot be enabled outside an explicit demo environment.",
    );
  }
  const code = existingCode ?? body.code;
  const actorId = request.auth!.user.id;
  const row = await app.db.transaction(async (client) => {
    const existing = await client.query(
      "SELECT 1 FROM withdrawal_methods WHERE code=$1 FOR UPDATE",
      [code],
    );
    if (existingCode && !existing.rows[0]) {
      throw new AppError(
        404,
        "WITHDRAWAL_METHOD_NOT_FOUND",
        "Withdrawal method not found.",
      );
    }
    if (!existingCode && existing.rows[0]) {
      throw new AppError(
        409,
        "WITHDRAWAL_METHOD_EXISTS",
        "A withdrawal method with this code already exists.",
      );
    }
    const result = await client.query<AdminWithdrawalMethodRow>(
      `${existingCode ? "UPDATE" : "INSERT INTO"} withdrawal_methods
       ${
         existingCode
           ? `SET display_name=$2, enabled=$3, minimum_points=$4,
              fee_points=$5, country_codes=$6, destination_schema=$7,
              configuration=$8 WHERE code=$1`
           : `(code, display_name, enabled, minimum_points, fee_points,
              country_codes, destination_schema, configuration)
              VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`
       }
       RETURNING code, display_name, enabled, minimum_points::TEXT,
        fee_points::TEXT, country_codes,
        (destination_schema->>'type')::TEXT AS destination_type,
        (configuration->>'processingDays')::INTEGER AS processing_days,
        'manual'::TEXT AS processing_mode,
        configuration->>'evidenceReference' AS evidence_reference,
        updated_at`,
      [
        code,
        body.displayName.trim(),
        body.enabled,
        body.minimumPoints,
        body.feePoints,
        body.countryCodes,
        JSON.stringify({ type: body.destinationType }),
        JSON.stringify({
          processingDays: body.processingDays,
          processingMode: "manual",
          evidenceReference: body.evidenceReference,
          demo: body.code.startsWith("demo_"),
        }),
      ],
    );
    await writeAudit(client, {
      actorType: "admin",
      actorId,
      action: existingCode
        ? "admin.withdrawal_method.updated"
        : "admin.withdrawal_method.created",
      targetType: "withdrawal_method",
      targetId: code,
      reason: body.reason,
      outcome: "success",
      requestId: request.id,
      ipHash: hashIp(request.ip, app.config.ipHashSecret),
      metadata: {
        enabled: body.enabled,
        evidenceReference: body.evidenceReference,
      },
    });
    return result.rows[0]!;
  });
  return projectWithdrawalMethod(row);
}

export async function listRoles(app: FastifyInstance) {
  const result = await app.db.query<{
    code: string;
    name: string;
    administrative: boolean;
    permissions: string[];
  }>(
    `SELECT r.code, r.name, r.administrative,
      COALESCE(ARRAY_AGG(rp.permission_code ORDER BY rp.permission_code)
        FILTER (WHERE rp.permission_code IS NOT NULL), '{}') AS permissions
     FROM roles r LEFT JOIN role_permissions rp ON rp.role_code = r.code
     GROUP BY r.code ORDER BY r.administrative DESC, r.name`,
  );
  return result.rows;
}

export async function assignRole(
  app: FastifyInstance,
  request: FastifyRequest,
  userId: string,
  body: RoleAssignment,
): Promise<void> {
  const actorId = request.auth!.user.id;
  await app.db.transaction(async (client) => {
    const target = await client.query(
      "SELECT 1 FROM users WHERE id = $1 AND deleted_at IS NULL",
      [userId],
    );
    const role = await client.query(
      "SELECT 1 FROM roles WHERE code = $1 AND administrative = TRUE",
      [body.roleCode],
    );
    if (!target.rows[0])
      throw new AppError(404, "USER_NOT_FOUND", "User not found.");
    if (!role.rows[0])
      throw new AppError(400, "ROLE_INVALID", "Administrative role not found.");
    await client.query(
      `INSERT INTO user_roles (user_id, role_code, assigned_by)
       VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`,
      [userId, body.roleCode, actorId],
    );
    await writeAudit(client, {
      actorType: "admin",
      actorId,
      action: "admin.role.assigned",
      targetType: "user",
      targetId: userId,
      reason: body.reason,
      outcome: "success",
      requestId: request.id,
      ipHash: hashIp(request.ip, app.config.ipHashSecret),
      metadata: { roleCode: body.roleCode },
    });
  });
}

export async function revokeRole(
  app: FastifyInstance,
  request: FastifyRequest,
  userId: string,
  roleCode: string,
  reason: string,
): Promise<void> {
  const actorId = request.auth!.user.id;
  if (userId === actorId && roleCode === "super_admin")
    throw new AppError(
      409,
      "ROLE_SELF_REVOKE_BLOCKED",
      "You cannot revoke your own Super Admin role.",
    );
  await app.db.transaction(async (client) => {
    if (roleCode === "super_admin") {
      const count = await client.query<{ count: number }>(
        `SELECT COUNT(*)::INTEGER AS count FROM user_roles
         WHERE role_code = 'super_admin'`,
      );
      if ((count.rows[0]?.count ?? 0) <= 1)
        throw new AppError(
          409,
          "LAST_SUPER_ADMIN",
          "The last Super Admin role cannot be revoked.",
        );
    }
    const removed = await client.query(
      "DELETE FROM user_roles WHERE user_id = $1 AND role_code = $2",
      [userId, roleCode],
    );
    if (!removed.rowCount)
      throw new AppError(
        404,
        "ROLE_ASSIGNMENT_NOT_FOUND",
        "Role assignment not found.",
      );
    await writeAudit(client, {
      actorType: "admin",
      actorId,
      action: "admin.role.revoked",
      targetType: "user",
      targetId: userId,
      reason,
      outcome: "success",
      requestId: request.id,
      ipHash: hashIp(request.ip, app.config.ipHashSecret),
      metadata: { roleCode },
    });
  });
}

export async function listJobs(app: FastifyInstance, limit: number) {
  const result = await app.db.query<{
    id: string;
    job_type: string;
    status: string;
    attempt_count: number;
    scheduled_for: Date;
    started_at: Date | null;
    finished_at: Date | null;
    last_error: string | null;
    created_at: Date;
  }>(
    `SELECT id, job_type, status, attempt_count, scheduled_for,
      started_at, finished_at, last_error, created_at
     FROM background_job_runs ORDER BY created_at DESC LIMIT $1`,
    [limit],
  );
  return result.rows.map((row) => ({
    id: row.id,
    jobType: row.job_type,
    status: row.status,
    attemptCount: row.attempt_count,
    scheduledFor: row.scheduled_for.toISOString(),
    startedAt: row.started_at?.toISOString() ?? null,
    finishedAt: row.finished_at?.toISOString() ?? null,
    lastError: row.last_error,
    createdAt: row.created_at.toISOString(),
  }));
}

export async function retryJob(
  app: FastifyInstance,
  request: FastifyRequest,
  jobId: string,
  reason: string,
): Promise<void> {
  const actorId = request.auth!.user.id;
  await app.db.transaction(async (client) => {
    const updated = await client.query(
      `UPDATE background_job_runs SET status = 'queued', scheduled_for = NOW(),
        started_at = NULL, finished_at = NULL, last_error = NULL
       WHERE id = $1 AND status IN ('failed', 'dead')`,
      [jobId],
    );
    if (!updated.rowCount)
      throw new AppError(
        409,
        "JOB_NOT_RETRYABLE",
        "Only failed or dead jobs can be retried.",
      );
    await writeAudit(client, {
      actorType: "admin",
      actorId,
      action: "admin.job.retried",
      targetType: "background_job",
      targetId: jobId,
      reason,
      outcome: "success",
      requestId: request.id,
      ipHash: hashIp(request.ip, app.config.ipHashSecret),
    });
  });
}

export async function getAdminUserDetail(app: FastifyInstance, userId: string) {
  const [user, roles, counts, wallet, activity, securityEvents] =
    await Promise.all([
      app.db.query<{
        id: string;
        email: string;
        display_name: string;
        country_code: string;
        account_status_code:
          "active" | "limited" | "suspended" | "disabled" | "archived";
        email_verified_at: Date | null;
        limit_template_id: string | null;
        timezone: string;
        display_currency: string;
        last_login_at: Date | null;
        deleted_at: Date | null;
        created_at: Date;
      }>(
        `SELECT id, email, display_name, country_code, account_status_code,
        email_verified_at, limit_template_id, timezone, display_currency,
        last_login_at, deleted_at, created_at FROM users WHERE id = $1`,
        [userId],
      ),
      app.db.query<{ role_code: string }>(
        "SELECT role_code FROM user_roles WHERE user_id = $1 ORDER BY role_code",
        [userId],
      ),
      app.db.query<{
        active_sessions: number;
        open_support: number;
        unread_notifications: number;
        survey_participations: number;
        withdrawals: number;
      }>(
        `SELECT
        (SELECT COUNT(*)::INTEGER FROM sessions WHERE user_id=$1
          AND revoked_at IS NULL AND expires_at>NOW()) AS active_sessions,
        (SELECT COUNT(*)::INTEGER FROM support_tickets WHERE user_id=$1
          AND status NOT IN ('resolved','closed')) AS open_support,
        (SELECT COUNT(*)::INTEGER FROM notifications WHERE user_id=$1
          AND status='unread') AS unread_notifications,
        (SELECT COUNT(*)::INTEGER FROM survey_participations WHERE user_id=$1)
          AS survey_participations,
        (SELECT COUNT(*)::INTEGER FROM withdrawals WHERE user_id=$1) AS withdrawals`,
        [userId],
      ),
      getWalletSummary(app.db, userId),
      app.db.query<{
        id: string;
        event_type: string;
        summary: string;
        target_type: string | null;
        target_id: string | null;
        created_at: Date;
      }>(
        `SELECT id, event_type, summary, target_type, target_id, created_at
       FROM user_activity_events WHERE user_id=$1
       ORDER BY created_at DESC, id DESC LIMIT 25`,
        [userId],
      ),
      app.db.query<{
        id: string;
        event_type: string;
        severity: string;
        outcome: string;
        created_at: Date;
      }>(
        `SELECT id, event_type, severity, outcome, created_at
       FROM security_events WHERE user_id=$1
       ORDER BY created_at DESC, id DESC LIMIT 25`,
        [userId],
      ),
    ]);
  const row = user.rows[0];
  if (!row) throw new AppError(404, "USER_NOT_FOUND", "User not found.");
  const stats = counts.rows[0]!;
  return {
    id: row.id,
    email: row.email,
    displayName: row.display_name,
    countryCode: row.country_code,
    accountStatus: row.account_status_code,
    emailVerified: Boolean(row.email_verified_at),
    limitTemplateId: row.limit_template_id,
    timezone: row.timezone,
    displayCurrency: row.display_currency,
    lastLoginAt: row.last_login_at?.toISOString() ?? null,
    deletedAt: row.deleted_at?.toISOString() ?? null,
    createdAt: row.created_at.toISOString(),
    roles: roles.rows.map((role) => role.role_code),
    activeSessionCount: stats.active_sessions,
    openSupportTicketCount: stats.open_support,
    unreadNotificationCount: stats.unread_notifications,
    surveyParticipationCount: stats.survey_participations,
    withdrawalCount: stats.withdrawals,
    wallet,
    recentActivity: activity.rows.map((event) => ({
      id: event.id,
      eventType: event.event_type,
      summary: event.summary,
      targetType: event.target_type,
      targetId: event.target_id,
      createdAt: event.created_at.toISOString(),
    })),
    recentSecurityEvents: securityEvents.rows.map((event) => ({
      id: event.id,
      eventType: event.event_type,
      severity: event.severity,
      outcome: event.outcome,
      createdAt: event.created_at.toISOString(),
    })),
  };
}

export async function forceLogoutUser(
  app: FastifyInstance,
  request: FastifyRequest,
  userId: string,
  reason: string,
): Promise<void> {
  if (userId === request.auth!.user.id)
    throw new AppError(
      409,
      "SELF_ACTION_DENIED",
      "Use your own security page to sign out.",
    );
  await app.db.transaction(async (client) => {
    const target = await client.query("SELECT 1 FROM users WHERE id=$1", [
      userId,
    ]);
    if (!target.rows[0])
      throw new AppError(404, "USER_NOT_FOUND", "User not found.");
    const revoked = await client.query(
      `UPDATE sessions SET revoked_at=NOW(), revoke_reason='admin_forced_logout'
       WHERE user_id=$1 AND revoked_at IS NULL`,
      [userId],
    );
    await writeAudit(client, {
      actorType: "admin",
      actorId: request.auth!.user.id,
      action: "admin.user.force_logout",
      targetType: "user",
      targetId: userId,
      reason,
      outcome: "success",
      requestId: request.id,
      ipHash: hashIp(request.ip, app.config.ipHashSecret),
      metadata: { revokedSessions: revoked.rowCount ?? 0 },
    });
  });
}

export async function sendAdminPasswordReset(
  app: FastifyInstance,
  request: FastifyRequest,
  userId: string,
  reason: string,
): Promise<void> {
  const user = await app.db.query<{ email: string }>(
    "SELECT email FROM users WHERE id=$1 AND deleted_at IS NULL",
    [userId],
  );
  if (!user.rows[0])
    throw new AppError(404, "USER_NOT_FOUND", "User not found.");
  await requestPasswordReset(app, user.rows[0].email);
  await app.db.transaction(async (client) => {
    await writeAudit(client, {
      actorType: "admin",
      actorId: request.auth!.user.id,
      action: "admin.user.password_reset_requested",
      targetType: "user",
      targetId: userId,
      reason,
      outcome: "success",
      requestId: request.id,
      ipHash: hashIp(request.ip, app.config.ipHashSecret),
    });
  });
}

export async function setUserDeletedState(
  app: FastifyInstance,
  request: FastifyRequest,
  userId: string,
  deleted: boolean,
  reason: string,
): Promise<void> {
  const actorId = request.auth!.user.id;
  if (userId === actorId)
    throw new AppError(
      409,
      "SELF_ACTION_DENIED",
      "You cannot archive your own account.",
    );
  await app.db.transaction(async (client) => {
    const result = await client.query<{
      account_status_code: string;
      limit_template_id: string | null;
      deleted_at: Date | null;
    }>(
      `SELECT account_status_code, limit_template_id, deleted_at
       FROM users WHERE id=$1 FOR UPDATE`,
      [userId],
    );
    const user = result.rows[0];
    if (!user) throw new AppError(404, "USER_NOT_FOUND", "User not found.");
    if (deleted === Boolean(user.deleted_at))
      throw new AppError(
        409,
        "USER_STATE_UNCHANGED",
        "The account already has this state.",
      );
    const nextState = deleted ? "archived" : "active";
    await client.query(
      `UPDATE users SET deleted_at=$2, account_status_code=$3,
        limit_template_id=CASE WHEN $2::TIMESTAMPTZ IS NULL THEN NULL ELSE limit_template_id END
       WHERE id=$1`,
      [userId, deleted ? new Date() : null, nextState],
    );
    if (deleted) {
      await client.query(
        `UPDATE sessions SET revoked_at=NOW(), revoke_reason='account_archived'
         WHERE user_id=$1 AND revoked_at IS NULL`,
        [userId],
      );
    }
    await client.query(
      `INSERT INTO account_state_events (
        id, user_id, previous_state_code, new_state_code,
        previous_limit_template_id, new_limit_template_id, actor_id, reason
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [
        randomUUID(),
        userId,
        user.account_status_code,
        nextState,
        user.limit_template_id,
        deleted ? user.limit_template_id : null,
        actorId,
        reason,
      ],
    );
    await writeAudit(client, {
      actorType: "admin",
      actorId,
      action: deleted ? "admin.user.archived" : "admin.user.restored",
      targetType: "user",
      targetId: userId,
      reason,
      outcome: "success",
      requestId: request.id,
      ipHash: hashIp(request.ip, app.config.ipHashSecret),
    });
  });
}

function csvCell(value: unknown): string {
  const text = value === null || value === undefined ? "" : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

export async function exportUsersCsv(app: FastifyInstance): Promise<string> {
  const result = await app.db.query<{
    id: string;
    email: string;
    display_name: string;
    country_code: string;
    account_status_code: string;
    email_verified_at: Date | null;
    created_at: Date;
    last_login_at: Date | null;
  }>(
    `SELECT id, email, display_name, country_code, account_status_code,
      email_verified_at, created_at, last_login_at
     FROM users ORDER BY created_at DESC`,
  );
  const header = [
    "id",
    "email",
    "display_name",
    "country_code",
    "account_status",
    "email_verified_at",
    "created_at",
    "last_login_at",
  ]
    .map(csvCell)
    .join(",");
  const rows = result.rows.map((row) =>
    [
      row.id,
      row.email,
      row.display_name,
      row.country_code,
      row.account_status_code,
      row.email_verified_at?.toISOString() ?? "",
      row.created_at.toISOString(),
      row.last_login_at?.toISOString() ?? "",
    ]
      .map(csvCell)
      .join(","),
  );
  return [header, ...rows].join("\n");
}
