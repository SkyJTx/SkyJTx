import { describe, it, expect, vi } from "vitest";
import { createVercelEdgeHandler, vercelEdgeConfig } from "../../src/adapters/runtime/vercel";

describe("Vercel Edge Runtime Adapter", () => {
  it("exports runtime edge config", () => {
    expect(vercelEdgeConfig.runtime).toBe("edge");
  });

  it("delegates edge request directly to server.fetch", async () => {
    const mockServer = {
      fetch: vi.fn().mockResolvedValue(new Response("Vercel Edge Response", { status: 200 })),
    };

    const handler = createVercelEdgeHandler(mockServer);
    const request = new Request("https://my-app.vercel.app/profile");
    const response = await handler(request);

    expect(mockServer.fetch).toHaveBeenCalledWith(request);
    expect(await response.text()).toBe("Vercel Edge Response");
  });
});
