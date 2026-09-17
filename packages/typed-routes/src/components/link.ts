import { Dynamic, type JSX } from "@solidjs/web";
import { createComponent } from "solid-js";
import type { ExtractRoutePaths, LinkProps } from "../types/route-inference";
import { buildUrl } from "../router/path-builder";

/**
 * Link component deriving target routes and parameters from the route manifest.
 */
export function Link<
  TManifest extends readonly unknown[],
  Path extends ExtractRoutePaths<TManifest> = ExtractRoutePaths<TManifest>,
>(props: LinkProps<TManifest, Path>): JSX.Element {
  const href = () =>
    buildUrl(props.to as string, {
      params: props.params as Record<string, unknown> | undefined,
      search: props.search as Record<string, unknown> | undefined,
      hash: props.hash,
    });

  return createComponent(Dynamic, {
    component: "a",
    get href() {
      return href();
    },
    class: props.class,
    target: props.target,
    rel: props.rel,
    onClick: props.onClick,
    get children() {
      return props.children;
    },
  });
}
