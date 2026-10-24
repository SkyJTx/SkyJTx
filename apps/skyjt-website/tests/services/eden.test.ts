import { describe, it, expect, vi, beforeEach } from "vitest";
import { edenClient, getClientBaseUrl } from "~/services/eden-client";
import { createEdenServer, edenServer } from "~/services/eden-server";
import type { RequestEvent } from "@solidjs/web";

describe("Eden Treaty Suite", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("edenClient", () => {
    it("resolves client base URL from window location in browser environment", () => {
      const baseUrl = getClientBaseUrl();
      expect(typeof baseUrl).toBe("string");
      expect(baseUrl.length).toBeGreaterThan(0);
    });

    it("executes fetch calls via edenClient", async () => {
      const mockPing = {
        status: "active" as const,
        timestamp: 123456789,
        path: "/api/ping",
      };

      vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
        new Response(JSON.stringify(mockPing), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        })
      );

      const res = await edenClient.api.ping.get();
      expect(res.status).toBe(200);
      expect(res.data).toEqual(mockPing);
    });
  });

  describe("edenServer with Hardened HTTP Forwarding", () => {
    it("executes in-process Elysia calls directly without loopback network socket", async () => {
      const res = await edenServer.api.ping.get();
      expect(res.status).toBe(200);
      expect(res.data).not.toBeNull();
      if (res.data && typeof res.data === "object" && "status" in res.data && "path" in res.data) {
        expect(res.data.status).toBe("active");
        expect(res.data.path).toBe("/api/ping");
      }
    });

    it("fetches storage data in-process via edenServer", async () => {
      const res = await edenServer.api.storage.data.works.get();
      expect(res.status).toBe(200);
      expect(Array.isArray(res.data)).toBe(true);
    });

    it("sanitizes hop-by-hop headers and strips content-length on bodyless GET requests", async () => {
      let forwardedHeaders: Headers | null = null;

      const mockRequest = new Request("http://localhost:3000/test", {
        headers: {
          authorization: "Bearer token-abc",
          cookie: "session=123",
          connection: "keep-alive",
          upgrade: "websocket",
          "content-length": "4096",
          "content-type": "application/json",
          host: "localhost:3000",
        },
      });

      const mockEvent = {
        request: mockRequest,
      } as unknown as RequestEvent;

      const testServer = createEdenServer({
        event: mockEvent,
        fetcher: async (req: Request) => {
          forwardedHeaders = req.headers;
          return new Response(JSON.stringify({ status: "active", timestamp: 1, path: "/api/ping" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        },
      });

      await testServer.api.ping.get();

      expect(forwardedHeaders).not.toBeNull();
      // Inbound cookies and auth must be forwarded
      expect(forwardedHeaders!.get("authorization")).toBe("Bearer token-abc");
      expect(forwardedHeaders!.get("cookie")).toBe("session=123");

      // Hop-by-hop headers must be stripped
      expect(forwardedHeaders!.has("connection")).toBe(false);
      expect(forwardedHeaders!.has("upgrade")).toBe(false);

      // Bodyless GET must strip content-length and content-type
      expect(forwardedHeaders!.has("content-length")).toBe(false);
      expect(forwardedHeaders!.has("content-type")).toBe(false);
    });

    it("validates host header against whitelist before setting x-forwarded-host", async () => {
      let forwardedHeaders: Headers | null = null;

      // Untrusted host
      const evilRequest = new Request("http://localhost:3000/", {
        headers: {
          host: "evil-attacker.com",
        },
      });

      const evilEvent = { request: evilRequest } as unknown as RequestEvent;
      const evilServer = createEdenServer({
        event: evilEvent,
        fetcher: async (req: Request) => {
          forwardedHeaders = req.headers;
          return new Response(JSON.stringify({ status: "active", timestamp: 1, path: "/api/ping" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        },
      });

      await evilServer.api.ping.get();
      expect(forwardedHeaders!.get("x-forwarded-host")).toBeNull();

      // Trusted host
      const trustedRequest = new Request("http://localhost:3000/", {
        headers: {
          host: "skyjt.dev",
        },
      });

      const trustedEvent = { request: trustedRequest } as unknown as RequestEvent;
      const trustedServer = createEdenServer({
        event: trustedEvent,
        fetcher: async (req: Request) => {
          forwardedHeaders = req.headers;
          return new Response(JSON.stringify({ status: "active", timestamp: 1, path: "/api/ping" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        },
      });

      await trustedServer.api.ping.get();
      expect(forwardedHeaders!.get("x-forwarded-host")).toBe("skyjt.dev");
    });

    it("forwards Set-Cookie headers from Elysia response back to SSR response headers", async () => {
      const outgoingResponseHeaders = new Headers();
      const mockEvent = {
        request: new Request("http://localhost:3000/"),
        response: {
          headers: outgoingResponseHeaders,
        },
      } as unknown as RequestEvent;

      const serverWithCookies = createEdenServer({
        event: mockEvent,
        fetcher: async () => {
          const headers = new Headers();
          headers.append("Set-Cookie", "auth_token=rotated_jwt_value; Path=/; HttpOnly");
          headers.append("Set-Cookie", "theme=dark; Path=/");
          headers.set("Content-Type", "application/json");
          return new Response(JSON.stringify({ status: "active", timestamp: 1, path: "/api/ping" }), {
            status: 200,
            headers,
          });
        },
      });

      await serverWithCookies.api.ping.get();

      const setCookies = outgoingResponseHeaders.getSetCookie();
      expect(setCookies).toHaveLength(2);
      expect(setCookies[0]).toContain("auth_token=rotated_jwt_value");
      expect(setCookies[1]).toContain("theme=dark");
    });

    it("safely falls back when called outside active SSR request context", async () => {
      const fallbackServer = createEdenServer();
      const res = await fallbackServer.api.ping.get();
      expect(res.status).toBe(200);
      expect(res.data).not.toBeNull();
      if (res.data && typeof res.data === "object" && "status" in res.data) {
        expect(res.data.status).toBe("active");
      }
    });
  });
});
