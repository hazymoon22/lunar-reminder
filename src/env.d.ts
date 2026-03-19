/// <reference types="astro/client" />

import "../.astro/env.d.ts";

type AuthSession = NonNullable<
  Awaited<ReturnType<typeof import("./lib/auth.ts").auth.api.getSession>>
>;

declare global {
  namespace App {
    interface Locals {
      user: AuthSession["user"] | null;
      session: AuthSession["session"] | null;
    }
  }
}

export {};
