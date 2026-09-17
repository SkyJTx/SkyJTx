import { createRouter as createSolidRouter, type RouteDefinition, type RouterConfig as SolidRouterConfig } from "@solidjs/router";
import type { ExtractRoutePaths, RouteParamsFor, RouteSearchFor } from "../types/route-inference";
import { buildUrl } from "./path-builder";
import { Link } from "../components/link";
import { useNavigate } from "../hooks/use-navigate";

export interface RouterConfig<R extends readonly RouteDefinition[] = RouteDefinition[]>
  extends SolidRouterConfig<R> {}

/**
 * Creates a router instance bound to the route manifest.
 */
export function createRouter<const TManifest extends readonly unknown[]>(
  config: RouterConfig,
) {
  const routerInstance = createSolidRouter(config);

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

  const boundLink = Link as unknown as <
    Path extends ExtractRoutePaths<TManifest> = ExtractRoutePaths<TManifest>,
  >(
    props: Parameters<typeof Link<TManifest, Path>>[0],
  ) => ReturnType<typeof Link<TManifest, Path>>;

  const boundUseNavigate = () => useNavigate<TManifest>();

  return {
    Router: routerInstance,
    paths,
    Link: boundLink,
    useNavigate: boundUseNavigate,
    routes: routerInstance.routes,
    config: routerInstance.config,
    match: (url: string) => routerInstance.match(url),
  };
}
