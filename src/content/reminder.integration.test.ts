import { describe, expect, it } from "vitest";
import { reminder } from "../db/schemas/app.ts";
import { user } from "../db/schemas/auth.ts";
import {
  createUserSeed,
  withRollbackTx,
} from "../lib/integration-test-utils.ts";
import { reminderLoader } from "./reminder.ts";

function createReminderSeed(
  userId: string,
  title: string,
  nextAlertDate: Date,
) {
  return {
    id: crypto.randomUUID(),
    title,
    reminderDate: new Date("2026-06-01T00:00:00.000Z"),
    nextAlertDate,
    userId,
    repeat: null,
    alertBefore: 1,
    mailSubject: "Mail subject",
    mailBody: "<p>Mail body</p>",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

describe("reminderLoader integration", () => {
  it("loadCollection returns empty entries when filter has no userId", async () => {
    await withRollbackTx(async (tx) => {
      const loader = reminderLoader(tx);
      const result = await loader.loadCollection({ filter: {} });

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
        "Owner earlier",
        new Date("2026-05-01T00:00:00.000Z"),
      );
      const ownerSecond = createReminderSeed(
        owner.id,
        "Owner later",
        new Date("2026-05-02T00:00:00.000Z"),
      );
      const foreignReminder = createReminderSeed(
        otherUser.id,
        "Foreign",
        new Date("2026-05-01T00:00:00.000Z"),
      );

      await tx.insert(reminder).values([
        ownerSecond,
        ownerFirst,
        foreignReminder,
      ]);

      const loader = reminderLoader(tx);
      const result = await loader.loadCollection({
        filter: { userId: owner.id },
      });

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
      const result = await loader.loadEntry({
        filter: { id: `missing-${crypto.randomUUID()}` },
      });

      expect(result).toBeDefined();
      if (!result) throw new Error("Expected loadEntry result");
      expect("error" in result).toBe(true);
    });
  });
});
