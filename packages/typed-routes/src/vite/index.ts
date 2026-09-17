import type { Plugin, PluginOption } from "vite";
import { fileRoutes, type FileRoutesOptions } from "filesystem-routing/vite";

/**
 * Default HTTP methods scanned for route handlers.
 */
export const defaultHttpMethods: readonly string[] = [
  "HEAD",
  "GET",
  "POST",
  "PUT",
  "DELETE",
  "PATCH",
  "OPTIONS",
  "QUERY",
];

export type RoutesPluginOptions = FileRoutesOptions;

/**
 * Vite plugin configuring file routes and SSR defaults.
 */
export function routes(options?: RoutesPluginOptions): PluginOption[] {
  const httpMethods =
    options?.httpMethods === true || options?.httpMethods === undefined
      ? [...defaultHttpMethods]
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
