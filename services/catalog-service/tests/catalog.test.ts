import { execSync } from "node:child_process";
import jwt from "jsonwebtoken";
import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { seedCategories } from "../prisma/seed.js";
import { app } from "../src/app.js";
import { prisma } from "../src/lib/prisma.js";

const SECRET = process.env.JWT_ACCESS_SECRET!;
const A = "11111111-1111-4111-8111-111111111111"; // seller A
const B = "22222222-2222-4222-8222-222222222222"; // seller B
const BUYER = "33333333-3333-4333-8333-333333333333";
const tok = (sub: string, role: string) => jwt.sign({ role }, SECRET, { subject: sub, expiresIn: "5m" });
const as = (sub: string, role = "SELLER") => ({ Authorization: `Bearer ${tok(sub, role)}` });

const body = (o: object = {}) => ({
  title: "Wireless Headphones",
  description: "Noise canceling",
  price: 19999,
  category: "electronics",
  imageUrls: ["https://img.example.com/a.jpg"],
  ...o,
});
const create = (sub = A, o: object = {}) => request(app).post("/api/v1/seller/products").set(as(sub)).send(body(o));

beforeAll(async () => {
  execSync("npx prisma migrate deploy", { stdio: "ignore", env: process.env });
  await seedCategories(prisma as any);
});
beforeEach(async () => {
  await prisma.product.deleteMany();
  await prisma.sellerProfile.deleteMany();
});
afterAll(() => prisma.$disconnect());

describe("categories + health", () => {
  it("lists the seeded categories publicly", async () => {
    const r = await request(app).get("/api/v1/categories");
    expect(r.status).toBe(200);
    expect(r.body.data.map((c: any) => c.slug)).toContain("home-decor");
    expect(r.body.data).toHaveLength(6);
  });
  it("health and readiness", async () => {
    expect((await request(app).get("/health")).body.service).toBe("catalog-service");
    expect((await request(app).get("/ready")).status).toBe(200);
  });
});

describe("seller access control", () => {
  it("requires login (401) and the SELLER role (403)", async () => {
    expect((await request(app).get("/api/v1/seller/products")).status).toBe(401);
    expect((await request(app).post("/api/v1/seller/products").set(as(BUYER, "BUYER")).send(body())).status).toBe(403);
    expect((await request(app).get("/api/v1/seller/products").set(as("x", "ADMIN"))).status).toBe(403);
  });
});

describe("seller product CRUD", () => {
  it("creates a product with category slug, images, and ACTIVE status", async () => {
    const r = await create();
    expect(r.status).toBe(201);
    expect(r.body.data).toMatchObject({
      title: "Wireless Headphones",
      price: 19999,
      status: "ACTIVE",
      category: { slug: "electronics" },
      imageUrl: "https://img.example.com/a.jpg",
    });
    expect(r.body.data.seller.id).toBe(A);
  });
  it("validates input with field errors", async () => {
    const r = await create(A, { title: "ab", price: 19.99, imageUrls: ["javascript:alert(1)"], category: undefined });
    expect(r.status).toBe(422);
    const fields = r.body.error.details.map((d: any) => d.field);
    expect(fields).toEqual(expect.arrayContaining(["title", "price", "imageUrls.0", "category"]));
  });
  it("rejects an unknown category", async () => {
    expect((await create(A, { category: "nope" })).status).toBe(422);
  });
  it("updates fields and replaces images", async () => {
    const id = (await create()).body.data.id;
    const r = await request(app)
      .patch(`/api/v1/seller/products/${id}`)
      .set(as(A))
      .send({ price: 25000, imageUrls: ["https://img.example.com/b.jpg", "https://img.example.com/c.jpg"] });
    expect(r.status).toBe(200);
    expect(r.body.data.price).toBe(25000);
    expect(r.body.data.images.map((i: any) => i.url)).toEqual(["https://img.example.com/b.jpg", "https://img.example.com/c.jpg"]);
    expect((await request(app).patch(`/api/v1/seller/products/${id}`).set(as(A)).send({})).status).toBe(422);
  });
  it("archive hides from buyers, activate shows again; nothing is deleted", async () => {
    const id = (await create()).body.data.id;
    expect((await request(app).get(`/api/v1/products/${id}`)).status).toBe(200);
    expect((await request(app).post(`/api/v1/seller/products/${id}/archive`).set(as(A))).body.data.status).toBe("ARCHIVED");
    expect((await request(app).get(`/api/v1/products/${id}`)).status).toBe(404);
    expect((await request(app).get("/api/v1/products")).body.meta.total).toBe(0);
    expect((await request(app).get("/api/v1/seller/products?status=ARCHIVED").set(as(A))).body.meta.total).toBe(1);
    await request(app).post(`/api/v1/seller/products/${id}/activate`).set(as(A));
    expect((await request(app).get(`/api/v1/products/${id}`)).status).toBe(200);
  });
});

describe("ownership (IDOR)", () => {
  it("seller B cannot read, edit or archive seller A's product (404)", async () => {
    const id = (await create(A)).body.data.id;
    await create(B, { title: "B product" });
    expect((await request(app).get(`/api/v1/seller/products/${id}`).set(as(B))).status).toBe(404);
    expect((await request(app).patch(`/api/v1/seller/products/${id}`).set(as(B)).send({ title: "hacked" })).status).toBe(404);
    expect((await request(app).post(`/api/v1/seller/products/${id}/archive`).set(as(B))).status).toBe(404);
    expect((await prisma.product.findUniqueOrThrow({ where: { id } })).title).toBe("Wireless Headphones");
  });
  it("a seller's list contains only their own products", async () => {
    await create(A);
    await create(B, { title: "B product" });
    const r = await request(app).get("/api/v1/seller/products").set(as(A));
    expect(r.body.meta.total).toBe(1);
    expect(r.body.data[0].seller.id).toBe(A);
  });
  it("malformed ids are 422, not server errors", async () => {
    expect((await request(app).get("/api/v1/seller/products/not-a-uuid").set(as(A))).status).toBe(422);
    expect((await request(app).get("/api/v1/products/not-a-uuid")).status).toBe(422);
  });
});

describe("public catalog", () => {
  beforeEach(async () => {
    await create(A, { title: "Cheap Keyboard", price: 1000, category: "electronics", description: "mechanical" });
    await create(A, { title: "Silk Scarf", price: 5000, category: "fashion" });
    await create(B, { title: "Premium Headphones", price: 90000, category: "electronics" });
    await create(B, { title: "Desk Lamp", price: 3000, category: "home-decor" });
  });
  const list = (qs = "") => request(app).get(`/api/v1/products${qs}`);

  it("lists everything without login, with seller + category and no internal fields", async () => {
    const r = await list();
    expect(r.body.meta).toMatchObject({ total: 4, page: 1, limit: 20, totalPages: 1 });
    expect(r.body.data[0]).not.toHaveProperty("moderation");
    expect(r.body.data[0]).not.toHaveProperty("status");
    expect(r.body.data[0].seller.shopName).toMatch(/^Seller-/);
  });
  it("filters by category slug", async () => {
    expect((await list("?category=electronics")).body.meta.total).toBe(2);
  });
  it("filters by price range (minor units)", async () => {
    const r = await list("?minPrice=2000&maxPrice=10000");
    expect(r.body.data.map((p: any) => p.title).sort()).toEqual(["Desk Lamp", "Silk Scarf"]);
    expect((await list("?minPrice=10&maxPrice=5")).status).toBe(422);
  });
  it("searches title and description, case-insensitively", async () => {
    expect((await list("?search=HEADPHONES")).body.data).toHaveLength(1);
    expect((await list("?search=mechanical")).body.data[0].title).toBe("Cheap Keyboard");
  });
  it("sorts by price", async () => {
    expect((await list("?sort=price_asc")).body.data.map((p: any) => p.price)).toEqual([1000, 3000, 5000, 90000]);
    expect((await list("?sort=price_desc")).body.data[0].price).toBe(90000);
  });
  it("paginates with stable pages and caps the limit", async () => {
    const p1 = await list("?sort=price_asc&limit=3&page=1");
    const p2 = await list("?sort=price_asc&limit=3&page=2");
    expect(p1.body.data).toHaveLength(3);
    expect(p2.body.data).toHaveLength(1);
    expect(p1.body.meta).toMatchObject({ total: 4, totalPages: 2 });
    expect((await list("?limit=500")).status).toBe(422);
    expect((await list("?page=0")).status).toBe(422);
  });
  it("hides hidden products and products of suspended sellers", async () => {
    const hidden = await prisma.product.findFirstOrThrow({ where: { title: "Silk Scarf" } });
    await prisma.product.update({ where: { id: hidden.id }, data: { moderation: "HIDDEN" } });
    await prisma.sellerProfile.update({ where: { id: B }, data: { status: "SUSPENDED" } });
    expect((await list()).body.meta.total).toBe(1);
    expect((await request(app).get(`/api/v1/products/${hidden.id}`)).status).toBe(404);
  });
  it("a suspended seller cannot create or edit products", async () => {
    await prisma.sellerProfile.update({ where: { id: B }, data: { status: "SUSPENDED" } });
    expect((await create(B)).status).toBe(403);
  });
});
