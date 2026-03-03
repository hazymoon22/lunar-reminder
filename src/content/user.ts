import type { LiveLoader } from "astro/loaders";
import { getUserByEmail, getUserById, getUsers } from "../db/auth.ts";
import { db, type DbClient } from "../db/index.ts";
import type { SelectUser } from "../db/schemas/auth.ts";

type EntryFilter = {
  id?: string;
  email?: string;
};

export function userLoader(database: DbClient = db): LiveLoader<
  SelectUser,
  EntryFilter
> {
  return {
    name: "user-loader",

    loadCollection: async () => {
      try {
        const users = await getUsers(database);
        const entries = users.map((user) => ({
          id: user.id,
          data: user,
        }));

        return { entries };
      } catch (e) {
        return { error: e as Error };
      }
    },
    loadEntry: async ({ filter }) => {
      try {
        const id = filter.id;
        if (id) {
          const user = await getUserById(id, database);
          return {
            id,
            data: user,
          };
        }

        const email = filter.email;
        if (email) {
          const user = await getUserByEmail(email, database);
          return {
            id: email,
            data: user,
          };
        }

        return { error: new Error("Entry not found") };
      } catch (_e) {
        return { error: new Error("Entry not found") };
      }
    },
  };
}
