import { defineConfig } from "vite";
import { typedRoutes } from "@skyjt/typed-routes/vite";
import solid from "@solidjs/vite-plugin";
import { nitro } from "nitro/vite";

export default defineConfig({
  plugins: [
    solid({
      start: {
        middleware: "src/middleware.ts",
      },
      ssr: true,
      diagnostics: true,
      extensions: [".jsx", ".tsx"],
    }),
    typedRoutes(),
    nitro(),
  ],
  server: {
    port: 3000,
  },
  build: {
    target: "esnext",
    assetsInlineLimit: 0,
  },
});
