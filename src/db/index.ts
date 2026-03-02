import { neon } from "@neondatabase/serverless";
import { DATABASE_URL } from "astro:env/server";
import { drizzle } from "drizzle-orm/neon-http";

const sql = neon(DATABASE_URL);
export const db = drizzle(sql);

export type DbClient = typeof db;
