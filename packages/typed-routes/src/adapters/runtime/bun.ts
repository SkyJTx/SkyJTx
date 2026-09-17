import type { BunAdapterOptions, StandardServerHandler } from "./types";

declare const Bun: {
  file(path: string): {
    exists(): Promise<boolean>;
    size: number;
    type: string;
  };
  serve(options: {
    port?: number;
    hostname?: string;
    fetch(req: Request): Promise<Response> | Response;
  }): {
    port: number;
    stop(closeActiveConnections?: boolean): void;
  };
};

/**
 * Creates a request handler for Bun environments with static file resolution.
 */
export function createBunHandler(
  server: StandardServerHandler,
  options?: BunAdapterOptions,
): (request: Request) => Promise<Response> {
  const staticDir = options?.staticDir ?? "./dist/client";

  return async (request: Request): Promise<Response> => {
    const url = new URL(request.url);

    if (
      typeof Bun !== "undefined" &&
      typeof Bun.file === "function" &&
      url.pathname !== "/" &&
      !url.pathname.includes("..")
    ) {
      const sanitizedPath = url.pathname.startsWith("/") ? url.pathname.slice(1) : url.pathname;
      const normalizedBase = staticDir.endsWith("/") ? staticDir : `${staticDir}/`;
      const targetPath = `${normalizedBase}${sanitizedPath}`;
      const asset = Bun.file(targetPath);

      if (await asset.exists()) {
        const response = new Response(asset as unknown as BodyInit);
        if (options?.maxAge !== undefined) {
          response.headers.set("Cache-Control", `public, max-age=${options.maxAge}`);
        }
        return response;
      }
    }

    return server.fetch(request);
  };
}

/**
 * Boots a native Bun HTTP server binding the given server handler.
 */
export function startBunServer(
  server: StandardServerHandler,
  options?: BunAdapterOptions,
) {
  if (typeof Bun === "undefined" || typeof Bun.serve !== "function") {
    throw new Error("startBunServer must be executed within a Bun runtime environment.");
  }

  const handler = createBunHandler(server, options);
  return Bun.serve({
    port: options?.port ?? 3000,
    hostname: options?.hostname,
    fetch: handler,
  });
}
