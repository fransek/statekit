import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["./src/**/*.test.ts"],
    coverage: {
      include: ["src/**/*.ts"],
      exclude: ["src/index.ts", "src/**/*.test.ts"],
      reporter: ["text", "json", "html"],
    },
    alias: {
      react: path.resolve(__dirname, "node_modules/react"),
    },
  },
});
