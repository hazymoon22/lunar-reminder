/**
 * Test-only shim for astro:env/client
 * Exports client-side environment variables from process.env
 */

export const APP_URL = process.env.APP_URL ?? "http://localhost:4321";
