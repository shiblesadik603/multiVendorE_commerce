import { createBaseApp, finalizeApp } from "@marketplace/common";
import { Router } from "express";
import { env } from "./config/env.js";
import { prisma } from "./lib/prisma.js";
import { listCategories } from "./modules/categories/categories.service.js";
import { publicProductsRouter, sellerProductsRouter } from "./modules/products/products.routes.js";

const SERVICE = "catalog-service";

export const app = createBaseApp({
  serviceName: SERVICE,
  corsOrigin: env.CORS_ORIGIN,
  ready: () => prisma.$queryRaw`SELECT 1`,
});

const api = Router();
api.get("/categories", async (_req, res) => res.json({ data: await listCategories() }));
api.use("/products", publicProductsRouter);
api.use("/seller/products", sellerProductsRouter);
app.use("/api/v1", api);

finalizeApp(app, SERVICE);
