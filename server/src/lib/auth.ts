import "dotenv/config";
import { betterAuth } from "better-auth";
import { anonymous } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/index.js";
import * as userSchema from "../db/schema/users.js";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    schema: userSchema,
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 16,
  },
  plugins: [anonymous()],
  trustedOrigins: [process.env.CLIENT_URL!],
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 10 * 60, // 10 mins
    },
  },
});
