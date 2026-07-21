import { randomUUID } from "node:crypto";

import { loadConfig } from "../config.js";
import { hashPassword } from "../lib/crypto.js";
import { Database } from "./database.js";

async function seed(): Promise<void> {
  const config = loadConfig();
  const email = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD;
  const countryCode = (process.env.SEED_ADMIN_COUNTRY ?? "US")
    .trim()
    .toUpperCase();

  if (!email || !password) {
    throw new Error("SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD are required");
  }
  if (password.length < 16)
    throw new Error("SEED_ADMIN_PASSWORD must be at least 16 characters");
  if (!/^[A-Z]{2}$/.test(countryCode))
    throw new Error("SEED_ADMIN_COUNTRY must be an ISO alpha-2 code");

  const database = new Database(config);
  try {
    const passwordHash = await hashPassword(password, config.passwordPepper);
    await database.transaction(async (client) => {
      const existing = await client.query<{ id: string }>(
        "SELECT id FROM users WHERE email = $1",
        [email],
      );
      const userId = existing.rows[0]?.id ?? randomUUID();
      if (!existing.rows[0]) {
        await client.query(
          `INSERT INTO users (
            id, email, password_hash, display_name, country_code, email_verified_at
          ) VALUES ($1, $2, $3, $4, $5, NOW())`,
          [
            userId,
            email,
            passwordHash,
            "EarnPearls Administrator",
            countryCode,
          ],
        );
      }
      await client.query(
        `INSERT INTO user_roles (user_id, role_code, assigned_by)
         VALUES ($1, 'super_admin', $1)
         ON CONFLICT (user_id, role_code) DO NOTHING`,
        [userId],
      );
    });

    if (config.allowDemoData) {
      await seedDemoData(database);
    }
    process.stdout.write(`Seeded administrator ${email}\n`);
  } finally {
    await database.close();
  }
}

async function seedDemoData(database: Database): Promise<void> {
  const providerId = "10000000-0000-4000-8000-000000000001";
  await database.query(
    `INSERT INTO providers (id, code, display_name, enabled, user_visible, health_status)
     VALUES ($1, 'demo', 'Demo Provider', TRUE, FALSE, 'healthy')
     ON CONFLICT (code) DO UPDATE SET enabled = TRUE, health_status = 'healthy'`,
    [providerId],
  );
  const surveys = [
    [
      "20000000-0000-4000-8000-000000000001",
      "demo-1",
      "Consumer habits survey",
      320n,
      320_000n,
      8,
    ],
    [
      "20000000-0000-4000-8000-000000000002",
      "demo-2",
      "Streaming preferences",
      550n,
      550_000n,
      14,
    ],
    [
      "20000000-0000-4000-8000-000000000003",
      "demo-3",
      "Travel planning study",
      900n,
      900_000n,
      22,
    ],
  ] as const;
  for (const survey of surveys) {
    await database.query(
      `INSERT INTO surveys (
        id, provider_id, external_id, title, reward_points, reward_usd_micros,
        estimated_minutes, difficulty, category, country_codes, device_types, launch_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'Medium', 'General',
        ARRAY['US','GB','CA','IE','AU','DE','BE','SA','AE','QA','OM','BH'],
        ARRAY['desktop','mobile'], $8)
      ON CONFLICT (provider_id, external_id) DO UPDATE SET
        reward_points = EXCLUDED.reward_points,
        reward_usd_micros = EXCLUDED.reward_usd_micros,
        active = TRUE`,
      [
        survey[0],
        providerId,
        survey[1],
        survey[2],
        survey[3].toString(),
        survey[4].toString(),
        survey[5],
        `https://example.invalid/surveys/${survey[1]}`,
      ],
    );
  }
}

await seed();
