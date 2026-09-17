import type { Plugin, PluginOption } from "vite";
import { fileRoutes, type FileRoutesOptions } from "filesystem-routing/vite";

/**
 * Options for configuring typedRoutes Vite plugin.
 */
export type TypedRoutesPluginOptions = FileRoutesOptions;

/**
 * Vite plugin configuring file-system routing and Solid SSR options.
 */
export function typedRoutes(options?: TypedRoutesPluginOptions): PluginOption[] {
  const fsPlugins = fileRoutes({
    types: true,
    ...options,
  });

  const ssrConfigPlugin: Plugin = {
    name: "skyjt:typed-routes:ssr-config",
    config() {
      return {
        resolve: {
          dedupe: ["solid-js", "@solidjs/web"],
        },
        ssr: {
          noExternal: true,
        },
      };
    },
  };

  const pluginsList = Array.isArray(fsPlugins) ? fsPlugins : [fsPlugins];
  return [...pluginsList, ssrConfigPlugin];
}
