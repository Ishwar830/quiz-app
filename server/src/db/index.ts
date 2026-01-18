import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-serverless";
import * as userSchema from "./schema/users.ts";
import * as quizSchema from "./schema/quizzes.ts";
import { Pool } from "@neondatabase/serverless";

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
export const db = drizzle(pool, {
  casing: "snake_case",
  schema: {
    ...userSchema,
    ...quizSchema,
  },
});
