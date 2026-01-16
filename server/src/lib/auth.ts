import "dotenv/config";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/neon.js";
import { user } from "../db/schema.js";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    schema: {
      user
    },
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 16,
  },
  trustedOrigins: [process.env.CLIENT_URL!],
});
