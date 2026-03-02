import {
  boolean,
  date,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { z } from "zod";
import { user } from "./auth.ts";

export const REPEAT_FREQUENCIES = ["monthly", "yearly"] as const;

export const reminder = pgTable("reminder", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  reminderDate: date("reminder_date", { mode: "date" }).notNull(),
  nextAlertDate: date("next_alert_date", { mode: "date" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  repeat: text("repeat", {
    enum: REPEAT_FREQUENCIES,
  }),
  alertBefore: integer("alert_before"),
  mailSubject: text("mail_subject").notNull(),
  mailBody: text("mail_body").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const ZSelectReminder = createSelectSchema(reminder);
export type SelectReminder = z.infer<typeof ZSelectReminder>;

export const ZInsertReminder = createInsertSchema(reminder, {
  reminderDate: z.coerce.date(),
  nextAlertDate: z.coerce.date().optional(),
}).omit({
  createdAt: true,
  updatedAt: true,
});

export type InsertReminder = z.infer<typeof ZInsertReminder>;

export const ZUpdateReminder = createUpdateSchema(reminder, {
  reminderDate: z.coerce.date().optional(),
  nextAlertDate: z.coerce.date().optional(),
}).omit({
  createdAt: true,
  updatedAt: true,
});
export type UpdateReminder = z.infer<typeof ZUpdateReminder>;

export const alert = pgTable("alert", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  reminderId: uuid("reminder_id")
    .notNull()
    .references(() => reminder.id, { onDelete: "cascade" }),
  alertDate: date("alert_date", { mode: "date" }).notNull(),
  acknowledged: boolean("acknowledged").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const ZSelectAlert = createSelectSchema(alert);
export type SelectAlert = z.infer<typeof ZSelectAlert>;

export const ZUpdateAlert = createUpdateSchema(alert);
export type UpdateAlert = z.infer<typeof ZUpdateAlert>;
