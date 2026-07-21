import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { loadConfig } from "../config.js";
import { Database } from "./database.js";

const migrationsDirectory = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../migrations",
);
const lockId = 7_153_101_001;

async function migrate(): Promise<void> {
  const database = new Database(loadConfig());
  const client = await database.pool.connect();
  try {
    await client.query("SELECT pg_advisory_lock($1)", [lockId]);
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        filename TEXT PRIMARY KEY,
        checksum CHAR(64) NOT NULL,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    const filenames = (await readdir(migrationsDirectory))
      .filter((filename) => filename.endsWith(".sql"))
      .sort((a, b) => a.localeCompare(b));

    for (const filename of filenames) {
      const sql = await readFile(join(migrationsDirectory, filename), "utf8");
      const checksum = createHash("sha256").update(sql).digest("hex");
      const existing = await client.query<{ checksum: string }>(
        "SELECT checksum FROM schema_migrations WHERE filename = $1",
        [filename],
      );
      if (existing.rows[0]) {
        if (existing.rows[0].checksum !== checksum) {
          throw new Error(`Applied migration ${filename} was modified`);
        }
        continue;
      }

      process.stdout.write(`Applying ${filename}... `);
      await client.query("BEGIN");
      try {
        await client.query(sql);
        await client.query(
          "INSERT INTO schema_migrations (filename, checksum) VALUES ($1, $2)",
          [filename, checksum],
        );
        await client.query("COMMIT");
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      }
      process.stdout.write("done\n");
    }
  } finally {
    await client
      .query("SELECT pg_advisory_unlock($1)", [lockId])
      .catch(() => undefined);
    client.release();
    await database.close();
  }
}

await migrate();
