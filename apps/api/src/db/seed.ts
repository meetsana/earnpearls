import { randomUUID } from "node:crypto";

import { loadConfig } from "../config.js";
import { encryptSensitive, hashPassword } from "../lib/crypto.js";
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
    const adminUserId = await database.transaction(async (client) => {
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
      return userId;
    });

    if (config.allowDemoData) {
      await seedDemoData(database, adminUserId, config.dataEncryptionKey);
    }
    process.stdout.write(`Seeded administrator ${email}\n`);
  } finally {
    await database.close();
  }
}

async function seedDemoData(
  database: Database,
  adminUserId: string,
  encryptionKey: Buffer,
): Promise<void> {
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

  for (const method of [
    {
      code: "demo_paypal",
      displayName: "PayPal (demo only)",
      minimumPoints: "5000",
      feePoints: "0",
      destinationSchema: { type: "email" },
    },
    {
      code: "demo_virtual_visa",
      displayName: "Virtual Visa (demo only)",
      minimumPoints: "10000",
      feePoints: "500",
      destinationSchema: { type: "email" },
    },
  ] as const) {
    await database.query(
      `INSERT INTO withdrawal_methods (
        code, display_name, enabled, minimum_points, fee_points,
        country_codes, destination_schema, configuration
      ) VALUES ($1, $2, FALSE, $3, $4, '{}', $5, '{"demo":true}')
      ON CONFLICT (code) DO UPDATE SET
        display_name = EXCLUDED.display_name,
        enabled = FALSE,
        minimum_points = EXCLUDED.minimum_points,
        fee_points = EXCLUDED.fee_points,
        destination_schema = EXCLUDED.destination_schema,
        configuration = EXCLUDED.configuration`,
      [
        method.code,
        method.displayName,
        method.minimumPoints,
        method.feePoints,
        JSON.stringify(method.destinationSchema),
      ],
    );
  }

  await seedDemoWithdrawal(database, adminUserId, encryptionKey);
}

async function seedDemoWithdrawal(
  database: Database,
  userId: string,
  encryptionKey: Buffer,
): Promise<void> {
  const adjustmentTransactionId = "30000000-0000-4000-8000-000000000001";
  const adjustmentEventId = "30000000-0000-4000-8000-000000000002";
  const withdrawalId = "40000000-0000-4000-8000-000000000001";
  const withdrawalTransactionId = "40000000-0000-4000-8000-000000000002";
  const requestEventId = "40000000-0000-4000-8000-000000000003";
  const rejectionEventId = "40000000-0000-4000-8000-000000000006";
  const points = "5000";
  const usdMicros = "5000000";
  const encryptedDestination = encryptSensitive(
    "demo-user@example.invalid",
    encryptionKey,
  );

  await database.transaction(async (client) => {
    const existing = await client.query(
      "SELECT 1 FROM withdrawals WHERE id = $1",
      [withdrawalId],
    );
    if (existing.rows[0]) return;

    await client.query(
      `INSERT INTO wallet_transactions (
        id, user_id, kind, current_bucket, amount_points, amount_usd_micros,
        description, reference_type, reference_id, idempotency_key
      ) VALUES ($1, $2, 'adjustment', 'withdrawable', $3, $4,
        'Synthetic staging wallet credit', 'demo_seed', $5,
        'demo-withdrawal-credit-v1')`,
      [adjustmentTransactionId, userId, points, usdMicros, withdrawalId],
    );
    await client.query(
      `INSERT INTO wallet_transaction_events (
        id, transaction_id, from_bucket, to_bucket, event_type,
        actor_type, actor_id, reason
      ) VALUES ($1, $2, NULL, 'withdrawable', 'created', 'system', NULL,
        'Synthetic credit for the disabled withdrawal demonstration')`,
      [adjustmentEventId, adjustmentTransactionId],
    );
    await client.query(
      `INSERT INTO wallet_entries (
        id, user_id, transaction_id, event_id, bucket,
        points_delta, usd_micros_delta
      ) VALUES ($1, $2, $3, $4, 'withdrawable', $5, $6)`,
      [
        "30000000-0000-4000-8000-000000000003",
        userId,
        adjustmentTransactionId,
        adjustmentEventId,
        points,
        usdMicros,
      ],
    );

    await client.query(
      `INSERT INTO wallet_transactions (
        id, user_id, kind, current_bucket, amount_points, amount_usd_micros,
        description, reference_type, reference_id, idempotency_key
      ) VALUES ($1, $2, 'withdrawal', 'withdrawable', $3, $4,
        'Synthetic rejected withdrawal', 'withdrawal', $5,
        'demo-rejected-withdrawal-v1')`,
      [withdrawalTransactionId, userId, points, usdMicros, withdrawalId],
    );
    await client.query(
      `INSERT INTO wallet_transaction_events (
        id, transaction_id, from_bucket, to_bucket, event_type,
        actor_type, actor_id, reason
      ) VALUES ($1, $2, 'withdrawable', 'reserved', 'withdrawal_requested',
        'user', $3, 'Synthetic staging withdrawal request')`,
      [requestEventId, withdrawalTransactionId, userId],
    );
    await client.query(
      `INSERT INTO wallet_entries (
        id, user_id, transaction_id, event_id, bucket,
        points_delta, usd_micros_delta
      ) VALUES
        ($1, $2, $3, $4, 'withdrawable', $5, $6),
        ($7, $2, $3, $4, 'reserved', $8, $9)`,
      [
        "40000000-0000-4000-8000-000000000004",
        userId,
        withdrawalTransactionId,
        requestEventId,
        `-${points}`,
        `-${usdMicros}`,
        "40000000-0000-4000-8000-000000000005",
        points,
        usdMicros,
      ],
    );
    await client.query(
      `INSERT INTO wallet_transaction_events (
        id, transaction_id, from_bucket, to_bucket, event_type,
        actor_type, actor_id, reason
      ) VALUES ($1, $2, 'reserved', 'withdrawable', 'withdrawal_rejected',
        'admin', $3, 'Synthetic staging rejection; no payout was attempted')`,
      [rejectionEventId, withdrawalTransactionId, userId],
    );
    await client.query(
      `INSERT INTO wallet_entries (
        id, user_id, transaction_id, event_id, bucket,
        points_delta, usd_micros_delta
      ) VALUES
        ($1, $2, $3, $4, 'reserved', $5, $6),
        ($7, $2, $3, $4, 'withdrawable', $8, $9)`,
      [
        "40000000-0000-4000-8000-000000000007",
        userId,
        withdrawalTransactionId,
        rejectionEventId,
        `-${points}`,
        `-${usdMicros}`,
        "40000000-0000-4000-8000-000000000008",
        points,
        usdMicros,
      ],
    );
    await client.query(
      `INSERT INTO withdrawals (
        id, user_id, method_code, wallet_transaction_id,
        amount_points, amount_usd_micros, fee_points, fee_usd_micros,
        destination_ciphertext, destination_masked, status,
        reviewed_by, reviewed_at, processed_at, rejection_reason,
        idempotency_key, requested_at
      ) VALUES ($1, $2, 'demo_paypal', $3, $4, $5, 0, 0, $6,
        'd***@example.invalid', 'rejected', $2,
        NOW() - INTERVAL '23 hours', NOW() - INTERVAL '23 hours',
        'Synthetic staging example; no payout was attempted',
        'demo-rejected-withdrawal-v1', NOW() - INTERVAL '1 day')`,
      [
        withdrawalId,
        userId,
        withdrawalTransactionId,
        points,
        usdMicros,
        encryptedDestination,
      ],
    );
  });
}

await seed();
