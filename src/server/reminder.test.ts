import { Lunar } from "lunar-typescript";
import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";
import { solarToDate } from "../lib/lunar.ts";
import { getNextAlertDate } from "./reminder.ts";

type ReminderInput = {
  title: string;
  reminderDate: Date;
  repeat: "monthly" | "yearly" | null;
  alertBefore: number | null;
  mailSubject: string;
  mailBody: string;
};

function makeReminder(overrides: Partial<ReminderInput> = {}): ReminderInput {
  return {
    title: "Test Reminder",
    reminderDate: new Date(Date.UTC(2026, 1, 27)),
    repeat: null,
    alertBefore: null,
    mailSubject: "Subject",
    mailBody: "Body",
    ...overrides,
  };
}

describe("getNextAlertDate", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(Date.UTC(2026, 1, 27, 12, 0, 0)));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns undefined when reminderDate is missing", () => {
    const result = getNextAlertDate({
      repeat: null,
    } as never);

    expect(result).toBeUndefined();
  });

  it("returns same date when reminder date is today/future", () => {
    const lunarNow = Lunar.fromDate(new Date());
    const reminderLunar = Lunar.fromYmd(
      lunarNow.getYear(),
      Math.abs(lunarNow.getMonth()),
      lunarNow.getDay() + 1,
    );
    const reminder = makeReminder({
      reminderDate: new Date(
        Date.UTC(
          reminderLunar.getYear(),
          Math.abs(reminderLunar.getMonth()) - 1,
          reminderLunar.getDay(),
        ),
      ),
      repeat: null,
    });
    const result = getNextAlertDate(reminder as never);

    expect(result).toBeDefined();
    expect(result?.getTime()).toBe(solarToDate(reminderLunar.getSolar()).getTime());
  });

  it("returns undefined for past non-repeating reminder", () => {
    const lunarNow = Lunar.fromDate(new Date());
    const reminderLunar = Lunar.fromYmd(
      lunarNow.getYear(),
      Math.abs(lunarNow.getMonth()),
      lunarNow.getDay() - 1,
    );
    const reminder = makeReminder({
      reminderDate: new Date(
        Date.UTC(
          reminderLunar.getYear(),
          Math.abs(reminderLunar.getMonth()) - 1,
          reminderLunar.getDay(),
        ),
      ),
      repeat: null,
    });
    const result = getNextAlertDate(reminder as never);

    expect(result).toBeUndefined();
  });

  it("returns a future date for past yearly reminder", () => {
    const reminder = makeReminder({
      reminderDate: new Date(Date.UTC(2025, 0, 20)),
      repeat: "yearly",
    });
    const result = getNextAlertDate(reminder as never);

    expect(result).toBeDefined();
    expect((result as Date).getTime()).toBeGreaterThan(new Date(Date.UTC(2026, 1, 27)).getTime());
  });

  it("returns a future date for past monthly reminder", () => {
    const reminder = makeReminder({
      reminderDate: new Date(Date.UTC(2026, 0, 15)),
      repeat: "monthly",
    });
    const result = getNextAlertDate(reminder as never);

    expect(result).toBeDefined();
    expect((result as Date).getTime()).toBeGreaterThan(new Date(Date.UTC(2026, 1, 27)).getTime());
  });
});
