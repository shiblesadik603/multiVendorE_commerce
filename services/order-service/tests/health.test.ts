import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../src/app.js";

describe("order-service health", () => {
  it("responds to /health and /ready", async () => {
    const h = await request(app).get("/health");
    expect(h.status).toBe(200);
    expect(h.body).toEqual({ status: "ok", service: "order-service" });
    expect((await request(app).get("/ready")).status).toBe(200);
  });
});
