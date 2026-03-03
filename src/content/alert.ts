import type { LiveLoader } from "astro/loaders";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import process from "node:process";
import { db, type DbClient } from "../db/index.ts";
import { getReminderAlerts } from "../db/reminder.ts";
import type { SelectAlert } from "../db/schemas/app.ts";

type EntryFilter = {
  id: string;
};

type CollectionFilter = {
  reminderId?: string;
};

export function alertLoader(
  database: DbClient = db,
): LiveLoader<SelectAlert, EntryFilter, CollectionFilter> {
  return {
    name: "alert-loader",

    loadCollection: async ({ filter }) => {
      try {
        if (!filter?.reminderId) return { entries: [] };

        const alerts = await getReminderAlerts(filter?.reminderId, database);
        const entries = alerts.map((alert) => ({
          id: alert.id,
          data: alert,
        }));

        return { entries };
      } catch (e) {
        return { error: e as Error };
      }
    },
    loadEntry: async ({ filter }: { filter: { id: string } }) => {
      // TODO: Below is a placeholder logic for loadEntry
      // Implement correct logic when we need to use this
      try {
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
