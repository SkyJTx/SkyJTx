import type { APIEvent } from "filesystem-routing/api";
import { getObjectStream } from "~/server/modules/storage";

export async function GET(event: APIEvent): Promise<Response> {
  const rawPath = (event.params?.path) || "";
  let key = rawPath;
  try {
    key = decodeURIComponent(rawPath);
  } catch {
    // Retain raw parameter if decoding encounters invalid escape sequence
  }

  const [result, error] = await getObjectStream(key, undefined, event);
  if (error) {
    return Response.json(
      {
        type: error.code,
        code: error.code,
        status: error.status,
        detail: error.message,
      },
      {
        status: error.status,
        headers: { "content-type": "application/problem+json" },
      }
    );
  }

  const headers = new Headers({
    "content-type": result.contentType,
    "cache-control": "public, max-age=3600, s-maxage=86400",
    "content-disposition": "inline",
  });
  if (result.contentLength !== undefined) {
    headers.set("content-length", String(result.contentLength));
  }

  return new Response(result.stream, { headers });
}