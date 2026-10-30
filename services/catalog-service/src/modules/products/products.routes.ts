import { requireAuth, requireRole, validate } from "@marketplace/common";
import { Router } from "express";
import { env } from "../../config/env.js";
import { toOwnProduct } from "./products.dto.js";
import {
  createProductSchema,
  idParams,
  ownListQuery,
  publicListQuery,
  updateProductSchema,
} from "./products.schemas.js";
import * as svc from "./products.service.js";

/** Public, no login: GET /api/v1/products */
export const publicProductsRouter = Router();
publicProductsRouter.get("/", validate({ query: publicListQuery }), async (req, res) => {
  res.json(await svc.listPublicProducts(req.query as any));
});
publicProductsRouter.get("/:id", validate({ params: idParams }), async (req, res) => {
  res.json({ data: await svc.getPublicProduct(req.params.id) });
});

/** Seller only: /api/v1/seller/products. Every handler scopes by req.user.id (the owner). */
export const sellerProductsRouter = Router();
sellerProductsRouter.use(requireAuth(env.JWT_ACCESS_SECRET), requireRole("SELLER"));

sellerProductsRouter.get("/", validate({ query: ownListQuery }), async (req, res) => {
  res.json(await svc.listOwnProducts(req.user!.id, req.query as any));
});
sellerProductsRouter.post("/", validate({ body: createProductSchema }), async (req, res) => {
  res.status(201).json({ data: await svc.createProduct(req.user!.id, req.body) });
});
sellerProductsRouter.get("/:id", validate({ params: idParams }), async (req, res) => {
  res.json({ data: toOwnProduct(await svc.getOwnProduct(req.user!.id, req.params.id)) });
});
sellerProductsRouter.patch("/:id", validate({ params: idParams, body: updateProductSchema }), async (req, res) => {
  res.json({ data: await svc.updateProduct(req.user!.id, req.params.id, req.body) });
});
sellerProductsRouter.post("/:id/archive", validate({ params: idParams }), async (req, res) => {
  res.json({ data: await svc.setProductStatus(req.user!.id, req.params.id, "ARCHIVED") });
});
sellerProductsRouter.post("/:id/activate", validate({ params: idParams }), async (req, res) => {
  res.json({ data: await svc.setProductStatus(req.user!.id, req.params.id, "ACTIVE") });
});
