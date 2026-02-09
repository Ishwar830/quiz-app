import z from "zod";
import path from "node:path";
import dotenv from "dotenv";

const environment = process.env.NODE_ENV || "development";
const envFileName = environment == "development" ? ".env.local" : ".env";
const envPath = path.resolve(process.cwd(), envFileName);

dotenv.config({ path: envPath });

const envSchema = z
  .object({
    NODE_ENV: z.enum(["development", "production"]).default("development"),
    PORT: z.coerce.number().default(8000),
    CLIENT_URL: z.url().optional(),
    BETTER_AUTH_SECRET: z.string(),
    DATABASE_URL: z.url(),
    REDIS_URL: z.url(),
    GEMINI_API_KEY: z.string(),
  })
  .refine((data) => {
    if (data.NODE_ENV == "development") return data.CLIENT_URL !== undefined;
    return true;
  });

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.log(z.prettifyError(_env.error));
  process.exit(1);
}

export const env = _env.data;
