import "dotenv/config";
import { parseEnv, secretSchema } from "@marketplace/common";
import { z } from "zod";

export const env = parseEnv({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(4002),
  DATABASE_URL: z.string().min(1),
  JWT_ACCESS_SECRET: secretSchema("JWT_ACCESS_SECRET"),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
});
