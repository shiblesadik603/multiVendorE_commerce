import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { AppError } from "../lib/errors.js";

type Role = "BUYER" | "SELLER" | "ADMIN";

export const requireAuth: RequestHandler = (req, _res, next) => {
  const header = req.header("authorization");
  if (!header?.startsWith("Bearer ")) throw new AppError(401, "UNAUTHORIZED", "Missing access token");
  try {
    const payload = jwt.verify(header.slice(7), env.JWT_ACCESS_SECRET) as { sub: string; role: Role };
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch {
    throw new AppError(401, "UNAUTHORIZED", "Invalid or expired access token");
  }
};

export const requireRole =
  (...roles: Role[]): RequestHandler =>
  (req, _res, next) => {
    if (!req.user) throw new AppError(401, "UNAUTHORIZED", "Not authenticated");
    if (!roles.includes(req.user.role)) throw new AppError(403, "FORBIDDEN", "You do not have access to this resource");
    next();
  };
