import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { PGlite } from "@electric-sql/pglite";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("PostgreSQL foundation migration", () => {
  const database = new PGlite();

  beforeAll(async () => {
    const sql = await readFile(
      resolve(process.cwd(), "migrations/0001_foundation.sql"),
      "utf8",
    );
    await database.exec(sql);
  });

  afterAll(async () => database.close());

  it("creates every MVP domain table", async () => {
    const result = await database.query<{ table_name: string }>(
      `SELECT table_name FROM information_schema.tables
       WHERE table_schema = 'public' ORDER BY table_name`,
    );
    const tables = result.rows.map((row) => row.table_name);
    for (const expected of [
      "users",
      "sessions",
      "providers",
      "surveys",
      "survey_participations",
      "wallet_transactions",
      "wallet_transaction_events",
      "wallet_entries",
      "withdrawals",
      "audit_logs",
      "security_events",
      "email_outbox",
    ]) {
      expect(tables).toContain(expected);
    }
  });

  it("enforces append-only financial and audit records in PostgreSQL", async () => {
    const userId = "30000000-0000-4000-8000-000000000001";
    const transactionId = "30000000-0000-4000-8000-000000000002";
    const eventId = "30000000-0000-4000-8000-000000000003";
    const entryId = "30000000-0000-4000-8000-000000000004";
    await database.query(
      `INSERT INTO users (id, email, password_hash, display_name, country_code)
       VALUES ($1, 'ledger@example.com', 'test', 'Ledger User', 'US')`,
      [userId],
    );
    await database.query(
      `INSERT INTO wallet_transactions (
        id, user_id, kind, current_bucket, amount_points, amount_usd_micros,
        description, reference_type, reference_id
       ) VALUES ($1, $2, 'survey_earning', 'pending', 1000, 1000000,
         'Test earning', 'test', $3)`,
      [transactionId, userId, eventId],
    );
    await database.query(
      `INSERT INTO wallet_transaction_events (
        id, transaction_id, to_bucket, event_type, actor_type, reason
       ) VALUES ($1, $2, 'pending', 'created', 'system', 'test')`,
      [eventId, transactionId],
    );
    await database.query(
      `INSERT INTO wallet_entries (
        id, user_id, transaction_id, event_id, bucket, points_delta, usd_micros_delta
       ) VALUES ($1, $2, $3, $4, 'pending', 1000, 1000000)`,
      [entryId, userId, transactionId, eventId],
    );

    await expect(
      database.query(
        "UPDATE wallet_entries SET points_delta = 1 WHERE id = $1",
        [entryId],
      ),
    ).rejects.toThrow("append-only");
    await expect(
      database.query("DELETE FROM wallet_transaction_events WHERE id = $1", [
        eventId,
      ]),
    ).rejects.toThrow("append-only");
    await expect(
      database.query(
        "UPDATE wallet_transactions SET amount_points = 1 WHERE id = $1",
        [transactionId],
      ),
    ).rejects.toThrow("financial facts are immutable");
  });

  it("keeps Limit Template management restricted to Super Admin by default", async () => {
    const result = await database.query<{ role_code: string }>(
      `SELECT role_code FROM role_permissions
       WHERE permission_code = 'admin.limit_templates.manage'
       ORDER BY role_code`,
    );
    expect(result.rows.map((row) => row.role_code)).toEqual(["super_admin"]);
  });
});
