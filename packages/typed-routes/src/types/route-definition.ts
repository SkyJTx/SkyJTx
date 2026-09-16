import type { Accessor } from "solid-js";
import type { Location } from "@solidjs/router";
import type { TypeValidator } from "./type-validator";

/**
 * Route validation and preload configuration contract.
 */
export interface RouteConfig<
  TParams = unknown,
  TSearch = unknown,
  TState = unknown,
  THash = unknown,
  TData = unknown,
> {
  params?: TypeValidator<TParams>;
  search?: TypeValidator<TSearch>;
  state?: TypeValidator<TState>;
  hash?: TypeValidator<THash>;
  preload?: (args: { params: TParams; search: TSearch; location: Location<TState> }) => TData;
  onError?: (args: {
    error: RouteValidationError;
    rawParams: Record<string, string | undefined>;
    rawSearch: Record<string, unknown>;
  }) => void;
  info?: Record<string, unknown>;
}

/**
 * Reactive context value providing accessors for validated route state.
 */
export interface RouteValidationContextValue<
  TParams = unknown,
  TSearch = unknown,
  TState = unknown,
  THash = unknown,
> {
  params: Accessor<TParams>;
  search: Accessor<TSearch>;
  state: Accessor<TState | undefined>;
  hash: Accessor<THash | undefined>;
}

/**
 * Bound route definition instance with type-safe reactive hooks.
 */
export interface DefinedRouteObject<
  TParams = unknown,
  TSearch = unknown,
  TState = unknown,
  THash = unknown,
  TData = unknown,
> {
  readonly config: RouteConfig<TParams, TSearch, TState, THash, TData>;
  useParams(): Accessor<TParams>;
  useSearch(): Accessor<TSearch>;
  useLocation(): Location<TState>;
}

/**
 * Error raised during route parameter or search validation failure.
 */
export class RouteValidationError extends Error {
  public readonly target: "params" | "search" | "state" | "hash";
  public readonly issues: ReadonlyArray<{ message: string; path?: string }>;

  public constructor(
    target: "params" | "search" | "state" | "hash",
    issues: ReadonlyArray<{ message: string; path?: string }>,
  ) {
    super(`Route validation failed for ${target}: ${issues.map((i) => i.message).join("; ")}`);
    this.name = "RouteValidationError";
    this.target = target;
    this.issues = issues;
  }
}
