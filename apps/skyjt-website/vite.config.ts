import { defineConfig } from "vite";
import { typedRoutes } from "@skyjt/typed-routes/vite";
import solid from "@solidjs/vite-plugin";

export default defineConfig({
  plugins: [
    solid({
      start: {},
      ssr: true,
      diagnostics: true,
      extensions: [".jsx", ".tsx"],
    }),
    typedRoutes(),
  ],
  server: {
    port: 3000,
  },
  build: {
    target: "esnext",
    assetsInlineLimit: 0,
  },
});