import { describe, expect, it } from "vitest";
import { user } from "../db/schemas/auth.ts";
import { createUserSeed, withRollbackTx } from "../lib/testing.ts";
import { userLoader } from "./user.ts";

describe("userLoader integration", () => {
  it("loadCollection includes seeded user", async () => {
    await withRollbackTx(async (tx) => {
      const seededUser = createUserSeed();
      await tx.insert(user).values(seededUser);

      const loader = userLoader(tx);
      const result = await loader.loadCollection({} as never);

      expect(result).toBeDefined();
      if (!result) throw new Error("Expected loadCollection result");
      expect("entries" in result).toBe(true);
      if ("entries" in result) {
        expect(result.entries.some((entry) => entry.id === seededUser.id)).toBe(
          true,
        );
      }
    });
  });

  it("loadEntry resolves user by id", async () => {
    await withRollbackTx(async (tx) => {
      const seededUser = createUserSeed();
      await tx.insert(user).values(seededUser);

      const loader = userLoader(tx);
      const result = await loader.loadEntry({ filter: { id: seededUser.id } });

      expect(result).toBeDefined();
      if (!result) throw new Error("Expected loadEntry result");
      expect("error" in result).toBe(false);
      if (!("error" in result)) {
        expect(result.id).toBe(seededUser.id);
        expect(result.data?.email).toBe(seededUser.email);
      }
    });
  });

  it("loadEntry resolves user by email", async () => {
    await withRollbackTx(async (tx) => {
      const seededUser = createUserSeed();
      await tx.insert(user).values(seededUser);

      const loader = userLoader(tx);
      const result = await loader.loadEntry({
        filter: { email: seededUser.email },
      });

      expect(result).toBeDefined();
      if (!result) throw new Error("Expected loadEntry result");
      expect("error" in result).toBe(false);
      if (!("error" in result)) {
        expect(result.id).toBe(seededUser.email);
        expect(result.data?.id).toBe(seededUser.id);
      }
    });
  });
});
