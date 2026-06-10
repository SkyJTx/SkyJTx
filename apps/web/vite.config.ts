import { defineConfig } from "vite";
import { nitroV2Plugin as nitro } from "@solidjs/vite-plugin-nitro-2";

import { solidStart } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    solidStart(),
    nitro({
      preset: process.env.VERCEL ? "vercel" : "node-server",
    }),
    tailwindcss(),
  ],
  optimizeDeps: {
    exclude: ["@skyjt/signals-solid"],
  },
  ssr: {
    noExternal: ["@skyjt/signals-solid"],
  },
});
