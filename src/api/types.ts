/** Frontend projections of the canonical TypeBox/OpenAPI contracts. */

/** Exact integer string. Financial calculations must parse this with BigInt. */
export type IntegerString = string;
export type IsoDateTime = string;
export type Uuid = string;

export type AccountStatus =
  "active" | "limited" | "suspended" | "disabled" | "archived";

export type Capability =
  | "dashboard.read"
  | "wallet.read"
  | "survey.read"
  | "survey.start"
  | "withdrawal.read"
  | "withdrawal.create"
  | "profile.edit"
  | "security.sessions.manage"
  | "security.password.change"
  | "profile.read"
  | "notification.read"
  | "notification.manage"
  | "leaderboard.read"
  | "support.read"
  | "support.create"
  | "support.reply"
  | "admin.dashboard.read"
  | "admin.users.read"
  | "admin.users.moderate"
  | "admin.limit_templates.read"
  | "admin.limit_templates.manage"
  | "admin.wallet.read"
  | "admin.wallet.settle"
  | "admin.wallet.adjust"
  | "admin.surveys.reconcile"
  | "admin.withdrawals.read"
  | "admin.withdrawals.review"
  | "admin.providers.read"
  | "admin.providers.manage"
  | "admin.settings.read"
  | "admin.settings.manage"
  | "admin.audit.read"
  | "admin.roles.read"
  | "admin.roles.manage"
  | "admin.content.read"
  | "admin.content.manage"
  | "admin.support.read"
  | "admin.support.manage"
  | "admin.notifications.manage"
  | "admin.countries.manage"
  | "admin.leaderboards.manage"
  | "admin.jobs.read"
  | "admin.jobs.manage"
  | "admin.security.read"
  | "admin.reports.read"
  | "admin.withdrawal_methods.manage";

export interface Money {
  points: IntegerString;
  usdMicros: IntegerString;
  /** Exact server-formatted decimal with six fractional digits. */
  usd: string;
}

export interface User {
  id: Uuid;
  email: string;
  displayName: string;
  countryCode: string;
  accountStatus: AccountStatus;
  emailVerified: boolean;
  createdAt: IsoDateTime;
}

export interface SessionResponse {
  authenticated: true;
  user: User;
  capabilities: Capability[];
}

export interface LoginResponse {
  authenticated: true;
  user: User;
}

export interface SessionDevice {
  id: Uuid;
  current: boolean;
  userAgent: string;
  createdAt: IsoDateTime;
  lastSeenAt: IsoDateTime;
  expiresAt: IsoDateTime;
}

export interface MessageResponse {
  message: string;
}

export interface RegisterBody {
  email: string;
  password: string;
  displayName: string;
  countryCode: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface VerifyEmailBody {
  token: string;
}

export interface PasswordResetRequestBody {
  email: string;
}

export interface PasswordResetConfirmBody {
  token: string;
  password: string;
}

export type WalletBucket =
  | "pending"
  | "validated"
  | "mature"
  | "withdrawable"
  | "reserved"
  | "paid"
  | "rejected"
  | "reversed";

export interface WalletSummary {
  pending: Money;
  validated: Money;
  mature: Money;
  withdrawable: Money;
  reserved: Money;
  paid: Money;
  rejected: Money;
  reversed: Money;
  totalEarnings: Money;
  conversion: {
    pointsPerUsd: IntegerString;
    sourceCurrency: "USD";
    localCurrencyEstimate: {
      currency: string;
      ratePerUsd: string;
      asOf: IsoDateTime;
      pending: string;
      validated: string;
      mature: string;
      withdrawable: string;
      totalEarnings: string;
    } | null;
  };
}

export interface WalletTransaction {
  id: Uuid;
  kind: string;
  currentBucket: WalletBucket;
  amount: Money;
  description: string;
  providerLabel?: string;
  estimatedMaturityAt: IsoDateTime | null;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

export interface CursorPage<T> {
  items: T[];
  nextCursor: string | null;
}

export interface Survey {
  id: Uuid;
  title: string;
  reward: Money;
  estimatedMinutes: number | null;
  difficulty: string | null;
  category: string | null;
  deviceCompatibility: string[];
  countryEligible: boolean;
  available: boolean;
}

export interface SurveyStartResponse {
  participationId: Uuid;
  launchUrl: string;
  status: "started";
}

export interface SurveyParticipation {
  id: Uuid;
  surveyId: Uuid;
  title: string;
  status: "started" | "completed" | "pending" | "validated" | "rejected";
  reward: Money;
  startedAt: IsoDateTime;
  completedAt: IsoDateTime | null;
  providerConfirmedAt: IsoDateTime | null;
  estimatedMaturityAt: IsoDateTime | null;
  rejectionReason: string | null;
}

export interface WithdrawalMethod {
  code: string;
  displayName: string;
  enabled: boolean;
  minimum: Money;
  fee: Money;
  supportedForUser: boolean;
  destinationType: "email" | "crypto_address" | "account_reference";
}

export type WithdrawalStatus =
  | "requested"
  | "under_review"
  | "approved"
  | "processing"
  | "paid"
  | "rejected"
  | "cancelled";

export interface Withdrawal {
  id: Uuid;
  methodCode: string;
  amount: Money;
  fee: Money;
  status: WithdrawalStatus;
  destinationMasked: string;
  requestedAt: IsoDateTime;
  updatedAt: IsoDateTime;
  estimatedCompletionAt: IsoDateTime | null;
  processedAt: IsoDateTime | null;
  payoutReference: string | null;
  rejectionReason: string | null;
}

export interface WithdrawalCreateBody {
  methodCode: string;
  points: IntegerString;
  destination: string;
}

export interface Dashboard {
  wallet: WalletSummary;
  weeklyEarnings: Money;
  monthlyEarnings: Money;
  leaderboardRank: number | null;
  availableSurveyCount: number;
  unreadNotificationCount: number;
  openSupportTicketCount: number;
  profileCompletion: number;
  recentTransactions: WalletTransaction[];
  recentNotifications: Notification[];
  activeWithdrawal: Withdrawal | null;
  announcements: Array<{
    id: Uuid;
    title: string;
    body: string;
    severity: "info" | "success" | "warning" | "danger";
  }>;
}

export interface AdminDashboard {
  users: {
    total: number;
    verified: number;
    limited: number;
    activeNow: number;
    newToday: number;
    newThisMonth: number;
  };
  surveys: { available: number; pendingParticipations: number };
  withdrawals: {
    requested: number;
    paid: number;
    rejected: number;
    reserved: Money;
  };
  providers: { enabled: number; degraded: number };
  support: { open: number; urgent: number };
  operations: {
    emailQueued: number;
    emailFailed: number;
    jobsQueued: number;
    jobsFailed: number;
  };
  security: { highLast24Hours: number };
  content: { drafts: number; scheduled: number };
  wallet: {
    validatedLiability: Money;
    withdrawableLiability: Money;
  };
}

export interface AdminUser {
  id: Uuid;
  email: string;
  displayName: string;
  countryCode: string;
  accountStatus: AccountStatus;
  emailVerified: boolean;
  limitTemplateId: Uuid | null;
  createdAt: IsoDateTime;
}

export interface AdminAccountStateBody {
  accountStatus: AccountStatus;
  reason: string;
  limitTemplateId?: Uuid | null;
}

export interface LimitTemplate {
  id: Uuid;
  code: string;
  name: string;
  description: string;
  active: boolean;
  deniedPermissions: string[];
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

export interface LimitTemplateCreateBody {
  code: string;
  name: string;
  description?: string;
  active?: boolean;
  deniedPermissions: string[];
}

export interface LimitTemplateUpdateBody {
  name: string;
  description: string;
  active: boolean;
  deniedPermissions: string[];
}

export interface AdminWithdrawal {
  id: Uuid;
  userId: Uuid;
  userEmail: string;
  methodCode: string;
  points: IntegerString;
  status: string;
  destinationMasked: string;
  requestedAt: IsoDateTime;
}

export interface AdminWithdrawalDecisionBody {
  reason: string;
  payoutReference?: string;
}

export interface AdminParticipationDecisionBody {
  providerEventReference: string;
  reason: string;
  estimatedMaturityAt?: IsoDateTime;
}

export interface WalletSettlementBody {
  evidenceReference: string;
  reason: string;
}

export interface AuditLog {
  id: Uuid;
  actorType: string;
  actorId: Uuid | null;
  action: string;
  targetType: string;
  targetId: string;
  reason: string | null;
  outcome: string;
  createdAt: IsoDateTime;
}

export interface UserProfile {
  user: User;
  timezone: string;
  displayCurrency: string;
  bio: string;
  marketingOptIn: boolean;
  lastLoginAt: IsoDateTime | null;
  profileCompletion: number;
}

export interface UserProfileUpdateBody {
  displayName: string;
  timezone: string;
  displayCurrency: string;
  bio: string;
  marketingOptIn: boolean;
}

export interface NotificationPreferences {
  emailRewardUpdates: boolean;
  emailWithdrawalUpdates: boolean;
  emailSecurityAlerts: boolean;
  emailSupportUpdates: boolean;
  emailPlatformAnnouncements: boolean;
  emailMarketing: boolean;
  inAppRewardUpdates: boolean;
  inAppWithdrawalUpdates: boolean;
  inAppSecurityAlerts: boolean;
  inAppSupportUpdates: boolean;
  inAppPlatformAnnouncements: boolean;
}

export interface UserActivity {
  id: Uuid;
  eventType: string;
  summary: string;
  targetType: string | null;
  targetId: string | null;
  createdAt: IsoDateTime;
}

export type NotificationStatus = "unread" | "read" | "archived" | "deleted";
export type NotificationCategory =
  | "survey"
  | "reward"
  | "withdrawal"
  | "security"
  | "announcement"
  | "support"
  | "promotion"
  | "system";

export interface Notification {
  id: Uuid;
  category: NotificationCategory;
  title: string;
  body: string;
  actionUrl: string | null;
  status: NotificationStatus;
  readAt: IsoDateTime | null;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

export interface SupportCategory {
  code: string;
  name: string;
  description: string;
}

export type SupportTicketStatus =
  "open" | "waiting_for_support" | "waiting_for_user" | "resolved" | "closed";
export type SupportTicketPriority = "low" | "normal" | "high" | "urgent";

export interface SupportMessage {
  id: Uuid;
  authorType: "user" | "admin";
  authorName: string;
  body: string;
  createdAt: IsoDateTime;
  internalNote?: boolean;
}

export interface SupportTicket {
  id: Uuid;
  ticketNumber: IntegerString;
  categoryCode: string;
  categoryName: string;
  subject: string;
  priority: SupportTicketPriority;
  status: SupportTicketStatus;
  lastMessageAt: IsoDateTime;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
  messages?: SupportMessage[];
}

export interface LeaderboardDefinition {
  code: string;
  name: string;
  cadence: "weekly" | "monthly" | "seasonal";
  metric: "points_earned" | "surveys_completed" | "streak_days";
}

export interface LeaderboardEntry {
  rank: number;
  displayName: string;
  metricValue: IntegerString;
  pointsEarned: IntegerString;
  surveysCompleted: number;
  isCurrentUser: boolean;
}

export interface Leaderboard {
  code: string;
  name: string;
  cadence: string;
  metric: string;
  period: { startsAt: IsoDateTime; endsAt: IsoDateTime; status: string };
  entries: LeaderboardEntry[];
  currentUserEntry: LeaderboardEntry | null;
}

export interface LeaderboardHistory {
  code: string;
  periods: Array<{
    id: Uuid;
    startsAt: IsoDateTime;
    endsAt: IsoDateTime;
    status: string;
    finalizedAt: IsoDateTime | null;
    entries: LeaderboardEntry[];
  }>;
}

export interface PublicSettings {
  brand: {
    name: "EarnPearls";
    tagline: "Your Time. Your Rewards.";
    language: "en";
  };
  registrationEnabled: boolean;
  pointsPerUsd: IntegerString;
  features: Record<string, boolean>;
  maintenance: { enabled: boolean; message: string };
}

export interface PublicCountry {
  code: string;
  name: string;
}

export interface CmsPage {
  slug: string;
  title: string;
  excerpt: string;
  bodyMarkdown: string;
  seoTitle: string;
  seoDescription: string;
  canonicalPath: string;
  publishedAt: IsoDateTime | null;
  updatedAt: IsoDateTime;
}

export interface BlogPostSummary {
  slug: string;
  title: string;
  excerpt: string;
  categoryName: string | null;
  featuredImageUrl: string | null;
  publishedAt: IsoDateTime;
}

export interface BlogPost extends BlogPostSummary {
  bodyMarkdown: string;
  seoTitle: string;
  seoDescription: string;
  canonicalPath: string;
  authorName: string | null;
  tags: string[];
}

export interface Faq {
  id: Uuid;
  category: string;
  question: string;
  answerMarkdown: string;
}

export interface AdminSetting {
  key: string;
  value: unknown;
  public: boolean;
  updatedAt: IsoDateTime;
}

export interface CountryAvailability {
  countryCode: string;
  status: "enabled" | "blocked" | "future" | "review";
  reason: string;
  updatedAt: IsoDateTime;
}

export interface AdminProvider {
  id: Uuid;
  code: string;
  displayName: string;
  enabled: boolean;
  userVisible: boolean;
  healthStatus: "unknown" | "healthy" | "degraded" | "down";
  configuration: unknown;
  lastHealthCheckAt: IsoDateTime | null;
  updatedAt: IsoDateTime;
}

export interface AdminWithdrawalMethod {
  code: string;
  displayName: string;
  enabled: boolean;
  minimumPoints: IntegerString;
  feePoints: IntegerString;
  countryCodes: string[];
  destinationType: "email" | "crypto_address" | "account_reference";
  processingDays: number;
  processingMode: "manual";
  evidenceReference: string | null;
  updatedAt: IsoDateTime;
}

export interface AdminWithdrawalMethodWriteBody {
  code: string;
  displayName: string;
  enabled: boolean;
  minimumPoints: IntegerString;
  feePoints: IntegerString;
  countryCodes: string[];
  destinationType: AdminWithdrawalMethod["destinationType"];
  processingDays: number;
  evidenceReference: string;
  reason: string;
}

export interface AdminRole {
  code: string;
  name: string;
  administrative: boolean;
  permissions: string[];
}

export interface BackgroundJob {
  id: Uuid;
  jobType: string;
  status: string;
  attemptCount: number;
  scheduledFor: IsoDateTime;
  startedAt: IsoDateTime | null;
  finishedAt: IsoDateTime | null;
  lastError: string | null;
  createdAt: IsoDateTime;
}

export interface AdminSupportTicket extends SupportTicket {
  userId: Uuid;
  userEmail: string;
  userDisplayName: string;
  assignedTo: Uuid | null;
}

export interface AdminCmsPage extends CmsPage {
  id: Uuid;
  status: "draft" | "scheduled" | "published" | "archived";
  scheduledFor: IsoDateTime | null;
}

export interface AdminBlogCategory {
  id: Uuid;
  slug: string;
  name: string;
  description: string;
  active: boolean;
}

export interface AdminBlogPost extends BlogPost {
  id: Uuid;
  categoryId: Uuid | null;
  status: "draft" | "scheduled" | "published" | "archived";
  scheduledFor: IsoDateTime | null;
  updatedAt: IsoDateTime;
}

export interface AdminFaq extends Faq {
  status: "draft" | "published" | "archived";
  sortOrder: number;
  publishedAt: IsoDateTime | null;
  updatedAt: IsoDateTime;
}

export interface AdminAnalytics {
  generatedAt: IsoDateTime;
  rangeDays: number;
  users: {
    dailyActive: number;
    weeklyActive: number;
    monthlyActive: number;
    registrations: number;
    verificationRate: number;
  };
  surveys: {
    started: number;
    validated: number;
    completionRate: number;
    rewardPoints: IntegerString;
  };
  withdrawals: { requested: number; paid: number; rejected: number };
  support: {
    opened: number;
    resolved: number;
    averageFirstResponseMinutes: number | null;
  };
  daily: Array<{
    metricDate: string;
    metricCode: string;
    value: string;
  }>;
}

export interface SecurityEvent {
  id: Uuid;
  userId: Uuid | null;
  eventType: string;
  severity: "info" | "warning" | "high" | "critical";
  outcome: string;
  requestId: string | null;
  createdAt: IsoDateTime;
}

export interface ProviderSyncRun {
  id: Uuid;
  providerCode: string;
  providerName: string;
  operation: string;
  status: string;
  attemptCount: number;
  recordsReceived: number;
  recordsChanged: number;
  durationMs: number | null;
  errorCode: string | null;
  errorMessage: string | null;
  startedAt: IsoDateTime | null;
  finishedAt: IsoDateTime | null;
  createdAt: IsoDateTime;
}

export interface AdminAnnouncement {
  id: Uuid;
  title: string;
  body: string;
  severity: "info" | "success" | "warning" | "danger";
  active: boolean;
  countryCodes: string[];
  startsAt: IsoDateTime;
  endsAt: IsoDateTime | null;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

export interface AdminEmailTemplate {
  code: string;
  displayName: string;
  subjectTemplate: string;
  textTemplate: string;
  htmlTemplate: string;
  enabled: boolean;
  variables: string[];
  updatedAt: IsoDateTime;
}

export interface AdminLeaderboardDefinition {
  id: Uuid;
  code: string;
  name: string;
  cadence: "weekly" | "monthly" | "seasonal";
  metric: "points_earned" | "surveys_completed" | "streak_days";
  enabled: boolean;
  maxEntries: number;
  configuration: unknown;
  exclusionCount: number;
  updatedAt: IsoDateTime;
}

export interface AdminLeaderboardExclusion {
  leaderboardId: Uuid;
  userId: Uuid;
  displayName: string;
  email: string;
  reason: string;
  createdAt: IsoDateTime;
}

export interface AdminUserDetail extends AdminUser {
  timezone: string;
  displayCurrency: string;
  lastLoginAt: IsoDateTime | null;
  deletedAt: IsoDateTime | null;
  roles: string[];
  activeSessionCount: number;
  openSupportTicketCount: number;
  unreadNotificationCount: number;
  surveyParticipationCount: number;
  withdrawalCount: number;
  wallet: WalletSummary;
  recentActivity: UserActivity[];
  recentSecurityEvents: Array<{
    id: Uuid;
    eventType: string;
    severity: string;
    outcome: string;
    createdAt: IsoDateTime;
  }>;
}

export interface ErrorEnvelope {
  error: {
    code: string;
    message: string;
    requestId: string;
    details?: unknown;
  };
}
