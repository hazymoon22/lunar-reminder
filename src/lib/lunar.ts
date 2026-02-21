import { Lunar, type Solar } from 'lunar-typescript'

export function solarToDate(solar: Solar): Date {
  const year = solar.getYear()
  const month = solar.getMonth() - 1
  const day = solar.getDay()

  return new Date(year, month, day)
}

export function lunarToDate(lunar: Lunar): Date {
  const year = lunar.getYear()
  const month = Math.abs(lunar.getMonth()) + 1
  const day = lunar.getDay()

  return new Date(year, month, day)
}

export function dateToLunar(date: Date): Lunar {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return Lunar.fromYmd(year, month, day)
}

export function getLunarNextYear(lunar: Lunar): Lunar | null {
  const currentYear = lunar.getYear()
  const targetYear = currentYear + 1
  const month = Math.abs(lunar.getMonth()) // Ignore leap status for anniversary
  const day = lunar.getDay()
  // Try to create the date. If it fails (e.g. 30th day in a 29-day month),
  // then we decide there is no equivalent date in the next year.
  try {
    return Lunar.fromYmd(targetYear, month, day)
  } catch (_e) {
    return null
  }
}

export function getLunarNextMonth(lunar: Lunar): Lunar | null {
  const currentYear = lunar.getYear()
  const currentMonth = lunar.getMonth()
  const targetMonth = currentMonth + 1
  const day = lunar.getDay()
  // Try to create the date. If it fails (e.g. 30th day in a 29-day month),
  // then we decide there is no equivalent date in the next month.
  try {
    return Lunar.fromYmd(currentYear, targetMonth, day)
  } catch (_e) {
    return null
  }
}
