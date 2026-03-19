import { z } from "zod";
import { REPEAT_FREQUENCIES, ZInsertReminder, ZSelectReminder } from "../db/schemas/app.ts";

export const ZRepeatOption = z.enum(REPEAT_FREQUENCIES);

export const ZReminderCard = ZSelectReminder.extend({
  nextAlertDateLunar: z.coerce.date().optional(),
  dueIn: z.string(),
});
export type ReminderCard = z.infer<typeof ZReminderCard>;

export const ZApiCreateReminder = ZInsertReminder.omit({
  userId: true,
});
export type ApiCreateReminder = z.infer<typeof ZApiCreateReminder>;

export const ZSelectReminderList = z.array(ZSelectReminder);
