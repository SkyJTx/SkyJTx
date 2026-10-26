import type { APIEvent } from "filesystem-routing/api";

export function GET(event: APIEvent): Response {
  const url = new URL(event.request.url);
  return Response.json({
    status: "active",
    timestamp: Date.now(),
    path: url.pathname,
  });
}