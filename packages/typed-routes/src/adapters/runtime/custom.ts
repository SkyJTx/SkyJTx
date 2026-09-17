import type { CustomRuntimeAdapterObject, CustomRuntimeAdapterFn } from "./types";

/**
 * Type-safe helper for defining custom runtime adapters with full type inference.
 */
export function defineRuntimeAdapter(
  adapter: CustomRuntimeAdapterObject | CustomRuntimeAdapterFn,
): CustomRuntimeAdapterObject | CustomRuntimeAdapterFn {
  return adapter;
}
