import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import type { PgDatabase } from "drizzle-orm/pg-core";
import { DATABASE_URL } from "astro:env/server";

// Stateless HTTP-based client for app runtime
export const db = drizzle({ client: neon(DATABASE_URL) });

export type DatabaseClient = PgDatabase<any, Record<string, never>, any>;
