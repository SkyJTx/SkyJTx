import { describe, it, expect, vi } from "vitest";
import {
  createCloudflarePagesHandler,
  createCloudflareWorkerHandler,
} from "../../src/adapters/runtime/cloudflare";

describe("Cloudflare Runtime Adapter", () => {
  describe("Pages Handler", () => {
    it("returns static asset directly when env.ASSETS matches", async () => {
      const mockServer = {
        fetch: vi.fn(),
      };

      const handler = createCloudflarePagesHandler(mockServer);

      const mockAssetResponse = new Response("CSS File Content", { status: 200 });
      const mockContext = {
        request: new Request("http://example.com/assets/main.css"),
        env: {
          ASSETS: {
            fetch: vi.fn().mockResolvedValue(mockAssetResponse),
          },
        },
        next: vi.fn(),
        waitUntil: vi.fn(),
      };

      const result = await handler(mockContext);

      expect(mockContext.env.ASSETS.fetch).toHaveBeenCalledWith(mockContext.request);
      expect(mockServer.fetch).not.toHaveBeenCalled();
      expect(await result.text()).toBe("CSS File Content");
    });

    it("falls back to server.fetch when env.ASSETS returns 404", async () => {
      const mockServer = {
        fetch: vi.fn().mockResolvedValue(new Response("SSR Page", { status: 200 })),
      };

      const handler = createCloudflarePagesHandler(mockServer);

      const mockContext = {
        request: new Request("http://example.com/dynamic-route"),
        env: {
          ASSETS: {
            fetch: vi.fn().mockResolvedValue(new Response("Not found", { status: 404 })),
          },
        },
        next: vi.fn(),
        waitUntil: vi.fn(),
      };

      const result = await handler(mockContext);

      expect(mockContext.env.ASSETS.fetch).toHaveBeenCalledWith(mockContext.request);
      expect(mockServer.fetch).toHaveBeenCalledWith(mockContext.request);
      expect(await result.text()).toBe("SSR Page");
    });
  });

  describe("Worker Handler", () => {
    it("delegates to env.ASSETS and falls back to server.fetch", async () => {
      const mockServer = {
        fetch: vi.fn().mockResolvedValue(new Response("Worker SSR", { status: 200 })),
      };

      const worker = createCloudflareWorkerHandler(mockServer);
      const req = new Request("http://example.com/");
      const env = {
        ASSETS: {
          fetch: vi.fn().mockResolvedValue(new Response("Not found", { status: 404 })),
        },
      };

      const result = await worker.fetch(req, env);

      expect(env.ASSETS.fetch).toHaveBeenCalledWith(req);
      expect(mockServer.fetch).toHaveBeenCalledWith(req);
      expect(await result.text()).toBe("Worker SSR");
    });
  });
});
