import { resolve } from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: { "react-native": resolve(__dirname, "__mocks__/react-native.ts") },
  },
});
