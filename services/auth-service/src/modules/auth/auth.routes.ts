import { Router, type Response } from "express";
import rateLimit from "express-rate-limit";
import { env } from "../../config/env.js";
import { requireAuth } from "../../middleware/auth.js";
import { loginSchema, registerSchema } from "./auth.schemas.js";
import * as svc from "./auth.service.js";

const COOKIE = "refreshToken";
const cookieOpts = (expires: Date) => ({
  httpOnly: true,
  sameSite: "lax" as const,
  secure: env.NODE_ENV === "production",
  path: "/api/v1/auth",
  expires,
});

// In-memory limiter for now; Day 18 replaces it with a Redis-backed shared limiter.
const authLimiter = rateLimit({
  windowMs: 15 * 60_000,
  limit: env.NODE_ENV === "test" ? 1000 : 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) =>
    res.status(429).json({ error: { code: "RATE_LIMITED", message: "Too many attempts, try again later", details: [] } }),
});

const sendSession = (res: Response, s: Awaited<ReturnType<typeof svc.login>>, status = 200) => {
  res.cookie(COOKIE, s.refreshToken, cookieOpts(s.refreshExpiresAt));
  res.status(status).json({ data: { user: svc.toPublicUser(s.user), accessToken: s.accessToken } });
};

export const authRouter = Router();

authRouter.post("/register", authLimiter, async (req, res) => {
  const user = await svc.register(registerSchema.parse(req.body));
  res.status(201).json({ data: { user: svc.toPublicUser(user) } });
});

authRouter.post("/login", authLimiter, async (req, res) => {
  sendSession(res, await svc.login(loginSchema.parse(req.body)));
});

authRouter.post("/refresh", authLimiter, async (req, res) => {
  sendSession(res, await svc.refresh(req.cookies?.[COOKIE]));
});

authRouter.post("/logout", async (req, res) => {
  await svc.logout(req.cookies?.[COOKIE]);
  res.clearCookie(COOKIE, { path: "/api/v1/auth" });
  res.status(204).end();
});

authRouter.get("/me", requireAuth, async (req, res) => {
  res.json({ data: { user: svc.toPublicUser(await svc.getUser(req.user!.id)) } });
});
