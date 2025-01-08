import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["./src/**/*.test.{ts,tsx}"],
    coverage: {
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/index.{ts,tsx}", "src/**/*.test.{ts,tsx}"],
      reporter: ["text", "json", "html"],
    },
    alias: {
      react: path.resolve(__dirname, "node_modules/react"),
      "@": path.resolve(__dirname, "src/lib"),
    },
  },
});
