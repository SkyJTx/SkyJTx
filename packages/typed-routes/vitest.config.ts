import { defineConfig } from "vitest/config";
import solid from "@solidjs/vite-plugin";

export default defineConfig({
  plugins: [
    solid({
      extensions: [".jsx", ".tsx"],
    }),
  ],
  resolve: {
    conditions: ["browser", "development"],
    dedupe: ["solid-js", "@solidjs/web"],
  },
  ssr: {
    noExternal: [/solid-js/, /@solidjs/],
  },
  test: {
    environment: "jsdom",
    server: {
      deps: {
        inline: [/solid-js/, /@solidjs/],
      },
    },
    include: ["tests/**/*.test.{ts,tsx}"],
  },
});
