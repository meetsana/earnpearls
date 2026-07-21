import {
  AdminAccountStateBodySchema,
  AdminDashboardSchema,
  AdminParticipationDecisionBodySchema,
  AdminWithdrawalDecisionBodySchema,
  MessageSchema,
  UuidSchema,
} from "@earnpearls/contracts";
import { Type } from "@sinclair/typebox";
import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";

import { AppError } from "../../lib/errors.js";
import {
  advanceWalletSettlement,
  changeAccountState,
  createLimitTemplate,
  decideWithdrawal,
  getAdminDashboard,
  listLimitTemplates,
  reconcileParticipation,
  updateLimitTemplate,
} from "./service.js";

const AdminUserSchema = Type.Object({
  id: UuidSchema,
  email: Type.String({ format: "email" }),
  displayName: Type.String(),
  countryCode: Type.String(),
  accountStatus: Type.String(),
  emailVerified: Type.Boolean(),
  limitTemplateId: Type.Union([UuidSchema, Type.Null()]),
  createdAt: Type.String({ format: "date-time" }),
});

const AdminWithdrawalSchema = Type.Object({
  id: UuidSchema,
  userId: UuidSchema,
  userEmail: Type.String({ format: "email" }),
  methodCode: Type.String(),
  points: Type.String(),
  status: Type.String(),
  destinationMasked: Type.String(),
  requestedAt: Type.String({ format: "date-time" }),
});

const AuditLogSchema = Type.Object({
  id: UuidSchema,
  actorType: Type.String(),
  actorId: Type.Union([UuidSchema, Type.Null()]),
  action: Type.String(),
  targetType: Type.String(),
  targetId: Type.String(),
  reason: Type.Union([Type.String(), Type.Null()]),
  outcome: Type.String(),
  createdAt: Type.String({ format: "date-time" }),
});

const LimitTemplateSchema = Type.Object({
  id: UuidSchema,
  code: Type.String(),
  name: Type.String(),
  description: Type.String(),
  active: Type.Boolean(),
  deniedPermissions: Type.Array(Type.String()),
  createdAt: Type.String({ format: "date-time" }),
  updatedAt: Type.String({ format: "date-time" }),
});

const LimitTemplateCreateSchema = Type.Object({
  code: Type.String({ pattern: "^[a-z][a-z0-9_]{2,63}$" }),
  name: Type.String({ minLength: 3, maxLength: 100 }),
  description: Type.Optional(Type.String({ maxLength: 1000, default: "" })),
  active: Type.Optional(Type.Boolean({ default: true })),
  deniedPermissions: Type.Array(Type.String({ minLength: 3, maxLength: 100 }), {
    maxItems: 100,
    uniqueItems: true,
  }),
});

const LimitTemplateUpdateSchema = Type.Object({
  name: Type.String({ minLength: 3, maxLength: 100 }),
  description: Type.String({ maxLength: 1000 }),
  active: Type.Boolean(),
  deniedPermissions: Type.Array(Type.String({ minLength: 3, maxLength: 100 }), {
    maxItems: 100,
    uniqueItems: true,
  }),
});

const WalletSettlementBodySchema = Type.Object({
  evidenceReference: Type.String({ minLength: 3, maxLength: 500 }),
  reason: Type.String({ minLength: 3, maxLength: 1000 }),
});

export const adminRoutes: FastifyPluginAsyncTypebox = async (app) => {
  app.get(
    "/dashboard",
    {
      preHandler: [app.authenticate, app.authorize("admin.dashboard.read")],
      schema: {
        tags: ["Admin"],
        security: [{ cookieAuth: [] }],
        response: { 200: AdminDashboardSchema },
      },
    },
    async () => getAdminDashboard(app),
  );

  app.get(
    "/users",
    {
      preHandler: [app.authenticate, app.authorize("admin.users.read")],
      schema: {
        tags: ["Admin"],
        security: [{ cookieAuth: [] }],
        querystring: Type.Object({
          search: Type.Optional(Type.String({ maxLength: 200 })),
          status: Type.Optional(Type.String({ maxLength: 40 })),
          limit: Type.Optional(
            Type.Integer({ minimum: 1, maximum: 100, default: 50 }),
          ),
        }),
        response: { 200: Type.Array(AdminUserSchema) },
      },
    },
    async (request) => {
      const search = request.query.search?.trim() ?? "";
      const result = await app.db.query<{
        id: string;
        email: string;
        display_name: string;
        country_code: string;
        account_status_code: string;
        email_verified_at: Date | null;
        limit_template_id: string | null;
        created_at: Date;
      }>(
        `SELECT id, email, display_name, country_code, account_status_code,
          email_verified_at, limit_template_id, created_at
         FROM users
         WHERE ($1 = '' OR email ILIKE '%' || $1 || '%' OR display_name ILIKE '%' || $1 || '%')
           AND ($2::TEXT IS NULL OR account_status_code = $2)
         ORDER BY created_at DESC LIMIT $3`,
        [search, request.query.status ?? null, request.query.limit ?? 50],
      );
      return result.rows.map((row) => ({
        id: row.id,
        email: row.email,
        displayName: row.display_name,
        countryCode: row.country_code,
        accountStatus: row.account_status_code,
        emailVerified: Boolean(row.email_verified_at),
        limitTemplateId: row.limit_template_id,
        createdAt: row.created_at.toISOString(),
      }));
    },
  );

  app.patch(
    "/users/:userId/account-state",
    {
      preHandler: [
        app.authenticate,
        app.verifyCsrf,
        app.authorize("admin.users.moderate"),
      ],
      schema: {
        tags: ["Admin"],
        security: [{ cookieAuth: [], csrfToken: [] }],
        params: Type.Object({ userId: UuidSchema }),
        body: AdminAccountStateBodySchema,
        response: { 200: MessageSchema },
      },
    },
    async (request) => {
      await changeAccountState(
        app,
        request,
        request.params.userId,
        request.body,
      );
      return { message: "Account state updated." };
    },
  );

  app.get(
    "/limit-templates",
    {
      preHandler: [
        app.authenticate,
        app.authorize("admin.limit_templates.read"),
      ],
      schema: {
        tags: ["Admin"],
        security: [{ cookieAuth: [] }],
        response: { 200: Type.Array(LimitTemplateSchema) },
      },
    },
    async () => listLimitTemplates(app),
  );

  app.post(
    "/limit-templates",
    {
      preHandler: [
        app.authenticate,
        app.verifyCsrf,
        app.authorize("admin.limit_templates.manage"),
      ],
      schema: {
        tags: ["Admin"],
        security: [{ cookieAuth: [], csrfToken: [] }],
        body: LimitTemplateCreateSchema,
        response: { 201: LimitTemplateSchema },
      },
    },
    async (request, reply) => {
      const created = await createLimitTemplate(app, request, {
        code: request.body.code,
        name: request.body.name,
        description: request.body.description ?? "",
        active: request.body.active ?? true,
        deniedPermissions: request.body.deniedPermissions,
      });
      return reply.code(201).send(created);
    },
  );

  app.put(
    "/limit-templates/:templateId",
    {
      preHandler: [
        app.authenticate,
        app.verifyCsrf,
        app.authorize("admin.limit_templates.manage"),
      ],
      schema: {
        tags: ["Admin"],
        security: [{ cookieAuth: [], csrfToken: [] }],
        params: Type.Object({ templateId: UuidSchema }),
        body: LimitTemplateUpdateSchema,
        response: { 200: LimitTemplateSchema },
      },
    },
    async (request) =>
      updateLimitTemplate(
        app,
        request,
        request.params.templateId,
        request.body,
      ),
  );

  app.post(
    "/limit-templates/:templateId/clone",
    {
      preHandler: [
        app.authenticate,
        app.verifyCsrf,
        app.authorize("admin.limit_templates.manage"),
      ],
      schema: {
        tags: ["Admin"],
        security: [{ cookieAuth: [], csrfToken: [] }],
        params: Type.Object({ templateId: UuidSchema }),
        body: Type.Object({
          code: Type.String({ pattern: "^[a-z][a-z0-9_]{2,63}$" }),
          name: Type.String({ minLength: 3, maxLength: 100 }),
        }),
        response: { 201: LimitTemplateSchema },
      },
    },
    async (request, reply) => {
      const source = (await listLimitTemplates(app)).find(
        (template) => template.id === request.params.templateId,
      );
      if (!source)
        throw new AppError(
          404,
          "LIMIT_TEMPLATE_NOT_FOUND",
          "Limit template not found.",
        );
      const cloned = await createLimitTemplate(app, request, {
        code: request.body.code,
        name: request.body.name,
        description: source.description,
        active: source.active,
        deniedPermissions: source.deniedPermissions,
        sourceTemplateId: source.id,
      });
      return reply.code(201).send(cloned);
    },
  );

  app.get(
    "/withdrawals",
    {
      preHandler: [app.authenticate, app.authorize("admin.withdrawals.read")],
      schema: {
        tags: ["Admin"],
        security: [{ cookieAuth: [] }],
        querystring: Type.Object({
          status: Type.Optional(Type.String({ maxLength: 40 })),
          limit: Type.Optional(
            Type.Integer({ minimum: 1, maximum: 100, default: 50 }),
          ),
        }),
        response: { 200: Type.Array(AdminWithdrawalSchema) },
      },
    },
    async (request) => {
      const result = await app.db.query<{
        id: string;
        user_id: string;
        email: string;
        method_code: string;
        amount_points: string;
        status: string;
        destination_masked: string;
        requested_at: Date;
      }>(
        `SELECT w.id, w.user_id, u.email, w.method_code, w.amount_points::TEXT,
          w.status, w.destination_masked, w.requested_at
         FROM withdrawals w JOIN users u ON u.id = w.user_id
         WHERE ($1::TEXT IS NULL OR w.status = $1)
         ORDER BY w.requested_at ASC LIMIT $2`,
        [request.query.status ?? null, request.query.limit ?? 50],
      );
      return result.rows.map((row) => ({
        id: row.id,
        userId: row.user_id,
        userEmail: row.email,
        methodCode: row.method_code,
        points: row.amount_points,
        status: row.status,
        destinationMasked: row.destination_masked,
        requestedAt: row.requested_at.toISOString(),
      }));
    },
  );

  for (const action of ["approve", "reject", "mark-paid"] as const) {
    app.post(
      `/withdrawals/:withdrawalId/${action}`,
      {
        preHandler: [
          app.authenticate,
          app.verifyCsrf,
          app.authorize("admin.withdrawals.review"),
        ],
        schema: {
          tags: ["Admin"],
          security: [{ cookieAuth: [], csrfToken: [] }],
          params: Type.Object({ withdrawalId: UuidSchema }),
          body: AdminWithdrawalDecisionBodySchema,
          response: { 200: MessageSchema },
        },
      },
      async (request) => {
        await decideWithdrawal(
          app,
          request,
          request.params.withdrawalId,
          action,
          request.body,
        );
        return { message: `Withdrawal action ${action} completed.` };
      },
    );
  }

  for (const action of ["validate", "reject"] as const) {
    app.post(
      `/participations/:participationId/${action}`,
      {
        preHandler: [
          app.authenticate,
          app.verifyCsrf,
          app.authorize("admin.surveys.reconcile"),
        ],
        schema: {
          tags: ["Admin"],
          security: [{ cookieAuth: [], csrfToken: [] }],
          params: Type.Object({ participationId: UuidSchema }),
          body: AdminParticipationDecisionBodySchema,
          response: { 200: MessageSchema },
        },
      },
      async (request) => {
        await reconcileParticipation(
          app,
          request,
          request.params.participationId,
          action,
          request.body,
        );
        return { message: `Participation ${action} completed.` };
      },
    );
  }

  for (const action of ["mark-mature", "mark-withdrawable"] as const) {
    app.post(
      `/wallet-transactions/:transactionId/${action}`,
      {
        preHandler: [
          app.authenticate,
          app.verifyCsrf,
          app.authorize("admin.wallet.settle"),
        ],
        schema: {
          tags: ["Admin"],
          security: [{ cookieAuth: [], csrfToken: [] }],
          params: Type.Object({ transactionId: UuidSchema }),
          body: WalletSettlementBodySchema,
          response: { 200: MessageSchema },
        },
      },
      async (request) => {
        await advanceWalletSettlement(
          app,
          request,
          request.params.transactionId,
          action,
          request.body,
        );
        return { message: `Wallet settlement action ${action} completed.` };
      },
    );
  }

  app.get(
    "/audit-logs",
    {
      preHandler: [app.authenticate, app.authorize("admin.audit.read")],
      schema: {
        tags: ["Admin"],
        security: [{ cookieAuth: [] }],
        querystring: Type.Object({
          action: Type.Optional(Type.String({ maxLength: 100 })),
          limit: Type.Optional(
            Type.Integer({ minimum: 1, maximum: 200, default: 100 }),
          ),
        }),
        response: { 200: Type.Array(AuditLogSchema) },
      },
    },
    async (request) => {
      const result = await app.db.query<{
        id: string;
        actor_type: string;
        actor_id: string | null;
        action: string;
        target_type: string;
        target_id: string;
        reason: string | null;
        outcome: string;
        created_at: Date;
      }>(
        `SELECT id, actor_type, actor_id, action, target_type, target_id,
          reason, outcome, created_at
         FROM audit_logs
         WHERE ($1::TEXT IS NULL OR action = $1)
         ORDER BY created_at DESC LIMIT $2`,
        [request.query.action ?? null, request.query.limit ?? 100],
      );
      return result.rows.map((row) => ({
        id: row.id,
        actorType: row.actor_type,
        actorId: row.actor_id,
        action: row.action,
        targetType: row.target_type,
        targetId: row.target_id,
        reason: row.reason,
        outcome: row.outcome,
        createdAt: row.created_at.toISOString(),
      }));
    },
  );
};
