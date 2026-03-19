/**
 * Test-only shim for astro:env/server
 * Exports server-side environment variables from process.env
 */

export const DATABASE_URL = process.env.DATABASE_URL ?? "";
export const BETTER_AUTH_SECRET = process.env.BETTER_AUTH_SECRET ?? "";
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID ?? "";
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET ?? "";
