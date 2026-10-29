import express from "express";
import jwt from "jsonwebtoken";
import request from "supertest";
import { afterAll, describe, expect, it } from "vitest";
import { z } from "zod";
import {
  closeRateLimiters,
  createBaseApp,
  finalizeApp,
  rateLimit,
  requireAuth,
  requireRole,
  requireService,
  serviceHeaders,
  validate,
} from "../src/index.js";

const USER_SECRET = "u".repeat(32);
const INTERNAL_SECRET = "i".repeat(32);
const userToken = (role: string, secret = USER_SECRET, opts: jwt.SignOptions = {}) =>
  jwt.sign({ role }, secret, { subject: "user-1", expiresIn: "5m", ...opts });

function build() {
  const app = createBaseApp({ serviceName: "demo", corsOrigin: "http://localhost:3000" });
  app.get("/me", requireAuth(USER_SECRET), (req, res) => res.json({ user: req.user }));
  app.get("/admin", requireAuth(USER_SECRET), requireRole("ADMIN"), (_req, res) => res.json({ ok: true }));
  app.get("/internal", requireService(["order-service"], INTERNAL_SECRET), (req, res) => res.json({ from: req.service }));
  app.post("/items", validate({ body: z.object({ qty: z.coerce.number().int().min(1).max(99) }) }), (req, res) =>
    res.status(201).json(req.body),
  );
  app.get("/boom", () => {
    throw new Error("secret internal detail");
  });
  finalizeApp(app, "demo");
  return app;
}
const app = build();
afterAll(() => closeRateLimiters());

describe("base app", () => {
  it("health, ready, request id, security headers, 404 format", async () => {
    const h = await request(app).get("/health");
    expect(h.body).toEqual({ status: "ok", service: "demo" });
    expect(h.headers["x-request-id"]).toBeTruthy();
    expect(h.headers["x-content-type-options"]).toBe("nosniff");
    expect(h.headers["x-powered-by"]).toBeUndefined();
    expect((await request(app).get("/ready")).status).toBe(200);
    const nf = await request(app).get("/nope");
    expect(nf.status).toBe(404);
    expect(nf.body.error.code).toBe("NOT_FOUND");
  });
  it("echoes a provided correlation id", async () => {
    expect((await request(app).get("/health").set("x-request-id", "abc-123")).headers["x-request-id"]).toBe("abc-123");
  });
  it("CORS allows only the configured origin", async () => {
    const ok = await request(app).get("/health").set("Origin", "http://localhost:3000");
    expect(ok.headers["access-control-allow-origin"]).toBe("http://localhost:3000");
    const bad = await request(app).get("/health").set("Origin", "https://evil.example");
    expect(bad.headers["access-control-allow-origin"]).toBeUndefined();
  });
  it("hides internal error details", async () => {
    const r = await request(app).get("/boom");
    expect(r.status).toBe(500);
    expect(JSON.stringify(r.body)).not.toMatch(/secret internal detail/);
  });
  it("handles malformed and oversized JSON", async () => {
    expect((await request(app).post("/items").set("content-type", "application/json").send("{bad")).status).toBe(400);
    expect((await request(app).post("/items").send({ qty: 1, pad: "x".repeat(20_000) })).status).toBe(413);
  });
});

describe("user auth middleware", () => {
  it("401 without / with bad / expired / wrongly-signed tokens", async () => {
    expect((await request(app).get("/me")).status).toBe(401);
    expect((await request(app).get("/me").set("Authorization", "Bearer junk")).status).toBe(401);
    const expired = userToken("BUYER", USER_SECRET, { expiresIn: -10 });
    expect((await request(app).get("/me").set("Authorization", `Bearer ${expired}`)).status).toBe(401);
    const forged = userToken("ADMIN", "x".repeat(32));
    expect((await request(app).get("/me").set("Authorization", `Bearer ${forged}`)).status).toBe(401);
  });
  it("accepts a valid token", async () => {
    const r = await request(app).get("/me").set("Authorization", `Bearer ${userToken("BUYER")}`);
    expect(r.body.user).toEqual({ id: "user-1", role: "BUYER" });
  });
  it("buyer cannot reach admin routes (403), admin can", async () => {
    expect((await request(app).get("/admin").set("Authorization", `Bearer ${userToken("BUYER")}`)).status).toBe(403);
    expect((await request(app).get("/admin").set("Authorization", `Bearer ${userToken("ADMIN")}`)).status).toBe(200);
  });
  it("rejects alg=none tokens", async () => {
    const none = Buffer.from('{"alg":"none","typ":"JWT"}').toString("base64url") + "." +
      Buffer.from('{"sub":"u","role":"ADMIN"}').toString("base64url") + ".";
    expect((await request(app).get("/admin").set("Authorization", `Bearer ${none}`)).status).toBe(401);
  });
});

describe("service-to-service auth", () => {
  it("accepts a token from an allowed service", async () => {
    process.env.INTERNAL_JWT_SECRET = INTERNAL_SECRET;
    const r = await request(app).get("/internal").set(serviceHeaders("order-service", "rid-1"));
    expect(r.status).toBe(200);
    expect(r.body.from).toBe("order-service");
  });
  it("rejects missing token, other services, and user tokens", async () => {
    process.env.INTERNAL_JWT_SECRET = INTERNAL_SECRET;
    expect((await request(app).get("/internal")).status).toBe(401);
    expect((await request(app).get("/internal").set(serviceHeaders("cart-service"))).status).toBe(403);
    expect((await request(app).get("/internal").set("x-service-token", userToken("ADMIN", INTERNAL_SECRET))).status).toBe(401);
    expect((await request(app).get("/internal").set("x-service-token", userToken("ADMIN"))).status).toBe(401);
  });
});

describe("validation", () => {
  it("coerces valid input and returns 422 field errors otherwise", async () => {
    expect((await request(app).post("/items").send({ qty: "3" })).body).toEqual({ qty: 3 });
    const bad = await request(app).post("/items").send({ qty: 500 });
    expect(bad.status).toBe(422);
    expect(bad.body.error.details[0].field).toBe("qty");
  });
});

describe("rate limiter", () => {
  const limited = (redisUrl?: string) => {
    const a = express();
    a.set("trust proxy", 1);
    a.use(rateLimit({ name: `t${Math.random()}`, windowSeconds: 30, max: 3, redisUrl }));
    a.get("/", (_req, res) => res.json({ ok: true }));
    return a;
  };
  const run = async (a: express.Express) => {
    const out = [];
    for (let i = 0; i < 5; i++) out.push(await request(a).get("/"));
    return out;
  };
  it("returns 429 with Retry-After after the limit (Redis)", async () => {
    const r = await run(limited("redis://localhost:6379"));
    expect(r.map((x) => x.status)).toEqual([200, 200, 200, 429, 429]);
    expect(Number(r[3].headers["retry-after"])).toBeGreaterThan(0);
    expect(r[3].body.error.code).toBe("RATE_LIMITED");
    expect(r[0].headers["ratelimit-remaining"]).toBe("2");
  });
  it("is shared across instances via Redis", async () => {
    const name = `shared${Math.random()}`;
    const mk = () => {
      const a = express();
      a.use(rateLimit({ name, windowSeconds: 30, max: 3, redisUrl: "redis://localhost:6379" }));
      a.get("/", (_req, res) => res.json({ ok: true }));
      return a;
    };
    const [a, b] = [mk(), mk()];
    const codes = [];
    for (const inst of [a, b, a, b]) codes.push((await request(inst).get("/")).status);
    expect(codes).toEqual([200, 200, 200, 429]);
  });
  it("falls back to in-memory limiting when Redis is down", async () => {
    const r = await run(limited("redis://localhost:1"));
    expect(r.map((x) => x.status)).toEqual([200, 200, 200, 429, 429]);
  });
});
