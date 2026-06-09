import * as schema from "./schema";
import { API_ENV } from "@traject/env/server";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const pool = postgres(API_ENV.DATABASE_URL, {});

const db = drizzle(pool, { schema });

export { db };

export * from "./schema";

export * from "drizzle-orm";

export async function closeDatabase() {
  await pool.end();
}
