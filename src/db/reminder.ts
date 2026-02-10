import { eq } from 'drizzle-orm'
import { db } from '.'
import {
  reminder,
  type InsertReminder,
  type SelectReminder,
  type UpdateReminder
} from './schema'

export async function getReminders(): Promise<SelectReminder[]> {
  const result = await db
    .select()
    .from(reminder)
    .orderBy(reminder.nextAlertDate)
  return result
}

export async function insertReminder(data: InsertReminder): Promise<string> {
  const result = await db
    .insert(reminder)
    .values(data)
    .returning({ id: reminder.id })
  const insertedReminder = result[0]
  return insertedReminder.id
}

export async function updateReminder(
  id: string,
  data: UpdateReminder
): Promise<string> {
  const result = await db
    .update(reminder)
    .set(data)
    .where(eq(reminder.id, id))
    .returning({ id: reminder.id })

  const updatedReminder = result[0]
  return updatedReminder.id
}

export async function deleteReminder(id: string): Promise<string> {
  const result = await db
    .delete(reminder)
    .where(eq(reminder.id, id))
    .returning({ id: reminder.id })

  const deletedReminder = result[0]
  return deletedReminder.id
}
