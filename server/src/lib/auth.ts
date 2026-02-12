import { env } from "../env.ts";
import { betterAuth } from "better-auth";
import { anonymous } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/index.js";
import * as userSchema from "../db/schema/users.js";
import { nanoid } from "nanoid";

let trustedOrigins: Array<string> = [];
if (env.NODE_ENV == "development") {
  trustedOrigins.push(env.CLIENT_URL!);
}

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
  plugins: [
    anonymous({
      generateName: () => {
        const randomId = nanoid();
        const randomUsername = `User-${randomId.slice(3, 6)}`;
        return randomUsername;
      },
    }),
  ],
  trustedOrigins,
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 10 * 60, // 10 mins
    },
  },
  secret: env.BETTER_AUTH_SECRET,
});
