import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src"],
  format: ["cjs"],
  target: "es2019",
  clean: true,
  dts: false,
  sourcemap: true,
  treeshake: true,
});
