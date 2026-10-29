import type { RequestHandler } from "express";
import type { ZodTypeAny } from "zod";

/** Zod validation for body / query / params. Parsed (and coerced/trimmed) values replace the raw ones. */
export const validate =
  (schemas: { body?: ZodTypeAny; query?: ZodTypeAny; params?: ZodTypeAny }): RequestHandler =>
  (req, _res, next) => {
    if (schemas.body) req.body = schemas.body.parse(req.body);
    if (schemas.query) (req as any).query = schemas.query.parse(req.query);
    if (schemas.params) (req as any).params = schemas.params.parse(req.params);
    next();
  };
