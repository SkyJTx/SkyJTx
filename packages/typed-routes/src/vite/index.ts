import type { Plugin, PluginOption } from "vite";
import { fileRoutes, type FileRoutesOptions } from "filesystem-routing/vite";

export interface TypedRoutesPluginOptions extends FileRoutesOptions {}

/**
 * Vite plugin configuring file-system routing with automatic TypeScript declaration generation.
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