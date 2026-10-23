import cors from "cors";
import express from "express";
import helmet from "helmet";
import { randomUUID } from "node:crypto";

const SERVICE = "catalog-service";
export const app = express();

app.disable("x-powered-by");
app.use((req, res, next) => {
  const id = req.header("x-request-id") || randomUUID();
  res.setHeader("x-request-id", id);
  next();
});
app.use(helmet());
app.use(cors({ origin: (process.env.CORS_ORIGIN ?? "http://localhost:3000").split(","), credentials: true }));
app.use(express.json({ limit: "10kb" }));

app.get("/health", (_req, res) => res.json({ status: "ok", service: SERVICE }));
// TODO: /ready will check this service's own database once it has one.
app.get("/ready", (_req, res) => res.json({ status: "ready", service: SERVICE }));

app.use((_req, res) => {
  res.status(404).json({ error: { code: "NOT_FOUND", message: "Route not found", details: [] } });
});
