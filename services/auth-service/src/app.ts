import { createBaseApp, finalizeApp } from "@marketplace/common";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";
import { prisma } from "./lib/prisma.js";
import { authRouter } from "./modules/auth/auth.routes.js";

const SERVICE = "auth-service";

export const app = createBaseApp({
  serviceName: SERVICE,
  corsOrigin: env.CORS_ORIGIN,
  ready: () => prisma.$queryRaw`SELECT 1`,
});
app.use(cookieParser());
app.use("/api/v1/auth", authRouter);
finalizeApp(app, SERVICE);
