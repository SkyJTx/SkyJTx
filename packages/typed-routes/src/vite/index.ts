import type { Plugin, PluginOption } from "vite";
import { fileRoutes, type FileRoutesOptions } from "filesystem-routing/vite";

/**
 * Default HTTP methods scanned by the typedRoutes Vite plugin, including RFC 10008 QUERY.
 */
export const DEFAULT_HTTP_METHODS: readonly string[] = [
  "HEAD",
  "GET",
  "POST",
  "PUT",
  "DELETE",
  "PATCH",
  "OPTIONS",
  "QUERY",
];

/**
 * Options for configuring typedRoutes Vite plugin.
 */
export type TypedRoutesPluginOptions = FileRoutesOptions;

/**
 * Vite plugin configuring file-system routing and Solid SSR options.
 */
export function typedRoutes(options?: TypedRoutesPluginOptions): PluginOption[] {
  const httpMethods =
    options?.httpMethods === true || options?.httpMethods === undefined
      ? [...DEFAULT_HTTP_METHODS]
      : options.httpMethods;

  const fsPlugins = fileRoutes({
    types: true,
    ...options,
    httpMethods,
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
