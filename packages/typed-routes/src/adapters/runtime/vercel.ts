import type { StandardServerHandler } from "./types";

/**
 * Standard configuration object for Vercel Edge Functions.
 */
export const vercelEdgeConfig = {
  runtime: "edge" as const,
};

/**
 * Creates an edge request handler for Vercel Edge Functions.
 */
export function createVercelEdgeHandler(
  server: StandardServerHandler,
): (request: Request) => Promise<Response> | Response {
  return (request: Request): Promise<Response> | Response => {
    return server.fetch(request);
  };
}
