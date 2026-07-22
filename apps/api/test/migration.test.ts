import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { PGlite } from "@electric-sql/pglite";
import type { FastifyInstance } from "fastify";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { getCurrentLeaderboard } from "../src/modules/leaderboards/service.js";
import { getSitemapXml } from "../src/modules/content/service.js";
import {
  listAdminWithdrawalMethods,
  saveAdminWithdrawalMethod,
} from "../src/modules/admin/platform-service.js";
import {
  listEmailTemplates,
  updateEmailTemplate,
} from "../src/modules/admin/insights-service.js";

describe("PostgreSQL migrations", () => {
  const database = new PGlite();

  beforeAll(async () => {
    const directory = resolve(process.cwd(), "migrations");
    const filenames = (await readdir(directory))
      .filter((filename) => filename.endsWith(".sql"))
      .sort((left, right) => left.localeCompare(right));
    for (const filename of filenames) {
      const sql = await readFile(resolve(directory, filename), "utf8");
      await database.exec(sql);
    }
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
      "email_templates",
      "email_template_revisions",
      "notifications",
      "support_tickets",
      "support_messages",
      "support_attachments",
      "support_ticket_events",
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
      "withdrawal_events",
      "analytics_daily",
      "system_setting_revisions",
      "user_activity_events",
      "user_preferences",
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

  it("installs the complete user and administrator capability model", async () => {
    const userCapabilities = await database.query<{ permission_code: string }>(
      `SELECT permission_code FROM role_permissions
       WHERE role_code = 'user' ORDER BY permission_code`,
    );
    expect(userCapabilities.rows.map((row) => row.permission_code)).toEqual(
      expect.arrayContaining([
        "notification.manage",
        "notification.read",
        "leaderboard.read",
        "support.create",
        "support.read",
        "support.reply",
      ]),
    );

    const administrativeRoles = await database.query<{ code: string }>(
      "SELECT code FROM roles WHERE administrative = TRUE ORDER BY code",
    );
    expect(administrativeRoles.rows.map((row) => row.code)).toEqual(
      expect.arrayContaining(["content_admin", "developer", "marketing_admin"]),
    );
  });

  it("keeps revisions and support conversations immutable", async () => {
    const userId = "62000000-0000-4000-8000-000000000001";
    const ticketId = "62000000-0000-4000-8000-000000000002";
    const messageId = "62000000-0000-4000-8000-000000000003";
    await database.query(
      `INSERT INTO users (id, email, password_hash, display_name, country_code)
       VALUES ($1, 'support-ledger@example.com', 'test', 'Support User', 'US')`,
      [userId],
    );
    await database.query(
      `INSERT INTO support_tickets (id, user_id, category_code, subject)
       VALUES ($1, $2, 'other', 'Immutable conversation')`,
      [ticketId, userId],
    );
    await database.query(
      `INSERT INTO support_messages (
        id, ticket_id, author_user_id, author_type, body
       ) VALUES ($1, $2, $3, 'user', 'Original message')`,
      [messageId, ticketId, userId],
    );

    await expect(
      database.query(
        "UPDATE support_messages SET body = 'changed' WHERE id = $1",
        [messageId],
      ),
    ).rejects.toThrow("append-only");
  });

  it("keeps live leaderboard materializations refreshable and exact", async () => {
    const userId = "63000000-0000-4000-8000-000000000001";
    const providerId = "63000000-0000-4000-8000-000000000002";
    const surveyId = "63000000-0000-4000-8000-000000000003";
    await database.query(
      `INSERT INTO users (id, email, password_hash, display_name, country_code)
       VALUES ($1, 'ranking@example.com', 'test', 'Ranking User', 'US')`,
      [userId],
    );
    await database.query(
      `INSERT INTO providers (id, code, display_name, enabled)
       VALUES ($1, 'ranking-provider', 'Ranking provider', TRUE)`,
      [providerId],
    );
    await database.query(
      `INSERT INTO surveys (
        id, provider_id, external_id, title, reward_points,
        reward_usd_micros, launch_url
       ) VALUES ($1,$2,'ranking-survey','Ranking survey',1000,1000000,
        'https://example.com/survey')`,
      [surveyId, providerId],
    );
    for (let index = 0; index < 2; index += 1) {
      await database.query(
        `INSERT INTO wallet_transactions (
          id, user_id, kind, current_bucket, amount_points,
          amount_usd_micros, description, reference_type, reference_id
         ) VALUES ($1,$2,'survey_earning','validated',$3,$4,
          'Ranking reward','test',$5)`,
        [
          `63000000-0000-4000-8000-00000000001${index}`,
          userId,
          index === 0 ? "1000" : "2000",
          index === 0 ? "1000000" : "2000000",
          `63000000-0000-4000-8000-00000000004${index}`,
        ],
      );
    }
    for (let index = 0; index < 3; index += 1) {
      await database.query(
        `INSERT INTO survey_participations (
          id, user_id, survey_id, provider_id, status, reward_points,
          reward_usd_micros, provider_confirmed_at
         ) VALUES ($1,$2,$3,$4,'validated',1000,1000000,NOW())`,
        [
          `63000000-0000-4000-8000-00000000002${index}`,
          userId,
          surveyId,
          providerId,
        ],
      );
    }

    const app = {
      db: {
        query: <T>(text: string, values: readonly unknown[] = []) =>
          database.query<T>(text, [...values]),
      },
    } as unknown as FastifyInstance;
    const leaderboard = await getCurrentLeaderboard(
      app,
      "weekly-points",
      userId,
    );
    expect(leaderboard.currentUserEntry).toMatchObject({
      pointsEarned: "3000",
      surveysCompleted: 3,
      metricValue: "3000",
    });

    const periodId = "63000000-0000-4000-8000-000000000030";
    const entryId = "63000000-0000-4000-8000-000000000031";
    await database.query(
      `INSERT INTO leaderboard_periods (
        id, leaderboard_id, starts_at, ends_at
       ) VALUES ($1,'51000000-0000-4000-8000-000000000001',
        NOW()-INTERVAL '1 hour',NOW()+INTERVAL '1 hour')`,
      [periodId],
    );
    await database.query(
      `INSERT INTO leaderboard_entries (
        id, period_id, user_id, rank, metric_value, points_earned
       ) VALUES ($1,$2,$3,1,3000,3000)`,
      [entryId, periodId, userId],
    );
    await expect(
      database.query("DELETE FROM leaderboard_entries WHERE id=$1", [entryId]),
    ).resolves.toBeDefined();
  });

  it("persists audited payout-method configuration without enabling payouts", async () => {
    const actorId = "64000000-0000-4000-8000-000000000001";
    await database.query(
      `INSERT INTO users (id, email, password_hash, display_name, country_code)
       VALUES ($1, 'payout-admin@example.com', 'test', 'Payout Admin', 'US')`,
      [actorId],
    );
    const query = <T>(text: string, values: readonly unknown[] = []) =>
      database.query<T>(text, [...values]);
    const adapter = {
      query,
      transaction: async <T>(
        callback: (client: { query: typeof query }) => Promise<T>,
      ) => {
        await database.exec("BEGIN");
        try {
          const result = await callback({ query });
          await database.exec("COMMIT");
          return result;
        } catch (error) {
          await database.exec("ROLLBACK");
          throw error;
        }
      },
    };
    const app = {
      db: adapter,
      config: { allowDemoData: false, ipHashSecret: "integration-test-secret" },
    } as unknown as FastifyInstance;
    const request = {
      id: "payout-method-test",
      ip: "127.0.0.1",
      auth: { user: { id: actorId } },
    } as never;
    const created = await saveAdminWithdrawalMethod(app, request, undefined, {
      code: "manual_paypal",
      displayName: "PayPal",
      enabled: false,
      minimumPoints: "5000",
      feePoints: "0",
      countryCodes: ["US", "GB"],
      destinationType: "email",
      processingDays: 5,
      evidenceReference: "OPS-APPROVAL-001",
      reason: "Create a disabled manual payout definition for review",
    });
    expect(created).toMatchObject({
      code: "manual_paypal",
      enabled: false,
      processingDays: 5,
      destinationType: "email",
    });
    const listed = await listAdminWithdrawalMethods(app);
    expect(listed).toContainEqual(created);
    const updated = await saveAdminWithdrawalMethod(
      app,
      request,
      "manual_paypal",
      {
        code: "manual_paypal",
        displayName: "PayPal manual review",
        enabled: false,
        minimumPoints: "6000",
        feePoints: "100",
        countryCodes: ["US"],
        destinationType: "email",
        processingDays: 7,
        evidenceReference: "OPS-APPROVAL-002",
        reason: "Update the still-disabled payout definition after review",
      },
    );
    expect(updated).toMatchObject({
      code: "manual_paypal",
      enabled: false,
      minimumPoints: "6000",
      feePoints: "100",
    });
    const audit = await database.query<{ action: string; target_id: string }>(
      `SELECT action, target_id FROM audit_logs
       WHERE target_type='withdrawal_method' AND target_id='manual_paypal'`,
    );
    expect(audit.rows).toEqual(
      expect.arrayContaining([
        {
          action: "admin.withdrawal_method.created",
          target_id: "manual_paypal",
        },
        {
          action: "admin.withdrawal_method.updated",
          target_id: "manual_paypal",
        },
      ]),
    );
  });

  it("serves an escaped, feature-aware database sitemap", async () => {
    await database.query(
      `INSERT INTO cms_pages (
        id, slug, title, body_markdown, status, canonical_path, published_at
       ) VALUES (
        '65000000-0000-4000-8000-000000000001', 'sitemap-guide',
        'Sitemap guide', 'Body', 'published',
        '/guides/rewards?topic=a&kind=b', NOW()
       )`,
    );
    await database.query(
      `INSERT INTO blog_posts (
        id, slug, title, excerpt, body_markdown, status,
        canonical_path, published_at
       ) VALUES (
        '65000000-0000-4000-8000-000000000002', 'sitemap-post',
        'Sitemap post', 'Excerpt', 'Body', 'published',
        '/blog/sitemap-post', NOW()
       )`,
    );
    const query = <T>(text: string, values: readonly unknown[] = []) =>
      database.query<T>(text, [...values]);
    const app = {
      db: { query },
      config: { publicAppUrl: "https://earnpearls.example" },
    } as unknown as FastifyInstance;
    const enabled = await getSitemapXml(app);
    expect(enabled).toContain(
      "https://earnpearls.example/guides/rewards?topic=a&amp;kind=b",
    );
    expect(enabled).toContain("https://earnpearls.example/blog/sitemap-post");
    await database.query(
      `UPDATE system_settings SET value='{"blogEnabled":false}'::JSONB
       WHERE key='content'`,
    );
    const disabled = await getSitemapXml(app);
    expect(disabled).not.toContain("/blog/sitemap-post");
    expect(disabled).not.toContain(
      "<loc>https://earnpearls.example/blog</loc>",
    );
  });

  it("versions safe email-template changes and protects account recovery", async () => {
    const actorId = "66000000-0000-4000-8000-000000000001";
    await database.query(
      `INSERT INTO users (id, email, password_hash, display_name, country_code)
       VALUES ($1, 'template-admin@example.com', 'test', 'Template Admin', 'US')`,
      [actorId],
    );
    const query = <T>(text: string, values: readonly unknown[] = []) =>
      database.query<T>(text, [...values]);
    const adapter = {
      query,
      transaction: async <T>(
        callback: (client: { query: typeof query }) => Promise<T>,
      ) => {
        await database.exec("BEGIN");
        try {
          const result = await callback({ query });
          await database.exec("COMMIT");
          return result;
        } catch (error) {
          await database.exec("ROLLBACK");
          throw error;
        }
      },
    };
    const app = {
      db: adapter,
      config: { ipHashSecret: "integration-test-secret" },
    } as unknown as FastifyInstance;
    const request = {
      id: "email-template-test",
      ip: "127.0.0.1",
      auth: { user: { id: actorId } },
    } as never;
    const templates = await listEmailTemplates(app);
    const notification = templates.find(
      (item) => item.code === "notification",
    )!;
    const updated = await updateEmailTemplate(app, request, "notification", {
      subjectTemplate: "EarnPearls: {{title}}",
      textTemplate: "{{body}}\n\nOpen: {{action_url}}",
      htmlTemplate: '<p>{{body}}</p><a href="{{action_url}}">Open</a>',
      enabled: true,
      reason: "Add a clear brand prefix to notification subjects",
    });
    expect(updated.subjectTemplate).toBe("EarnPearls: {{title}}");
    expect(updated.updatedAt).not.toBe(notification.updatedAt);
    await expect(
      updateEmailTemplate(app, request, "verify_email", {
        subjectTemplate: "Verify email",
        textTemplate: "{{action_url}} {{expires_at}}",
        htmlTemplate: "<p>{{action_url}} {{expires_at}}</p>",
        enabled: false,
        reason: "Attempt to disable a security-critical template",
      }),
    ).rejects.toThrow(/cannot be disabled/);
    const revisions = await database.query<{ count: number }>(
      `SELECT COUNT(*)::INTEGER AS count FROM email_template_revisions
       WHERE template_code='notification'`,
    );
    expect(revisions.rows[0]?.count).toBe(1);
  });
});
