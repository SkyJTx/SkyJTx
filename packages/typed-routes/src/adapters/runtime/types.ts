/**
 * Universal server handler exposing standard Web Fetch interface.
 */
export interface StandardServerHandler {
  fetch(request: Request): Promise<Response> | Response;
}

/**
 * Configuration options for static asset resolution.
 */
export interface StaticAssetOptions {
  staticDir?: string;
  maxAge?: number;
}

/**
 * Configuration options for Bun server runtime.
 */
export interface BunAdapterOptions extends StaticAssetOptions {
  port?: number;
  hostname?: string;
}

/**
 * Configuration options for Node.js server runtime.
 */
export interface NodeAdapterOptions extends StaticAssetOptions {
  port?: number;
  host?: string;
}

/**
 * Execution context provided by Cloudflare Pages.
 */
export interface CloudflarePagesContext<TEnv = Record<string, unknown>> {
  request: Request;
  env: TEnv & {
    ASSETS: {
      fetch(request: Request): Promise<Response>;
    };
  };
  next(): Promise<Response>;
  waitUntil(promise: Promise<unknown>): void;
}

/**
 * Environment bindings provided to Cloudflare Workers.
 */
export interface CloudflareWorkerEnv {
  ASSETS?: {
    fetch(request: Request): Promise<Response>;
  };
  [key: string]: unknown;
}

/**
 * Payload contract for AWS API Gateway v2 HTTP events.
 */
export interface APIGatewayV2Event {
  rawPath: string;
  rawQueryString?: string;
  headers: Record<string, string | undefined>;
  cookies?: string[];
  requestContext: {
    http: {
      method: string;
      path: string;
      protocol: string;
      sourceIp: string;
      userAgent: string;
    };
    domainName?: string;
  };
  body?: string;
  isBase64Encoded?: boolean;
}

/**
 * Result contract returned to AWS API Gateway v2.
 */
export interface APIGatewayV2Result {
  statusCode: number;
  headers?: Record<string, string>;
  cookies?: string[];
  body?: string;
  isBase64Encoded?: boolean;
}

/**
 * Execution context provided to custom runtime adapters during build.
 */
export interface CustomAdapterContext {
  cwd: string;
  distClient: string;
  distServer: string;
  serverEntry: string;
}

/**
 * Object definition for a structured custom runtime adapter.
 */
export interface CustomRuntimeAdapterObject {
  name: string;
  emit(context: CustomAdapterContext): void | Promise<void>;
}

/**
 * Function callback for an inline custom runtime adapter.
 */
export type CustomRuntimeAdapterFn = (context: CustomAdapterContext) => void | Promise<void>;

/**
 * Built-in runtime adapter preset names.
 */
export type RuntimeAdapterName = "bun" | "node" | "cloudflare" | "vercel" | "aws-lambda";

/**
 * Supported runtime adapter option types.
 */
export type RuntimeAdapterOption =
  | RuntimeAdapterName
  | CustomRuntimeAdapterFn
  | CustomRuntimeAdapterObject;
