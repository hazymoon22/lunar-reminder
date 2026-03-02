import type { LiveLoader } from "astro/loaders";
import { getUserByEmail, getUserById, getUsers } from "../db/auth.ts";
import type { SelectUser } from "../db/schemas/auth.ts";

type EntryFilter = {
  id?: string;
  email?: string;
};

export function userLoader(): LiveLoader<SelectUser, EntryFilter> {
  return {
    name: "user-loader",

    loadCollection: async () => {
      try {
        const users = await getUsers();
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
          const user = await getUserById(id);
          return {
            id,
            data: user,
          };
        }

        const email = filter.email;
        if (email) {
          const user = await getUserByEmail(email);
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
