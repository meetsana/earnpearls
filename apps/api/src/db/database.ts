import pg from "pg";

import type { AppConfig } from "../config.js";

const { Pool } = pg;

export type QueryResultRow = pg.QueryResultRow;
export type Queryable = Pick<pg.Pool, "query"> | Pick<pg.PoolClient, "query">;

export class Database {
  readonly pool: pg.Pool;

  constructor(config: AppConfig) {
    this.pool = new Pool({
      connectionString: config.databaseUrl,
      max: config.databasePoolMax,
      application_name: "earnpearls-api",
      statement_timeout: 15_000,
      query_timeout: 20_000,
      idle_in_transaction_session_timeout: 15_000,
      ssl: config.databaseSsl ? { rejectUnauthorized: true } : undefined,
    });
  }

  query<T extends QueryResultRow>(
    text: string,
    values: readonly unknown[] = [],
  ): Promise<pg.QueryResult<T>> {
    return this.pool.query<T>(text, [...values]);
  }

  async transaction<T>(
    callback: (client: pg.PoolClient) => Promise<T>,
    isolation:
      "READ COMMITTED" | "REPEATABLE READ" | "SERIALIZABLE" = "READ COMMITTED",
  ): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(`SET TRANSACTION ISOLATION LEVEL ${isolation}`);
      const value = await callback(client);
      await client.query("COMMIT");
      return value;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async ready(): Promise<boolean> {
    try {
      const result = await this.pool.query<{ ready: number }>(
        "SELECT 1 AS ready",
      );
      return result.rows[0]?.ready === 1;
    } catch {
      return false;
    }
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}
