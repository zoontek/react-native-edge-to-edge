import { defineConfig } from "tsup";

export default defineConfig({
  entry: { index: "src/index.ts" },
  format: ["cjs", "esm"],
  target: "es2017",
  clean: true,
  dts: true,
  sourcemap: true,
  treeshake: true,
});
