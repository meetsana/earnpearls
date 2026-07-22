import "dotenv/config";

export type AppConfig = Readonly<{
  nodeEnv: "development" | "test" | "production";
  host: string;
  port: number;
  logLevel: string;
  databaseUrl: string;
  databaseSsl: boolean;
  databasePoolMax: number;
  appOrigins: readonly string[];
  publicAppUrl: string;
  trustProxy: boolean;
  sessionCookieName: string;
  sessionTtlHours: number;
  authTokenTtlMinutes: number;
  passwordPepper: string;
  ipHashSecret: string;
  dataEncryptionKey: Buffer;
  providerWebhookSecret: string;
  enableSwagger: boolean;
  allowDemoData: boolean;
  smtpUrl: string | null;
  emailFrom: string;
  emailWorkerPollMs: number;
  operationsWorkerPollMs: number;
}>;

function getString(name: string, fallback?: string): string {
  const value = process.env[name]?.trim() || fallback;
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function getBoolean(name: string, fallback: boolean): boolean {
  const raw = process.env[name];
  if (raw === undefined) return fallback;
  if (raw === "true") return true;
  if (raw === "false") return false;
  throw new Error(`${name} must be true or false`);
}

function getInteger(
  name: string,
  fallback: number,
  minimum: number,
  maximum: number,
): number {
  const parsed = Number.parseInt(process.env[name] ?? String(fallback), 10);
  if (!Number.isInteger(parsed) || parsed < minimum || parsed > maximum) {
    throw new Error(
      `${name} must be an integer between ${minimum} and ${maximum}`,
    );
  }
  return parsed;
}

function getEncryptionKey(): Buffer {
  const raw = getString(
    "DATA_ENCRYPTION_KEY",
    "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=",
  );
  const key = Buffer.from(raw, "base64");
  if (key.length !== 32)
    throw new Error("DATA_ENCRYPTION_KEY must decode to exactly 32 bytes");
  return key;
}

function assertProductionSecrets(config: AppConfig): void {
  if (config.nodeEnv !== "production") return;

  const insecure = new Set([
    "replace-with-a-long-random-secret",
    "replace-with-a-different-long-random-secret",
    "replace-with-provider-specific-secret-manager-values",
  ]);
  if (
    insecure.has(config.passwordPepper) ||
    config.passwordPepper.length < 32
  ) {
    throw new Error(
      "PASSWORD_PEPPER must be a unique production secret of at least 32 characters",
    );
  }
  if (insecure.has(config.ipHashSecret) || config.ipHashSecret.length < 32) {
    throw new Error(
      "IP_HASH_SECRET must be a unique production secret of at least 32 characters",
    );
  }
  if (config.dataEncryptionKey.equals(Buffer.alloc(32))) {
    throw new Error(
      "DATA_ENCRYPTION_KEY must not use the development placeholder in production",
    );
  }
  if (!config.databaseSsl)
    throw new Error("DATABASE_SSL must be true in production");
  if (config.appOrigins.some((origin) => !origin.startsWith("https://"))) {
    throw new Error("APP_ORIGINS must use HTTPS in production");
  }
  if (!config.publicAppUrl.startsWith("https://")) {
    throw new Error("PUBLIC_APP_URL must use HTTPS in production");
  }
}

export function loadConfig(): AppConfig {
  const nodeEnv = getString("NODE_ENV", "development");
  if (!["development", "test", "production"].includes(nodeEnv)) {
    throw new Error("NODE_ENV must be development, test, or production");
  }

  const config: AppConfig = {
    nodeEnv: nodeEnv as AppConfig["nodeEnv"],
    host: getString("HOST", "127.0.0.1"),
    port: getInteger("PORT", 3001, 1, 65_535),
    logLevel: getString("LOG_LEVEL", "info"),
    databaseUrl: getString(
      "DATABASE_URL",
      "postgres://earnpearls:earnpearls@127.0.0.1:5432/earnpearls",
    ),
    databaseSsl: getBoolean("DATABASE_SSL", false),
    databasePoolMax: getInteger("DATABASE_POOL_MAX", 10, 1, 100),
    appOrigins: getString("APP_ORIGINS", "http://localhost:5173")
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean),
    publicAppUrl: getString("PUBLIC_APP_URL", "http://localhost:5173"),
    trustProxy: getBoolean("TRUST_PROXY", false),
    sessionCookieName: getString("SESSION_COOKIE_NAME", "ep_session"),
    sessionTtlHours: getInteger("SESSION_TTL_HOURS", 24, 1, 24 * 30),
    authTokenTtlMinutes: getInteger("AUTH_TOKEN_TTL_MINUTES", 30, 5, 24 * 60),
    passwordPepper: getString(
      "PASSWORD_PEPPER",
      "replace-with-a-long-random-secret",
    ),
    ipHashSecret: getString(
      "IP_HASH_SECRET",
      "replace-with-a-different-long-random-secret",
    ),
    dataEncryptionKey: getEncryptionKey(),
    providerWebhookSecret: getString(
      "PROVIDER_WEBHOOK_SECRET",
      "replace-with-provider-specific-secret-manager-values",
    ),
    enableSwagger: getBoolean("ENABLE_SWAGGER", nodeEnv !== "production"),
    allowDemoData: getBoolean("ALLOW_DEMO_DATA", false),
    smtpUrl: process.env.SMTP_URL?.trim() || null,
    emailFrom: getString("EMAIL_FROM", "EarnPearls <no-reply@example.com>"),
    emailWorkerPollMs: getInteger("EMAIL_WORKER_POLL_MS", 5_000, 1_000, 60_000),
    operationsWorkerPollMs: getInteger(
      "OPERATIONS_WORKER_POLL_MS",
      15_000,
      1_000,
      300_000,
    ),
  };
  assertProductionSecrets(config);
  return Object.freeze(config);
}
