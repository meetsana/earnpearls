import { randomUUID } from "node:crypto";

import { describe, expect, it } from "vitest";

import { buildApp } from "../src/app.js";
import { loadConfig } from "../src/config.js";
import { Database } from "../src/db/database.js";
import { decryptSensitive } from "../src/lib/crypto.js";

process.env.LOG_LEVEL = "silent";

const testDatabaseUrl = process.env.TEST_DATABASE_URL;
const describeDatabase = testDatabaseUrl ? describe : describe.skip;

describeDatabase("PostgreSQL integration", () => {
  it("supports registration, verification, session auth, and an empty wallet", async () => {
    const config = Object.freeze({
      ...loadConfig(),
      nodeEnv: "test" as const,
      databaseUrl: testDatabaseUrl!,
      databaseSsl: false,
      enableSwagger: false,
    });
    const database = new Database(config);
    const app = await buildApp({ config, database });
    const email = `test-${randomUUID()}@example.com`;
    try {
      const registration = await app.inject({
        method: "POST",
        url: "/v1/auth/register",
        payload: {
          email,
          password: "a strong integration password 2026!",
          displayName: "Integration User",
          countryCode: "US",
        },
      });
      expect(registration.statusCode).toBe(202);
      const outbox = await database.query<{
        template_data: { tokenCiphertext: string };
      }>(
        `SELECT template_data FROM email_outbox
         WHERE recipient = $1 AND template_code = 'verify_email'
         ORDER BY created_at DESC LIMIT 1`,
        [email],
      );
      const verificationToken = decryptSensitive(
        outbox.rows[0]!.template_data.tokenCiphertext,
        config.dataEncryptionKey,
      );

      const verification = await app.inject({
        method: "POST",
        url: "/v1/auth/verify-email",
        payload: { token: verificationToken },
      });
      expect(verification.statusCode).toBe(200);

      const login = await app.inject({
        method: "POST",
        url: "/v1/auth/login",
        payload: { email, password: "a strong integration password 2026!" },
      });
      expect(login.statusCode).toBe(200);
      const cookies = login.cookies;
      const session = cookies.find((cookie) => cookie.name === "ep_session");
      const csrf = cookies.find((cookie) => cookie.name === "ep_session_csrf");
      expect(session?.httpOnly).toBe(true);
      expect(csrf?.value).toBeTruthy();
      const cookieHeader = cookies
        .map((cookie) => `${cookie.name}=${cookie.value}`)
        .join("; ");

      const wallet = await app.inject({
        method: "GET",
        url: "/v1/wallet/",
        headers: { cookie: cookieHeader },
      });
      expect(wallet.statusCode).toBe(200);
      expect(wallet.json()).toMatchObject({
        pending: { points: "0", usdMicros: "0" },
        withdrawable: { points: "0", usdMicros: "0" },
      });

      const logout = await app.inject({
        method: "POST",
        url: "/v1/auth/logout",
        headers: { cookie: cookieHeader, "x-csrf-token": csrf!.value },
      });
      expect(logout.statusCode).toBe(200);
    } finally {
      await app.close();
    }
  });
});
