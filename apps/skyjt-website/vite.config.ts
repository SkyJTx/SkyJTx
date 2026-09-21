import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";
import { routes } from "@skyjt/typed-routes/vite";
import solid from "@solidjs/vite-plugin";
import { nitro } from "nitro/vite";
import { aot } from "elysia/plugin/aot/vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  resolve: {
    alias: {
      "~": fileURLToPath(new URL("./src", import.meta.url)),
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  plugins: [
    solid({
      start: {
        middleware: "src/middleware.ts",
      },
      ssr: true,
      diagnostics: true,
      extensions: [".jsx", ".tsx"],
    }),
    routes({
      codeSplitting: true,
    }),
    nitro({
      preset: "vercel",
      routeRules: {
        "/": { isr: 60 },
      },
    }),
    tailwindcss(),
    {
      ...aot("src/server/index.ts"),
      apply(_config, env) {
        return Boolean(env.isSsrBuild);
      }
    },
  ],
  server: {
    port: 3000,
  },
  build: {
    target: "esnext",
    assetsInlineLimit: 0,
  },
});
