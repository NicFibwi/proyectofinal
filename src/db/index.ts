import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

config({ path: ".env" });

const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL!);

const db = drizzle(sql);

export { db };
