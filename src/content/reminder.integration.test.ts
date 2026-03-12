import { describe, expect, it } from "vitest";
import { reminder } from "../db/schemas/app.ts";
import { user } from "../db/schemas/auth.ts";
import {
  createReminderSeed,
  createUserSeed,
  withRollbackTx,
} from "../lib/testing.ts";
import { reminderLoader } from "./reminder.ts";

describe("reminderLoader integration", () => {
  it("loadCollection returns empty entries when filter has no userId", async () => {
    await withRollbackTx(async (tx) => {
      const loader = reminderLoader(tx);
      const result = await loader.loadCollection(
        {
          collection: "reminders",
          filter: {},
        } as Parameters<typeof loader.loadCollection>[0],
      );

      expect(result).toBeDefined();
      if (!result) throw new Error("Expected loadCollection result");
      expect("entries" in result).toBe(true);
      if ("entries" in result) {
        expect(result.entries).toEqual([]);
      }
    });
  });

  it("loadCollection returns only reminders for requested user", async () => {
    await withRollbackTx(async (tx) => {
      const owner = createUserSeed();
      const otherUser = createUserSeed();
      await tx.insert(user).values([owner, otherUser]);

      const ownerFirst = createReminderSeed(
        owner.id,
        {
          title: "Owner earlier",
          nextAlertDate: new Date("2026-05-01T00:00:00.000Z"),
          reminderDate: new Date("2026-06-01T00:00:00.000Z"),
        },
      );
      const ownerSecond = createReminderSeed(
        owner.id,
        {
          title: "Owner later",
          nextAlertDate: new Date("2026-05-02T00:00:00.000Z"),
          reminderDate: new Date("2026-06-01T00:00:00.000Z"),
        },
      );
      const foreignReminder = createReminderSeed(
        otherUser.id,
        {
          title: "Foreign",
          nextAlertDate: new Date("2026-05-01T00:00:00.000Z"),
          reminderDate: new Date("2026-06-01T00:00:00.000Z"),
        },
      );

      await tx.insert(reminder).values([
        ownerSecond,
        ownerFirst,
        foreignReminder,
      ]);

      const loader = reminderLoader(tx);
      const result = await loader.loadCollection(
        {
          collection: "reminders",
          filter: { userId: owner.id },
        } as Parameters<typeof loader.loadCollection>[0],
      );

      expect(result).toBeDefined();
      if (!result) throw new Error("Expected loadCollection result");
      expect("entries" in result).toBe(true);
      if ("entries" in result) {
        expect(result.entries).toHaveLength(2);
        expect(result.entries[0].id).toBe(ownerFirst.id);
        expect(result.entries[1].id).toBe(ownerSecond.id);
      }
    });
  });

  it("loadEntry returns error for non-existent file id", async () => {
    await withRollbackTx(async (tx) => {
      const loader = reminderLoader(tx);
      const result = await loader.loadEntry(
        {
          collection: "reminders",
          filter: { id: `missing-${crypto.randomUUID()}` },
        } as Parameters<typeof loader.loadEntry>[0],
      );

      expect(result).toBeDefined();
      if (!result) throw new Error("Expected loadEntry result");
      expect("error" in result).toBe(true);
    });
  });
});
