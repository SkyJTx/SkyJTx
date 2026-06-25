import { defineConfig } from "vite";
import { nitroV2Plugin as nitro } from "@solidjs/vite-plugin-nitro-2";

import { solidStart } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  resolve: {
    dedupe: ["solid-js", "solid-js/web", "solid-js/store", "solid-styled-components"],
  },
  ssr: {
    noExternal: [
      "@skyjt/signals-solid",
      "@skyjt/store-solid",
      "@skyjt/query-solid",
    ],
  },
  optimizeDeps: {
    exclude: [
      "@skyjt/signals-solid",
      "@skyjt/store-solid",
      "@skyjt/query-solid",
    ],
  },
  server: {
    fs: {
      allow: ["../../"],
    },
  },
  plugins: [
    solidStart(),
    nitro({
      preset: process.env.VERCEL ? "vercel" : "node-server",
    }),
    tailwindcss(),
  ],
});

