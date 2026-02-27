import { eq } from 'drizzle-orm'
import { db } from './index.ts'
import { user, type SelectUser } from './schemas/auth.ts'

export function getUsers(): Promise<SelectUser[]> {
  return db.select().from(user).orderBy(user.createdAt)
}

export async function getUserById(id: string): Promise<SelectUser> {
  const result = await db
    .select()
    .from(user)
    .where(eq(user.id, id))
    .orderBy(user.createdAt)
    .limit(1)

  return result[0]
}

export async function getUserByEmail(email: string): Promise<SelectUser> {
  const result = await db
    .select()
    .from(user)
    .where(eq(user.email, email))
    .orderBy(user.createdAt)
    .limit(1)

  return result[0]
}
