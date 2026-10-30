import "dotenv/config";
import { parseEnv, secretSchema } from "@marketplace/common";
import { z } from "zod";

export const env = parseEnv({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(4001),
  DATABASE_URL: z.string().min(1),
  JWT_ACCESS_SECRET: secretSchema("JWT_ACCESS_SECRET"),
  ACCESS_TOKEN_TTL: z.string().default("15m"),
  REFRESH_TOKEN_TTL_DAYS: z.coerce.number().default(7),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
  REDIS_URL: z.string().default("redis://localhost:6379"),
  AUTH_RATE_LIMIT_MAX: z.coerce.number().default(20),
  AUTH_RATE_LIMIT_WINDOW_SECONDS: z.coerce.number().default(900),
});
