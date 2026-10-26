import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";
import { routes } from "@skyjt/typed-routes-solid/vite";
import solid from "@solidjs/vite-plugin";
import { nitro } from "nitro/vite";
import tailwindcss from "@tailwindcss/vite";
import Icons from "unplugin-icons/vite";

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
      preset: process.env.NITRO_PRESET || "cloudflare-module",
      cloudflare: {
        wrangler: {
          name: "nattakarn",
          compatibility_date: "2026-07-30",
          compatibility_flags: ["nodejs_compat"],
          observability: {
            enabled: true,
            head_sampling_rate: 1,
            redact_query_string: false,
            logs: {
              enabled: true,
              head_sampling_rate: 1,
              invocation_logs: true,
              persist: true,
            },
            traces: {
              enabled: true,
              head_sampling_rate: 1,
              persist: true,
            },
          },
        },
      },
      commands: {
        preview: "bunx wrangler dev --env-file .env",
        deploy: "bunx wrangler --cwd ./ deploy",
      },
      routeRules: {
        "/": {
          headers: {
            "cache-control":
              "public, max-age=0, s-maxage=60, stale-while-revalidate=60",
          },
        },
      },
    }),
    tailwindcss(),
    Icons({
      compiler: "solid",
    }),
  ],
  server: {
    port: 3000,
  },
  build: {
    target: "esnext",
    assetsInlineLimit: 0,
  },
});
