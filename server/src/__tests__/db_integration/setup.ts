import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db } from "../../db/index.ts";

export async function setup() {
  console.log("Running global migrations...");
  await migrate(db, { migrationsFolder: "./drizzle" });
}
