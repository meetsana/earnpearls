import { request } from "./client";
import type {
  AdminAccountStateBody,
  AdminDashboard,
  AdminParticipationDecisionBody,
  AdminUser,
  AdminWithdrawal,
  AdminWithdrawalDecisionBody,
  AuditLog,
  CursorPage,
  Dashboard,
  LimitTemplate,
  LimitTemplateCreateBody,
  LimitTemplateUpdateBody,
  LoginBody,
  LoginResponse,
  MessageResponse,
  PasswordResetConfirmBody,
  PasswordResetRequestBody,
  RegisterBody,
  SessionDevice,
  SessionResponse,
  Survey,
  SurveyStartResponse,
  VerifyEmailBody,
  WalletSettlementBody,
  WalletSummary,
  WalletTransaction,
  Withdrawal,
  WithdrawalCreateBody,
  WithdrawalMethod,
} from "./types";

function queryString(
  values: Record<string, string | number | undefined>,
): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) {
    if (value !== undefined && value !== "") params.set(key, String(value));
  }
  const query = params.toString();
  return query === "" ? "" : `?${query}`;
}

export const api = {
  auth: {
    register: (body: RegisterBody) =>
      request<MessageResponse>("/auth/register", { method: "POST", body }),
    login: (body: LoginBody) =>
      request<LoginResponse>("/auth/login", { method: "POST", body }),
    verifyEmail: (body: VerifyEmailBody) =>
      request<MessageResponse>("/auth/verify-email", { method: "POST", body }),
    requestPasswordReset: (body: PasswordResetRequestBody) =>
      request<MessageResponse>("/auth/password-reset/request", {
        method: "POST",
        body,
      }),
    confirmPasswordReset: (body: PasswordResetConfirmBody) =>
      request<MessageResponse>("/auth/password-reset/confirm", {
        method: "POST",
        body,
      }),
    session: () => request<SessionResponse>("/auth/session"),
    sessions: () => request<SessionDevice[]>("/auth/sessions"),
    revokeSession: (sessionId: string) =>
      request<MessageResponse>(
        `/auth/sessions/${encodeURIComponent(sessionId)}`,
        {
          method: "DELETE",
        },
      ),
    logout: () => request<MessageResponse>("/auth/logout", { method: "POST" }),
    logoutAll: () =>
      request<MessageResponse>("/auth/logout-all", { method: "POST" }),
  },
  dashboard: () => request<Dashboard>("/dashboard/"),
  wallet: {
    summary: () => request<WalletSummary>("/wallet/"),
    transactions: (options: { cursor?: string; limit?: number } = {}) =>
      request<CursorPage<WalletTransaction>>(
        `/wallet/transactions${queryString(options)}`,
      ),
  },
  surveys: {
    list: () => request<Survey[]>("/surveys/"),
    start: (surveyId: string) =>
      request<SurveyStartResponse>(
        `/surveys/${encodeURIComponent(surveyId)}/start`,
        {
          method: "POST",
        },
      ),
  },
  withdrawals: {
    methods: () => request<WithdrawalMethod[]>("/withdrawals/methods"),
    list: () => request<Withdrawal[]>("/withdrawals/"),
    create: (body: WithdrawalCreateBody, idempotencyKey: string) =>
      request<Withdrawal>("/withdrawals/", {
        method: "POST",
        body,
        idempotencyKey,
      }),
  },
  admin: {
    dashboard: () => request<AdminDashboard>("/admin/dashboard"),
    users: (
      options: { search?: string; status?: string; limit?: number } = {},
    ) => request<AdminUser[]>(`/admin/users${queryString(options)}`),
    updateAccountState: (userId: string, body: AdminAccountStateBody) =>
      request<MessageResponse>(
        `/admin/users/${encodeURIComponent(userId)}/account-state`,
        {
          method: "PATCH",
          body,
        },
      ),
    limitTemplates: () => request<LimitTemplate[]>("/admin/limit-templates"),
    createLimitTemplate: (body: LimitTemplateCreateBody) =>
      request<LimitTemplate>("/admin/limit-templates", {
        method: "POST",
        body,
      }),
    updateLimitTemplate: (templateId: string, body: LimitTemplateUpdateBody) =>
      request<LimitTemplate>(
        `/admin/limit-templates/${encodeURIComponent(templateId)}`,
        {
          method: "PUT",
          body,
        },
      ),
    cloneLimitTemplate: (
      templateId: string,
      body: { code: string; name: string },
    ) =>
      request<LimitTemplate>(
        `/admin/limit-templates/${encodeURIComponent(templateId)}/clone`,
        { method: "POST", body },
      ),
    withdrawals: (options: { status?: string; limit?: number } = {}) =>
      request<AdminWithdrawal[]>(`/admin/withdrawals${queryString(options)}`),
    decideWithdrawal: (
      withdrawalId: string,
      action: "approve" | "reject" | "mark-paid",
      body: AdminWithdrawalDecisionBody,
    ) =>
      request<MessageResponse>(
        `/admin/withdrawals/${encodeURIComponent(withdrawalId)}/${action}`,
        { method: "POST", body },
      ),
    reconcileParticipation: (
      participationId: string,
      action: "validate" | "reject",
      body: AdminParticipationDecisionBody,
    ) =>
      request<MessageResponse>(
        `/admin/participations/${encodeURIComponent(participationId)}/${action}`,
        { method: "POST", body },
      ),
    settleWalletTransaction: (
      transactionId: string,
      action: "mark-mature" | "mark-withdrawable",
      body: WalletSettlementBody,
    ) =>
      request<MessageResponse>(
        `/admin/wallet-transactions/${encodeURIComponent(transactionId)}/${action}`,
        { method: "POST", body },
      ),
    auditLogs: (options: { action?: string; limit?: number } = {}) =>
      request<AuditLog[]>(`/admin/audit-logs${queryString(options)}`),
  },
} as const;
