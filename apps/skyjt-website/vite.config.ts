import { defineConfig } from "vite";
import { fileRoutes } from "filesystem-routing/vite";
import solid from "@solidjs/vite-plugin";

export default defineConfig({
  plugins: [
    solid({
      start: {},
      ssr: true,
      diagnostics: true,
      extensions: [".jsx", ".tsx"],
    }),
    fileRoutes({ types: true }),
  ],
  server: {
    port: 3000,
  },
  build: {
    target: "esnext",
    assetsInlineLimit: 0,
  },
});
