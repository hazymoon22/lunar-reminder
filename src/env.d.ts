/// <reference types="astro/client" />
/// <reference path="../.astro/env.d.ts" />

type AuthSession = NonNullable<
  Awaited<ReturnType<typeof import("./lib/auth.ts").auth.api.getSession>>
>;

declare namespace App {
  interface Locals {
    user: AuthSession["user"] | null;
    session: AuthSession["session"] | null;
  }
}
