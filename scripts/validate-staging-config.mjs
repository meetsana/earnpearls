import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import { parse } from "yaml";

const [blueprintSource, dockerfile, migration, seed, ci, codeql] =
  await Promise.all([
    readFile("render.yaml", "utf8"),
    readFile("infra/docker/api.Dockerfile", "utf8"),
    readFile("apps/api/migrations/0001_foundation.sql", "utf8"),
    readFile("apps/api/src/db/seed.ts", "utf8"),
    readFile(".github/workflows/ci.yml", "utf8"),
    readFile(".github/workflows/codeql.yml", "utf8"),
  ]);

const blueprint = parse(blueprintSource);
const services = blueprint.services ?? [];
const api = services.find(
  (service) => service.name === "earnpearls-staging-api-meetsana",
);
const web = services.find(
  (service) => service.name === "earnpearls-staging-web-meetsana",
);
const env = Object.fromEntries(
  (api?.envVars ?? []).map((item) => [item.key, item]),
);
let controls = 0;
const check = (condition, message) => {
  assert.ok(condition, message);
  controls += 1;
};

check(
  services.length === 2,
  "Blueprint must define only the API and static frontend",
);
check(
  api?.runtime === "docker" && api.plan === "free",
  "API must use the free Docker service",
);
check(
  web?.runtime === "static",
  "Frontend must be an immutable static service",
);
check(
  api?.branch === "staging" && web?.branch === "staging",
  "Both services must deploy staging",
);
check(
  api?.autoDeployTrigger === "checksPass" &&
    web?.autoDeployTrigger === "checksPass",
  "Deploys must wait for CI",
);
check(
  api?.healthCheckPath === "/health/ready",
  "Readiness must gate the API rollout",
);
check(
  env.NODE_ENV?.value === "production",
  "Staging must execute production code paths",
);
check(
  env.DATABASE_URL?.sync === false && env.DATABASE_SSL?.value === "true",
  "Database URL must be secret and TLS-only",
);
check(
  env.ALLOW_DEMO_DATA?.value === "true",
  "Synthetic staging data must be explicit",
);
check(
  env.SMTP_URL?.sync === false && env.EMAIL_FROM?.sync === false,
  "SMTP values must be prompted as secrets/configuration",
);
check(
  env.PASSWORD_PEPPER?.generateValue === true &&
    env.IP_HASH_SECRET?.generateValue === true,
  "Authentication secrets must be generated",
);
check(
  env.DATA_ENCRYPTION_KEY?.generateValue === true &&
    env.PROVIDER_WEBHOOK_SECRET?.generateValue === true,
  "Encryption and demo webhook secrets must be generated",
);
check(
  !("databases" in blueprint),
  "The TLS-only Neon database must remain external to Render",
);
check(
  !services.some((service) => ["keyvalue", "redis"].includes(service.type)),
  "Do not provision an unused cache",
);
check(
  (web?.routes ?? [])[0]?.source === "/v1/*",
  "API rewrite must precede SPA fallback",
);
check(
  (web?.routes ?? []).at(-1)?.destination === "/index.html",
  "SPA history fallback is required",
);
check(
  dockerfile.includes("staging-supervisor.mjs"),
  "Runtime image must include the staging supervisor",
);
check(
  dockerfile.includes("process.env.PORT||3001"),
  "Container health checks must follow the provider-assigned port",
);
check(
  migration.includes(`'withdrawals', '{"enabled":false`),
  "Global withdrawals must default off",
);
check(
  seed.includes("demo_paypal") &&
    seed.includes("enabled, minimum_points") &&
    seed.includes("VALUES ($1, $2, FALSE"),
  "Demo payout methods must remain disabled",
);
check(
  seed.includes("demo-rejected-withdrawal-v1") &&
    seed.includes("Synthetic staging example; no payout was attempted"),
  "Synthetic withdrawal history must be terminal and payout-free",
);
check(
  ci.includes("branches: [main, staging]") &&
    codeql.includes("branches: [main, staging]"),
  "CI and CodeQL must gate staging pushes",
);
check(
  ci.includes("db:verify-staging") && ci.includes('ALLOW_DEMO_DATA: "true"'),
  "CI must verify the synthetic, payout-disabled seed against PostgreSQL",
);
check(
  ci.includes("docker build -f infra/docker/api.Dockerfile"),
  "CI must build the staging runtime image",
);
check(
  !/re_(?:[A-Za-z0-9_-]{16,})/.test(blueprintSource),
  "No Resend API key may be committed",
);
check(
  !/postgres(?:ql)?:\/\/[^\s<]+:[^\s<]+@/.test(blueprintSource),
  "No database credentials may be committed",
);

process.stdout.write(
  `Staging deployment controls: ${controls}/${controls} passed\n`,
);
