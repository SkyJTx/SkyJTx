export type {
  StandardSchemaV1,
  StandardSchemaResult,
  ZodLikeSchema,
  TypeBoxSchema,
  FunctionValidator,
  TypeValidator,
  InferOutput,
  InferInput,
  ValidationIssue,
  ValidationResult,
} from "./types/type-validator";

export {
  RouteValidationError,
  type RouteConfig,
  type RouteValidationContextValue,
  type DefinedRouteObject,
} from "./types/route-definition";

export type {
  ExtractRoutePaths,
  RouteParamsFor,
  RouteSearchFor,
  NavigationArgs,
  LinkProps,
  FindRouteEntry,
} from "./types/route-inference";

export { schema, type BuiltinSchema } from "./schema/builtin";
export { coercePrimitive, coerceRecord, normalizeSearchParams } from "./schema/coercion";
export { validateData, isStandardSchema, isZodSchema, isTypeBoxSchema } from "./schema/validator-adapter";

export { RouteValidationProvider, useRouteValidationContext } from "./context/route-context";

export { interceptFileRoutes, type FileRouteEntry, type FileRouteLazyRef, type FileRouteEagerRef } from "./interceptor/interceptor";

export { defineRoute } from "./router/define-route";
export { buildUrl } from "./router/path-builder";
export { createRouter, type RouterConfig } from "./router/create-router";
export { Link } from "./components/link";
export { useNavigate } from "./hooks/use-navigate";

export {
  createMiddleware,
  type HttpMethod,
  type HttpMethodKey,
  type MiddlewareOptions,
} from "./middleware/middleware";
