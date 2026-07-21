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
  | "admin.audit.read";

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
    localCurrencyEstimate: null;
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

export interface WithdrawalMethod {
  code: string;
  displayName: string;
  enabled: boolean;
  minimum: Money;
  fee: Money;
  supportedForUser: boolean;
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
  processedAt: IsoDateTime | null;
  rejectionReason: string | null;
}

export interface WithdrawalCreateBody {
  methodCode: string;
  points: IntegerString;
  destination: string;
}

export interface Dashboard {
  wallet: WalletSummary;
  availableSurveyCount: number;
  recentTransactions: WalletTransaction[];
  activeWithdrawal: Withdrawal | null;
  announcements: Array<{
    id: Uuid;
    title: string;
    body: string;
    severity: "info" | "success" | "warning" | "danger";
  }>;
}

export interface AdminDashboard {
  users: { total: number; verified: number; limited: number };
  surveys: { available: number; pendingParticipations: number };
  withdrawals: { requested: number; reserved: Money };
  providers: { enabled: number; degraded: number };
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

export interface ErrorEnvelope {
  error: {
    code: string;
    message: string;
    requestId: string;
    details?: unknown;
  };
}
