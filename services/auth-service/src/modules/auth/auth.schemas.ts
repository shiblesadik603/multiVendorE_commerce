import { z } from "zod";

// Bangladesh-friendly but permissive: optional +, 10-15 digits.
const phone = z
  .string()
  .trim()
  .regex(/^\+?\d{10,15}$/, "Enter a valid phone number");

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().toLowerCase().email("Enter a valid email").max(254),
  phone,
  password: z.string().min(6, "Password must be at least 6 characters").max(72),
  role: z.enum(["BUYER", "SELLER"]).default("BUYER"),
});

export const loginSchema = z.object({
  identifier: z.string().trim().min(1, "Email or phone is required").max(254),
  password: z.string().min(1, "Password is required").max(72),
});
