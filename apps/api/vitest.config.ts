import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["test/**/*.test.ts"],
    pool: "forks",
    maxWorkers: 1,
    testTimeout: 30_000,
    hookTimeout: 30_000,
    restoreMocks: true,
  },
});
