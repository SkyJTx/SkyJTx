import { useLocation } from "@solidjs/router";
import type { JSX } from "@solidjs/web";
import type { ExtractRoutePaths, RouteParamsFor, RouteSearchFor } from "../types/route-inference";
import { buildUrl } from "../router/path-builder";

/**
 * Type-safe link component that derives target routes and parameters from the manifest tuple.
 */
export function TypedLink<
  TManifest extends readonly unknown[],
  Path extends ExtractRoutePaths<TManifest> = ExtractRoutePaths<TManifest>,
>(
  props: {
    to: Path;
    params?: RouteParamsFor<TManifest, Path>;
    search?: RouteSearchFor<TManifest, Path>;
    state?: unknown;
    hash?: string;
    activeClass?: string;
    inactiveClass?: string;
    children?: JSX.Element;
  } & Omit<JSX.AnchorHTMLAttributes<HTMLAnchorElement>, "href">,
): JSX.Element {
  let location: ReturnType<typeof useLocation> | undefined = undefined;
  try {
    location = useLocation();
  } catch {
  }

  const href = () =>
    buildUrl(props.to as string, {
      params: props.params as Record<string, unknown> | undefined,
      search: props.search as Record<string, unknown> | undefined,
      hash: props.hash,
    });

  const isActive = () => {
    if (!location) {
      return false;
    }
    const targetPath = href().split("?")[0].split("#")[0];
    return location.pathname === targetPath;
  };

  const computedClass = () => {
    const active = isActive();
    const classes: string[] = [];
    if (typeof props.class === "string") {
      classes.push(props.class);
    }
    if (active && props.activeClass) {
      classes.push(props.activeClass);
    }
    if (!active && props.inactiveClass) {
      classes.push(props.inactiveClass);
    }
    return classes.length > 0 ? classes.join(" ") : undefined;
  };

  return (
    <a
      href={href()}
      class={computedClass()}
      target={props.target}
      rel={props.rel}
      onClick={props.onClick}
    >
      {props.children}
    </a>
  );
}