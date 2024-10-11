import { defineConfig } from "tsup";

export default defineConfig({
  entry: { index: "src/index.ts" },
  format: ["cjs", "esm"],
  target: "es2019",
  clean: true,
  dts: false,
  sourcemap: true,
  treeshake: true,
});
