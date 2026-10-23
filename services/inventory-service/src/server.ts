import "dotenv/config";
import { app } from "./app.js";

const port = Number(process.env.PORT ?? 4004);
const server = app.listen(port, () => {
  console.log(JSON.stringify({ service: "inventory-service", msg: `listening on ${port}` }));
});

// Graceful shutdown so a load balancer can drain this instance safely.
const shutdown = () => {
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10_000).unref();
};
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
