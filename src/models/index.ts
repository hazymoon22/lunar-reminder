import { z } from 'zod'
import { REPEAT_FREQUENCIES, ZSelectReminder } from '../db/schema'

export const ZRepeatOption = z.enum(REPEAT_FREQUENCIES)

export const ZReminderCard = ZSelectReminder.extend({
  nextAlertDateLunar: z.coerce.date().optional(),
  dueIn: z.string()
})

export type ReminderCard = z.infer<typeof ZReminderCard>
