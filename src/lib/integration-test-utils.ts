import { TransactionRollbackError } from "drizzle-orm";
import { db, type DbClient } from "../db/index.ts";

export function createUserSeed() {
  const id = crypto.randomUUID();
  return {
    id,
    name: `User ${id.slice(0, 8)}`,
    email: `${id}@example.com`,
    emailVerified: true,
    image: null,
    role: null,
    banned: false,
    banReason: null,
    banExpires: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export async function withRollbackTx<T>(
  run: (tx: DbClient) => Promise<T>,
): Promise<T> {
  let result!: T;

  try {
    await db.transaction(async (tx) => {
      result = await run(tx as unknown as DbClient);
      tx.rollback();
    });
  } catch (error) {
    if (!(error instanceof TransactionRollbackError)) throw error;
  }

  return result;
}
