import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

const pathsToRead = {
  foundation: "apps/api/migrations/0001_foundation.sql",
  product: "apps/api/migrations/0002_product_domains.sql",
  openapi: "docs/api/openapi.json",
  app: "apps/api/src/app.ts",
  settings: "apps/api/src/modules/admin/platform-service.ts",
  provider: "apps/api/src/modules/surveys/provider.ts",
  operations: "apps/api/src/workers/operations.ts",
  email: "apps/api/src/workers/email.ts",
  content: "apps/api/src/modules/content/service.ts",
  frontend: "src/App.tsx",
  navigation: "src/components/AppShell.tsx",
  seed: "apps/api/src/db/seed.ts",
  ci: ".github/workflows/ci.yml",
  package: "package.json",
  apiPackage: "apps/api/package.json",
  blueprint: "render.yaml",
  readme: "README.md",
};

const sources = Object.fromEntries(
  await Promise.all(
    Object.entries(pathsToRead).map(async ([key, path]) => [
      key,
      await read(path),
    ]),
  ),
);
const openapi = JSON.parse(sources.openapi);
const migrations = `${sources.foundation}\n${sources.product}`;
const checks = [];
const check = (name, passed, evidence) =>
  checks.push({ name, passed: Boolean(passed), evidence });

const requiredApiPaths = [
  "/auth/register",
  "/auth/login",
  "/auth/session",
  "/auth/sessions",
  "/users/me",
  "/users/me/preferences",
  "/users/me/activity",
  "/dashboard/",
  "/surveys/",
  "/surveys/history",
  "/surveys/{surveyId}/start",
  "/wallet/",
  "/wallet/transactions",
  "/withdrawals/methods",
  "/withdrawals/",
  "/notifications/",
  "/support/tickets",
  "/content/settings",
  "/content/pages/{slug}",
  "/content/blog",
  "/content/faqs",
  "/content/sitemap.xml",
  "/leaderboards/",
  "/leaderboards/{code}/history",
  "/admin/dashboard",
  "/admin/users",
  "/admin/users/{userId}",
  "/admin/limit-templates",
  "/admin/withdrawals",
  "/admin/withdrawal-methods",
  "/admin/settings",
  "/admin/countries",
  "/admin/providers",
  "/admin/roles",
  "/admin/jobs",
  "/admin/support/tickets",
  "/admin/content/pages",
  "/admin/content/blog/posts",
  "/admin/content/faqs",
  "/admin/analytics",
  "/admin/security-events",
  "/admin/provider-sync-runs",
  "/admin/announcements",
  "/admin/notifications/broadcast",
  "/admin/email-templates",
  "/admin/leaderboards",
  "/admin/audit-logs",
];
for (const path of requiredApiPaths) {
  check(`API path ${path}`, openapi.paths?.[path], path);
}

for (const table of [
  "users",
  "user_preferences",
  "user_activity_events",
  "sessions",
  "providers",
  "surveys",
  "survey_participations",
  "wallet_transactions",
  "wallet_transaction_events",
  "wallet_entries",
  "withdrawals",
  "withdrawal_events",
  "notifications",
  "notification_deliveries",
  "support_tickets",
  "support_messages",
  "cms_pages",
  "cms_page_revisions",
  "blog_posts",
  "blog_post_revisions",
  "faqs",
  "faq_revisions",
  "legal_documents",
  "user_consents",
  "leaderboard_definitions",
  "leaderboard_periods",
  "leaderboard_entries",
  "leaderboard_exclusions",
  "provider_sync_runs",
  "background_job_runs",
  "provider_settlements",
  "analytics_daily",
  "system_setting_revisions",
  "email_templates",
  "email_template_revisions",
]) {
  check(
    `Database table ${table}`,
    migrations.includes(`CREATE TABLE ${table}`),
    table,
  );
}

for (const trigger of [
  "wallet_entries_append_only",
  "wallet_events_append_only",
  "audit_logs_append_only",
  "security_events_append_only",
  "account_state_events_append_only",
  "support_messages_append_only",
  "cms_page_revisions_append_only",
  "blog_post_revisions_append_only",
  "faq_revisions_append_only",
  "user_consents_append_only",
  "withdrawal_events_append_only",
  "email_template_revisions_append_only",
]) {
  check(
    `Append-only trigger ${trigger}`,
    migrations.includes(trigger),
    trigger,
  );
}

for (const route of [
  'path="/"',
  'path="/register"',
  'path="/blog"',
  'path="/faq"',
  'path="/app"',
  'path="surveys"',
  'path="wallet"',
  'path="withdrawals"',
  'path="notifications"',
  'path="leaderboards"',
  'path="support"',
  'path="profile"',
  'path="admin/users"',
  'path="admin/withdrawals"',
  'path="admin/content"',
  'path="admin/payout-methods"',
  'path="admin/limit-templates"',
  'path="admin/analytics"',
  'path="admin/system-health"',
  'path="admin/communications"',
  'path="admin/leaderboards"',
]) {
  check(`Frontend route ${route}`, sources.frontend.includes(route), route);
}

check(
  "Exact integer accounting contract",
  sources.openapi.includes('"pattern": "^-?[0-9]+$"') &&
    sources.foundation.includes("amount_usd_micros BIGINT") &&
    sources.settings.includes("positive integer string"),
  "integer strings + BIGINT + validated conversion",
);
check(
  "Pending rewards never auto-validate by time",
  !sources.operations.match(/pending[\s\S]{0,160}(validated|toBucket)/i),
  "no pending-to-validated operations job",
);
check(
  "Withdrawal global default remains off",
  sources.foundation.includes(`'withdrawals', '{"enabled":false`) &&
    sources.settings.includes("APPROVAL_EVIDENCE_REQUIRED"),
  "default off + evidence-gated activation",
);
check(
  "Wallet adjustments remain evidence-gated",
  sources.foundation.includes(`'wallet_adjustments', '{"enabled":false`) &&
    sources.settings.includes("APPROVAL_EVIDENCE_REQUIRED"),
  "default off + evidence-gated activation",
);
check(
  "Future modules cannot be enabled",
  ["referrals", "offerwalls", "cashback", "games"].every((feature) =>
    sources.settings.includes(feature),
  ) && sources.settings.includes("FEATURE_NOT_IMPLEMENTED"),
  "future flags fail closed",
);
check(
  "Provider requires a compiled adapter",
  sources.provider.includes("has(code") &&
    sources.settings.includes("PROVIDER_ADAPTER_REQUIRED"),
  "registry and activation guard",
);
check(
  "Maintenance and feature hooks are server-side",
  sources.app.includes("maintenancePlugin") &&
    sources.app.includes("featureFlagPlugin"),
  "Fastify onRequest enforcement",
);
check(
  "Navigation is capability and feature filtered",
  sources.navigation.includes("requiredCapability") &&
    sources.navigation.includes("features?.[item.feature] !== false"),
  "AppShell registry",
);
check(
  "Operations worker covers recurring domains",
  [
    "publish_scheduled_content",
    "analytics_daily_rollup",
    "leaderboard_snapshot",
    "broadcast_notifications",
    "retention_cleanup",
  ].every((job) => sources.operations.includes(job)),
  "all recurring job types",
);
check(
  "Operations SQL is executed fail-fast in CI",
  sources.operations.includes("OPERATIONS_WORKER_RUN_ONCE") &&
    sources.apiPackage.includes("worker:operations:once") &&
    sources.ci.includes("worker:operations:once"),
  "real PostgreSQL CI execution",
);
check(
  "Email templates are safe and configurable",
  sources.email.includes("email_templates") &&
    sources.email.includes("escapeHtml") &&
    sources.product.includes("email_template_revisions_append_only"),
  "database template + escaped variables + immutable revisions",
);
check(
  "Sitemap is database and feature aware",
  sources.content.includes("getSitemapXml") &&
    sources.content.includes('row.content_type === "blog"') &&
    sources.blueprint.includes("source: /sitemap.xml"),
  "published CMS/blog sitemap",
);
check(
  "Staging is not indexable",
  sources.blueprint.includes("X-Robots-Tag") &&
    sources.blueprint.includes("noindex, nofollow"),
  "staging response header",
);
check(
  "Staging seed is synthetic and payout-disabled",
  sources.seed.includes("demo_paypal") &&
    sources.seed.includes("VALUES ($1, $2, FALSE") &&
    sources.seed.includes("no payout was attempted"),
  "demo methods off + rejected evidence",
);
check(
  "Initial country policy is explicit",
  [
    "US",
    "GB",
    "CA",
    "IE",
    "AU",
    "DE",
    "BE",
    "SA",
    "AE",
    "QA",
    "OM",
    "BH",
  ].every((code) => sources.foundation.includes(`('${code}', 'enabled'`)) &&
    ["PK", "IN", "BD", "CN"].every((code) =>
      sources.foundation.includes(`('${code}', 'blocked'`),
    ),
  "12 enabled and 4 blocked launch countries",
);
check(
  "No unsupported Render free-tier shutdown field",
  !sources.blueprint.includes("maxShutdownDelaySeconds"),
  "free Blueprint schema",
);

const requiredDocuments = [
  "README.md",
  "SECURITY.md",
  "CONTRIBUTING.md",
  "CHANGELOG.md",
  "docs/INSTALLATION.md",
  "docs/CONFIGURATION.md",
  "docs/TROUBLESHOOTING.md",
  "docs/product/BUSINESS-BLUEPRINT.md",
  "docs/product/PRODUCT-BLUEPRINT.md",
  "docs/product/ROADMAP.md",
  "docs/architecture/SYSTEM-ARCHITECTURE.md",
  "docs/architecture/DATABASE.md",
  "docs/api/README.md",
  "docs/operations/ADMIN-MANUAL.md",
  "docs/operations/USER-MANUAL.md",
  "docs/operations/BACKUP-RECOVERY.md",
  "docs/operations/MONITORING-RUNBOOK.md",
  "docs/operations/RELEASE-CHECKLIST.md",
  "docs/marketing/GROWTH-SEO.md",
];
for (const document of requiredDocuments) {
  let exists = true;
  try {
    await access(new URL(document, root));
  } catch {
    exists = false;
  }
  check(`Documentation ${document}`, exists, document);
}
check(
  "README states external launch gates",
  sources.readme.includes("external launch approvals") ||
    (sources.readme.includes("activation gates") &&
      sources.readme.includes("global withdrawal switch")),
  "code completion is not live-money approval",
);

for (const asset of [
  "public/robots.txt",
  "public/site.webmanifest",
  "public/brand-mark.svg",
]) {
  let exists = true;
  try {
    await access(new URL(asset, root));
  } catch {
    exists = false;
  }
  check(`Public asset ${asset}`, exists, asset);
}

for (const obsolete of [
  "docs/handoffs/OPUS-4.8-MVP-FRONTEND-PROMPT.md",
  "src/pages/Dashboard.jsx",
  "src/components/SurveyCard.jsx",
]) {
  let exists = true;
  try {
    await access(new URL(obsolete, root));
  } catch {
    exists = false;
  }
  check(`Obsolete scaffold removed: ${obsolete}`, !exists, obsolete);
}

const failed = checks.filter((item) => !item.passed);
process.stdout.write(
  `${JSON.stringify(
    {
      checks: checks.length,
      passed: checks.length - failed.length,
      failed,
    },
    null,
    2,
  )}\n`,
);
if (failed.length > 0) process.exitCode = 1;
