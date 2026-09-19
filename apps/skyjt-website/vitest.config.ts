import { defineConfig } from "vitest/config";
import { fileURLToPath, URL } from "node:url";
import solid from "@solidjs/vite-plugin";
import { routes, defaultHttpMethods } from "@skyjt/typed-routes/vite";
import { PageFileSystemRouter } from "filesystem-routing";

const router = new PageFileSystemRouter({
  dir: fileURLToPath(new URL("./src/routes", import.meta.url)),
  extensions: ["js", "jsx", "ts", "tsx"],
  httpMethods: [...defaultHttpMethods],
});

export default defineConfig({
  plugins: [
    solid({
      extensions: [".jsx", ".tsx"],
    }),
    routes({
      codeSplitting: true,
      routers: {
        client: router,
      },
    }),
  ],
  resolve: {
    alias: {
      "~": fileURLToPath(new URL("./src", import.meta.url)),
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
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
