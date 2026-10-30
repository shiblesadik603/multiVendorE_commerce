import { z } from "zod";

/** Fail fast at startup if a required secret is missing or weak (secrets only come from env). */
export const secretSchema = (name: string) =>
  z.string({ required_error: `${name} is required` }).min(32, `${name} must be at least 32 characters`);

export function parseEnv<T extends z.ZodRawShape>(shape: T, source: NodeJS.ProcessEnv = process.env) {
  return z.object(shape).parse(source);
}
