import { env } from "../env.ts";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-serverless";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import * as userSchema from "./schema/users.ts";
import * as quizSchema from "./schema/quizzes.ts";
import * as gameSchema from "./schema/game.ts";
import { Pool as NeonPool } from "@neondatabase/serverless";
import { Pool as PgPool } from "pg";

const schema = {
  ...userSchema,
  ...quizSchema,
  ...gameSchema,
};

const isProduction = env.NODE_ENV === "production";
const DATABASE_URL = env.DATABASE_URL;

function createDb() {
  if (isProduction) {
    // Use Neon serverless for production
    const pool = new NeonPool({ connectionString: DATABASE_URL });
    return drizzleNeon(pool, {
      casing: "snake_case",
      schema,
    });
  } else {
    // Use standard pg for local development
    const pool = new PgPool({ connectionString: DATABASE_URL });
    return drizzlePg(pool, {
      casing: "snake_case",
      schema,
    });
  }
}

export const db = createDb();
