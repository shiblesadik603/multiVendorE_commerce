import { createHash, randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { User } from "@prisma/client";
import { env } from "../../config/env.js";
import { AppError } from "../../lib/errors.js";
import { prisma } from "../../lib/prisma.js";
import type { z } from "zod";
import type { loginSchema, registerSchema } from "./auth.schemas.js";

const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");

export const toPublicUser = (u: User) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  phone: u.phone,
  role: u.role,
});

function signAccessToken(user: User) {
  return jwt.sign({ role: user.role }, env.JWT_ACCESS_SECRET, {
    subject: user.id,
    expiresIn: env.ACCESS_TOKEN_TTL,
  } as jwt.SignOptions);
}

async function issueTokens(user: User) {
  const refreshToken = randomBytes(48).toString("hex");
  const expiresAt = new Date(Date.now() + env.REFRESH_TOKEN_TTL_DAYS * 86_400_000);
  await prisma.refreshToken.create({
    data: { userId: user.id, tokenHash: sha256(refreshToken), expiresAt },
  });
  return { accessToken: signAccessToken(user), refreshToken, refreshExpiresAt: expiresAt };
}

export async function register(input: z.infer<typeof registerSchema>) {
  const existing = await prisma.user.findFirst({
    where: { OR: [{ email: input.email }, { phone: input.phone }] },
    select: { email: true },
  });
  if (existing) {
    const field = existing.email === input.email ? "email" : "phone";
    throw new AppError(409, "ALREADY_EXISTS", `An account with this ${field} already exists`);
  }
  const passwordHash = await bcrypt.hash(input.password, 12);
  try {
    return await prisma.user.create({
      data: { name: input.name, email: input.email, phone: input.phone, passwordHash, role: input.role },
    });
  } catch (e: any) {
    if (e?.code === "P2002") throw new AppError(409, "ALREADY_EXISTS", "Email or phone already registered");
    throw e;
  }
}

export async function login(input: z.infer<typeof loginSchema>) {
  const id = input.identifier.toLowerCase();
  const user = await prisma.user.findFirst({ where: { OR: [{ email: id }, { phone: input.identifier }] } });
  // Same error for unknown user and wrong password: do not reveal which accounts exist.
  const ok = user && (await bcrypt.compare(input.password, user.passwordHash));
  if (!user || !ok) throw new AppError(401, "INVALID_CREDENTIALS", "Invalid email/phone or password");
  if (!user.isActive) throw new AppError(403, "ACCOUNT_DISABLED", "This account has been disabled");
  return { user, ...(await issueTokens(user)) };
}

export async function refresh(refreshToken: string | undefined) {
  if (!refreshToken) throw new AppError(401, "UNAUTHORIZED", "Missing refresh token");
  const record = await prisma.refreshToken.findUnique({
    where: { tokenHash: sha256(refreshToken) },
    include: { user: true },
  });
  if (!record || record.revokedAt || record.expiresAt < new Date() || !record.user.isActive) {
    throw new AppError(401, "UNAUTHORIZED", "Invalid refresh token");
  }
  // Rotate: the used token can never be used again.
  await prisma.refreshToken.update({ where: { id: record.id }, data: { revokedAt: new Date() } });
  return { user: record.user, ...(await issueTokens(record.user)) };
}

export async function logout(refreshToken: string | undefined) {
  if (!refreshToken) return;
  await prisma.refreshToken.updateMany({
    where: { tokenHash: sha256(refreshToken), revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

export async function getUser(id: string) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user || !user.isActive) throw new AppError(401, "UNAUTHORIZED", "Account not available");
  return user;
}
