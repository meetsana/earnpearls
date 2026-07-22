import {
  AdminProviderSchema,
  AdminProviderUpdateBodySchema,
  AdminRoleAssignmentBodySchema,
  AdminRoleSchema,
  AdminSettingSchema,
  AdminSettingUpdateBodySchema,
  AdminUserDetailSchema,
  AdminWithdrawalMethodSchema,
  AdminWithdrawalMethodWriteBodySchema,
  BackgroundJobSchema,
  CountryAvailabilitySchema,
  CountryAvailabilityUpdateBodySchema,
  MessageSchema,
  UuidSchema,
} from "@earnpearls/contracts";
import { Type } from "@sinclair/typebox";
import type { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";

import {
  assignRole,
  exportUsersCsv,
  forceLogoutUser,
  getAdminUserDetail,
  listCountries,
  listJobs,
  listProviders,
  listRoles,
  listSettings,
  listAdminWithdrawalMethods,
  retryJob,
  revokeRole,
  sendAdminPasswordReset,
  saveAdminWithdrawalMethod,
  setUserDeletedState,
  updateCountry,
  updateProvider,
  updateSetting,
} from "./platform-service.js";

export const adminPlatformRoutes: FastifyPluginAsyncTypebox = async (app) => {
  const reasonBody = Type.Object({
    reason: Type.String({ minLength: 3, maxLength: 1000 }),
  });

  app.get(
    "/users/export.csv",
    {
      preHandler: [app.authenticate, app.authorize("admin.users.read")],
      schema: { tags: ["Admin"], security: [{ cookieAuth: [] }] },
    },
    async (_request, reply) =>
      reply
        .header("Content-Type", "text/csv; charset=utf-8")
        .header(
          "Content-Disposition",
          'attachment; filename="earnpearls-users.csv"',
        )
        .send(await exportUsersCsv(app)),
  );

  app.get(
    "/users/:userId",
    {
      preHandler: [app.authenticate, app.authorize("admin.users.read")],
      schema: {
        tags: ["Admin"],
        security: [{ cookieAuth: [] }],
        params: Type.Object({ userId: UuidSchema }),
        response: { 200: AdminUserDetailSchema },
      },
    },
    async (request) => getAdminUserDetail(app, request.params.userId),
  );

  app.post(
    "/users/:userId/force-logout",
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
        body: reasonBody,
        response: { 200: MessageSchema },
      },
    },
    async (request) => {
      await forceLogoutUser(
        app,
        request,
        request.params.userId,
        request.body.reason,
      );
      return { message: "Active sessions revoked." };
    },
  );

  app.post(
    "/users/:userId/password-reset",
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
        body: reasonBody,
        response: { 202: MessageSchema },
      },
    },
    async (request, reply) => {
      await sendAdminPasswordReset(
        app,
        request,
        request.params.userId,
        request.body.reason,
      );
      return reply.code(202).send({ message: "Password reset email queued." });
    },
  );

  app.post(
    "/users/:userId/archive",
    {
      preHandler: [
        app.authenticate,
        app.verifyCsrf,
        app.authorize("admin.roles.manage"),
      ],
      schema: {
        tags: ["Admin"],
        security: [{ cookieAuth: [], csrfToken: [] }],
        params: Type.Object({ userId: UuidSchema }),
        body: reasonBody,
        response: { 200: MessageSchema },
      },
    },
    async (request) => {
      await setUserDeletedState(
        app,
        request,
        request.params.userId,
        true,
        request.body.reason,
      );
      return { message: "Account archived." };
    },
  );

  app.post(
    "/users/:userId/restore",
    {
      preHandler: [
        app.authenticate,
        app.verifyCsrf,
        app.authorize("admin.roles.manage"),
      ],
      schema: {
        tags: ["Admin"],
        security: [{ cookieAuth: [], csrfToken: [] }],
        params: Type.Object({ userId: UuidSchema }),
        body: reasonBody,
        response: { 200: MessageSchema },
      },
    },
    async (request) => {
      await setUserDeletedState(
        app,
        request,
        request.params.userId,
        false,
        request.body.reason,
      );
      return { message: "Account restored." };
    },
  );

  app.get(
    "/settings",
    {
      preHandler: [app.authenticate, app.authorize("admin.settings.read")],
      schema: {
        tags: ["Admin"],
        security: [{ cookieAuth: [] }],
        response: { 200: Type.Array(AdminSettingSchema) },
      },
    },
    async () => listSettings(app),
  );

  app.put(
    "/settings/:key",
    {
      preHandler: [
        app.authenticate,
        app.verifyCsrf,
        app.authorize("admin.settings.manage"),
      ],
      schema: {
        tags: ["Admin"],
        security: [{ cookieAuth: [], csrfToken: [] }],
        params: Type.Object({
          key: Type.String({ minLength: 1, maxLength: 120 }),
        }),
        body: AdminSettingUpdateBodySchema,
        response: { 200: AdminSettingSchema },
      },
    },
    async (request) =>
      updateSetting(app, request, request.params.key, request.body),
  );

  app.get(
    "/countries",
    {
      preHandler: [app.authenticate, app.authorize("admin.settings.read")],
      schema: {
        tags: ["Admin"],
        security: [{ cookieAuth: [] }],
        response: { 200: Type.Array(CountryAvailabilitySchema) },
      },
    },
    async () => listCountries(app),
  );

  app.put(
    "/countries/:countryCode",
    {
      preHandler: [
        app.authenticate,
        app.verifyCsrf,
        app.authorize("admin.countries.manage"),
      ],
      schema: {
        tags: ["Admin"],
        security: [{ cookieAuth: [], csrfToken: [] }],
        params: Type.Object({
          countryCode: Type.String({
            minLength: 2,
            maxLength: 2,
            pattern: "^[A-Z]{2}$",
          }),
        }),
        body: CountryAvailabilityUpdateBodySchema,
        response: { 200: CountryAvailabilitySchema },
      },
    },
    async (request) =>
      updateCountry(app, request, request.params.countryCode, request.body),
  );

  app.get(
    "/providers",
    {
      preHandler: [app.authenticate, app.authorize("admin.providers.read")],
      schema: {
        tags: ["Admin"],
        security: [{ cookieAuth: [] }],
        response: { 200: Type.Array(AdminProviderSchema) },
      },
    },
    async () => listProviders(app),
  );

  app.put(
    "/providers/:providerId",
    {
      preHandler: [
        app.authenticate,
        app.verifyCsrf,
        app.authorize("admin.providers.manage"),
      ],
      schema: {
        tags: ["Admin"],
        security: [{ cookieAuth: [], csrfToken: [] }],
        params: Type.Object({ providerId: UuidSchema }),
        body: AdminProviderUpdateBodySchema,
        response: { 200: AdminProviderSchema },
      },
    },
    async (request) =>
      updateProvider(app, request, request.params.providerId, request.body),
  );

  app.get(
    "/withdrawal-methods",
    {
      preHandler: [
        app.authenticate,
        app.authorize("admin.withdrawal_methods.manage"),
      ],
      schema: {
        tags: ["Admin"],
        security: [{ cookieAuth: [] }],
        response: { 200: Type.Array(AdminWithdrawalMethodSchema) },
      },
    },
    async () => listAdminWithdrawalMethods(app),
  );

  app.post(
    "/withdrawal-methods",
    {
      preHandler: [
        app.authenticate,
        app.verifyCsrf,
        app.authorize("admin.withdrawal_methods.manage"),
      ],
      schema: {
        tags: ["Admin"],
        security: [{ cookieAuth: [], csrfToken: [] }],
        body: AdminWithdrawalMethodWriteBodySchema,
        response: { 201: AdminWithdrawalMethodSchema },
      },
    },
    async (request, reply) =>
      reply
        .code(201)
        .send(
          await saveAdminWithdrawalMethod(
            app,
            request,
            undefined,
            request.body,
          ),
        ),
  );

  app.put(
    "/withdrawal-methods/:code",
    {
      preHandler: [
        app.authenticate,
        app.verifyCsrf,
        app.authorize("admin.withdrawal_methods.manage"),
      ],
      schema: {
        tags: ["Admin"],
        security: [{ cookieAuth: [], csrfToken: [] }],
        params: Type.Object({
          code: Type.String({ pattern: "^[a-z][a-z0-9_]{2,63}$" }),
        }),
        body: AdminWithdrawalMethodWriteBodySchema,
        response: { 200: AdminWithdrawalMethodSchema },
      },
    },
    async (request) =>
      saveAdminWithdrawalMethod(
        app,
        request,
        request.params.code,
        request.body,
      ),
  );

  app.get(
    "/roles",
    {
      preHandler: [app.authenticate, app.authorize("admin.roles.read")],
      schema: {
        tags: ["Admin"],
        security: [{ cookieAuth: [] }],
        response: { 200: Type.Array(AdminRoleSchema) },
      },
    },
    async () => listRoles(app),
  );

  app.post(
    "/users/:userId/roles",
    {
      preHandler: [
        app.authenticate,
        app.verifyCsrf,
        app.authorize("admin.roles.manage"),
      ],
      schema: {
        tags: ["Admin"],
        security: [{ cookieAuth: [], csrfToken: [] }],
        params: Type.Object({ userId: UuidSchema }),
        body: AdminRoleAssignmentBodySchema,
        response: { 200: MessageSchema },
      },
    },
    async (request) => {
      await assignRole(app, request, request.params.userId, request.body);
      return { message: "Role assigned." };
    },
  );

  app.delete(
    "/users/:userId/roles/:roleCode",
    {
      preHandler: [
        app.authenticate,
        app.verifyCsrf,
        app.authorize("admin.roles.manage"),
      ],
      schema: {
        tags: ["Admin"],
        security: [{ cookieAuth: [], csrfToken: [] }],
        params: Type.Object({
          userId: UuidSchema,
          roleCode: Type.String({ minLength: 1, maxLength: 100 }),
        }),
        body: Type.Object({
          reason: Type.String({ minLength: 3, maxLength: 1000 }),
        }),
        response: { 200: MessageSchema },
      },
    },
    async (request) => {
      await revokeRole(
        app,
        request,
        request.params.userId,
        request.params.roleCode,
        request.body.reason,
      );
      return { message: "Role revoked." };
    },
  );

  app.get(
    "/jobs",
    {
      preHandler: [app.authenticate, app.authorize("admin.jobs.read")],
      schema: {
        tags: ["Admin"],
        security: [{ cookieAuth: [] }],
        querystring: Type.Object({
          limit: Type.Optional(
            Type.Integer({ minimum: 1, maximum: 200, default: 50 }),
          ),
        }),
        response: { 200: Type.Array(BackgroundJobSchema) },
      },
    },
    async (request) => listJobs(app, request.query.limit ?? 50),
  );

  app.post(
    "/jobs/:jobId/retry",
    {
      preHandler: [
        app.authenticate,
        app.verifyCsrf,
        app.authorize("admin.jobs.manage"),
      ],
      schema: {
        tags: ["Admin"],
        security: [{ cookieAuth: [], csrfToken: [] }],
        params: Type.Object({ jobId: UuidSchema }),
        body: Type.Object({
          reason: Type.String({ minLength: 3, maxLength: 1000 }),
        }),
        response: { 200: MessageSchema },
      },
    },
    async (request) => {
      await retryJob(app, request, request.params.jobId, request.body.reason);
      return { message: "Job queued for retry." };
    },
  );
};
