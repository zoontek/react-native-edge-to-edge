import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src"],
  format: ["cjs", "esm"],
  target: "es2019",
  tsconfig: "./tsconfig.build.json",
  clean: true,
  dts: false,
  sourcemap: true,
  treeshake: true,
});
