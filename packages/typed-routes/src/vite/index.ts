import type { PluginOption } from "vite";
import { fileRoutes, type FileRoutesOptions } from "filesystem-routing/vite";

export interface TypedRoutesPluginOptions extends FileRoutesOptions {}

/**
 * Vite plugin configuring file-system routing with automatic TypeScript declaration generation.
 */
export function typedRoutes(options?: TypedRoutesPluginOptions): PluginOption[] {
  return fileRoutes({
    types: true,
    ...options,
  });
}
