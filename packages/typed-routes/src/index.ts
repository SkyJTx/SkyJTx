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
  TypedNavigationArgs,
  TypedLinkProps,
  FindRouteEntry,
} from "./types/route-inference";

export { schema, type BuiltinSchema } from "./schema/builtin";
export { coercePrimitive, coerceRecord, normalizeSearchParams } from "./schema/coercion";
export { validateData, isStandardSchema, isZodSchema, isTypeBoxSchema } from "./schema/validator-adapter";

export { RouteValidationProvider, useRouteValidationContext } from "./context/route-context";

export { interceptFileRoutes, type FileRouteEntry, type FileRouteLazyRef, type FileRouteEagerRef } from "./interceptor/interceptor";

export { defineRoute } from "./router/define-route";
export { buildUrl } from "./router/path-builder";
export { createTypedRouter, type TypedRouterConfig } from "./router/create-typed-router";
export { TypedLink } from "./components/typed-link";
export { useTypedNavigate } from "./hooks/use-typed-navigate";

export type {
  StandardServerHandler,
  StaticAssetOptions,
  BunAdapterOptions,
  NodeAdapterOptions,
  CloudflarePagesContext,
  CloudflareWorkerEnv,
  APIGatewayV2Event,
  APIGatewayV2Result,
  CustomAdapterContext,
  CustomRuntimeAdapterObject,
  CustomRuntimeAdapterFn,
  RuntimeAdapterName,
  RuntimeAdapterOption,
} from "./adapters/runtime/types";

export { defineRuntimeAdapter } from "./adapters/runtime/custom";
export { createBunHandler } from "./adapters/runtime/bun";
export { createCloudflarePagesHandler, createCloudflareWorkerHandler } from "./adapters/runtime/cloudflare";
export { createVercelEdgeHandler, vercelEdgeConfig } from "./adapters/runtime/vercel";
export { createLambdaHandler, lambdaEventToWebRequest, webResponseToLambdaResult } from "./adapters/runtime/aws-lambda";
