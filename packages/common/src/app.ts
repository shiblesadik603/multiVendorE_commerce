import "express-async-errors";
import { randomUUID } from "node:crypto";
import cors from "cors";
import express, { type Express, type RequestHandler } from "express";
import helmet from "helmet";
import { ZodError } from "zod";
import { AppError } from "./errors.js";
import "./types.js";

export interface BaseAppOptions {
  serviceName: string;
  /** Comma-separated list of allowed browser origins. */
  corsOrigin?: string;
  /** Readiness probe: resolve if dependencies (DB etc.) are reachable. */
  ready?: () => Promise<unknown>;
  /** Body size limit. Default 10kb. */
  jsonLimit?: string;
}

/**
 * The same baseline for every service: correlation id, structured access log, security headers,
 * CORS, body-size limit, /health + /ready. Register routes, then call finalizeApp().
 */
export function createBaseApp(opts: BaseAppOptions): Express {
  const app = express();
  app.disable("x-powered-by");
  app.set("trust proxy", 1);

  const requestId: RequestHandler = (req, res, next) => {
    const incoming = req.header("x-request-id");
    req.id = incoming && incoming.length <= 100 ? incoming : randomUUID();
    res.setHeader("x-request-id", req.id);
    next();
  };
  const accessLog: RequestHandler = (req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
      if (process.env.NODE_ENV === "test") return;
      console.log(
        JSON.stringify({
          service: opts.serviceName,
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

  app.use(requestId, accessLog, helmet());
  app.use(
    cors({
      origin: (opts.corsOrigin ?? "http://localhost:3000").split(",").map((s) => s.trim()),
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization", "Idempotency-Key", "x-request-id"],
      exposedHeaders: ["x-request-id", "RateLimit-Limit", "RateLimit-Remaining", "RateLimit-Reset", "Retry-After"],
    }),
  );
  app.use(express.json({ limit: opts.jsonLimit ?? "10kb" }));

  // Liveness = process is up. Readiness = dependencies reachable (load balancers use this).
  app.get("/health", (_req, res) => res.json({ status: "ok", service: opts.serviceName }));
  app.get("/ready", async (_req, res) => {
    try {
      await opts.ready?.();
      res.json({ status: "ready", service: opts.serviceName });
    } catch {
      res.status(503).json({ status: "unavailable", service: opts.serviceName });
    }
  });
  return app;
}

/** Call after all routes: adds the 404 handler and the single error format. */
export function finalizeApp(app: Express, serviceName: string) {
  app.use((_req, res) => {
    res.status(404).json({ error: { code: "NOT_FOUND", message: "Route not found", details: [] } });
  });
  app.use(((err, req, res, _next) => {
    if (err instanceof ZodError) {
      return res.status(422).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Invalid input",
          details: err.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
        },
      });
    }
    if (err instanceof AppError) {
      return res.status(err.status).json({ error: { code: err.code, message: err.message, details: err.details } });
    }
    // Malformed JSON / body too large (thrown by express.json)
    if (err?.type === "entity.parse.failed")
      return res.status(400).json({ error: { code: "BAD_REQUEST", message: "Malformed JSON", details: [] } });
    if (err?.type === "entity.too.large")
      return res.status(413).json({ error: { code: "PAYLOAD_TOO_LARGE", message: "Request body too large", details: [] } });
    console.error(JSON.stringify({ service: serviceName, requestId: req.id, error: String(err?.stack ?? err) }));
    res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Something went wrong", details: [] } });
  }) as import("express").ErrorRequestHandler);
}
