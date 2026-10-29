import { createBaseApp, finalizeApp } from "@marketplace/common";

const SERVICE = "catalog-service";

export const app = createBaseApp({ serviceName: SERVICE, corsOrigin: process.env.CORS_ORIGIN });
// Routes are added on this service's planned day.
finalizeApp(app, SERVICE);
