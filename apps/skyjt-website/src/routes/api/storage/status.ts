import type { APIEvent } from "filesystem-routing/api";
import { getStorageContext } from "~/server/modules/storage";

export function GET(event: APIEvent): Response {
  const [context, error] = getStorageContext(event);
  if (error) {
    return Response.json(
      {
        storageReady: false,
        hasStorage: false,
        hasContext: false,
        error: error.message,
      },
      { status: 500 }
    );
  }

  return Response.json({
    storageReady: true,
    hasStorage: true,
    hasContext: typeof context.bucket === "string",
  });
}