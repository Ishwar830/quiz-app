import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    dir: "./src/__tests__",
    globals: true,
    projects: [
      {
        extends: true,
        test: {
          name: "db-integration",
          globalSetup: ["./src/__tests__/db_integration/setup.ts"],
          fileParallelism: false,
          include: ["**/db_integration/*.test.ts"],
          environment: "node",
        },
      },
      {
        extends: true,
        test: {
          name: "api-testing",
          globalSetup: ["./src/__tests__/db_integration/setup.ts"],
          fileParallelism: false,
          include: ["**/api/*.test.ts"],
        },
      },
    ],
  },
});
