import { describe, expect, it } from "vite-plus/test";
import { alert, reminder } from "../db/schemas/app.ts";
import { user } from "../db/schemas/auth.ts";
import {
  createAlertSeed,
  createReminderSeed,
  createUserSeed,
  withRollbackTx,
} from "../lib/testing.ts";
import { alertLoader } from "./alert.ts";

describe("alertLoader integration", () => {
  it("loadCollection returns empty entries when filter has no reminderId", async () => {
    await withRollbackTx(async (tx) => {
      const loader = alertLoader(tx);
      const result = await loader.loadCollection({
        collection: "alerts",
        filter: {},
      } as Parameters<typeof loader.loadCollection>[0]);

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
      await tx.insert(alert).values([pendingAlert, acknowledgedAlert, otherReminderAlert]);

      const loader = alertLoader(tx);
      const result = await loader.loadCollection({
        collection: "alerts",
        filter: { reminderId: reminderA.id },
      } as Parameters<typeof loader.loadCollection>[0]);

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
        collection: "alerts",
        filter: { id: `missing-${crypto.randomUUID()}` },
      } as Parameters<typeof loader.loadEntry>[0]);

      expect(result).toBeDefined();
      if (!result) throw new Error("Expected loadEntry result");
      expect("error" in result).toBe(true);
    });
  });
});
