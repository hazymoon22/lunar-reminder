import { Pool } from "@neondatabase/serverless";
import { DATABASE_URL } from "astro:env/server";
import { drizzle } from "drizzle-orm/neon-serverless";
import type { NeonDatabase } from "drizzle-orm/neon-serverless";

export type TestDbTransaction = NeonDatabase<Record<string, never>>;

/**
 * Create a test database transaction with automatic cleanup.
 * Pool and client are released after use to avoid long-lived WebSocket connections.
 */
export async function createTestDbSession(): Promise<{
  db: TestDbTransaction;
  cleanup: () => Promise<void>;
}> {
  const pool = new Pool({ connectionString: DATABASE_URL });
  const client = await pool.connect();
  const db = drizzle(client);

  return {
    db,
    cleanup: async () => {
      client.release();
      await pool.end();
    },
  };
}
