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

  process.stdout.write("Staging PostgreSQL seed verification: passed\n");
} finally {
  await database.close();
}
