import { and, eq, exists } from "drizzle-orm";
import { db, type DbClient } from ".";
import { NotFoundError } from "../lib/error.ts";
import {
  alert,
  type InsertReminder,
  reminder,
  type SelectAlert,
  type SelectReminder,
  type UpdateAlert,
  type UpdateReminder,
} from "./schemas/app.ts";

export async function getReminders(
  userId: string,
  database: DbClient = db,
): Promise<SelectReminder[]> {
  const result = await database
    .select()
    .from(reminder)
    .where(eq(reminder.userId, userId))
    .orderBy(reminder.nextAlertDate);

  return result;
}

export async function insertReminder(
  data: InsertReminder,
  database: DbClient = db,
): Promise<string> {
  const [result] = await database
    .insert(reminder)
    .values(data)
    .returning({ id: reminder.id });

  return result.id;
}

export async function updateReminder(
  id: string,
  userId: string,
  data: UpdateReminder,
  database: DbClient = db,
): Promise<string> {
  const matchId = eq(reminder.id, id);
  const belongToUser = eq(reminder.userId, userId);
  const [result] = await database
    .update(reminder)
    .set(data)
    .where(and(matchId, belongToUser))
    .returning({ id: reminder.id });

  if (!result) throw new NotFoundError("Reminder not found");
  return result.id;
}

export async function deleteReminder(
  id: string,
  userId: string,
  database: DbClient = db,
): Promise<string> {
  const matchId = eq(reminder.id, id);
  const belongToUser = eq(reminder.userId, userId);
  const [result] = await database
    .delete(reminder)
    .where(and(matchId, belongToUser))
    .returning({ id: reminder.id });

  if (!result) throw new NotFoundError("Reminder not found");
  return result.id;
}

export async function getReminderAlerts(
  reminderId: string,
  database: DbClient = db,
): Promise<SelectAlert[]> {
  const belongToReminder = eq(alert.reminderId, reminderId);
  const isNotAcknowledged = eq(alert.acknowledged, false);
  const result = await database
    .select()
    .from(alert)
    .where(and(belongToReminder, isNotAcknowledged));

  return result;
}

export async function updateReminderAlert(
  id: string,
  userId: string,
  data: UpdateAlert,
  database: DbClient = db,
): Promise<string> {
  const matchId = eq(alert.id, id);
  const reminderOwnsAlert = eq(reminder.id, alert.reminderId);
  const reminderBelongToUser = eq(reminder.userId, userId);
  const alertBelongToUser = exists(
    database
      .select()
      .from(reminder)
      .where(and(reminderOwnsAlert, reminderBelongToUser)),
  );
  const [result] = await database
    .update(alert)
    .set(data)
    .where(and(matchId, alertBelongToUser))
    .returning({ id: alert.id });

  if (!result) throw new NotFoundError("Alert not found");
  return result.id;
}
