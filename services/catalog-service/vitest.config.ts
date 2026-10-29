import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    fileParallelism: false,
    env: {
      NODE_ENV: "test",
      DATABASE_URL: "postgresql://marketplace:marketplace@localhost:5432/catalog_db_test?schema=public",
      JWT_ACCESS_SECRET: "test-secret-test-secret-test-secret-1234",
    },
  },
});
