import { describe, it, expect, vi } from "vitest";
import type { APIGatewayV2Event } from "../../src/adapters/runtime/types";
import {
  lambdaEventToWebRequest,
  webResponseToLambdaResult,
  createLambdaHandler,
} from "../../src/adapters/runtime/aws-lambda";

describe("AWS Lambda Runtime Adapter", () => {
  it("converts API Gateway v2 event to Web Standard Request", async () => {
    const event: APIGatewayV2Event = {
      rawPath: "/items/123",
      rawQueryString: "filter=active&sort=desc",
      headers: {
        host: "api.example.com",
        "x-custom-header": "lambda-test",
      },
      cookies: ["session_id=xyz123", "theme=dark"],
      requestContext: {
        http: {
          method: "POST",
          path: "/items/123",
          protocol: "HTTP/1.1",
          sourceIp: "127.0.0.1",
          userAgent: "aws-sdk",
        },
        domainName: "api.example.com",
      },
      body: JSON.stringify({ name: "Widget" }),
      isBase64Encoded: false,
    };

    const request = lambdaEventToWebRequest(event);

    expect(request.url).toBe("https://api.example.com/items/123?filter=active&sort=desc");
    expect(request.method).toBe("POST");
    expect(request.headers.get("x-custom-header")).toBe("lambda-test");
    expect(request.headers.get("cookie")).toBe("session_id=xyz123; theme=dark");
    expect(await request.json()).toEqual({ name: "Widget" });
  });

  it("decodes base64 body when event is base64 encoded", async () => {
    const rawString = "Hello from Lambda!";
    const base64Body = Buffer.from(rawString).toString("base64");

    const event: APIGatewayV2Event = {
      rawPath: "/binary",
      headers: {},
      requestContext: {
        http: {
          method: "POST",
          path: "/binary",
          protocol: "HTTP/1.1",
          sourceIp: "127.0.0.1",
          userAgent: "curl",
        },
      },
      body: base64Body,
      isBase64Encoded: true,
    };

    const request = lambdaEventToWebRequest(event);
    expect(await request.text()).toBe(rawString);
  });

  it("serializes textual Web Response to APIGatewayV2Result", async () => {
    const response = new Response("<h1>Hello World</h1>", {
      status: 200,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "set-cookie": "token=abc; Path=/",
        "x-powered-by": "typed-routes",
      },
    });

    const result = await webResponseToLambdaResult(response);

    expect(result.statusCode).toBe(200);
    expect(result.body).toBe("<h1>Hello World</h1>");
    expect(result.isBase64Encoded).toBe(false);
    expect(result.headers?.["content-type"]).toBe("text/html; charset=utf-8");
    expect(result.headers?.["x-powered-by"]).toBe("typed-routes");
    expect(result.cookies).toContain("token=abc; Path=/");
  });

  it("serializes binary Web Response with base64 encoding", async () => {
    const binaryData = new Uint8Array([0x89, 0x50, 0x4e, 0x47]); // PNG signature
    const response = new Response(binaryData, {
      status: 200,
      headers: {
        "content-type": "image/png",
      },
    });

    const result = await webResponseToLambdaResult(response);

    expect(result.statusCode).toBe(200);
    expect(result.isBase64Encoded).toBe(true);
    expect(result.body).toBe(Buffer.from(binaryData).toString("base64"));
  });

  it("executes end-to-end in createLambdaHandler", async () => {
    const mockServer = {
      fetch: vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ status: "ok" }), {
          status: 200,
          headers: { "content-type": "application/json" },
        }),
      ),
    };

    const handler = createLambdaHandler(mockServer);
    const event: APIGatewayV2Event = {
      rawPath: "/health",
      headers: {},
      requestContext: {
        http: {
          method: "GET",
          path: "/health",
          protocol: "HTTP/1.1",
          sourceIp: "127.0.0.1",
          userAgent: "health-check",
        },
      },
    };

    const result = await handler(event);

    expect(mockServer.fetch).toHaveBeenCalledTimes(1);
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body || "{}")).toEqual({ status: "ok" });
  });
});
