import { Lunar } from "lunar-typescript";
import type { InsertReminder, UpdateReminder } from "../db/schemas/app.ts";
import {
  dateToLunar,
  getLunarCurrentMonth,
  getLunarCurrentYear,
  getLunarNextMonth,
  getLunarNextYear,
  solarToDate,
} from "../lib/lunar.ts";
import { ZRepeatOption } from "../models/index.ts";

export function getNextAlertDate(reminder: InsertReminder | UpdateReminder): Date | undefined {
  const { repeat, reminderDate } = reminder;
  if (!reminderDate) return undefined;

  const lunar = dateToLunar(reminderDate);

  const now = new Date();
  const lunarNow = Lunar.fromDate(now);

  const lunarTime = solarToDate(lunar.getSolar()).getTime();
  const nowTime = solarToDate(lunarNow.getSolar()).getTime();

  if (lunarTime >= nowTime) return solarToDate(lunar.getSolar());

  if (repeat === ZRepeatOption.enum.yearly) {
    return getNextAlertDateYearly(lunar);
  }

  if (repeat === ZRepeatOption.enum.monthly) {
    return getNextAlertDateMonthly(lunar);
  }

  return undefined;
}

function getNextAlertDateYearly(lunar: Lunar): Date | undefined {
  const now = new Date();
  const lunarNow = Lunar.fromDate(now);
  const lunarCurrentYear = getLunarCurrentYear(lunar);
  if (!lunarCurrentYear) return undefined;

  const lunarTime = solarToDate(lunarCurrentYear.getSolar()).getTime();
  const nowTime = solarToDate(lunarNow.getSolar()).getTime();

  if (lunarTime >= nowTime) return solarToDate(lunarCurrentYear.getSolar());

  const lunarNextYear = getLunarNextYear(lunarCurrentYear);
  if (!lunarNextYear) return undefined;

  return solarToDate(lunarNextYear.getSolar());
}

function getNextAlertDateMonthly(lunar: Lunar): Date | undefined {
  const now = new Date();
  const lunarNow = Lunar.fromDate(now);
  const lunarCurrentMonth = getLunarCurrentMonth(lunar);
  if (!lunarCurrentMonth) return undefined;

  const lunarTime = solarToDate(lunarCurrentMonth.getSolar()).getTime();
  const nowTime = solarToDate(lunarNow.getSolar()).getTime();

  if (lunarTime >= nowTime) return solarToDate(lunarCurrentMonth.getSolar());

  const lunarNextMonth = getLunarNextMonth(lunarCurrentMonth);
  if (!lunarNextMonth) return undefined;

  return solarToDate(lunarNextMonth.getSolar());
}
