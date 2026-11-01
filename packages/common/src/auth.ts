import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "./errors.js";
import type { Role } from "./types.js";

/**
 * Verifies the user's access token (issued by auth-service) and sets req.user.
 * Every service validates tokens itself, so no network call to auth-service is needed per request.
 */
export const requireAuth =
  (secret: string = process.env.JWT_ACCESS_SECRET ?? ""): RequestHandler =>
  (req, _res, next) => {
    const header = req.header("authorization");
    if (!header?.startsWith("Bearer ")) throw new AppError(401, "UNAUTHORIZED", "Missing access token");
    try {
      const payload = jwt.verify(header.slice(7), secret, { algorithms: ["HS256"] }) as { sub: string; role: Role };
      req.user = { id: payload.sub, role: payload.role };
      next();
    } catch {
      throw new AppError(401, "UNAUTHORIZED", "Invalid or expired access token");
    }
  };

/** Must run after requireAuth. 401 if not logged in, 403 if the role is not allowed. */
export const requireRole =
  (...roles: Role[]): RequestHandler =>
  (req, _res, next) => {
    if (!req.user) throw new AppError(401, "UNAUTHORIZED", "Not authenticated");
    if (!roles.includes(req.user.role)) throw new AppError(403, "FORBIDDEN", "You do not have access to this resource");
    next();
  };
