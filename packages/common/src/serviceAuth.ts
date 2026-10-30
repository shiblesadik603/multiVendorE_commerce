import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "./errors.js";

/**
 * Service-to-service auth: a short-lived (60s) JWT signed with INTERNAL_JWT_SECRET,
 * sent in the `x-service-token` header. It is a different secret from user tokens, so a user
 * token can never be used to call an internal endpoint and vice versa.
 */
const HEADER = "x-service-token";

export function signServiceToken(serviceName: string, secret: string = process.env.INTERNAL_JWT_SECRET ?? "") {
  return jwt.sign({ svc: serviceName }, secret, { issuer: "marketplace-internal", expiresIn: 60 });
}

/** Headers to attach to a downstream call. Also forwards the correlation id. */
export function serviceHeaders(serviceName: string, requestId?: string): Record<string, string> {
  const h: Record<string, string> = { [HEADER]: signServiceToken(serviceName) };
  if (requestId) h["x-request-id"] = requestId;
  return h;
}

/** Protects internal endpoints. Optionally restrict to specific calling services. */
export const requireService =
  (allowed?: string[], secret: string = process.env.INTERNAL_JWT_SECRET ?? ""): RequestHandler =>
  (req, _res, next) => {
    const token = req.header(HEADER);
    if (!token) throw new AppError(401, "UNAUTHORIZED", "Missing service token");
    try {
      const p = jwt.verify(token, secret, { algorithms: ["HS256"], issuer: "marketplace-internal" }) as { svc: string };
      if (allowed && !allowed.includes(p.svc)) throw new AppError(403, "FORBIDDEN", "Service not allowed");
      req.service = p.svc;
      next();
    } catch (e) {
      if (e instanceof AppError) throw e;
      throw new AppError(401, "UNAUTHORIZED", "Invalid service token");
    }
  };
