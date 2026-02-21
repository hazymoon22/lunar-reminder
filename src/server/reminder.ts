import { Lunar } from 'lunar-typescript'
import type { InsertReminder, UpdateReminder } from '../db/schema.ts'
import {
  dateToLunar,
  getLunarNextMonth,
  getLunarNextYear,
  solarToDate
} from '../lib/lunar.ts'
import { ZRepeatOption } from '../models/index.ts'

export function getNextAlertDate(
  reminder: InsertReminder | UpdateReminder
): Date | undefined {
  const { repeat, reminderDate } = reminder
  if (!reminderDate) return undefined

  const lunar = dateToLunar(reminderDate)

  const now = new Date()
  const lunarNow = Lunar.fromDate(now)

  if (lunar >= lunarNow) return solarToDate(lunar.getSolar())

  if (repeat === ZRepeatOption.enum.yearly) {
    const lunarNextYear = getLunarNextYear(lunar)
    return lunarNextYear ? solarToDate(lunarNextYear.getSolar()) : undefined
  }

  if (repeat === ZRepeatOption.enum.monthly) {
    const lunarNextMonth = getLunarNextMonth(lunar)
    return lunarNextMonth ? solarToDate(lunarNextMonth.getSolar()) : undefined
  }

  return undefined
}
