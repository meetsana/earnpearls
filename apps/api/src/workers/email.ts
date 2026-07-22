import { setTimeout as delay } from "node:timers/promises";

import nodemailer from "nodemailer";

import { loadConfig } from "../config.js";
import { Database } from "../db/database.js";
import { decryptSensitive } from "../lib/crypto.js";

type OutboxRow = Readonly<{
  id: string;
  recipient: string;
  template_code: "verify_email" | "reset_password" | "notification";
  template_data:
    | { tokenCiphertext: string; expiresAt: string }
    | {
        notificationId: string;
        title: string;
        body: string;
        actionUrl: string | null;
      };
  attempt_count: number;
}>;

type TemplateRow = Readonly<{
  subject_template: string;
  text_template: string;
  html_template: string;
}>;

const config = loadConfig();
if (!config.smtpUrl)
  throw new Error("SMTP_URL is required to run the email worker");
const database = new Database(config);
const transport = nodemailer.createTransport(config.smtpUrl);
let stopping = false;

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function interpolate(
  source: string,
  variables: Readonly<Record<string, string>>,
  escapeValues: boolean,
): string {
  const rendered = source.replace(
    /\{\{([a-z_]+)\}\}/g,
    (_token, name: string) => {
      const value = variables[name];
      if (value === undefined)
        throw new Error(`Missing email template variable: ${name}`);
      return escapeValues ? escapeHtml(value) : value;
    },
  );
  if (rendered.includes("{{") || rendered.includes("}}")) {
    throw new Error("Email template contains an invalid variable token");
  }
  return rendered;
}

async function renderMessage(row: OutboxRow) {
  const template = await database.query<TemplateRow>(
    `SELECT subject_template, text_template, html_template
     FROM email_templates WHERE code=$1 AND enabled=TRUE`,
    [row.template_code],
  );
  const selected = template.rows[0];
  if (!selected) {
    throw new Error(`Enabled email template not found: ${row.template_code}`);
  }
  let variables: Record<string, string>;
  if (row.template_code === "notification") {
    const data = row.template_data as {
      notificationId: string;
      title: string;
      body: string;
      actionUrl: string | null;
    };
    const actionLink = data.actionUrl
      ? new URL(data.actionUrl, config.publicAppUrl).toString()
      : config.publicAppUrl;
    variables = {
      title: data.title,
      body: data.body,
      action_url: actionLink,
    };
  } else {
    const tokenData = row.template_data as {
      tokenCiphertext: string;
      expiresAt: string;
    };
    const token = decryptSensitive(
      tokenData.tokenCiphertext,
      config.dataEncryptionKey,
    );
    const path =
      row.template_code === "verify_email"
        ? "/verify-email"
        : "/reset-password";
    const link = new URL(path, config.publicAppUrl);
    link.searchParams.set("token", token);
    variables = {
      action_url: link.toString(),
      expires_at: tokenData.expiresAt,
    };
  }
  return {
    subject: interpolate(selected.subject_template, variables, false).replace(
      /[\r\n]+/g,
      " ",
    ),
    text: interpolate(selected.text_template, variables, false),
    html: interpolate(selected.html_template, variables, true),
  };
}

async function claimBatch(): Promise<OutboxRow[]> {
  return database.transaction(async (client) => {
    await client.query(
      `UPDATE email_outbox SET status = 'failed', last_error = 'stale sending lease'
       WHERE status = 'sending' AND updated_at < NOW() - INTERVAL '15 minutes'`,
    );
    const result = await client.query<OutboxRow>(
      `SELECT id, recipient, template_code, template_data, attempt_count
       FROM email_outbox
       WHERE status IN ('queued', 'failed') AND next_attempt_at <= NOW()
         AND attempt_count < 8
       ORDER BY created_at ASC
       LIMIT 10
       FOR UPDATE SKIP LOCKED`,
    );
    if (result.rows.length > 0) {
      await client.query(
        `UPDATE email_outbox SET status = 'sending', attempt_count = attempt_count + 1
         WHERE id = ANY($1::UUID[])`,
        [result.rows.map((row) => row.id)],
      );
    }
    return result.rows;
  });
}

async function deliver(row: OutboxRow): Promise<void> {
  try {
    const message = await renderMessage(row);
    await transport.sendMail({
      from: config.emailFrom,
      to: row.recipient,
      ...message,
    });
    await database.query(
      `UPDATE email_outbox SET status = 'sent', sent_at = NOW(), last_error = NULL
       WHERE id = $1`,
      [row.id],
    );
    if (row.template_code === "notification") {
      const data = row.template_data as { notificationId: string };
      await database.query(
        `UPDATE notification_deliveries
         SET status = 'delivered', attempted_at = NOW(), delivered_at = NOW(),
           failure_reason = NULL
         WHERE notification_id = $1 AND channel = 'email'`,
        [data.notificationId],
      );
    }
  } catch (error) {
    const attempts = row.attempt_count + 1;
    const dead = attempts >= 8;
    const backoffSeconds = Math.min(3_600, 2 ** attempts * 30);
    await database.query(
      `UPDATE email_outbox SET status = $2,
        next_attempt_at = NOW() + ($3::TEXT || ' seconds')::INTERVAL,
        last_error = $4
       WHERE id = $1`,
      [
        row.id,
        dead ? "dead" : "failed",
        backoffSeconds,
        error instanceof Error ? error.message : "Unknown error",
      ],
    );
    if (row.template_code === "notification") {
      const data = row.template_data as { notificationId: string };
      await database.query(
        `UPDATE notification_deliveries
         SET status = $2, attempted_at = NOW(), failure_reason = $3
         WHERE notification_id = $1 AND channel = 'email'`,
        [
          data.notificationId,
          dead ? "failed" : "queued",
          error instanceof Error ? error.message : "Unknown error",
        ],
      );
    }
  }
}

async function run(): Promise<void> {
  await transport.verify();
  while (!stopping) {
    const rows = await claimBatch();
    await Promise.all(rows.map(deliver));
    if (rows.length === 0) await delay(config.emailWorkerPollMs);
  }
}

async function shutdown(): Promise<void> {
  stopping = true;
}

process.once("SIGTERM", () => void shutdown());
process.once("SIGINT", () => void shutdown());

try {
  await run();
} finally {
  stopping = true;
  transport.close();
  await database.close();
}
