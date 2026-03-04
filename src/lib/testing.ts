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

export function mockSession(userId: string) {
  return {
    user: {
      id: userId,
      role: null,
    },
    session: {
      id: crypto.randomUUID(),
    },
  } as never;
}

export function createReminderSeed(
  userId: string,
  options?: {
    title?: string;
    nextAlertDate?: Date;
    reminderDate?: Date;
  },
) {
  return {
    id: crypto.randomUUID(),
    title: options?.title ?? "Seeded reminder",
    reminderDate: options?.reminderDate ?? new Date("2026-07-15T00:00:00.000Z"),
    nextAlertDate: options?.nextAlertDate ??
      new Date("2026-07-14T00:00:00.000Z"),
    userId,
    repeat: null,
    alertBefore: 1,
    mailSubject: "subject",
    mailBody: "<p>body</p>",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export function createAlertSeed(
  reminderId: string,
  acknowledged = false,
) {
  return {
    id: crypto.randomUUID(),
    reminderId,
    alertDate: new Date("2026-07-14T00:00:00.000Z"),
    acknowledged,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
