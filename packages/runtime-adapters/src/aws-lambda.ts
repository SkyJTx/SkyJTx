import type { APIGatewayV2Event, APIGatewayV2Result, StandardServerHandler } from "./types";

/**
 * Transforms an AWS API Gateway v2 HTTP event into a Web Standard Request.
 */
export function lambdaEventToWebRequest(event: APIGatewayV2Event): Request {
  const domain = event.requestContext?.domainName || "localhost";
  const protocol = event.headers["x-forwarded-proto"] || "https";
  const search = event.rawQueryString ? `?${event.rawQueryString}` : "";
  const rawPath = event.rawPath?.startsWith("/") ? event.rawPath : `/${event.rawPath || ""}`;
  const url = `${protocol}://${domain}${rawPath}${search}`;

  const headers = new Headers();
  for (const [key, value] of Object.entries(event.headers)) {
    if (value !== undefined) {
      headers.set(key, value);
    }
  }

  if (event.cookies && event.cookies.length > 0) {
    headers.set("cookie", event.cookies.join("; "));
  }

  const method = event.requestContext?.http?.method || "GET";
  const hasBody = method !== "GET" && method !== "HEAD" && event.body !== undefined;

  let body: BodyInit | undefined = undefined;
  if (hasBody && event.body) {
    if (event.isBase64Encoded) {
      body = Buffer.from(event.body, "base64");
    } else {
      body = event.body;
    }
  }

  return new Request(url, {
    method,
    headers,
    body,
  });
}

/**
 * Serializes a Web Standard Response into an AWS API Gateway v2 result payload.
 */
export async function webResponseToLambdaResult(
  webResponse: Response,
): Promise<APIGatewayV2Result> {
  const statusCode = webResponse.status;
  const headers: Record<string, string> = {};
  const cookies: string[] = [];

  webResponse.headers.forEach((value, key) => {
    if (key.toLowerCase() === "set-cookie") {
      cookies.push(value);
    } else {
      headers[key] = value;
    }
  });

  const contentType = webResponse.headers.get("content-type") || "";
  const isTextual =
    contentType.startsWith("text/") ||
    contentType.includes("application/json") ||
    contentType.includes("application/javascript") ||
    contentType.includes("application/xml") ||
    contentType.includes("image/svg+xml");

  if (!webResponse.body) {
    return {
      statusCode,
      headers,
      cookies: cookies.length > 0 ? cookies : undefined,
    };
  }

  if (isTextual) {
    const textBody = await webResponse.text();
    return {
      statusCode,
      headers,
      cookies: cookies.length > 0 ? cookies : undefined,
      body: textBody,
      isBase64Encoded: false,
    };
  }

  const arrayBuffer = await webResponse.arrayBuffer();
  const base64Body = Buffer.from(arrayBuffer).toString("base64");

  return {
    statusCode,
    headers,
    cookies: cookies.length > 0 ? cookies : undefined,
    body: base64Body,
    isBase64Encoded: true,
  };
}

/**
 * Creates an AWS Lambda handler accepting API Gateway v2 HTTP events.
 */
export function createLambdaHandler(
  server: StandardServerHandler,
): (event: APIGatewayV2Event) => Promise<APIGatewayV2Result> {
  return async (event: APIGatewayV2Event): Promise<APIGatewayV2Result> => {
    const request = lambdaEventToWebRequest(event);
    const response = await server.fetch(request);
    return webResponseToLambdaResult(response);
  };
}
