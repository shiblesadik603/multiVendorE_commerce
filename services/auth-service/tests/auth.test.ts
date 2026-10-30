import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { execSync } from "node:child_process";
import { app } from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";
import { requireRole } from "@marketplace/common";

const buyer = { name: "Test Buyer", email: "Buyer@Example.com", phone: "01712345678", password: "secret123" };

beforeAll(() => {
  execSync("npx prisma migrate deploy", { stdio: "ignore", env: process.env });
});
beforeEach(async () => {
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();
});
afterAll(() => prisma.$disconnect());

const register = (body: object = buyer) => request(app).post("/api/v1/auth/register").send(body);
const login = (identifier = "buyer@example.com", password = "secret123") =>
  request(app).post("/api/v1/auth/login").send({ identifier, password });

describe("health", () => {
  it("liveness and readiness", async () => {
    expect((await request(app).get("/health")).body.status).toBe("ok");
    expect((await request(app).get("/ready")).status).toBe(200);
  });
  it("returns a request id", async () => {
    expect((await request(app).get("/health")).headers["x-request-id"]).toBeTruthy();
  });
});

describe("register", () => {
  it("creates a buyer, normalizes email, never returns the hash", async () => {
    const res = await register();
    expect(res.status).toBe(201);
    expect(res.body.data.user).toMatchObject({ email: "buyer@example.com", role: "BUYER" });
    expect(JSON.stringify(res.body)).not.toMatch(/password/i);
    const row = await prisma.user.findFirstOrThrow();
    expect(row.passwordHash).not.toBe("secret123");
    expect(row.passwordHash.startsWith("$2")).toBe(true);
  });
  it("allows registering as seller but never as admin", async () => {
    expect((await register({ ...buyer, role: "SELLER" })).body.data.user.role).toBe("SELLER");
    const res = await register({ ...buyer, email: "a@b.com", phone: "01800000000", role: "ADMIN" });
    expect(res.status).toBe(422);
  });
  it("validates input", async () => {
    const res = await register({ name: "", email: "nope", phone: "abc", password: "123" });
    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
    expect(res.body.error.details.map((d: any) => d.field).sort()).toEqual(["email", "name", "password", "phone"]);
  });
  it("rejects duplicate email and phone", async () => {
    await register();
    expect((await register()).status).toBe(409);
    expect((await register({ ...buyer, email: "other@example.com" })).status).toBe(409);
  });
});

describe("login / session", () => {
  beforeEach(async () => {
    await register();
  });

  it("logs in by email or phone and sets an httpOnly refresh cookie", async () => {
    for (const id of ["buyer@example.com", "BUYER@example.com", "01712345678"]) {
      const res = await login(id);
      expect(res.status).toBe(200);
      expect(res.body.data.accessToken).toBeTruthy();
      expect(String(res.headers["set-cookie"])).toMatch(/refreshToken=.*HttpOnly/i);
    }
  });
  it("gives the same error for wrong password and unknown user", async () => {
    const a = await login("buyer@example.com", "wrongpass");
    const b = await login("nobody@example.com", "secret123");
    expect(a.status).toBe(401);
    expect(b.status).toBe(401);
    expect(a.body).toEqual(b.body);
  });
  it("GET /me requires a valid access token", async () => {
    expect((await request(app).get("/api/v1/auth/me")).status).toBe(401);
    expect((await request(app).get("/api/v1/auth/me").set("Authorization", "Bearer junk")).status).toBe(401);
    const { body } = await login();
    const me = await request(app).get("/api/v1/auth/me").set("Authorization", `Bearer ${body.data.accessToken}`);
    expect(me.status).toBe(200);
    expect(me.body.data.user.email).toBe("buyer@example.com");
  });
  it("rotates refresh tokens and rejects reuse", async () => {
    const agent = request.agent(app);
    await agent.post("/api/v1/auth/login").send({ identifier: "buyer@example.com", password: "secret123" });
    const first = String(
      (await login()).headers["set-cookie"],
    ).split(";")[0];
    const r1 = await request(app).post("/api/v1/auth/refresh").set("Cookie", first);
    expect(r1.status).toBe(200);
    const r2 = await request(app).post("/api/v1/auth/refresh").set("Cookie", first);
    expect(r2.status).toBe(401);
  });
  it("logout revokes the refresh token", async () => {
    const cookie = String((await login()).headers["set-cookie"]).split(";")[0];
    expect((await request(app).post("/api/v1/auth/logout").set("Cookie", cookie)).status).toBe(204);
    expect((await request(app).post("/api/v1/auth/refresh").set("Cookie", cookie)).status).toBe(401);
  });
  it("blocks disabled accounts", async () => {
    await prisma.user.updateMany({ data: { isActive: false } });
    expect((await login()).status).toBe(403);
  });
});

describe("role middleware", () => {
  it("returns 403 for the wrong role and 401 when unauthenticated", () => {
    const next = () => {};
    expect(() => requireRole("ADMIN")({ user: { id: "1", role: "BUYER" } } as any, {} as any, next)).toThrow(
      /do not have access/,
    );
    expect(() => requireRole("ADMIN")({} as any, {} as any, next)).toThrow(/Not authenticated/);
  });
});
