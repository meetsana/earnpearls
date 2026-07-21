export const PUBLIC_ROUTES = {
  home: "/",
  register: "/register",
  login: "/login",
  verifyEmail: "/verify-email",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
} as const;

export const APP_ROUTES = {
  dashboard: "/app",
  surveys: "/app/surveys",
  wallet: "/app/wallet",
  withdrawals: "/app/withdrawals",
  security: "/app/security",
} as const;

export const ADMIN_ROUTES = {
  dashboard: "/app/admin",
  users: "/app/admin/users",
  withdrawals: "/app/admin/withdrawals",
  reconciliation: "/app/admin/reconciliation",
  auditLog: "/app/admin/audit-log",
} as const;
