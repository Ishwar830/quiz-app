import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    projects: [
      {
        extends: true,
        test: {
          name: "db-integration",
          setupFiles: ["./src/__tests__/db_integration/setup.ts"],
          fileParallelism: false,
          include: ["**/db_integration/*.test.ts"],
          environment: "node"
        },
      },
    ],
  },
});
