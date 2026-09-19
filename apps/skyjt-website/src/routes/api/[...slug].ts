import type { APIEvent } from "filesystem-routing/api";
import app from "~/server";

async function handleRequest(event: APIEvent): Promise<Response> {
  return app.fetch(event.request, event);
}

export const GET = handleRequest;
export const QUERY = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;
export const HEAD = handleRequest;
export const OPTIONS = handleRequest;