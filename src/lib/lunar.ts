import { Lunar, type Solar } from "lunar-typescript";

export function solarToDate(solar: Solar): Date {
  const year = solar.getYear();
  const month = solar.getMonth() - 1;
  const day = solar.getDay();
  const timestamp = Date.UTC(year, month, day);

  return new Date(timestamp);
}

export function lunarToDate(lunar: Lunar): Date {
  const year = lunar.getYear();
  const month = Math.abs(lunar.getMonth()) - 1;
  const day = lunar.getDay();
  const timestamp = Date.UTC(year, month, day);

  return new Date(timestamp);
}

export function dateToLunar(date: Date): Lunar {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return Lunar.fromYmd(year, month, day);
}

export function getLunarCurrentYear(lunar: Lunar): Lunar | null {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = Math.abs(lunar.getMonth());
  const day = lunar.getDay();

  // Try to create the date. If it fails (e.g. 30th day in a 29-day month),
  // then we decide there is no equivalent date in the next year.
  try {
    return Lunar.fromYmd(year, month, day);
  } catch (_e) {
    return null;
  }
}

export function getLunarNextYear(lunar: Lunar): Lunar | null {
  const now = new Date();
  const currentYear = now.getUTCFullYear();
  const targetYear = currentYear + 1;
  const month = Math.abs(lunar.getMonth());
  const day = lunar.getDay();
  // Try to create the date. If it fails (e.g. 30th day in a 29-day month),
  // then we decide there is no equivalent date in the next year.
  try {
    return Lunar.fromYmd(targetYear, month, day);
  } catch (_e) {
    return null;
  }
}

export function getLunarCurrentMonth(lunar: Lunar): Lunar | null {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth() + 1;
  const day = lunar.getDay();

  // Try to create the date. If it fails (e.g. 30th day in a 29-day month),
  // then we decide there is no equivalent date in the next month.
  try {
    return Lunar.fromYmd(year, month, day);
  } catch (_e) {
    return null;
  }
}

export function getLunarNextMonth(lunar: Lunar): Lunar | null {
  const now = new Date();
  const currentYear = now.getUTCFullYear();
  const currentMonth = now.getUTCMonth();
  const targetMonth = currentMonth + 2;
  const day = lunar.getDay();
  // Try to create the date. If it fails (e.g. 30th day in a 29-day month),
  // then we decide there is no equivalent date in the next month.
  try {
    return Lunar.fromYmd(currentYear, targetMonth, day);
  } catch (_e) {
    return null;
  }
}
