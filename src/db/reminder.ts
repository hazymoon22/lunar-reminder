import { and, eq, exists } from 'drizzle-orm'
import { db } from '.'
import { NotFoundError } from '../lib/error.ts'
import {
  alert,
  reminder,
  type InsertReminder,
  type SelectAlert,
  type SelectReminder,
  type UpdateAlert,
  type UpdateReminder
} from './schemas/app.ts'

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
  userId: string,
  data: UpdateReminder
): Promise<string> {
  const matchId = eq(reminder.id, id)
  const belongToUser = eq(reminder.userId, userId)
  const [result] = await db
    .update(reminder)
    .set(data)
    .where(and(matchId, belongToUser))
    .returning({ id: reminder.id })

  if (!result) throw new NotFoundError('Reminder not found')
  return result.id
}

export async function deleteReminder(
  id: string,
  userId: string
): Promise<string> {
  const matchId = eq(reminder.id, id)
  const belongToUser = eq(reminder.userId, userId)
  const [result] = await db
    .delete(reminder)
    .where(and(matchId, belongToUser))
    .returning({ id: reminder.id })

  if (!result) throw new NotFoundError('Reminder not found')
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
  userId: string,
  data: UpdateAlert
): Promise<string> {
  const matchId = eq(alert.id, id)
  const reminderOwnsAlert = eq(reminder.id, alert.reminderId)
  const reminderBelongToUser = eq(reminder.userId, userId)
  const alertBelongToUser = exists(
    db
      .select()
      .from(reminder)
      .where(and(reminderOwnsAlert, reminderBelongToUser))
  )
  const [result] = await db
    .update(alert)
    .set(data)
    .where(and(matchId, alertBelongToUser))
    .returning({ id: alert.id })

  if (!result) throw new NotFoundError('Alert not found')
  return result.id
}
