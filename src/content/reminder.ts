import type { LiveLoader } from "astro/loaders";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import process from "node:process";
import { getReminders } from "../db/reminder.ts";
import type { SelectReminder } from "../db/schemas/app.ts";

type EntryFilter = {
  id: string;
};

type CollectionFilter = {
  userId?: string;
};

export function reminderLoader(): LiveLoader<
  SelectReminder,
  EntryFilter,
  CollectionFilter
> {
  return {
    name: "reminder-loader",

    loadCollection: async ({ filter }) => {
      try {
        if (!filter?.userId) return { entries: [] };

        const reminders = await getReminders(filter?.userId);
        const entries = reminders.map((reminder) => ({
          id: reminder.id,
          data: reminder,
        }));

        return { entries };
      } catch (e) {
        return { error: e as Error };
      }
    },
    loadEntry: async ({ filter }: { filter: { id: string } }) => {
      try {
        // TODO: Below is a placeholder logic for loadEntry
        // Implement correct logic when we need to use this
        const id = filter.id;

        if (!id) return { error: new Error("ID is required") };

        const content = await readFile(
          join(process.cwd(), "src/data", `${id}.json`),
          "utf-8",
        );
        const data = JSON.parse(content);
        return {
          id,
          data,
          rendered: { html: data.mail_body.replace(/\n/g, "<br/>") },
        };
      } catch (_e) {
        return { error: new Error("Entry not found") };
      }
    },
  };
}
