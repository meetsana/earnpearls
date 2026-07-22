import { request } from "./client";
import type {
  AdminAccountStateBody,
  AdminAnalytics,
  AdminAnnouncement,
  AdminDashboard,
  AdminEmailTemplate,
  AdminCmsPage,
  AdminBlogCategory,
  AdminBlogPost,
  AdminFaq,
  AdminLeaderboardDefinition,
  AdminLeaderboardExclusion,
  AdminProvider,
  AdminRole,
  AdminSetting,
  AdminSupportTicket,
  AdminParticipationDecisionBody,
  AdminUser,
  AdminUserDetail,
  AdminWithdrawal,
  AdminWithdrawalDecisionBody,
  AdminWithdrawalMethod,
  AdminWithdrawalMethodWriteBody,
  AuditLog,
  BackgroundJob,
  BlogPost,
  BlogPostSummary,
  CmsPage,
  CountryAvailability,
  CursorPage,
  Dashboard,
  Faq,
  Leaderboard,
  LeaderboardDefinition,
  LeaderboardHistory,
  LimitTemplate,
  LimitTemplateCreateBody,
  LimitTemplateUpdateBody,
  LoginBody,
  LoginResponse,
  MessageResponse,
  Notification,
  NotificationPreferences,
  NotificationStatus,
  PasswordResetConfirmBody,
  PasswordResetRequestBody,
  RegisterBody,
  PublicCountry,
  PublicSettings,
  ProviderSyncRun,
  SessionDevice,
  SessionResponse,
  SecurityEvent,
  Survey,
  SurveyParticipation,
  SupportCategory,
  SupportTicket,
  SupportTicketPriority,
  SupportTicketStatus,
  SurveyStartResponse,
  VerifyEmailBody,
  UserActivity,
  UserProfile,
  UserProfileUpdateBody,
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
  content: {
    settings: () => request<PublicSettings>("/content/settings"),
    countries: () => request<PublicCountry[]>("/content/countries"),
    page: (slug: string) =>
      request<CmsPage>(`/content/pages/${encodeURIComponent(slug)}`),
    blog: (
      options: { category?: string; search?: string; limit?: number } = {},
    ) => request<BlogPostSummary[]>(`/content/blog${queryString(options)}`),
    blogPost: (slug: string) =>
      request<BlogPost>(`/content/blog/${encodeURIComponent(slug)}`),
    faqs: (category?: string) =>
      request<Faq[]>(
        `/content/faqs${queryString({ category: category || undefined })}`,
      ),
  },
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
  users: {
    profile: () => request<UserProfile>("/users/me"),
    updateProfile: (body: UserProfileUpdateBody) =>
      request<UserProfile>("/users/me", { method: "PATCH", body }),
    preferences: () =>
      request<NotificationPreferences>("/users/me/preferences"),
    updatePreferences: (body: NotificationPreferences) =>
      request<NotificationPreferences>("/users/me/preferences", {
        method: "PUT",
        body,
      }),
    changePassword: (body: { currentPassword: string; newPassword: string }) =>
      request<MessageResponse>("/users/me/change-password", {
        method: "POST",
        body,
      }),
    activity: (limit = 25) =>
      request<UserActivity[]>(`/users/me/activity${queryString({ limit })}`),
  },
  notifications: {
    list: (
      options: {
        status?: NotificationStatus;
        cursor?: string;
        limit?: number;
      } = {},
    ) =>
      request<CursorPage<Notification>>(
        `/notifications/${queryString(options)}`,
      ),
    unreadCount: () =>
      request<{ unread: number }>("/notifications/unread-count"),
    setStatus: (
      notificationId: string,
      status: Exclude<NotificationStatus, "unread">,
    ) =>
      request<Notification>(
        `/notifications/${encodeURIComponent(notificationId)}`,
        { method: "PATCH", body: { status } },
      ),
    markAllRead: () =>
      request<MessageResponse>("/notifications/mark-all-read", {
        method: "POST",
      }),
  },
  leaderboards: {
    list: () => request<LeaderboardDefinition[]>("/leaderboards/"),
    get: (code: string) =>
      request<Leaderboard>(`/leaderboards/${encodeURIComponent(code)}`),
    history: (code: string, limit = 12) =>
      request<LeaderboardHistory>(
        `/leaderboards/${encodeURIComponent(code)}/history${queryString({ limit })}`,
      ),
  },
  support: {
    categories: () => request<SupportCategory[]>("/support/categories"),
    tickets: () => request<SupportTicket[]>("/support/tickets"),
    ticket: (ticketId: string) =>
      request<SupportTicket>(
        `/support/tickets/${encodeURIComponent(ticketId)}`,
      ),
    create: (body: {
      categoryCode: string;
      subject: string;
      message: string;
      priority?: SupportTicketPriority;
    }) => request<SupportTicket>("/support/tickets", { method: "POST", body }),
    reply: (ticketId: string, message: string) =>
      request<SupportTicket>(
        `/support/tickets/${encodeURIComponent(ticketId)}/replies`,
        { method: "POST", body: { message } },
      ),
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
    list: (
      options: {
        category?: string;
        difficulty?: string;
        device?: string;
        sort?: "reward_desc" | "time_asc" | "newest";
      } = {},
    ) => request<Survey[]>(`/surveys/${queryString(options)}`),
    get: (surveyId: string) =>
      request<Survey>(`/surveys/${encodeURIComponent(surveyId)}`),
    history: (limit = 50) =>
      request<SurveyParticipation[]>(
        `/surveys/history${queryString({ limit })}`,
      ),
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
    user: (userId: string) =>
      request<AdminUserDetail>(`/admin/users/${encodeURIComponent(userId)}`),
    forceLogoutUser: (userId: string, reason: string) =>
      request<MessageResponse>(
        `/admin/users/${encodeURIComponent(userId)}/force-logout`,
        { method: "POST", body: { reason } },
      ),
    sendPasswordReset: (userId: string, reason: string) =>
      request<MessageResponse>(
        `/admin/users/${encodeURIComponent(userId)}/password-reset`,
        { method: "POST", body: { reason } },
      ),
    setArchived: (userId: string, archived: boolean, reason: string) =>
      request<MessageResponse>(
        `/admin/users/${encodeURIComponent(userId)}/${archived ? "archive" : "restore"}`,
        { method: "POST", body: { reason } },
      ),
    adjustWallet: (
      userId: string,
      body: {
        points: string;
        bucket: "pending" | "validated" | "mature" | "withdrawable";
        reason: string;
        evidenceReference: string;
        idempotencyKey: string;
      },
    ) =>
      request<MessageResponse>(
        `/admin/users/${encodeURIComponent(userId)}/wallet-adjustments`,
        { method: "POST", body },
      ),
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
    settings: () => request<AdminSetting[]>("/admin/settings"),
    updateSetting: (
      key: string,
      body: { value: unknown; public: boolean; reason: string },
    ) =>
      request<AdminSetting>(`/admin/settings/${encodeURIComponent(key)}`, {
        method: "PUT",
        body,
      }),
    countries: () => request<CountryAvailability[]>("/admin/countries"),
    updateCountry: (
      countryCode: string,
      body: {
        status: CountryAvailability["status"];
        reason: string;
      },
    ) =>
      request<CountryAvailability>(
        `/admin/countries/${encodeURIComponent(countryCode)}`,
        { method: "PUT", body },
      ),
    providers: () => request<AdminProvider[]>("/admin/providers"),
    updateProvider: (
      providerId: string,
      body: {
        displayName: string;
        enabled: boolean;
        userVisible: boolean;
        configuration: unknown;
        reason: string;
      },
    ) =>
      request<AdminProvider>(
        `/admin/providers/${encodeURIComponent(providerId)}`,
        { method: "PUT", body },
      ),
    withdrawalMethods: () =>
      request<AdminWithdrawalMethod[]>("/admin/withdrawal-methods"),
    createWithdrawalMethod: (body: AdminWithdrawalMethodWriteBody) =>
      request<AdminWithdrawalMethod>("/admin/withdrawal-methods", {
        method: "POST",
        body,
      }),
    updateWithdrawalMethod: (
      code: string,
      body: AdminWithdrawalMethodWriteBody,
    ) =>
      request<AdminWithdrawalMethod>(
        `/admin/withdrawal-methods/${encodeURIComponent(code)}`,
        { method: "PUT", body },
      ),
    roles: () => request<AdminRole[]>("/admin/roles"),
    assignRole: (userId: string, roleCode: string, reason: string) =>
      request<MessageResponse>(
        `/admin/users/${encodeURIComponent(userId)}/roles`,
        { method: "POST", body: { roleCode, reason } },
      ),
    revokeRole: (userId: string, roleCode: string, reason: string) =>
      request<MessageResponse>(
        `/admin/users/${encodeURIComponent(userId)}/roles/${encodeURIComponent(roleCode)}`,
        { method: "DELETE", body: { reason } },
      ),
    jobs: (limit = 50) =>
      request<BackgroundJob[]>(`/admin/jobs${queryString({ limit })}`),
    retryJob: (jobId: string, reason: string) =>
      request<MessageResponse>(
        `/admin/jobs/${encodeURIComponent(jobId)}/retry`,
        { method: "POST", body: { reason } },
      ),
    analytics: (rangeDays = 30) =>
      request<AdminAnalytics>(`/admin/analytics${queryString({ rangeDays })}`),
    securityEvents: (
      options: {
        severity?: SecurityEvent["severity"];
        limit?: number;
      } = {},
    ) =>
      request<SecurityEvent[]>(`/admin/security-events${queryString(options)}`),
    providerSyncRuns: (limit = 100) =>
      request<ProviderSyncRun[]>(
        `/admin/provider-sync-runs${queryString({ limit })}`,
      ),
    announcements: () => request<AdminAnnouncement[]>("/admin/announcements"),
    createAnnouncement: (body: {
      title: string;
      body: string;
      severity: AdminAnnouncement["severity"];
      active: boolean;
      countryCodes: string[];
      startsAt: string;
      endsAt: string | null;
      reason: string;
    }) =>
      request<AdminAnnouncement>("/admin/announcements", {
        method: "POST",
        body,
      }),
    updateAnnouncement: (
      announcementId: string,
      body: {
        title: string;
        body: string;
        severity: AdminAnnouncement["severity"];
        active: boolean;
        countryCodes: string[];
        startsAt: string;
        endsAt: string | null;
        reason: string;
      },
    ) =>
      request<AdminAnnouncement>(
        `/admin/announcements/${encodeURIComponent(announcementId)}`,
        { method: "PUT", body },
      ),
    queueNotificationBroadcast: (body: {
      category: "announcement" | "promotion" | "system";
      title: string;
      body: string;
      actionUrl: string | null;
      audience:
        | { type: "all" }
        | { type: "country"; countryCode: string }
        | { type: "user"; userId: string };
      reason: string;
    }) =>
      request<MessageResponse>("/admin/notifications/broadcast", {
        method: "POST",
        body,
      }),
    emailTemplates: () =>
      request<AdminEmailTemplate[]>("/admin/email-templates"),
    updateEmailTemplate: (
      code: string,
      body: {
        subjectTemplate: string;
        textTemplate: string;
        htmlTemplate: string;
        enabled: boolean;
        reason: string;
      },
    ) =>
      request<AdminEmailTemplate>(
        `/admin/email-templates/${encodeURIComponent(code)}`,
        { method: "PUT", body },
      ),
    leaderboards: () =>
      request<AdminLeaderboardDefinition[]>("/admin/leaderboards"),
    updateLeaderboard: (
      leaderboardId: string,
      body: {
        name: string;
        cadence: AdminLeaderboardDefinition["cadence"];
        metric: AdminLeaderboardDefinition["metric"];
        enabled: boolean;
        maxEntries: number;
        configuration: unknown;
        reason: string;
      },
    ) =>
      request<AdminLeaderboardDefinition>(
        `/admin/leaderboards/${encodeURIComponent(leaderboardId)}`,
        { method: "PUT", body },
      ),
    resetLeaderboard: (leaderboardId: string, reason: string) =>
      request<MessageResponse>(
        `/admin/leaderboards/${encodeURIComponent(leaderboardId)}/reset`,
        { method: "POST", body: { reason } },
      ),
    leaderboardExclusions: (leaderboardId: string) =>
      request<AdminLeaderboardExclusion[]>(
        `/admin/leaderboards/${encodeURIComponent(leaderboardId)}/exclusions`,
      ),
    excludeLeaderboardUser: (
      leaderboardId: string,
      userId: string,
      reason: string,
    ) =>
      request<MessageResponse>(
        `/admin/leaderboards/${encodeURIComponent(leaderboardId)}/exclusions`,
        { method: "POST", body: { userId, reason } },
      ),
    restoreLeaderboardUser: (
      leaderboardId: string,
      userId: string,
      reason: string,
    ) =>
      request<MessageResponse>(
        `/admin/leaderboards/${encodeURIComponent(leaderboardId)}/exclusions/${encodeURIComponent(userId)}`,
        { method: "DELETE", body: { reason } },
      ),
    supportTickets: (
      options: {
        status?: SupportTicketStatus;
        priority?: SupportTicketPriority;
        limit?: number;
      } = {},
    ) =>
      request<AdminSupportTicket[]>(
        `/admin/support/tickets${queryString(options)}`,
      ),
    supportTicket: (ticketId: string) =>
      request<AdminSupportTicket>(
        `/admin/support/tickets/${encodeURIComponent(ticketId)}`,
      ),
    replySupportTicket: (
      ticketId: string,
      body: {
        message: string;
        internalNote?: boolean;
        status?: SupportTicketStatus;
        priority?: SupportTicketPriority;
        assignedTo?: string | null;
        reason: string;
      },
    ) =>
      request<AdminSupportTicket>(
        `/admin/support/tickets/${encodeURIComponent(ticketId)}/replies`,
        { method: "POST", body },
      ),
    contentPages: () => request<AdminCmsPage[]>("/admin/content/pages"),
    createContentPage: (body: {
      slug: string;
      title: string;
      excerpt: string;
      bodyMarkdown: string;
      status: AdminCmsPage["status"];
      seoTitle: string;
      seoDescription: string;
      canonicalPath: string;
      scheduledFor?: string | null;
      reason: string;
    }) =>
      request<AdminCmsPage>("/admin/content/pages", { method: "POST", body }),
    updateContentPage: (
      pageId: string,
      body: {
        slug: string;
        title: string;
        excerpt: string;
        bodyMarkdown: string;
        status: AdminCmsPage["status"];
        seoTitle: string;
        seoDescription: string;
        canonicalPath: string;
        scheduledFor?: string | null;
        reason: string;
      },
    ) =>
      request<AdminCmsPage>(
        `/admin/content/pages/${encodeURIComponent(pageId)}`,
        { method: "PUT", body },
      ),
    blogCategories: () =>
      request<AdminBlogCategory[]>("/admin/content/blog/categories"),
    createBlogCategory: (body: {
      slug: string;
      name: string;
      description: string;
      active: boolean;
      reason: string;
    }) =>
      request<AdminBlogCategory>("/admin/content/blog/categories", {
        method: "POST",
        body,
      }),
    updateBlogCategory: (
      categoryId: string,
      body: {
        slug: string;
        name: string;
        description: string;
        active: boolean;
        reason: string;
      },
    ) =>
      request<AdminBlogCategory>(
        `/admin/content/blog/categories/${encodeURIComponent(categoryId)}`,
        { method: "PUT", body },
      ),
    blogPosts: () => request<AdminBlogPost[]>("/admin/content/blog/posts"),
    createBlogPost: (body: {
      slug: string;
      title: string;
      excerpt: string;
      bodyMarkdown: string;
      categoryId?: string | null;
      status: AdminBlogPost["status"];
      featuredImageUrl?: string | null;
      seoTitle: string;
      seoDescription: string;
      canonicalPath: string;
      tags: string[];
      scheduledFor?: string | null;
      reason: string;
    }) =>
      request<AdminBlogPost>("/admin/content/blog/posts", {
        method: "POST",
        body,
      }),
    updateBlogPost: (
      postId: string,
      body: {
        slug: string;
        title: string;
        excerpt: string;
        bodyMarkdown: string;
        categoryId?: string | null;
        status: AdminBlogPost["status"];
        featuredImageUrl?: string | null;
        seoTitle: string;
        seoDescription: string;
        canonicalPath: string;
        tags: string[];
        scheduledFor?: string | null;
        reason: string;
      },
    ) =>
      request<AdminBlogPost>(
        `/admin/content/blog/posts/${encodeURIComponent(postId)}`,
        { method: "PUT", body },
      ),
    faqs: () => request<AdminFaq[]>("/admin/content/faqs"),
    createFaq: (body: {
      category: string;
      question: string;
      answerMarkdown: string;
      status: AdminFaq["status"];
      sortOrder: number;
      reason: string;
    }) => request<AdminFaq>("/admin/content/faqs", { method: "POST", body }),
    updateFaq: (
      faqId: string,
      body: {
        category: string;
        question: string;
        answerMarkdown: string;
        status: AdminFaq["status"];
        sortOrder: number;
        reason: string;
      },
    ) =>
      request<AdminFaq>(`/admin/content/faqs/${encodeURIComponent(faqId)}`, {
        method: "PUT",
        body,
      }),
  },
} as const;
