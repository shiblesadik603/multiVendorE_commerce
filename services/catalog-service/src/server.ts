import { app } from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./lib/prisma.js";

const server = app.listen(env.PORT, () => {
  console.log(JSON.stringify({ service: "catalog-service", msg: `listening on ${env.PORT}` }));
});

// Graceful shutdown so a load balancer can drain this instance safely.
const shutdown = (signal: string) => {
  console.log(JSON.stringify({ service: "catalog-service", msg: `${signal} received, shutting down` }));
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000).unref();
};
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
