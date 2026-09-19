import { createServer, type Server } from "node:http";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import * as v from "valibot";
import middlewares from "~/middleware";

const PingResponseSchema = v.object({
  status: v.literal("active"),
  timestamp: v.number(),
  path: v.literal("/api/ping"),
});

describe("API Route: /api/ping", () => {
  let server: Server;
  let baseUrl: string;

  beforeAll(async () => {
    const [middleware] = middlewares;

    server = createServer((req, res) => {
      const host = req.headers.host ?? "localhost";
      const url = new URL(req.url ?? "/", `http://${host}`);
      const headers = new Headers();

      for (const [key, value] of Object.entries(req.headers)) {
        if (value !== undefined) {
          headers.set(key, Array.isArray(value) ? value.join(", ") : value);
        }
      }

      const webRequest = new Request(url, {
        method: req.method,
        headers,
      });

      Promise.resolve(middleware(webRequest, () => new Response("Not Found", { status: 404 })))
        .then(async (response) => {
          res.statusCode = response.status;
          response.headers.forEach((val, key) => {
            res.setHeader(key, val);
          });
          const text = await response.text();
          res.end(text);
        })
        .catch((err: unknown) => {
          res.statusCode = 500;
          res.end(err instanceof Error ? err.message : "Internal Server Error");
        });
    });

    await new Promise<void>((resolve) => {
      server.listen(0, () => resolve());
    });

    const addr = server.address();
    const port = typeof addr === "object" && addr ? addr.port : 0;
    baseUrl = `http://localhost:${port}`;
  });

  afterAll(async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()));
    });
  });

  it("responds to fetch with JSON payload containing active status and route path", async () => {
    const response = await fetch(`${baseUrl}/api/ping`);
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("application/json");

    const parsed = v.parse(PingResponseSchema, await response.json());
    expect(parsed.status).toBe("active");
    expect(parsed.path).toBe("/api/ping");
    expect(parsed.timestamp).toBeLessThanOrEqual(Date.now());
  });

  it("falls through with 404 when dispatched with unsupported HTTP method", async () => {
    const response = await fetch(`${baseUrl}/api/ping`, { method: "POST" });
    expect(response.status).toBe(404);
  });
});
