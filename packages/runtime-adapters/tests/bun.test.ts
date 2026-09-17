import { describe, it, expect, vi } from "vitest";
import { createBunHandler } from "../src/bun";

describe("Bun Runtime Adapter", () => {
  it("delegates to server.fetch when requesting root path", async () => {
    const mockServer = {
      fetch: vi.fn().mockResolvedValue(new Response("SSR Output", { status: 200 })),
    };

    const handler = createBunHandler(mockServer);
    const request = new Request("http://localhost:3000/");
    const response = await handler(request);

    expect(mockServer.fetch).toHaveBeenCalledTimes(1);
    expect(await response.text()).toBe("SSR Output");
  });

  it("delegates to server.fetch when asset is not present", async () => {
    const mockServer = {
      fetch: vi.fn().mockResolvedValue(new Response("Dynamic Route", { status: 200 })),
    };

    const handler = createBunHandler(mockServer, { staticDir: "./non-existent-dir" });
    const request = new Request("http://localhost:3000/users/42");
    const response = await handler(request);

    expect(mockServer.fetch).toHaveBeenCalledTimes(1);
    expect(await response.text()).toBe("Dynamic Route");
  });
});
