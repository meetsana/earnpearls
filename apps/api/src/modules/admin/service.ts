import { randomUUID } from "node:crypto";

import type { AdminDashboardSchema, Withdrawal } from "@earnpearls/contracts";
import type { Static } from "@sinclair/typebox";
import type { FastifyInstance, FastifyRequest } from "fastify";

import { writeAudit } from "../../lib/audit.js";
import { hashIp } from "../../lib/crypto.js";
import { AppError } from "../../lib/errors.js";
import { toMoney } from "../../lib/money.js";
import {
  lockUserWallet,
  transitionWalletTransaction,
} from "../wallet/service.js";

export type AdminDashboard = Static<typeof AdminDashboardSchema>;

export async function getAdminDashboard(
  app: FastifyInstance,
): Promise<AdminDashboard> {
  const [users, surveys, withdrawals, providers, reserved] = await Promise.all([
    app.db.query<{ total: number; verified: number; limited: number }>(
      `SELECT COUNT(*)::INTEGER AS total,
        COUNT(*) FILTER (WHERE email_verified_at IS NOT NULL)::INTEGER AS verified,
        COUNT(*) FILTER (WHERE account_status_code = 'limited')::INTEGER AS limited
       FROM users`,
    ),
    app.db.query<{ available: number; pending: number }>(
      `SELECT
        (SELECT COUNT(*) FROM surveys s JOIN providers p ON p.id = s.provider_id
          WHERE s.active = TRUE AND p.enabled = TRUE)::INTEGER AS available,
        (SELECT COUNT(*) FROM survey_participations
          WHERE status IN ('completed','pending'))::INTEGER AS pending`,
    ),
    app.db.query<{ requested: number }>(
      `SELECT COUNT(*) FILTER (WHERE status IN ('requested','under_review'))::INTEGER AS requested
       FROM withdrawals`,
    ),
    app.db.query<{ enabled: number; degraded: number }>(
      `SELECT COUNT(*) FILTER (WHERE enabled)::INTEGER AS enabled,
        COUNT(*) FILTER (WHERE health_status IN ('degraded','down'))::INTEGER AS degraded
       FROM providers`,
    ),
    app.db.query<{ points: string; usd_micros: string }>(
      `SELECT COALESCE(SUM(points), 0)::TEXT AS points,
        COALESCE(SUM(usd_micros), 0)::TEXT AS usd_micros
       FROM wallet_balances WHERE bucket = 'reserved'`,
    ),
  ]);
  return {
    users: users.rows[0] ?? { total: 0, verified: 0, limited: 0 },
    surveys: {
      available: surveys.rows[0]?.available ?? 0,
      pendingParticipations: surveys.rows[0]?.pending ?? 0,
    },
    withdrawals: {
      requested: withdrawals.rows[0]?.requested ?? 0,
      reserved: toMoney(
        BigInt(reserved.rows[0]?.points ?? "0"),
        BigInt(reserved.rows[0]?.usd_micros ?? "0"),
      ),
    },
    providers: providers.rows[0] ?? { enabled: 0, degraded: 0 },
  };
}

export async function changeAccountState(
  app: FastifyInstance,
  request: FastifyRequest,
  userId: string,
  input: Readonly<{
    accountStatus: "active" | "limited" | "suspended" | "disabled" | "archived";
    reason: string;
    limitTemplateId?: string | null;
  }>,
): Promise<void> {
  const auth = request.auth!;
  if (userId === auth.user.id) {
    throw new AppError(
      409,
      "SELF_MODERATION_DENIED",
      "You cannot moderate your own administrative account.",
    );
  }
  await app.db.transaction(async (client) => {
    const current = await client.query<{
      account_status_code: string;
      limit_template_id: string | null;
    }>(
      `SELECT account_status_code, limit_template_id FROM users WHERE id = $1 FOR UPDATE`,
      [userId],
    );
    const user = current.rows[0];
    if (!user) throw new AppError(404, "USER_NOT_FOUND", "User not found.");
    if (input.accountStatus === "limited" && !input.limitTemplateId) {
      throw new AppError(
        400,
        "LIMIT_TEMPLATE_REQUIRED",
        "A limit template is required for a limited account.",
      );
    }
    if (input.limitTemplateId) {
      const template = await client.query<{ active: boolean }>(
        "SELECT active FROM limit_templates WHERE id = $1",
        [input.limitTemplateId],
      );
      if (!template.rows[0]?.active)
        throw new AppError(
          400,
          "LIMIT_TEMPLATE_INVALID",
          "Limit template is invalid.",
        );
    }
    await client.query(
      `UPDATE users SET account_status_code = $1, limit_template_id = $2 WHERE id = $3`,
      [input.accountStatus, input.limitTemplateId ?? null, userId],
    );
    await client.query(
      `INSERT INTO account_state_events (
        id, user_id, previous_state_code, new_state_code,
        previous_limit_template_id, new_limit_template_id, actor_id, reason
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        randomUUID(),
        userId,
        user.account_status_code,
        input.accountStatus,
        user.limit_template_id,
        input.limitTemplateId ?? null,
        auth.user.id,
        input.reason,
      ],
    );
    if (["suspended", "disabled", "archived"].includes(input.accountStatus)) {
      await client.query(
        `UPDATE sessions SET revoked_at = NOW(), revoke_reason = 'administrative_account_state'
         WHERE user_id = $1 AND revoked_at IS NULL`,
        [userId],
      );
    }
    await writeAudit(client, {
      actorType: "admin",
      actorId: auth.user.id,
      action: "admin.user.account_state_changed",
      targetType: "user",
      targetId: userId,
      reason: input.reason,
      outcome: "success",
      requestId: request.id,
      ipHash: hashIp(request.ip, app.config.ipHashSecret),
      metadata: {
        previousState: user.account_status_code,
        newState: input.accountStatus,
        previousLimitTemplateId: user.limit_template_id,
        newLimitTemplateId: input.limitTemplateId ?? null,
      },
    });
  });
}

export type LimitTemplateView = Readonly<{
  id: string;
  code: string;
  name: string;
  description: string;
  active: boolean;
  deniedPermissions: string[];
  createdAt: string;
  updatedAt: string;
}>;

type LimitTemplateRow = Readonly<{
  id: string;
  code: string;
  name: string;
  description: string;
  active: boolean;
  denied_permissions: string[] | null;
  created_at: Date;
  updated_at: Date;
}>;

function mapLimitTemplate(row: LimitTemplateRow): LimitTemplateView {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    description: row.description,
    active: row.active,
    deniedPermissions: row.denied_permissions ?? [],
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

async function assertPermissionsExist(
  app: FastifyInstance,
  permissionCodes: readonly string[],
): Promise<string[]> {
  const normalized = [...new Set(permissionCodes)].sort();
  if (normalized.length === 0) return normalized;
  const result = await app.db.query<{ code: string }>(
    "SELECT code FROM permissions WHERE code = ANY($1::TEXT[])",
    [normalized],
  );
  if (result.rows.length !== normalized.length) {
    const found = new Set(result.rows.map((row) => row.code));
    throw new AppError(
      400,
      "PERMISSION_INVALID",
      "One or more permission codes are invalid.",
      {
        invalid: normalized.filter((code) => !found.has(code)),
      },
    );
  }
  return normalized;
}

export async function listLimitTemplates(
  app: FastifyInstance,
): Promise<LimitTemplateView[]> {
  const result = await app.db.query<LimitTemplateRow>(
    `SELECT lt.id, lt.code, lt.name, lt.description, lt.active,
      COALESCE(ARRAY_AGG(ltp.permission_code ORDER BY ltp.permission_code)
        FILTER (WHERE ltp.allowed = FALSE), '{}') AS denied_permissions,
      lt.created_at, lt.updated_at
     FROM limit_templates lt
     LEFT JOIN limit_template_permissions ltp ON ltp.limit_template_id = lt.id
     GROUP BY lt.id ORDER BY lt.name`,
  );
  return result.rows.map(mapLimitTemplate);
}

export async function createLimitTemplate(
  app: FastifyInstance,
  request: FastifyRequest,
  input: Readonly<{
    code: string;
    name: string;
    description: string;
    active: boolean;
    deniedPermissions: readonly string[];
    sourceTemplateId?: string;
  }>,
): Promise<LimitTemplateView> {
  const auth = request.auth!;
  const deniedPermissions = await assertPermissionsExist(
    app,
    input.deniedPermissions,
  );
  return app.db.transaction(async (client) => {
    const id = randomUUID();
    await client.query(
      `INSERT INTO limit_templates (id, code, name, description, active, created_by)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        id,
        input.code,
        input.name,
        input.description,
        input.active,
        auth.user.id,
      ],
    );
    for (const permission of deniedPermissions) {
      await client.query(
        `INSERT INTO limit_template_permissions (limit_template_id, permission_code, allowed)
         VALUES ($1, $2, FALSE)`,
        [id, permission],
      );
    }
    await writeAudit(client, {
      actorType: "admin",
      actorId: auth.user.id,
      action: input.sourceTemplateId
        ? "admin.limit_template.cloned"
        : "admin.limit_template.created",
      targetType: "limit_template",
      targetId: id,
      reason: input.sourceTemplateId
        ? "Cloned reusable limit template"
        : "Created reusable limit template",
      outcome: "success",
      requestId: request.id,
      ipHash: hashIp(request.ip, app.config.ipHashSecret),
      metadata: {
        code: input.code,
        deniedPermissions,
        sourceTemplateId: input.sourceTemplateId ?? null,
      },
    });
    const result = await client.query<LimitTemplateRow>(
      `SELECT lt.id, lt.code, lt.name, lt.description, lt.active,
        $2::TEXT[] AS denied_permissions, lt.created_at, lt.updated_at
       FROM limit_templates lt WHERE lt.id = $1`,
      [id, deniedPermissions],
    );
    return mapLimitTemplate(result.rows[0]!);
  });
}

export async function updateLimitTemplate(
  app: FastifyInstance,
  request: FastifyRequest,
  templateId: string,
  input: Readonly<{
    name: string;
    description: string;
    active: boolean;
    deniedPermissions: readonly string[];
  }>,
): Promise<LimitTemplateView> {
  const auth = request.auth!;
  const deniedPermissions = await assertPermissionsExist(
    app,
    input.deniedPermissions,
  );
  return app.db.transaction(async (client) => {
    const updated = await client.query<{ id: string }>(
      `UPDATE limit_templates SET name = $1, description = $2, active = $3
       WHERE id = $4 RETURNING id`,
      [input.name, input.description, input.active, templateId],
    );
    if (!updated.rows[0])
      throw new AppError(
        404,
        "LIMIT_TEMPLATE_NOT_FOUND",
        "Limit template not found.",
      );
    await client.query(
      "DELETE FROM limit_template_permissions WHERE limit_template_id = $1",
      [templateId],
    );
    for (const permission of deniedPermissions) {
      await client.query(
        `INSERT INTO limit_template_permissions (limit_template_id, permission_code, allowed)
         VALUES ($1, $2, FALSE)`,
        [templateId, permission],
      );
    }
    await writeAudit(client, {
      actorType: "admin",
      actorId: auth.user.id,
      action: "admin.limit_template.updated",
      targetType: "limit_template",
      targetId: templateId,
      reason: "Updated reusable limit template",
      outcome: "success",
      requestId: request.id,
      ipHash: hashIp(request.ip, app.config.ipHashSecret),
      metadata: { deniedPermissions, active: input.active },
    });
    const result = await client.query<LimitTemplateRow>(
      `SELECT lt.id, lt.code, lt.name, lt.description, lt.active,
        $2::TEXT[] AS denied_permissions, lt.created_at, lt.updated_at
       FROM limit_templates lt WHERE lt.id = $1`,
      [templateId, deniedPermissions],
    );
    return mapLimitTemplate(result.rows[0]!);
  });
}

type WithdrawalAdminRow = Readonly<{
  id: string;
  user_id: string;
  method_code: string;
  wallet_transaction_id: string;
  amount_points: string;
  amount_usd_micros: string;
  fee_points: string;
  fee_usd_micros: string;
  status: Withdrawal["status"];
  destination_masked: string;
  requested_at: Date;
  updated_at: Date;
  processed_at: Date | null;
  rejection_reason: string | null;
}>;

export async function decideWithdrawal(
  app: FastifyInstance,
  request: FastifyRequest,
  withdrawalId: string,
  action: "approve" | "reject" | "mark-paid",
  input: Readonly<{ reason: string; payoutReference?: string }>,
): Promise<void> {
  const auth = request.auth!;
  await app.db.transaction(async (client) => {
    const result = await client.query<WithdrawalAdminRow>(
      `SELECT id, user_id, method_code, wallet_transaction_id,
        amount_points::TEXT, amount_usd_micros::TEXT,
        fee_points::TEXT, fee_usd_micros::TEXT, status, destination_masked,
        requested_at, updated_at, processed_at, rejection_reason
       FROM withdrawals WHERE id = $1 FOR UPDATE`,
      [withdrawalId],
    );
    const withdrawal = result.rows[0];
    if (!withdrawal)
      throw new AppError(404, "WITHDRAWAL_NOT_FOUND", "Withdrawal not found.");
    await lockUserWallet(client, withdrawal.user_id);

    if (action === "approve") {
      if (!["requested", "under_review"].includes(withdrawal.status)) {
        throw new AppError(
          409,
          "WITHDRAWAL_STATE_INVALID",
          "Only a pending withdrawal can be approved.",
        );
      }
      await client.query(
        `UPDATE withdrawals SET status = 'approved', reviewed_by = $1,
          reviewed_at = NOW(), payout_reference = COALESCE($2, payout_reference)
         WHERE id = $3`,
        [auth.user.id, input.payoutReference ?? null, withdrawalId],
      );
    } else if (action === "reject") {
      if (!["requested", "under_review"].includes(withdrawal.status)) {
        throw new AppError(
          409,
          "WITHDRAWAL_STATE_INVALID",
          "Only a pending withdrawal can be rejected.",
        );
      }
      await transitionWalletTransaction(client, {
        transactionId: withdrawal.wallet_transaction_id,
        toBucket: "withdrawable",
        actorType: "admin",
        actorId: auth.user.id,
        eventType: "withdrawal_rejected",
        reason: input.reason,
      });
      await client.query(
        `UPDATE withdrawals SET status = 'rejected', reviewed_by = $1,
          reviewed_at = NOW(), processed_at = NOW(), rejection_reason = $2
         WHERE id = $3`,
        [auth.user.id, input.reason, withdrawalId],
      );
    } else {
      if (!["approved", "processing"].includes(withdrawal.status)) {
        throw new AppError(
          409,
          "WITHDRAWAL_STATE_INVALID",
          "Only an approved withdrawal can be marked paid.",
        );
      }
      if (!input.payoutReference) {
        throw new AppError(
          400,
          "PAYOUT_REFERENCE_REQUIRED",
          "A payout reference is required.",
        );
      }
      await transitionWalletTransaction(client, {
        transactionId: withdrawal.wallet_transaction_id,
        toBucket: "paid",
        actorType: "admin",
        actorId: auth.user.id,
        eventType: "withdrawal_paid",
        reason: input.reason,
        evidenceReference: input.payoutReference,
      });
      await client.query(
        `UPDATE withdrawals SET status = 'paid', reviewed_by = COALESCE(reviewed_by, $1),
          reviewed_at = COALESCE(reviewed_at, NOW()), processed_at = NOW(), payout_reference = $2
         WHERE id = $3`,
        [auth.user.id, input.payoutReference, withdrawalId],
      );
    }
    await writeAudit(client, {
      actorType: "admin",
      actorId: auth.user.id,
      action: `admin.withdrawal.${action}`,
      targetType: "withdrawal",
      targetId: withdrawalId,
      reason: input.reason,
      outcome: "success",
      requestId: request.id,
      ipHash: hashIp(request.ip, app.config.ipHashSecret),
      metadata: { payoutReference: input.payoutReference ?? null },
    });
  }, "SERIALIZABLE");
}

export async function reconcileParticipation(
  app: FastifyInstance,
  request: FastifyRequest,
  participationId: string,
  action: "validate" | "reject",
  input: Readonly<{
    providerEventReference: string;
    reason: string;
    estimatedMaturityAt?: string;
  }>,
): Promise<void> {
  const auth = request.auth!;
  await app.db.transaction(async (client) => {
    const result = await client.query<{
      user_id: string;
      status: string;
      wallet_transaction_id: string | null;
    }>(
      `SELECT sp.user_id, sp.status, wt.id AS wallet_transaction_id
       FROM survey_participations sp
       LEFT JOIN wallet_transactions wt
         ON wt.reference_type = 'survey_participation' AND wt.reference_id = sp.id
       WHERE sp.id = $1 FOR UPDATE OF sp`,
      [participationId],
    );
    const participation = result.rows[0];
    if (!participation)
      throw new AppError(
        404,
        "PARTICIPATION_NOT_FOUND",
        "Survey participation not found.",
      );
    if (
      !participation.wallet_transaction_id ||
      !["pending", "validated"].includes(participation.status)
    ) {
      throw new AppError(
        409,
        "PARTICIPATION_STATE_INVALID",
        "Participation cannot be reconciled from its current state.",
      );
    }
    if (action === "validate") {
      if (participation.status !== "pending") {
        throw new AppError(
          409,
          "PARTICIPATION_STATE_INVALID",
          "Only a pending participation can be validated.",
        );
      }
      await transitionWalletTransaction(client, {
        transactionId: participation.wallet_transaction_id,
        toBucket: "validated",
        actorType: "admin",
        actorId: auth.user.id,
        eventType: "verified_reconciliation",
        reason: input.reason,
        evidenceReference: input.providerEventReference,
      });
      await client.query(
        `UPDATE survey_participations SET status = 'validated', provider_confirmed_at = NOW(),
          estimated_maturity_at = COALESCE($2, estimated_maturity_at)
         WHERE id = $1`,
        [participationId, input.estimatedMaturityAt ?? null],
      );
    } else {
      await transitionWalletTransaction(client, {
        transactionId: participation.wallet_transaction_id,
        toBucket: "rejected",
        actorType: "admin",
        actorId: auth.user.id,
        eventType: "verified_reconciliation_rejected",
        reason: input.reason,
        evidenceReference: input.providerEventReference,
      });
      await client.query(
        `UPDATE survey_participations SET status = 'rejected', rejected_at = NOW(), rejection_reason = $2
         WHERE id = $1`,
        [participationId, input.reason],
      );
    }
    await writeAudit(client, {
      actorType: "admin",
      actorId: auth.user.id,
      action: `admin.survey_participation.${action}`,
      targetType: "survey_participation",
      targetId: participationId,
      reason: input.reason,
      outcome: "success",
      requestId: request.id,
      ipHash: hashIp(request.ip, app.config.ipHashSecret),
      metadata: { providerEventReference: input.providerEventReference },
    });
  }, "SERIALIZABLE");
}

export async function advanceWalletSettlement(
  app: FastifyInstance,
  request: FastifyRequest,
  transactionId: string,
  action: "mark-mature" | "mark-withdrawable",
  input: Readonly<{ evidenceReference: string; reason: string }>,
): Promise<void> {
  const auth = request.auth!;
  const toBucket = action === "mark-mature" ? "mature" : "withdrawable";
  await app.db.transaction(async (client) => {
    const owner = await client.query<{ user_id: string }>(
      "SELECT user_id FROM wallet_transactions WHERE id = $1",
      [transactionId],
    );
    if (!owner.rows[0])
      throw new AppError(
        404,
        "WALLET_TRANSACTION_NOT_FOUND",
        "Wallet transaction not found.",
      );
    await transitionWalletTransaction(client, {
      transactionId,
      toBucket,
      actorType: "admin",
      actorId: auth.user.id,
      eventType:
        action === "mark-mature"
          ? "verified_settlement"
          : "cleared_funds_confirmed",
      reason: input.reason,
      evidenceReference: input.evidenceReference,
    });
    await writeAudit(client, {
      actorType: "admin",
      actorId: auth.user.id,
      action: `admin.wallet.${action}`,
      targetType: "wallet_transaction",
      targetId: transactionId,
      reason: input.reason,
      outcome: "success",
      requestId: request.id,
      ipHash: hashIp(request.ip, app.config.ipHashSecret),
      metadata: {
        evidenceReference: input.evidenceReference,
        userId: owner.rows[0].user_id,
      },
    });
  }, "SERIALIZABLE");
}
