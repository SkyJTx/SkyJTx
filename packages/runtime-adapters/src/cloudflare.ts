import type {
  CloudflarePagesContext,
  CloudflareWorkerEnv,
  StandardServerHandler,
} from "./types";

/**
 * Creates an onRequest handler for Cloudflare Pages with ASSETS binding delegation.
 */
export function createCloudflarePagesHandler<TEnv = Record<string, unknown>>(
  server: StandardServerHandler,
): (context: CloudflarePagesContext<TEnv>) => Promise<Response> {
  return async (context: CloudflarePagesContext<TEnv>): Promise<Response> => {
    if (context.env?.ASSETS && typeof context.env.ASSETS.fetch === "function") {
      const assetResponse = await context.env.ASSETS.fetch(context.request);
      if (assetResponse.status !== 404) {
        return assetResponse;
      }
    }

    return server.fetch(context.request);
  };
}

/**
 * Creates an ES module fetch export for standalone Cloudflare Workers.
 */
export function createCloudflareWorkerHandler(
  server: StandardServerHandler,
): {
  fetch(request: Request, env: CloudflareWorkerEnv, ctx?: unknown): Promise<Response>;
} {
  return {
    async fetch(
      request: Request,
      env: CloudflareWorkerEnv,
      _ctx?: unknown,
    ): Promise<Response> {
      if (env?.ASSETS && typeof env.ASSETS.fetch === "function") {
        const assetResponse = await env.ASSETS.fetch(request);
        if (assetResponse.status !== 404) {
          return assetResponse;
        }
      }

      return server.fetch(request);
    },
  };
}
