import { createRouter, type RouteDefinition, type RouterConfig } from "@solidjs/router";
import type { ExtractRoutePaths, RouteParamsFor, RouteSearchFor } from "../types/route-inference";
import { buildUrl } from "./path-builder";
import { TypedLink } from "../components/typed-link";
import { useTypedNavigate } from "../hooks/use-typed-navigate";

export interface TypedRouterConfig<R extends readonly RouteDefinition[] = RouteDefinition[]>
  extends RouterConfig<R> {}

/**
 * Factory creating a type-safe router instance with bound links, hooks, and path builders.
 */
export function createTypedRouter<const TManifest extends readonly unknown[]>(
  config: TypedRouterConfig,
) {
  const routerInstance = createRouter(config);

  const paths = {
    build<Path extends ExtractRoutePaths<TManifest>>(
      to: Path,
      options?: {
        params?: RouteParamsFor<TManifest, Path>;
        search?: RouteSearchFor<TManifest, Path>;
        hash?: string;
      },
    ): string {
      return buildUrl(to as string, options as Record<string, unknown> | undefined);
    },
    ...routerInstance.paths,
  };

  const BoundTypedLink = TypedLink as unknown as <
    Path extends ExtractRoutePaths<TManifest> = ExtractRoutePaths<TManifest>,
  >(
    props: Parameters<typeof TypedLink<TManifest, Path>>[0],
  ) => ReturnType<typeof TypedLink<TManifest, Path>>;

  const boundUseTypedNavigate = () => useTypedNavigate<TManifest>();

  return {
    Router: routerInstance,
    paths,
    TypedLink: BoundTypedLink,
    useTypedNavigate: boundUseTypedNavigate,
    routes: routerInstance.routes,
    config: routerInstance.config,
    match: (url: string) => routerInstance.match(url),
  };
}
