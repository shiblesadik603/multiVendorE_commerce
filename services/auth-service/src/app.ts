import "express-async-errors";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env } from "./config/env.js";
import { prisma } from "./lib/prisma.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { accessLog, requestId } from "./middleware/requestId.js";
import { authRouter } from "./modules/auth/auth.routes.js";

export const app = express();

app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use(requestId);
app.use(accessLog);
app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN.split(","), credentials: true }));
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

// Liveness: process is up. Readiness: dependencies reachable (used by the load balancer).
app.get("/health", (_req, res) => res.json({ status: "ok", service: "auth-service" }));
app.get("/ready", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ready", service: "auth-service" });
  } catch {
    res.status(503).json({ status: "unavailable", service: "auth-service" });
  }
});

app.use("/api/v1/auth", authRouter);
app.use(notFound);
app.use(errorHandler);
