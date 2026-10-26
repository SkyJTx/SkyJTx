import mime from "mime";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getStorageContext, type S3Context } from "./s3Client";
import {
  StorageNotFoundError,
  StorageOperationError,
  type StorageError,
} from "./errors";
import { type Result, ok, err } from "~/types/result";

export function getMimeType(filename: string): string {
  const cleanPath = filename.split(/[?#]/)[0] ?? filename;
  return mime.getType(cleanPath) || "application/octet-stream";
}

function isNotFoundError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) {
    return false;
  }
  const e = error as Record<string, unknown>;
  if (e.name === "NoSuchKey" || e.name === "NotFound") {
    return true;
  }
  if (typeof e.$metadata === "object" && e.$metadata !== null) {
    const meta = e.$metadata as Record<string, unknown>;
    if (meta.httpStatusCode === 404) {
      return true;
    }
  }
  return false;
}

export interface GetObjectStreamResult {
  readonly stream: ReadableStream;
  readonly contentType: string;
  readonly contentLength?: number;
}

export async function getObjectStream(
  key: string,
  customContext?: S3Context,
  envOrEvent?: unknown
): Promise<Result<GetObjectStreamResult, StorageError>> {
  const normalizedKey = key.replace(/^\/+/, "");
  const [context, contextError] = customContext
    ? ok(customContext)
    : getStorageContext(envOrEvent);

  if (contextError) {
    return err(contextError);
  }

  try {
    const command = new GetObjectCommand({
      Bucket: context.bucket,
      Key: normalizedKey,
    });
    const response = await context.client.send(command);

    if (!response.Body) {
      return err(new StorageNotFoundError(normalizedKey));
    }

    const contentType =
      response.ContentType && response.ContentType !== "application/octet-stream"
        ? response.ContentType
        : getMimeType(normalizedKey);

    return ok({
      stream: response.Body.transformToWebStream(),
      contentType,
      contentLength: response.ContentLength,
    });
  } catch (error: unknown) {
    if (isNotFoundError(error)) {
      return err(new StorageNotFoundError(normalizedKey));
    }
    return err(
      new StorageOperationError(
        error instanceof Error ? error.message : String(error),
        error
      )
    );
  }
}

export async function getObjectText(
  key: string,
  customContext?: S3Context,
  envOrEvent?: unknown
): Promise<Result<string, StorageError>> {
  const normalizedKey = key.replace(/^\/+/, "");
  const [context, contextError] = customContext
    ? ok(customContext)
    : getStorageContext(envOrEvent);

  if (contextError) {
    return err(contextError);
  }

  try {
    const command = new GetObjectCommand({
      Bucket: context.bucket,
      Key: normalizedKey,
    });
    const response = await context.client.send(command);

    if (!response.Body) {
      return err(new StorageNotFoundError(normalizedKey));
    }

    const text = await response.Body.transformToString();
    return ok(text);
  } catch (error: unknown) {
    if (isNotFoundError(error)) {
      return err(new StorageNotFoundError(normalizedKey));
    }
    return err(
      new StorageOperationError(
        error instanceof Error ? error.message : String(error),
        error
      )
    );
  }
}