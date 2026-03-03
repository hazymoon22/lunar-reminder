import { drizzle } from "drizzle-orm/neon-serverless";
import { DATABASE_URL } from "astro:env/server";

export const db = drizzle(DATABASE_URL);

export type DbClient = typeof db;
