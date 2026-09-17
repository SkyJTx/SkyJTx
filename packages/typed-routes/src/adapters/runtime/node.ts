import type { IncomingMessage, ServerResponse } from "node:http";
import { createServer, type Server } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { Readable } from "node:stream";
import type { NodeAdapterOptions, StandardServerHandler } from "./types";

/**
 * Converts a Node.js IncomingMessage into a Web Standard Request object.
 */
export function nodeRequestToWebRequest(req: IncomingMessage): Request {
  const protocol = req.headers["x-forwarded-proto"] || "http";
  const host = req.headers["x-forwarded-host"] || req.headers.host || "localhost";
  const url = new URL(req.url || "/", `${protocol}://${host}`);

  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      for (const item of value) {
        headers.append(key, item);
      }
    } else {
      headers.set(key, value);
    }
  }

  const method = req.method?.toUpperCase() || "GET";
  const hasBody = method !== "GET" && method !== "HEAD";
  const body = hasBody ? (Readable.toWeb(req) as ReadableStream<Uint8Array>) : undefined;

  return new Request(url.toString(), {
    method,
    headers,
    body,
    duplex: hasBody ? "half" : undefined,
  } as RequestInit);
}

/**
 * Streams a Web Standard Response into a Node.js ServerResponse.
 */
export async function sendWebResponseToNodeResponse(
  webResponse: Response,
  nodeResponse: ServerResponse,
): Promise<void> {
  nodeResponse.statusCode = webResponse.status;
  nodeResponse.statusMessage = webResponse.statusText;

  webResponse.headers.forEach((value, key) => {
    nodeResponse.setHeader(key, value);
  });

  if (!webResponse.body) {
    nodeResponse.end();
    return;
  }

  const reader = webResponse.body.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      nodeResponse.write(value);
    }
    nodeResponse.end();
  } catch (error) {
    nodeResponse.destroy(error instanceof Error ? error : new Error(String(error)));
  }
}

/**
 * Creates Connect/Express compatible middleware for Node.js servers.
 */
export function createNodeMiddleware(
  server: StandardServerHandler,
  options?: NodeAdapterOptions,
): (req: IncomingMessage, res: ServerResponse, next?: () => void) => Promise<void> {
  const staticDir = options?.staticDir ?? "./dist/client";

  return async (req: IncomingMessage, res: ServerResponse, next?: () => void): Promise<void> => {
    const rawUrl = req.url || "/";
    const pathname = rawUrl.split("?")[0];

    if (pathname !== "/" && !pathname.includes("..")) {
      const sanitized = pathname.startsWith("/") ? pathname.slice(1) : pathname;
      const targetFilePath = join(process.cwd(), staticDir, sanitized);

      if (existsSync(targetFilePath) && statSync(targetFilePath).isFile()) {
        if (options?.maxAge !== undefined) {
          res.setHeader("Cache-Control", `public, max-age=${options.maxAge}`);
        }
        createReadStream(targetFilePath).pipe(res);
        return;
      }
    }

    try {
      const webRequest = nodeRequestToWebRequest(req);
      const webResponse = await server.fetch(webRequest);
      await sendWebResponseToNodeResponse(webResponse, res);
    } catch {
      if (next) {
        next();
      } else {
        res.statusCode = 500;
        res.end("Internal Server Error");
      }
    }
  };
}

/**
 * Instantiates and boots a Node.js HTTP server.
 */
export function createNodeServer(
  server: StandardServerHandler,
  options?: NodeAdapterOptions,
): Server {
  const middleware = createNodeMiddleware(server, options);
  const httpServer = createServer((req, res) => {
    void middleware(req, res);
  });

  if (options?.port) {
    httpServer.listen(options.port, options.host);
  }

  return httpServer;
}
