import { config as loadEnv } from "dotenv";
import { defineConfig } from "vitest/config";

loadEnv({ path: ".env.test", override: true });
process.env.NODE_ENV = "test";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.spec.ts"],
    fileParallelism: false
  }
});
