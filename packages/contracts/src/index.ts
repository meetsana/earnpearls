import { Type } from "@sinclair/typebox";
import type { Static, TSchema } from "@sinclair/typebox";

export const IsoDateTimeSchema = Type.String({ format: "date-time" });
export const UuidSchema = Type.String({ format: "uuid" });
export const CountryCodeSchema = Type.String({
  minLength: 2,
  maxLength: 2,
  pattern: "^[A-Z]{2}$",
});
export const IntegerStringSchema = Type.String({ pattern: "^-?[0-9]+$" });

export const MoneySchema = Type.Object({
  points: IntegerStringSchema,
  usdMicros: IntegerStringSchema,
  usd: Type.String({ pattern: "^-?[0-9]+\\.[0-9]{6}$" }),
});

export const ErrorSchema = Type.Object({
  error: Type.Object({
    code: Type.String(),
    message: Type.String(),
    requestId: Type.String(),
    details: Type.Optional(Type.Unknown()),
  }),
});

export const MessageSchema = Type.Object({ message: Type.String() });

export const AccountStatusSchema = Type.Union([
  Type.Literal("active"),
  Type.Literal("limited"),
  Type.Literal("suspended"),
  Type.Literal("disabled"),
  Type.Literal("archived"),
]);

export const UserSchema = Type.Object({
  id: UuidSchema,
  email: Type.String({ format: "email" }),
  displayName: Type.String(),
  countryCode: CountryCodeSchema,
  accountStatus: AccountStatusSchema,
  emailVerified: Type.Boolean(),
  createdAt: IsoDateTimeSchema,
});

export const SessionSchema = Type.Object({
  authenticated: Type.Literal(true),
  user: UserSchema,
  capabilities: Type.Array(Type.String()),
});

export const LoginResponseSchema = Type.Object({
  authenticated: Type.Literal(true),
  user: UserSchema,
});

export const SessionDeviceSchema = Type.Object({
  id: UuidSchema,
  current: Type.Boolean(),
  userAgent: Type.String(),
  createdAt: IsoDateTimeSchema,
  lastSeenAt: IsoDateTimeSchema,
  expiresAt: IsoDateTimeSchema,
});

export const RegisterBodySchema = Type.Object({
  email: Type.String({ format: "email", maxLength: 254 }),
  password: Type.String({ minLength: 12, maxLength: 128 }),
  displayName: Type.String({ minLength: 1, maxLength: 100 }),
  countryCode: CountryCodeSchema,
});

export const LoginBodySchema = Type.Object({
  email: Type.String({ format: "email", maxLength: 254 }),
  password: Type.String({ minLength: 1, maxLength: 128 }),
});

export const VerifyEmailBodySchema = Type.Object({
  token: Type.String({ minLength: 40, maxLength: 200 }),
});

export const PasswordResetRequestBodySchema = Type.Object({
  email: Type.String({ format: "email", maxLength: 254 }),
});

export const PasswordResetBodySchema = Type.Object({
  token: Type.String({ minLength: 40, maxLength: 200 }),
  password: Type.String({ minLength: 12, maxLength: 128 }),
});

export const WalletBucketSchema = Type.Union([
  Type.Literal("pending"),
  Type.Literal("validated"),
  Type.Literal("mature"),
  Type.Literal("withdrawable"),
  Type.Literal("reserved"),
  Type.Literal("paid"),
  Type.Literal("rejected"),
  Type.Literal("reversed"),
]);

export const WalletSummarySchema = Type.Object({
  pending: MoneySchema,
  validated: MoneySchema,
  mature: MoneySchema,
  withdrawable: MoneySchema,
  reserved: MoneySchema,
  paid: MoneySchema,
  rejected: MoneySchema,
  reversed: MoneySchema,
  totalEarnings: MoneySchema,
  conversion: Type.Object({
    pointsPerUsd: IntegerStringSchema,
    sourceCurrency: Type.Literal("USD"),
    localCurrencyEstimate: Type.Union([
      Type.Null(),
      Type.Object({
        currency: Type.String({ pattern: "^[A-Z]{3}$" }),
        ratePerUsd: Type.String({ pattern: "^[0-9]+(?:\\.[0-9]{1,6})?$" }),
        asOf: IsoDateTimeSchema,
        pending: Type.String(),
        validated: Type.String(),
        mature: Type.String(),
        withdrawable: Type.String(),
        totalEarnings: Type.String(),
      }),
    ]),
  }),
});

export const WalletTransactionSchema = Type.Object({
  id: UuidSchema,
  kind: Type.String(),
  currentBucket: WalletBucketSchema,
  amount: MoneySchema,
  description: Type.String(),
  providerLabel: Type.Optional(Type.String()),
  estimatedMaturityAt: Type.Union([IsoDateTimeSchema, Type.Null()]),
  createdAt: IsoDateTimeSchema,
  updatedAt: IsoDateTimeSchema,
});

export const CursorPageSchema = <T extends TSchema>(item: T) =>
  Type.Object({
    items: Type.Array(item),
    nextCursor: Type.Union([Type.String(), Type.Null()]),
  });

export const SurveySchema = Type.Object({
  id: UuidSchema,
  title: Type.String(),
  reward: MoneySchema,
  estimatedMinutes: Type.Union([Type.Integer({ minimum: 1 }), Type.Null()]),
  difficulty: Type.Union([Type.String(), Type.Null()]),
  category: Type.Union([Type.String(), Type.Null()]),
  deviceCompatibility: Type.Array(Type.String()),
  countryEligible: Type.Boolean(),
  available: Type.Boolean(),
});

export const SurveyStartResponseSchema = Type.Object({
  participationId: UuidSchema,
  launchUrl: Type.String({ format: "uri" }),
  status: Type.Literal("started"),
});

export const SurveyParticipationSchema = Type.Object({
  id: UuidSchema,
  surveyId: UuidSchema,
  title: Type.String(),
  status: Type.Union([
    Type.Literal("started"),
    Type.Literal("completed"),
    Type.Literal("pending"),
    Type.Literal("validated"),
    Type.Literal("rejected"),
  ]),
  reward: MoneySchema,
  startedAt: IsoDateTimeSchema,
  completedAt: Type.Union([IsoDateTimeSchema, Type.Null()]),
  providerConfirmedAt: Type.Union([IsoDateTimeSchema, Type.Null()]),
  estimatedMaturityAt: Type.Union([IsoDateTimeSchema, Type.Null()]),
  rejectionReason: Type.Union([Type.String(), Type.Null()]),
});

export const WithdrawalMethodSchema = Type.Object({
  code: Type.String(),
  displayName: Type.String(),
  enabled: Type.Boolean(),
  minimum: MoneySchema,
  fee: MoneySchema,
  supportedForUser: Type.Boolean(),
  destinationType: Type.Union([
    Type.Literal("email"),
    Type.Literal("crypto_address"),
    Type.Literal("account_reference"),
  ]),
});

export const WithdrawalStatusSchema = Type.Union([
  Type.Literal("requested"),
  Type.Literal("under_review"),
  Type.Literal("approved"),
  Type.Literal("processing"),
  Type.Literal("paid"),
  Type.Literal("rejected"),
  Type.Literal("cancelled"),
]);

export const WithdrawalSchema = Type.Object({
  id: UuidSchema,
  methodCode: Type.String(),
  amount: MoneySchema,
  fee: MoneySchema,
  status: WithdrawalStatusSchema,
  destinationMasked: Type.String(),
  requestedAt: IsoDateTimeSchema,
  updatedAt: IsoDateTimeSchema,
  estimatedCompletionAt: Type.Union([IsoDateTimeSchema, Type.Null()]),
  processedAt: Type.Union([IsoDateTimeSchema, Type.Null()]),
  payoutReference: Type.Union([Type.String(), Type.Null()]),
  rejectionReason: Type.Union([Type.String(), Type.Null()]),
});

export const WithdrawalCreateBodySchema = Type.Object({
  methodCode: Type.String({ minLength: 1, maxLength: 64 }),
  points: Type.String({ pattern: "^[1-9][0-9]*$" }),
  destination: Type.String({ minLength: 3, maxLength: 500 }),
});

export const DashboardSchema = Type.Object({
  wallet: WalletSummarySchema,
  weeklyEarnings: MoneySchema,
  monthlyEarnings: MoneySchema,
  leaderboardRank: Type.Union([Type.Integer({ minimum: 1 }), Type.Null()]),
  availableSurveyCount: Type.Integer({ minimum: 0 }),
  unreadNotificationCount: Type.Integer({ minimum: 0 }),
  openSupportTicketCount: Type.Integer({ minimum: 0 }),
  profileCompletion: Type.Integer({ minimum: 0, maximum: 100 }),
  recentTransactions: Type.Array(WalletTransactionSchema),
  recentNotifications: Type.Array(
    Type.Object({
      id: UuidSchema,
      category: Type.String(),
      title: Type.String(),
      body: Type.String(),
      actionUrl: Type.Union([Type.String(), Type.Null()]),
      status: Type.String(),
      readAt: Type.Union([IsoDateTimeSchema, Type.Null()]),
      createdAt: IsoDateTimeSchema,
      updatedAt: IsoDateTimeSchema,
    }),
  ),
  activeWithdrawal: Type.Union([WithdrawalSchema, Type.Null()]),
  announcements: Type.Array(
    Type.Object({
      id: UuidSchema,
      title: Type.String(),
      body: Type.String(),
      severity: Type.Union([
        Type.Literal("info"),
        Type.Literal("success"),
        Type.Literal("warning"),
        Type.Literal("danger"),
      ]),
    }),
  ),
});

export const AdminDashboardSchema = Type.Object({
  users: Type.Object({
    total: Type.Integer({ minimum: 0 }),
    verified: Type.Integer({ minimum: 0 }),
    limited: Type.Integer({ minimum: 0 }),
    activeNow: Type.Integer({ minimum: 0 }),
    newToday: Type.Integer({ minimum: 0 }),
    newThisMonth: Type.Integer({ minimum: 0 }),
  }),
  surveys: Type.Object({
    available: Type.Integer({ minimum: 0 }),
    pendingParticipations: Type.Integer({ minimum: 0 }),
  }),
  withdrawals: Type.Object({
    requested: Type.Integer({ minimum: 0 }),
    paid: Type.Integer({ minimum: 0 }),
    rejected: Type.Integer({ minimum: 0 }),
    reserved: MoneySchema,
  }),
  providers: Type.Object({
    enabled: Type.Integer({ minimum: 0 }),
    degraded: Type.Integer({ minimum: 0 }),
  }),
  support: Type.Object({
    open: Type.Integer({ minimum: 0 }),
    urgent: Type.Integer({ minimum: 0 }),
  }),
  operations: Type.Object({
    emailQueued: Type.Integer({ minimum: 0 }),
    emailFailed: Type.Integer({ minimum: 0 }),
    jobsQueued: Type.Integer({ minimum: 0 }),
    jobsFailed: Type.Integer({ minimum: 0 }),
  }),
  security: Type.Object({
    highLast24Hours: Type.Integer({ minimum: 0 }),
  }),
  content: Type.Object({
    drafts: Type.Integer({ minimum: 0 }),
    scheduled: Type.Integer({ minimum: 0 }),
  }),
  wallet: Type.Object({
    validatedLiability: MoneySchema,
    withdrawableLiability: MoneySchema,
  }),
});

export const AdminAccountStateBodySchema = Type.Object({
  accountStatus: AccountStatusSchema,
  reason: Type.String({ minLength: 3, maxLength: 1000 }),
  limitTemplateId: Type.Optional(Type.Union([UuidSchema, Type.Null()])),
});

export const AdminWithdrawalDecisionBodySchema = Type.Object({
  reason: Type.String({ minLength: 3, maxLength: 1000 }),
  payoutReference: Type.Optional(Type.String({ minLength: 1, maxLength: 200 })),
});

export const AdminParticipationDecisionBodySchema = Type.Object({
  providerEventReference: Type.String({ minLength: 1, maxLength: 200 }),
  reason: Type.String({ minLength: 3, maxLength: 1000 }),
  estimatedMaturityAt: Type.Optional(IsoDateTimeSchema),
});

export const UserProfileSchema = Type.Object({
  user: UserSchema,
  timezone: Type.String(),
  displayCurrency: Type.String({ pattern: "^[A-Z]{3}$" }),
  bio: Type.String(),
  marketingOptIn: Type.Boolean(),
  lastLoginAt: Type.Union([IsoDateTimeSchema, Type.Null()]),
  profileCompletion: Type.Integer({ minimum: 0, maximum: 100 }),
});

export const UserProfileUpdateBodySchema = Type.Object({
  displayName: Type.String({ minLength: 1, maxLength: 100 }),
  timezone: Type.String({ minLength: 1, maxLength: 100 }),
  displayCurrency: Type.String({ pattern: "^[A-Z]{3}$" }),
  bio: Type.String({ maxLength: 500 }),
  marketingOptIn: Type.Boolean(),
});

export const ChangePasswordBodySchema = Type.Object({
  currentPassword: Type.String({ minLength: 1, maxLength: 128 }),
  newPassword: Type.String({ minLength: 12, maxLength: 128 }),
});

export const NotificationPreferencesSchema = Type.Object({
  emailRewardUpdates: Type.Boolean(),
  emailWithdrawalUpdates: Type.Boolean(),
  emailSecurityAlerts: Type.Boolean(),
  emailSupportUpdates: Type.Boolean(),
  emailPlatformAnnouncements: Type.Boolean(),
  emailMarketing: Type.Boolean(),
  inAppRewardUpdates: Type.Boolean(),
  inAppWithdrawalUpdates: Type.Boolean(),
  inAppSecurityAlerts: Type.Boolean(),
  inAppSupportUpdates: Type.Boolean(),
  inAppPlatformAnnouncements: Type.Boolean(),
});

export const UserActivitySchema = Type.Object({
  id: UuidSchema,
  eventType: Type.String(),
  summary: Type.String(),
  targetType: Type.Union([Type.String(), Type.Null()]),
  targetId: Type.Union([Type.String(), Type.Null()]),
  createdAt: IsoDateTimeSchema,
});

export const NotificationCategorySchema = Type.Union([
  Type.Literal("survey"),
  Type.Literal("reward"),
  Type.Literal("withdrawal"),
  Type.Literal("security"),
  Type.Literal("announcement"),
  Type.Literal("support"),
  Type.Literal("promotion"),
  Type.Literal("system"),
]);

export const NotificationStatusSchema = Type.Union([
  Type.Literal("unread"),
  Type.Literal("read"),
  Type.Literal("archived"),
  Type.Literal("deleted"),
]);

export const NotificationSchema = Type.Object({
  id: UuidSchema,
  category: NotificationCategorySchema,
  title: Type.String(),
  body: Type.String(),
  actionUrl: Type.Union([Type.String(), Type.Null()]),
  status: NotificationStatusSchema,
  readAt: Type.Union([IsoDateTimeSchema, Type.Null()]),
  createdAt: IsoDateTimeSchema,
  updatedAt: IsoDateTimeSchema,
});

export const NotificationCountSchema = Type.Object({
  unread: Type.Integer({ minimum: 0 }),
});

export const NotificationStatusBodySchema = Type.Object({
  status: Type.Union([
    Type.Literal("read"),
    Type.Literal("archived"),
    Type.Literal("deleted"),
  ]),
});

export const SupportTicketStatusSchema = Type.Union([
  Type.Literal("open"),
  Type.Literal("waiting_for_support"),
  Type.Literal("waiting_for_user"),
  Type.Literal("resolved"),
  Type.Literal("closed"),
]);

export const SupportTicketPrioritySchema = Type.Union([
  Type.Literal("low"),
  Type.Literal("normal"),
  Type.Literal("high"),
  Type.Literal("urgent"),
]);

export const SupportCategorySchema = Type.Object({
  code: Type.String(),
  name: Type.String(),
  description: Type.String(),
});

export const SupportMessageSchema = Type.Object({
  id: UuidSchema,
  authorType: Type.Union([Type.Literal("user"), Type.Literal("admin")]),
  authorName: Type.String(),
  body: Type.String(),
  createdAt: IsoDateTimeSchema,
});

export const SupportTicketSchema = Type.Object({
  id: UuidSchema,
  ticketNumber: IntegerStringSchema,
  categoryCode: Type.String(),
  categoryName: Type.String(),
  subject: Type.String(),
  priority: SupportTicketPrioritySchema,
  status: SupportTicketStatusSchema,
  lastMessageAt: IsoDateTimeSchema,
  createdAt: IsoDateTimeSchema,
  updatedAt: IsoDateTimeSchema,
  messages: Type.Optional(Type.Array(SupportMessageSchema)),
});

export const SupportTicketCreateBodySchema = Type.Object({
  categoryCode: Type.String({ minLength: 1, maxLength: 64 }),
  subject: Type.String({ minLength: 3, maxLength: 200 }),
  message: Type.String({ minLength: 10, maxLength: 10_000 }),
  priority: Type.Optional(SupportTicketPrioritySchema),
});

export const SupportReplyBodySchema = Type.Object({
  message: Type.String({ minLength: 1, maxLength: 10_000 }),
});

export const PublicSettingsSchema = Type.Object({
  brand: Type.Object({
    name: Type.Literal("EarnPearls"),
    tagline: Type.Literal("Your Time. Your Rewards."),
    language: Type.Literal("en"),
  }),
  registrationEnabled: Type.Boolean(),
  pointsPerUsd: IntegerStringSchema,
  features: Type.Record(Type.String(), Type.Boolean()),
  maintenance: Type.Object({
    enabled: Type.Boolean(),
    message: Type.String(),
  }),
});

export const PublicCountrySchema = Type.Object({
  code: CountryCodeSchema,
  name: Type.String(),
});

export const CmsPageSchema = Type.Object({
  slug: Type.String(),
  title: Type.String(),
  excerpt: Type.String(),
  bodyMarkdown: Type.String(),
  seoTitle: Type.String(),
  seoDescription: Type.String(),
  canonicalPath: Type.String(),
  publishedAt: Type.Union([IsoDateTimeSchema, Type.Null()]),
  updatedAt: IsoDateTimeSchema,
});

export const BlogPostSummarySchema = Type.Object({
  slug: Type.String(),
  title: Type.String(),
  excerpt: Type.String(),
  categoryName: Type.Union([Type.String(), Type.Null()]),
  featuredImageUrl: Type.Union([Type.String(), Type.Null()]),
  publishedAt: IsoDateTimeSchema,
});

export const BlogPostSchema = Type.Intersect([
  BlogPostSummarySchema,
  Type.Object({
    bodyMarkdown: Type.String(),
    seoTitle: Type.String(),
    seoDescription: Type.String(),
    canonicalPath: Type.String(),
    authorName: Type.Union([Type.String(), Type.Null()]),
    tags: Type.Array(Type.String()),
  }),
]);

export const FaqSchema = Type.Object({
  id: UuidSchema,
  category: Type.String(),
  question: Type.String(),
  answerMarkdown: Type.String(),
});

export const LeaderboardDefinitionSchema = Type.Object({
  code: Type.String(),
  name: Type.String(),
  cadence: Type.Union([
    Type.Literal("weekly"),
    Type.Literal("monthly"),
    Type.Literal("seasonal"),
  ]),
  metric: Type.Union([
    Type.Literal("points_earned"),
    Type.Literal("surveys_completed"),
    Type.Literal("streak_days"),
  ]),
});

export const LeaderboardEntrySchema = Type.Object({
  rank: Type.Integer({ minimum: 1 }),
  displayName: Type.String(),
  metricValue: IntegerStringSchema,
  pointsEarned: IntegerStringSchema,
  surveysCompleted: Type.Integer({ minimum: 0 }),
  isCurrentUser: Type.Boolean(),
});

export const LeaderboardSchema = Type.Object({
  code: Type.String(),
  name: Type.String(),
  cadence: Type.String(),
  metric: Type.String(),
  period: Type.Object({
    startsAt: IsoDateTimeSchema,
    endsAt: IsoDateTimeSchema,
    status: Type.String(),
  }),
  entries: Type.Array(LeaderboardEntrySchema),
  currentUserEntry: Type.Union([LeaderboardEntrySchema, Type.Null()]),
});

export const LeaderboardHistorySchema = Type.Object({
  code: Type.String(),
  periods: Type.Array(
    Type.Object({
      id: UuidSchema,
      startsAt: IsoDateTimeSchema,
      endsAt: IsoDateTimeSchema,
      status: Type.String(),
      finalizedAt: Type.Union([IsoDateTimeSchema, Type.Null()]),
      entries: Type.Array(LeaderboardEntrySchema),
    }),
  ),
});

export const AdminSettingSchema = Type.Object({
  key: Type.String(),
  value: Type.Unknown(),
  public: Type.Boolean(),
  updatedAt: IsoDateTimeSchema,
});

export const AdminSettingUpdateBodySchema = Type.Object({
  value: Type.Unknown(),
  public: Type.Boolean(),
  reason: Type.String({ minLength: 3, maxLength: 1000 }),
});

export const CountryAvailabilitySchema = Type.Object({
  countryCode: CountryCodeSchema,
  status: Type.Union([
    Type.Literal("enabled"),
    Type.Literal("blocked"),
    Type.Literal("future"),
    Type.Literal("review"),
  ]),
  reason: Type.String(),
  updatedAt: IsoDateTimeSchema,
});

export const CountryAvailabilityUpdateBodySchema = Type.Object({
  status: Type.Union([
    Type.Literal("enabled"),
    Type.Literal("blocked"),
    Type.Literal("future"),
    Type.Literal("review"),
  ]),
  reason: Type.String({ minLength: 3, maxLength: 1000 }),
});

export const AdminProviderSchema = Type.Object({
  id: UuidSchema,
  code: Type.String(),
  displayName: Type.String(),
  enabled: Type.Boolean(),
  userVisible: Type.Boolean(),
  healthStatus: Type.Union([
    Type.Literal("unknown"),
    Type.Literal("healthy"),
    Type.Literal("degraded"),
    Type.Literal("down"),
  ]),
  configuration: Type.Unknown(),
  lastHealthCheckAt: Type.Union([IsoDateTimeSchema, Type.Null()]),
  updatedAt: IsoDateTimeSchema,
});

export const AdminProviderUpdateBodySchema = Type.Object({
  displayName: Type.String({ minLength: 1, maxLength: 120 }),
  enabled: Type.Boolean(),
  userVisible: Type.Boolean(),
  configuration: Type.Unknown(),
  reason: Type.String({ minLength: 3, maxLength: 1000 }),
});

export const AdminWithdrawalMethodSchema = Type.Object({
  code: Type.String(),
  displayName: Type.String(),
  enabled: Type.Boolean(),
  minimumPoints: IntegerStringSchema,
  feePoints: IntegerStringSchema,
  countryCodes: Type.Array(CountryCodeSchema),
  destinationType: Type.Union([
    Type.Literal("email"),
    Type.Literal("crypto_address"),
    Type.Literal("account_reference"),
  ]),
  processingDays: Type.Integer({ minimum: 1, maximum: 30 }),
  processingMode: Type.Literal("manual"),
  evidenceReference: Type.Union([Type.String(), Type.Null()]),
  updatedAt: IsoDateTimeSchema,
});

export const AdminWithdrawalMethodWriteBodySchema = Type.Object({
  code: Type.String({ pattern: "^[a-z][a-z0-9_]{2,63}$" }),
  displayName: Type.String({ minLength: 2, maxLength: 120 }),
  enabled: Type.Boolean(),
  minimumPoints: Type.String({ pattern: "^[0-9]+$", maxLength: 30 }),
  feePoints: Type.String({ pattern: "^[0-9]+$", maxLength: 30 }),
  countryCodes: Type.Array(CountryCodeSchema, {
    maxItems: 250,
    uniqueItems: true,
  }),
  destinationType: Type.Union([
    Type.Literal("email"),
    Type.Literal("crypto_address"),
    Type.Literal("account_reference"),
  ]),
  processingDays: Type.Integer({ minimum: 1, maximum: 30 }),
  evidenceReference: Type.String({ minLength: 3, maxLength: 500 }),
  reason: Type.String({ minLength: 3, maxLength: 1000 }),
});

export const AdminRoleSchema = Type.Object({
  code: Type.String(),
  name: Type.String(),
  administrative: Type.Boolean(),
  permissions: Type.Array(Type.String()),
});

export const AdminRoleAssignmentBodySchema = Type.Object({
  roleCode: Type.String({ minLength: 1, maxLength: 100 }),
  reason: Type.String({ minLength: 3, maxLength: 1000 }),
});

export const BackgroundJobSchema = Type.Object({
  id: UuidSchema,
  jobType: Type.String(),
  status: Type.String(),
  attemptCount: Type.Integer({ minimum: 0 }),
  scheduledFor: IsoDateTimeSchema,
  startedAt: Type.Union([IsoDateTimeSchema, Type.Null()]),
  finishedAt: Type.Union([IsoDateTimeSchema, Type.Null()]),
  lastError: Type.Union([Type.String(), Type.Null()]),
  createdAt: IsoDateTimeSchema,
});

export const AdminSupportMessageSchema = Type.Intersect([
  SupportMessageSchema,
  Type.Object({ internalNote: Type.Boolean() }),
]);

export const AdminSupportTicketSchema = Type.Intersect([
  SupportTicketSchema,
  Type.Object({
    userId: UuidSchema,
    userEmail: Type.String({ format: "email" }),
    userDisplayName: Type.String(),
    assignedTo: Type.Union([UuidSchema, Type.Null()]),
    messages: Type.Optional(Type.Array(AdminSupportMessageSchema)),
  }),
]);

export const AdminSupportReplyBodySchema = Type.Object({
  message: Type.String({ minLength: 1, maxLength: 10_000 }),
  internalNote: Type.Optional(Type.Boolean()),
  status: Type.Optional(SupportTicketStatusSchema),
  priority: Type.Optional(SupportTicketPrioritySchema),
  assignedTo: Type.Optional(Type.Union([UuidSchema, Type.Null()])),
  reason: Type.String({ minLength: 3, maxLength: 1000 }),
});

export const AdminCmsPageSchema = Type.Object({
  id: UuidSchema,
  slug: Type.String(),
  title: Type.String(),
  excerpt: Type.String(),
  bodyMarkdown: Type.String(),
  status: Type.Union([
    Type.Literal("draft"),
    Type.Literal("scheduled"),
    Type.Literal("published"),
    Type.Literal("archived"),
  ]),
  seoTitle: Type.String(),
  seoDescription: Type.String(),
  canonicalPath: Type.String(),
  publishedAt: Type.Union([IsoDateTimeSchema, Type.Null()]),
  scheduledFor: Type.Union([IsoDateTimeSchema, Type.Null()]),
  updatedAt: IsoDateTimeSchema,
});

export const AdminCmsPageWriteBodySchema = Type.Object({
  slug: Type.String({
    minLength: 1,
    maxLength: 120,
    pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$",
  }),
  title: Type.String({ minLength: 1, maxLength: 200 }),
  excerpt: Type.String({ maxLength: 500 }),
  bodyMarkdown: Type.String({ minLength: 1, maxLength: 200_000 }),
  status: Type.Union([
    Type.Literal("draft"),
    Type.Literal("scheduled"),
    Type.Literal("published"),
    Type.Literal("archived"),
  ]),
  seoTitle: Type.String({ maxLength: 200 }),
  seoDescription: Type.String({ maxLength: 500 }),
  canonicalPath: Type.String({ minLength: 1, maxLength: 300, pattern: "^/" }),
  scheduledFor: Type.Optional(Type.Union([IsoDateTimeSchema, Type.Null()])),
  reason: Type.String({ minLength: 3, maxLength: 1000 }),
});

export const AdminBlogCategorySchema = Type.Object({
  id: UuidSchema,
  slug: Type.String(),
  name: Type.String(),
  description: Type.String(),
  active: Type.Boolean(),
});

export const AdminBlogPostSchema = Type.Object({
  id: UuidSchema,
  slug: Type.String(),
  title: Type.String(),
  excerpt: Type.String(),
  bodyMarkdown: Type.String(),
  categoryId: Type.Union([UuidSchema, Type.Null()]),
  categoryName: Type.Union([Type.String(), Type.Null()]),
  status: Type.Union([
    Type.Literal("draft"),
    Type.Literal("scheduled"),
    Type.Literal("published"),
    Type.Literal("archived"),
  ]),
  featuredImageUrl: Type.Union([Type.String(), Type.Null()]),
  seoTitle: Type.String(),
  seoDescription: Type.String(),
  canonicalPath: Type.String(),
  tags: Type.Array(Type.String()),
  publishedAt: Type.Union([IsoDateTimeSchema, Type.Null()]),
  scheduledFor: Type.Union([IsoDateTimeSchema, Type.Null()]),
  updatedAt: IsoDateTimeSchema,
});

export const AdminBlogPostWriteBodySchema = Type.Object({
  slug: Type.String({
    minLength: 1,
    maxLength: 160,
    pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$",
  }),
  title: Type.String({ minLength: 1, maxLength: 250 }),
  excerpt: Type.String({ minLength: 1, maxLength: 1000 }),
  bodyMarkdown: Type.String({ minLength: 1, maxLength: 300_000 }),
  categoryId: Type.Optional(Type.Union([UuidSchema, Type.Null()])),
  status: Type.Union([
    Type.Literal("draft"),
    Type.Literal("scheduled"),
    Type.Literal("published"),
    Type.Literal("archived"),
  ]),
  featuredImageUrl: Type.Optional(
    Type.Union([Type.String({ format: "uri", maxLength: 2000 }), Type.Null()]),
  ),
  seoTitle: Type.String({ maxLength: 200 }),
  seoDescription: Type.String({ maxLength: 500 }),
  canonicalPath: Type.String({ minLength: 1, maxLength: 300, pattern: "^/" }),
  tags: Type.Array(Type.String({ minLength: 1, maxLength: 60 }), {
    maxItems: 20,
  }),
  scheduledFor: Type.Optional(Type.Union([IsoDateTimeSchema, Type.Null()])),
  reason: Type.String({ minLength: 3, maxLength: 1000 }),
});

export const AdminFaqSchema = Type.Object({
  id: UuidSchema,
  category: Type.String(),
  question: Type.String(),
  answerMarkdown: Type.String(),
  status: Type.Union([
    Type.Literal("draft"),
    Type.Literal("published"),
    Type.Literal("archived"),
  ]),
  sortOrder: Type.Integer(),
  publishedAt: Type.Union([IsoDateTimeSchema, Type.Null()]),
  updatedAt: IsoDateTimeSchema,
});

export const AdminFaqWriteBodySchema = Type.Object({
  category: Type.String({ minLength: 1, maxLength: 120 }),
  question: Type.String({ minLength: 3, maxLength: 500 }),
  answerMarkdown: Type.String({ minLength: 3, maxLength: 20_000 }),
  status: Type.Union([
    Type.Literal("draft"),
    Type.Literal("published"),
    Type.Literal("archived"),
  ]),
  sortOrder: Type.Integer({ minimum: -10_000, maximum: 10_000 }),
  reason: Type.String({ minLength: 3, maxLength: 1000 }),
});

export const AdminUserDetailSchema = Type.Object({
  id: UuidSchema,
  email: Type.String({ format: "email" }),
  displayName: Type.String(),
  countryCode: CountryCodeSchema,
  accountStatus: AccountStatusSchema,
  emailVerified: Type.Boolean(),
  limitTemplateId: Type.Union([UuidSchema, Type.Null()]),
  timezone: Type.String(),
  displayCurrency: Type.String(),
  lastLoginAt: Type.Union([IsoDateTimeSchema, Type.Null()]),
  deletedAt: Type.Union([IsoDateTimeSchema, Type.Null()]),
  createdAt: IsoDateTimeSchema,
  roles: Type.Array(Type.String()),
  activeSessionCount: Type.Integer({ minimum: 0 }),
  openSupportTicketCount: Type.Integer({ minimum: 0 }),
  unreadNotificationCount: Type.Integer({ minimum: 0 }),
  surveyParticipationCount: Type.Integer({ minimum: 0 }),
  withdrawalCount: Type.Integer({ minimum: 0 }),
  wallet: WalletSummarySchema,
  recentActivity: Type.Array(UserActivitySchema),
  recentSecurityEvents: Type.Array(
    Type.Object({
      id: UuidSchema,
      eventType: Type.String(),
      severity: Type.String(),
      outcome: Type.String(),
      createdAt: IsoDateTimeSchema,
    }),
  ),
});

export const AdminWalletAdjustmentBodySchema = Type.Object({
  points: Type.String({ pattern: "^-?[1-9][0-9]*$" }),
  bucket: Type.Union([
    Type.Literal("pending"),
    Type.Literal("validated"),
    Type.Literal("mature"),
    Type.Literal("withdrawable"),
  ]),
  reason: Type.String({ minLength: 3, maxLength: 1000 }),
  evidenceReference: Type.String({ minLength: 1, maxLength: 500 }),
  idempotencyKey: Type.String({ minLength: 8, maxLength: 200 }),
});

export const AnalyticsMetricSchema = Type.Object({
  metricDate: Type.String({ format: "date" }),
  metricCode: Type.String(),
  value: Type.String(),
});

export const AdminAnalyticsSchema = Type.Object({
  generatedAt: IsoDateTimeSchema,
  rangeDays: Type.Integer({ minimum: 1, maximum: 365 }),
  users: Type.Object({
    dailyActive: Type.Integer({ minimum: 0 }),
    weeklyActive: Type.Integer({ minimum: 0 }),
    monthlyActive: Type.Integer({ minimum: 0 }),
    registrations: Type.Integer({ minimum: 0 }),
    verificationRate: Type.Number({ minimum: 0, maximum: 100 }),
  }),
  surveys: Type.Object({
    started: Type.Integer({ minimum: 0 }),
    validated: Type.Integer({ minimum: 0 }),
    completionRate: Type.Number({ minimum: 0, maximum: 100 }),
    rewardPoints: IntegerStringSchema,
  }),
  withdrawals: Type.Object({
    requested: Type.Integer({ minimum: 0 }),
    paid: Type.Integer({ minimum: 0 }),
    rejected: Type.Integer({ minimum: 0 }),
  }),
  support: Type.Object({
    opened: Type.Integer({ minimum: 0 }),
    resolved: Type.Integer({ minimum: 0 }),
    averageFirstResponseMinutes: Type.Union([
      Type.Number({ minimum: 0 }),
      Type.Null(),
    ]),
  }),
  daily: Type.Array(AnalyticsMetricSchema),
});

export const SecurityEventSchema = Type.Object({
  id: UuidSchema,
  userId: Type.Union([UuidSchema, Type.Null()]),
  eventType: Type.String(),
  severity: Type.Union([
    Type.Literal("info"),
    Type.Literal("warning"),
    Type.Literal("high"),
    Type.Literal("critical"),
  ]),
  outcome: Type.String(),
  requestId: Type.Union([Type.String(), Type.Null()]),
  createdAt: IsoDateTimeSchema,
});

export const ProviderSyncRunSchema = Type.Object({
  id: UuidSchema,
  providerCode: Type.String(),
  providerName: Type.String(),
  operation: Type.String(),
  status: Type.String(),
  attemptCount: Type.Integer({ minimum: 0 }),
  recordsReceived: Type.Integer({ minimum: 0 }),
  recordsChanged: Type.Integer({ minimum: 0 }),
  durationMs: Type.Union([Type.Integer({ minimum: 0 }), Type.Null()]),
  errorCode: Type.Union([Type.String(), Type.Null()]),
  errorMessage: Type.Union([Type.String(), Type.Null()]),
  startedAt: Type.Union([IsoDateTimeSchema, Type.Null()]),
  finishedAt: Type.Union([IsoDateTimeSchema, Type.Null()]),
  createdAt: IsoDateTimeSchema,
});

export const AdminAnnouncementSchema = Type.Object({
  id: UuidSchema,
  title: Type.String(),
  body: Type.String(),
  severity: Type.Union([
    Type.Literal("info"),
    Type.Literal("success"),
    Type.Literal("warning"),
    Type.Literal("danger"),
  ]),
  active: Type.Boolean(),
  countryCodes: Type.Array(CountryCodeSchema),
  startsAt: IsoDateTimeSchema,
  endsAt: Type.Union([IsoDateTimeSchema, Type.Null()]),
  createdAt: IsoDateTimeSchema,
  updatedAt: IsoDateTimeSchema,
});

export const AdminAnnouncementWriteBodySchema = Type.Object({
  title: Type.String({ minLength: 3, maxLength: 200 }),
  body: Type.String({ minLength: 3, maxLength: 5000 }),
  severity: Type.Union([
    Type.Literal("info"),
    Type.Literal("success"),
    Type.Literal("warning"),
    Type.Literal("danger"),
  ]),
  active: Type.Boolean(),
  countryCodes: Type.Array(CountryCodeSchema, { maxItems: 250 }),
  startsAt: IsoDateTimeSchema,
  endsAt: Type.Union([IsoDateTimeSchema, Type.Null()]),
  reason: Type.String({ minLength: 3, maxLength: 1000 }),
});

export const AdminBroadcastBodySchema = Type.Object({
  category: Type.Union([
    Type.Literal("announcement"),
    Type.Literal("promotion"),
    Type.Literal("system"),
  ]),
  title: Type.String({ minLength: 3, maxLength: 200 }),
  body: Type.String({ minLength: 3, maxLength: 5000 }),
  actionUrl: Type.Union([Type.String({ maxLength: 1000 }), Type.Null()]),
  audience: Type.Union([
    Type.Object({ type: Type.Literal("all") }),
    Type.Object({
      type: Type.Literal("country"),
      countryCode: CountryCodeSchema,
    }),
    Type.Object({ type: Type.Literal("user"), userId: UuidSchema }),
  ]),
  reason: Type.String({ minLength: 3, maxLength: 1000 }),
});

export const AdminEmailTemplateSchema = Type.Object({
  code: Type.String(),
  displayName: Type.String(),
  subjectTemplate: Type.String(),
  textTemplate: Type.String(),
  htmlTemplate: Type.String(),
  enabled: Type.Boolean(),
  variables: Type.Array(Type.String()),
  updatedAt: IsoDateTimeSchema,
});

export const AdminEmailTemplateUpdateBodySchema = Type.Object({
  subjectTemplate: Type.String({ minLength: 1, maxLength: 300 }),
  textTemplate: Type.String({ minLength: 1, maxLength: 20_000 }),
  htmlTemplate: Type.String({ minLength: 1, maxLength: 40_000 }),
  enabled: Type.Boolean(),
  reason: Type.String({ minLength: 3, maxLength: 1000 }),
});

export const AdminLeaderboardDefinitionSchema = Type.Object({
  id: UuidSchema,
  code: Type.String(),
  name: Type.String(),
  cadence: Type.Union([
    Type.Literal("weekly"),
    Type.Literal("monthly"),
    Type.Literal("seasonal"),
  ]),
  metric: Type.Union([
    Type.Literal("points_earned"),
    Type.Literal("surveys_completed"),
    Type.Literal("streak_days"),
  ]),
  enabled: Type.Boolean(),
  maxEntries: Type.Integer({ minimum: 1, maximum: 1000 }),
  configuration: Type.Unknown(),
  exclusionCount: Type.Integer({ minimum: 0 }),
  updatedAt: IsoDateTimeSchema,
});

export const AdminLeaderboardWriteBodySchema = Type.Object({
  name: Type.String({ minLength: 3, maxLength: 200 }),
  cadence: Type.Union([
    Type.Literal("weekly"),
    Type.Literal("monthly"),
    Type.Literal("seasonal"),
  ]),
  metric: Type.Union([
    Type.Literal("points_earned"),
    Type.Literal("surveys_completed"),
    Type.Literal("streak_days"),
  ]),
  enabled: Type.Boolean(),
  maxEntries: Type.Integer({ minimum: 1, maximum: 1000 }),
  configuration: Type.Unknown(),
  reason: Type.String({ minLength: 3, maxLength: 1000 }),
});

export const AdminLeaderboardExclusionSchema = Type.Object({
  leaderboardId: UuidSchema,
  userId: UuidSchema,
  displayName: Type.String(),
  email: Type.String({ format: "email" }),
  reason: Type.String(),
  createdAt: IsoDateTimeSchema,
});

export type Money = Static<typeof MoneySchema>;
export type User = Static<typeof UserSchema>;
export type Session = Static<typeof SessionSchema>;
export type WalletSummary = Static<typeof WalletSummarySchema>;
export type WalletTransaction = Static<typeof WalletTransactionSchema>;
export type Survey = Static<typeof SurveySchema>;
export type Withdrawal = Static<typeof WithdrawalSchema>;
export type Dashboard = Static<typeof DashboardSchema>;
