import { setTimeout as delay } from "node:timers/promises";

import nodemailer from "nodemailer";

import { loadConfig } from "../config.js";
import { Database } from "../db/database.js";
import { decryptSensitive } from "../lib/crypto.js";

type OutboxRow = Readonly<{
  id: string;
  recipient: string;
  template_code: "verify_email" | "reset_password";
  template_data: { tokenCiphertext: string; expiresAt: string };
  attempt_count: number;
}>;

const config = loadConfig();
if (!config.smtpUrl)
  throw new Error("SMTP_URL is required to run the email worker");
const database = new Database(config);
const transport = nodemailer.createTransport(config.smtpUrl);
let stopping = false;

function renderMessage(row: OutboxRow) {
  const token = decryptSensitive(
    row.template_data.tokenCiphertext,
    config.dataEncryptionKey,
  );
  const path =
    row.template_code === "verify_email" ? "/verify-email" : "/reset-password";
  const link = new URL(path, config.publicAppUrl);
  link.searchParams.set("token", token);
  if (row.template_code === "verify_email") {
    return {
      subject: "Verify your EarnPearls email",
      text: `Verify your EarnPearls email: ${link.toString()}\n\nThis link expires at ${row.template_data.expiresAt}.`,
      html: `<p>Verify your EarnPearls email:</p><p><a href="${link.toString()}">Verify email</a></p><p>This link expires at ${row.template_data.expiresAt}.</p>`,
    };
  }
  return {
    subject: "Reset your EarnPearls password",
    text: `Reset your EarnPearls password: ${link.toString()}\n\nThis link expires at ${row.template_data.expiresAt}.`,
    html: `<p>Reset your EarnPearls password:</p><p><a href="${link.toString()}">Reset password</a></p><p>This link expires at ${row.template_data.expiresAt}.</p>`,
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
    const message = renderMessage(row);
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
