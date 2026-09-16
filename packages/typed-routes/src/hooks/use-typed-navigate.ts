import { useNavigate } from "@solidjs/router";
import type { ExtractRoutePaths, RouteParamsFor, RouteSearchFor } from "../types/route-inference";
import { buildUrl } from "../router/path-builder";

/**
 * Type-safe navigation hook ensuring compile-time path and parameter constraints.
 */
export function useTypedNavigate<TManifest extends readonly unknown[]>() {
  const nativeNavigate = useNavigate();

  return <Path extends ExtractRoutePaths<TManifest>>(
    to: Path,
    options?: {
      params?: RouteParamsFor<TManifest, Path>;
      search?: RouteSearchFor<TManifest, Path>;
      state?: unknown;
      hash?: string;
      replace?: boolean;
      scroll?: boolean;
    },
  ) => {
    const url = buildUrl(to as string, {
      params: options?.params as Record<string, unknown> | undefined,
      search: options?.search as Record<string, unknown> | undefined,
      hash: options?.hash,
    });
    nativeNavigate(url, {
      replace: options?.replace,
      scroll: options?.scroll,
      state: options?.state,
    });
  };
}
