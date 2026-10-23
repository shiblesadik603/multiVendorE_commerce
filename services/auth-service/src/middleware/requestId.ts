import { randomUUID } from "node:crypto";
import type { RequestHandler } from "express";

declare module "express-serve-static-core" {
  interface Request {
    id: string;
    user?: { id: string; role: "BUYER" | "SELLER" | "ADMIN" };
  }
}

export const requestId: RequestHandler = (req, res, next) => {
  req.id = (req.header("x-request-id") as string) || randomUUID();
  res.setHeader("x-request-id", req.id);
  next();
};

export const accessLog: RequestHandler = (req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    if (process.env.NODE_ENV === "test") return;
    console.log(
      JSON.stringify({
        service: "auth-service",
        requestId: req.id,
        method: req.method,
        path: req.originalUrl.split("?")[0],
        status: res.statusCode,
        ms: Date.now() - start,
      }),
    );
  });
  next();
};
