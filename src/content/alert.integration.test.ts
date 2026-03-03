import { describe, expect, it } from "vitest";
import { alert, reminder } from "../db/schemas/app.ts";
import { user } from "../db/schemas/auth.ts";
import {
  createUserSeed,
  withRollbackTx,
} from "../lib/integration-test-utils.ts";
import { alertLoader } from "./alert.ts";

function createReminderSeed(userId: string) {
  return {
    id: crypto.randomUUID(),
    title: "Alert parent reminder",
    reminderDate: new Date("2026-06-01T00:00:00.000Z"),
    nextAlertDate: new Date("2026-05-31T00:00:00.000Z"),
    userId,
    repeat: null,
    alertBefore: 1,
    mailSubject: "subject",
    mailBody: "<p>body</p>",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

function createAlertSeed(reminderId: string, acknowledged: boolean) {
  return {
    id: crypto.randomUUID(),
    reminderId,
    alertDate: new Date("2026-05-31T00:00:00.000Z"),
    acknowledged,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

describe("alertLoader integration", () => {
  it("loadCollection returns empty entries when filter has no reminderId", async () => {
    await withRollbackTx(async (tx) => {
      const loader = alertLoader(tx);
      const result = await loader.loadCollection({ filter: {} });

      expect(result).toBeDefined();
      if (!result) throw new Error("Expected loadCollection result");
      expect("entries" in result).toBe(true);
      if ("entries" in result) {
        expect(result.entries).toEqual([]);
      }
    });
  });

  it("loadCollection returns only non-acknowledged alerts for reminder", async () => {
    await withRollbackTx(async (tx) => {
      const seededUser = createUserSeed();
      await tx.insert(user).values(seededUser);

      const reminderA = createReminderSeed(seededUser.id);
      const reminderB = createReminderSeed(seededUser.id);
      await tx.insert(reminder).values([reminderA, reminderB]);

      const pendingAlert = createAlertSeed(reminderA.id, false);
      const acknowledgedAlert = createAlertSeed(reminderA.id, true);
      const otherReminderAlert = createAlertSeed(reminderB.id, false);
      await tx
        .insert(alert)
        .values([pendingAlert, acknowledgedAlert, otherReminderAlert]);

      const loader = alertLoader(tx);
      const result = await loader.loadCollection({
        filter: { reminderId: reminderA.id },
      });

      expect(result).toBeDefined();
      if (!result) throw new Error("Expected loadCollection result");
      expect("entries" in result).toBe(true);
      if ("entries" in result) {
        expect(result.entries).toHaveLength(1);
        expect(result.entries[0].id).toBe(pendingAlert.id);
      }
    });
  });

  it("loadEntry returns error for non-existent file id", async () => {
    await withRollbackTx(async (tx) => {
      const loader = alertLoader(tx);
      const result = await loader.loadEntry({
        filter: { id: `missing-${crypto.randomUUID()}` },
      });

      expect(result).toBeDefined();
      if (!result) throw new Error("Expected loadEntry result");
      expect("error" in result).toBe(true);
    });
  });
});
