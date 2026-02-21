import { and, eq } from 'drizzle-orm'
import { db } from '.'
import {
  alert,
  reminder,
  type InsertReminder,
  type SelectAlert,
  type SelectReminder,
  type UpdateAlert,
  type UpdateReminder
} from './schema.ts'

export async function getReminders(userId: string): Promise<SelectReminder[]> {
  const result = await db
    .select()
    .from(reminder)
    .where(eq(reminder.userId, userId))
    .orderBy(reminder.nextAlertDate)

  return result
}

export async function insertReminder(data: InsertReminder): Promise<string> {
  const [result] = await db
    .insert(reminder)
    .values(data)
    .returning({ id: reminder.id })

  return result.id
}

export async function updateReminder(
  id: string,
  data: UpdateReminder
): Promise<string> {
  const [result] = await db
    .update(reminder)
    .set(data)
    .where(eq(reminder.id, id))
    .returning({ id: reminder.id })

  return result.id
}

export async function deleteReminder(id: string): Promise<string> {
  const [result] = await db
    .delete(reminder)
    .where(eq(reminder.id, id))
    .returning({ id: reminder.id })

  return result.id
}

export async function getReminderAlerts(
  reminderId: string
): Promise<SelectAlert[]> {
  const belongToReminder = eq(alert.reminderId, reminderId)
  const isNotAcknowledged = eq(alert.acknowledged, false)
  const result = await db
    .select()
    .from(alert)
    .where(and(belongToReminder, isNotAcknowledged))

  return result
}

export async function updateReminderAlert(
  id: string,
  data: UpdateAlert
): Promise<string> {
  const [result] = await db
    .update(alert)
    .set(data)
    .where(eq(alert.id, id))
    .returning({ id: alert.id })

  return result.id
}
