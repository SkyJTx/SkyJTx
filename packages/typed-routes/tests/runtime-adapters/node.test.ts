import { describe, it, expect, vi } from "vitest";
import type { IncomingMessage, ServerResponse } from "node:http";
import {
  nodeRequestToWebRequest,
  sendWebResponseToNodeResponse,
  createNodeMiddleware,
} from "../../src/adapters/runtime/node";

describe("Node.js Runtime Adapter", () => {
  it("converts IncomingMessage to Web Standard Request", () => {
    const mockReq = {
      headers: {
        host: "localhost:3000",
        "x-forwarded-proto": "https",
        "user-agent": "test-agent",
      },
      url: "/users/99?view=compact",
      method: "GET",
    } as unknown as IncomingMessage;

    const webRequest = nodeRequestToWebRequest(mockReq);

    expect(webRequest.url).toBe("https://localhost:3000/users/99?view=compact");
    expect(webRequest.method).toBe("GET");
    expect(webRequest.headers.get("user-agent")).toBe("test-agent");
  });

  it("pipes Web Standard Response to ServerResponse", async () => {
    const writtenChunks: string[] = [];
    const mockHeaders = new Map<string, string>();
    let isEnded = false;

    const mockRes = {
      statusCode: 0,
      statusMessage: "",
      setHeader(key: string, val: string) {
        mockHeaders.set(key, val);
      },
      write(chunk: unknown) {
        writtenChunks.push(new TextDecoder().decode(chunk as Uint8Array));
      },
      end() {
        isEnded = true;
      },
      destroy: vi.fn(),
    } as unknown as ServerResponse;

    const webResponse = new Response("Hello from Web Stream", {
      status: 201,
      statusText: "Created",
      headers: { "Content-Type": "text/plain" },
    });

    await sendWebResponseToNodeResponse(webResponse, mockRes);

    expect(mockRes.statusCode).toBe(201);
    expect(mockRes.statusMessage).toBe("Created");
    expect(mockHeaders.get("content-type")).toBe("text/plain");
    expect(writtenChunks.join("")).toBe("Hello from Web Stream");
    expect(isEnded).toBe(true);
  });

  it("dispatches request through server.fetch in createNodeMiddleware", async () => {
    const mockServer = {
      fetch: vi.fn().mockResolvedValue(new Response("Rendered Content", { status: 200 })),
    };

    const middleware = createNodeMiddleware(mockServer);

    const mockReq = {
      headers: { host: "localhost:3000" },
      url: "/api/data",
      method: "GET",
    } as unknown as IncomingMessage;

    let isEnded = false;
    const mockRes = {
      statusCode: 0,
      setHeader: vi.fn(),
      write: vi.fn(),
      end: () => {
        isEnded = true;
      },
    } as unknown as ServerResponse;

    await middleware(mockReq, mockRes);

    expect(mockServer.fetch).toHaveBeenCalledTimes(1);
    expect(isEnded).toBe(true);
  });
});
