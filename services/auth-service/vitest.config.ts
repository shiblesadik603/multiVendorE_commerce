import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    fileParallelism: false,
    env: {
      NODE_ENV: "test",
      DATABASE_URL: "postgresql://marketplace:marketplace@localhost:5432/auth_db_test?schema=public",
      AUTH_RATE_LIMIT_MAX: "1000",
      JWT_ACCESS_SECRET: "test-secret-test-secret-test-secret-1234",
    },
  },
});
