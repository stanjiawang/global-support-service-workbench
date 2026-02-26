import { defineConfig } from "vitest/config";

function resolvePath(pathname: string): string {
  return new URL(pathname, import.meta.url).pathname;
}

export default defineConfig({
  resolve: {
    alias: {
      "@app": resolvePath("./src/app"),
      "@features": resolvePath("./src/features"),
      "@shared": resolvePath("./src/shared"),
      "@platform": resolvePath("./src/platform")
    }
  },
  test: {
    include: ["src/**/*.spec.ts", "src/**/*.spec.tsx"],
    exclude: ["src/**/*.a11y.spec.ts", "src/**/*.a11y.spec.tsx"],
    passWithNoTests: true,
    environment: "node"
  }
});
