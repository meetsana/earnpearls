import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");
const [
  migration,
  openApiText,
  config,
  authRoutes,
  surveyService,
  adminService,
  contracts,
] = await Promise.all([
  read("apps/api/migrations/0001_foundation.sql"),
  read("docs/api/openapi.json"),
  read("apps/api/src/config.ts"),
  read("apps/api/src/modules/auth/routes.ts"),
  read("apps/api/src/modules/surveys/service.ts"),
  read("apps/api/src/modules/admin/service.ts"),
  read("packages/contracts/src/index.ts"),
]);

const openApi = JSON.parse(openApiText);
const checks = [];
const check = (name, passed, evidence) =>
  checks.push({ name, passed, evidence });

const requiredPaths = [
  "/auth/register",
  "/auth/login",
  "/auth/session",
  "/auth/sessions",
  "/dashboard/",
  "/wallet/",
  "/wallet/transactions",
  "/surveys/",
  "/surveys/{surveyId}/start",
  "/withdrawals/methods",
  "/withdrawals/",
  "/admin/dashboard",
  "/admin/users",
  "/admin/limit-templates",
  "/admin/withdrawals",
  "/admin/audit-logs",
];
for (const path of requiredPaths) {
  check(`OpenAPI path ${path}`, Boolean(openApi.paths?.[path]), path);
}

for (const scheme of ["cookieAuth", "csrfToken", "providerSignature"]) {
  check(
    `OpenAPI security scheme ${scheme}`,
    Boolean(openApi.components?.securitySchemes?.[scheme]),
    scheme,
  );
}

for (const table of [
  "wallet_entries",
  "wallet_transaction_events",
  "audit_logs",
  "security_events",
  "account_state_events",
]) {
  check(
    `${table} is append-only`,
    migration.includes(
      `CREATE TRIGGER ${table.replace("wallet_transaction_events", "wallet_events")}`,
    ) || migration.includes(`BEFORE UPDATE OR DELETE ON ${table}`),
    `BEFORE UPDATE OR DELETE ON ${table}`,
  );
}

check(
  "Wallet financial facts are immutable",
  migration.includes("wallet transaction financial facts are immutable"),
  "protect_wallet_transaction_facts",
);
check(
  "Withdrawals default disabled",
  migration.includes(`('withdrawals', '{"enabled":false`),
  "system_settings.withdrawals.enabled=false",
);
check(
  "No payout method is pre-enabled",
  !migration.includes("INSERT INTO withdrawal_methods"),
  "No INSERT INTO withdrawal_methods",
);
check(
  "No real provider is pre-enabled",
  !migration.includes("INSERT INTO providers"),
  "No INSERT INTO providers",
);
check(
  "Public auth contract exposes no verification tokens",
  !openApiText.includes("developmentToken") &&
    !authRoutes.includes("developmentToken"),
  "No developmentToken field",
);
check(
  "Production requires TLS app origins",
  config.includes("APP_ORIGINS must use HTTPS in production"),
  "assertProductionSecrets",
);
check(
  "Production rejects placeholder data-encryption key",
  config.includes(
    "DATA_ENCRYPTION_KEY must not use the development placeholder in production",
  ),
  "assertProductionSecrets",
);
check(
  "Money uses exact integer strings",
  contracts.includes('pattern: "^-?[0-9]+$"') &&
    contracts.includes("usdMicros"),
  "IntegerStringSchema",
);

const validationTransitions = [surveyService, adminService]
  .join("\n")
  .match(/toBucket:\s*["']validated["']/g)?.length;
check(
  "Validated transitions are limited to provider or authorized reconciliation services",
  validationTransitions === 2 &&
    !surveyService.includes("estimated_maturity_at <= NOW()"),
  `validated transition sites: ${validationTransitions ?? 0}`,
);
check(
  "No elapsed-time validation query exists",
  ![surveyService, adminService]
    .join("\n")
    .match(/pending[\s\S]{0,100}(interval|setTimeout|Date\.now)/i),
  "No pending-to-validated timer pattern",
);

const failed = checks.filter((item) => !item.passed);
process.stdout.write(
  `${JSON.stringify({ checks: checks.length, passed: checks.length - failed.length, failed }, null, 2)}\n`,
);
if (failed.length > 0) process.exitCode = 1;
