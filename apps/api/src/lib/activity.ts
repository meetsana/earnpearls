import { randomUUID } from "node:crypto";

import type { Queryable } from "../db/database.js";

export async function writeUserActivity(
  queryable: Queryable,
  record: Readonly<{
    userId: string;
    eventType: string;
    summary: string;
    targetType?: string | null;
    targetId?: string | null;
    metadata?: Record<string, unknown>;
  }>,
): Promise<void> {
  await queryable.query(
    `INSERT INTO user_activity_events (
      id, user_id, event_type, summary, target_type, target_id, metadata
    ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      randomUUID(),
      record.userId,
      record.eventType,
      record.summary,
      record.targetType ?? null,
      record.targetId ?? null,
      JSON.stringify(record.metadata ?? {}),
    ],
  );
}
