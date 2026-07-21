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
    localCurrencyEstimate: Type.Null(),
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

export const WithdrawalMethodSchema = Type.Object({
  code: Type.String(),
  displayName: Type.String(),
  enabled: Type.Boolean(),
  minimum: MoneySchema,
  fee: MoneySchema,
  supportedForUser: Type.Boolean(),
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
  processedAt: Type.Union([IsoDateTimeSchema, Type.Null()]),
  rejectionReason: Type.Union([Type.String(), Type.Null()]),
});

export const WithdrawalCreateBodySchema = Type.Object({
  methodCode: Type.String({ minLength: 1, maxLength: 64 }),
  points: Type.String({ pattern: "^[1-9][0-9]*$" }),
  destination: Type.String({ minLength: 3, maxLength: 500 }),
});

export const DashboardSchema = Type.Object({
  wallet: WalletSummarySchema,
  availableSurveyCount: Type.Integer({ minimum: 0 }),
  recentTransactions: Type.Array(WalletTransactionSchema),
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
  }),
  surveys: Type.Object({
    available: Type.Integer({ minimum: 0 }),
    pendingParticipations: Type.Integer({ minimum: 0 }),
  }),
  withdrawals: Type.Object({
    requested: Type.Integer({ minimum: 0 }),
    reserved: MoneySchema,
  }),
  providers: Type.Object({
    enabled: Type.Integer({ minimum: 0 }),
    degraded: Type.Integer({ minimum: 0 }),
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

export type Money = Static<typeof MoneySchema>;
export type User = Static<typeof UserSchema>;
export type Session = Static<typeof SessionSchema>;
export type WalletSummary = Static<typeof WalletSummarySchema>;
export type WalletTransaction = Static<typeof WalletTransactionSchema>;
export type Survey = Static<typeof SurveySchema>;
export type Withdrawal = Static<typeof WithdrawalSchema>;
export type Dashboard = Static<typeof DashboardSchema>;
