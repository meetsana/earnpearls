import { randomUUID } from "node:crypto";

import type { Queryable } from "../db/database.js";

export type AuditRecord = Readonly<{
  actorType: "system" | "user" | "admin" | "provider";
  actorId?: string | null;
  action: string;
  targetType: string;
  targetId: string;
  reason?: string | null;
  outcome: "success" | "denied" | "failure";
  requestId?: string | null;
  ipHash?: string | null;
  metadata?: Record<string, unknown>;
}>;

export async function writeAudit(
  queryable: Queryable,
  record: AuditRecord,
): Promise<void> {
  await queryable.query(
    `INSERT INTO audit_logs (
      id, actor_type, actor_id, action, target_type, target_id, reason,
      outcome, request_id, ip_hash, metadata
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
    [
      randomUUID(),
      record.actorType,
      record.actorId ?? null,
      record.action,
      record.targetType,
      record.targetId,
      record.reason ?? null,
      record.outcome,
      record.requestId ?? null,
      record.ipHash ?? null,
      JSON.stringify(record.metadata ?? {}),
    ],
  );
}

export async function writeSecurityEvent(
  queryable: Queryable,
  record: Readonly<{
    userId?: string | null;
    eventType: string;
    severity: "info" | "warning" | "high" | "critical";
    outcome: string;
    requestId?: string | null;
    ipHash?: string | null;
    userAgent?: string | null;
    metadata?: Record<string, unknown>;
  }>,
): Promise<void> {
  await queryable.query(
    `INSERT INTO security_events (
      id, user_id, event_type, severity, outcome, request_id,
      ip_hash, user_agent, metadata
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [
      randomUUID(),
      record.userId ?? null,
      record.eventType,
      record.severity,
      record.outcome,
      record.requestId ?? null,
      record.ipHash ?? null,
      record.userAgent ?? null,
      JSON.stringify(record.metadata ?? {}),
    ],
  );
}
