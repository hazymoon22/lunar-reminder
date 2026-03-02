import { eq } from "drizzle-orm";
import { db, type DbClient } from "./index.ts";
import { type SelectUser, user } from "./schemas/auth.ts";

export function getUsers(database: DbClient = db): Promise<SelectUser[]> {
  return database.select().from(user).orderBy(user.createdAt);
}

export async function getUserById(
  id: string,
  database: DbClient = db,
): Promise<SelectUser> {
  const result = await database
    .select()
    .from(user)
    .where(eq(user.id, id))
    .orderBy(user.createdAt)
    .limit(1);

  return result[0];
}

export async function getUserByEmail(
  email: string,
  database: DbClient = db,
): Promise<SelectUser> {
  const result = await database
    .select()
    .from(user)
    .where(eq(user.email, email))
    .orderBy(user.createdAt)
    .limit(1);

  return result[0];
}
