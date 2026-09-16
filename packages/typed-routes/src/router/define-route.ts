import { createMemo, type Accessor } from "solid-js";
import { useParams, useSearchParams, useLocation, type Location } from "@solidjs/router";
import type { TypeValidator, InferOutput } from "../types/type-validator";
import type { DefinedRouteObject, RouteConfig, RouteValidationError } from "../types/route-definition";
import { useRouteValidationContext } from "../context/route-context";
import { validateData } from "../schema/validator-adapter";
import { normalizeSearchParams } from "../schema/coercion";

/**
 * Path-agnostic route schema definition helper.
 * Attaches validation contracts and generates strongly-typed reactive hooks without path coupling.
 */
export function defineRoute<
  P extends TypeValidator<unknown, unknown> | undefined = undefined,
  S extends TypeValidator<unknown, unknown> | undefined = undefined,
  St extends TypeValidator<unknown, unknown> | undefined = undefined,
  H extends TypeValidator<unknown, unknown> | undefined = undefined,
  D = unknown,
>(config: {
  params?: P;
  search?: S;
  state?: St;
  hash?: H;
  preload?: (args: { params: InferOutput<P>; search: InferOutput<S>; location: Location<InferOutput<St>> }) => D;
  onError?: (args: {
    error: RouteValidationError;
    rawParams: Record<string, string | undefined>;
    rawSearch: Record<string, string | string[] | undefined>;
  }) => void;
  info?: Record<string, unknown>;
}): DefinedRouteObject<InferOutput<P>, InferOutput<S>, InferOutput<St>, InferOutput<H>, D> {
  type TParams = InferOutput<P>;
  type TSearch = InferOutput<S>;
  type TState = InferOutput<St>;
  type THash = InferOutput<H>;

  const routeConfig: RouteConfig<TParams, TSearch, TState, THash, D> = config as unknown as RouteConfig<
    TParams,
    TSearch,
    TState,
    THash,
    D
  >;

  return {
    config: routeConfig,

    useParams(): Accessor<TParams> {
      const ctx = useRouteValidationContext<TParams, TSearch, TState, THash>();
      if (ctx) {
        return ctx.params;
      }
      const raw = useParams();
      return createMemo(() => {
        const res = validateData(routeConfig.params, raw);
        return res.data as TParams;
      });
    },

    useSearch(): Accessor<TSearch> {
      const ctx = useRouteValidationContext<TParams, TSearch, TState, THash>();
      if (ctx) {
        return ctx.search;
      }
      const [search] = useSearchParams();
      return createMemo(() => {
        const res = validateData(routeConfig.search, normalizeSearchParams(search));
        return res.data as TSearch;
      });
    },

    useLocation(): Location<TState> {
      return useLocation<TState>();
    },
  };
}
