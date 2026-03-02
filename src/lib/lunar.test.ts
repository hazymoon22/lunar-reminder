import { Lunar, Solar } from "lunar-typescript";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  dateToLunar,
  getLunarCurrentMonth,
  getLunarCurrentYear,
  getLunarNextMonth,
  getLunarNextYear,
  lunarToDate,
  solarToDate,
} from "./lunar.ts";

describe("lunar.ts", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(Date.UTC(2026, 1, 27, 0, 0, 0)));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("converts Solar to UTC Date with correct month offset", () => {
    const solar = Solar.fromYmd(2026, 3, 15);
    const date = solarToDate(solar);

    expect(date.toISOString()).toBe("2026-03-15T00:00:00.000Z");
  });

  it("converts Lunar to UTC Date with absolute month handling", () => {
    const lunar = Lunar.fromYmd(2026, 1, 10);
    const date = lunarToDate(lunar);

    expect(date.toISOString()).toBe("2026-01-10T00:00:00.000Z");
  });

  it("converts Date to Lunar", () => {
    const lunar = dateToLunar(new Date(2026, 0, 10));

    expect(lunar.getYear()).toBe(2026);
    expect(Math.abs(lunar.getMonth())).toBe(1);
    expect(lunar.getDay()).toBe(10);
  });

  it("builds lunar current year from now year", () => {
    const source = Lunar.fromYmd(2024, 8, 12);
    const result = getLunarCurrentYear(source);

    expect(result).not.toBeNull();
    expect(result?.getYear()).toBe(2026);
    expect(Math.abs(result?.getMonth() ?? 0)).toBe(8);
    expect(result?.getDay()).toBe(12);
  });

  it("builds lunar next year from now year + 1", () => {
    const source = Lunar.fromYmd(2024, 8, 12);
    const result = getLunarNextYear(source);

    expect(result).not.toBeNull();
    expect(result?.getYear()).toBe(2027);
    expect(Math.abs(result?.getMonth() ?? 0)).toBe(8);
    expect(result?.getDay()).toBe(12);
  });

  it("builds lunar current month from current UTC month", () => {
    const source = Lunar.fromYmd(2024, 3, 9);
    const result = getLunarCurrentMonth(source);

    expect(result).not.toBeNull();
    expect(result?.getYear()).toBe(2026);
    expect(Math.abs(result?.getMonth() ?? 0)).toBe(2);
    expect(result?.getDay()).toBe(9);
  });

  it("builds lunar next month from current UTC month + 1", () => {
    const source = Lunar.fromYmd(2024, 3, 9);
    const result = getLunarNextMonth(source);

    expect(result).not.toBeNull();
    expect(result?.getYear()).toBe(2026);
    expect(Math.abs(result?.getMonth() ?? 0)).toBe(3);
    expect(result?.getDay()).toBe(9);
  });
});
