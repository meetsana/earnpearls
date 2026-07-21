import assert from "node:assert/strict";

import { loadConfig } from "../config.js";
import { Database } from "./database.js";

const config = loadConfig();
assert.equal(
  config.allowDemoData,
  true,
  "ALLOW_DEMO_DATA must be explicit for this verification",
);

const database = new Database(config);
try {
  const providers = await database.query<{ code: string }>(
    "SELECT code FROM providers WHERE enabled = TRUE ORDER BY code",
  );
  assert.deepEqual(
    providers.rows.map((row) => row.code),
    ["demo"],
    "Only the built-in demo provider may be enabled",
  );

  const surveys = await database.query<{ count: number }>(
    "SELECT COUNT(*)::INTEGER AS count FROM surveys WHERE active = TRUE",
  );
  assert.equal(
    surveys.rows[0]?.count,
    3,
    "Exactly three demo surveys are expected",
  );

  const methods = await database.query<{ code: string; enabled: boolean }>(
    `SELECT code, enabled FROM withdrawal_methods
     WHERE code LIKE 'demo_%' ORDER BY code`,
  );
  assert.deepEqual(methods.rows, [
    { code: "demo_paypal", enabled: false },
    { code: "demo_virtual_visa", enabled: false },
  ]);

  const withdrawals = await database.query<{ enabled: boolean }>(
    `SELECT (value->>'enabled')::BOOLEAN AS enabled
     FROM system_settings WHERE key = 'withdrawals'`,
  );
  assert.equal(
    withdrawals.rows[0]?.enabled,
    false,
    "Global withdrawals must remain disabled",
  );

  const administrator = await database.query<{ role_code: string }>(
    `SELECT ur.role_code FROM user_roles ur
     JOIN users u ON u.id = ur.user_id
     WHERE u.email = $1 ORDER BY ur.role_code`,
    [process.env.SEED_ADMIN_EMAIL?.toLowerCase()],
  );
  assert.deepEqual(
    administrator.rows.map((row) => row.role_code),
    ["super_admin"],
  );

  const demoWithdrawal = await database.query<{
    status: string;
    payout_reference: string | null;
    rejection_reason: string | null;
  }>(
    `SELECT status, payout_reference, rejection_reason
     FROM withdrawals
     WHERE id = '40000000-0000-4000-8000-000000000001'`,
  );
  assert.deepEqual(demoWithdrawal.rows, [
    {
      status: "rejected",
      payout_reference: null,
      rejection_reason: "Synthetic staging example; no payout was attempted",
    },
  ]);

  const demoBalances = await database.query<{
    withdrawable_points: string;
    reserved_points: string;
  }>(
    `SELECT
       COALESCE(SUM(points_delta) FILTER (WHERE bucket = 'withdrawable'), 0)::TEXT
         AS withdrawable_points,
       COALESCE(SUM(points_delta) FILTER (WHERE bucket = 'reserved'), 0)::TEXT
         AS reserved_points
     FROM wallet_entries
     WHERE user_id = (
       SELECT id FROM users WHERE email = $1
     )`,
    [process.env.SEED_ADMIN_EMAIL?.toLowerCase()],
  );
  assert.deepEqual(demoBalances.rows, [
    { withdrawable_points: "5000", reserved_points: "0" },
  ]);

  process.stdout.write("Staging PostgreSQL seed verification: passed\n");
} finally {
  await database.close();
}
