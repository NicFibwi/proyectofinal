import { drizzle } from "drizzle-orm/neon-http";
import {neon } from "@neondatabase/serverless";
import {config} from "dotenv"
import postgres from "postgres";

config({path: ".env"});

const sql = neon(process.env.DATABASE_URL!);

const db = drizzle(sql)

export { db };