import mime from "mime";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getStorageContext } from "./s3Client";

export function getMimeType(filename: string): string {
  const cleanPath = filename.split(/[?#]/)[0] ?? filename;
  return mime.getType(cleanPath) || "application/octet-stream";
}

export interface GetObjectBytesResult {
  readonly data: Uint8Array;
  readonly contentType: string;
}

export async function getObjectBytes(key: string): Promise<GetObjectBytesResult | null> {
  const normalizedKey = key.replace(/^\/+/, "");
  const context = getStorageContext();
  try {
    const command = new GetObjectCommand({
      Bucket: context.bucket,
      Key: normalizedKey,
    });
    const response = await context.client.send(command);

    if (!response.Body) {
      return null;
    }

    const byteStream = await response.Body.transformToByteArray();
    const contentType =
      response.ContentType && response.ContentType !== "application/octet-stream"
        ? response.ContentType
        : getMimeType(normalizedKey);

    return {
      data: byteStream,
      contentType,
    };
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "name" in error &&
      (error as { name: string }).name === "NoSuchKey"
    ) {
      return null;
    }
    throw error;
  }
}
