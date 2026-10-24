import mime from "mime";
import type { ProjectData, PersonalInfo, MusicWorkData } from "~/types";
import Elysia from "elysia";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

export interface S3StorageConfig {
  readonly endpoint: string;
  readonly bucket: string;
  readonly accessKeyId: string;
  readonly secretAccessKey: string;
}

export function getS3Config(): S3StorageConfig {
  const env =
    (globalThis as unknown as { __env__?: Record<string, string | undefined> }).__env__ ||
    (typeof process !== "undefined" ? process.env : {});

  const endpoint = env.R2_ENDPOINT || (typeof process !== "undefined" ? process.env?.R2_ENDPOINT : undefined);
  const bucket = env.R2_BUCKET || (typeof process !== "undefined" ? process.env?.R2_BUCKET : undefined);
  const accessKeyId = env.R2_ACCESS_KEY_ID || (typeof process !== "undefined" ? process.env?.R2_ACCESS_KEY_ID : undefined);
  const secretAccessKey = env.R2_SECRET_ACCESS_KEY || (typeof process !== "undefined" ? process.env?.R2_SECRET_ACCESS_KEY : undefined);

  if (!endpoint || !bucket || !accessKeyId || !secretAccessKey) {
    throw new Error(
      "R2 storage environment variables are not configured (R2_ENDPOINT, R2_BUCKET, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY)."
    );
  }

  return {
    endpoint,
    bucket,
    accessKeyId,
    secretAccessKey,
  };
}

export interface StorageContext {
  readonly client: S3Client;
  readonly bucket: string;
}

let cachedContext: StorageContext | null = null;

export function getStorageContext(): StorageContext {
  if (cachedContext) {
    return cachedContext;
  }
  const config = getS3Config();
  cachedContext = {
    bucket: config.bucket,
    client: new S3Client({
      region: "auto",
      endpoint: config.endpoint,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    }),
  };
  return cachedContext;
}

export function resetStorageContext(): void {
  cachedContext = null;
}

export function getS3Client(): S3Client {
  return getStorageContext().client;
}

export function resetS3Client(): void {
  resetStorageContext();
}

export function getMimeType(filePath: string): string {
  const cleanPath = filePath.split(/[?#]/)[0] ?? filePath;
  return mime.getType(cleanPath) || "application/octet-stream";
}

async function getObjectBytes(key: string): Promise<{ data: Uint8Array; contentType: string } | null> {
  const normalizedKey = key.replace(/^\/+/, "");
  const storage = getStorageContext();

  try {
    const response = await storage.client.send(
      new GetObjectCommand({
        Bucket: storage.bucket,
        Key: normalizedKey,
      })
    );

    if (response.Body) {
      const bytes = await response.Body.transformToByteArray();
      return {
        data: bytes,
        contentType:
          response.ContentType && response.ContentType !== "application/octet-stream"
            ? response.ContentType
            : getMimeType(normalizedKey),
      };
    }
  } catch (error: unknown) {
    if ((error as { name?: string }).name === "NoSuchKey") {
      return null;
    }
    throw error;
  }

  return null;
}

export const storageRoutes = new Elysia({ prefix: "/storage" })
  .get("/data/works", async ({ set }): Promise<ProjectData[]> => {
    set.headers["content-type"] = "application/json; charset=utf-8";
    set.headers["cache-control"] = "public, max-age=60, s-maxage=60, stale-while-revalidate=60";
    const result = await getObjectBytes("worksData.json");
    if (!result) {
      set.status = 404;
      throw new Error("Works data object 'worksData.json' not found in storage bucket.");
    }
    return JSON.parse(new TextDecoder().decode(result.data));
  })
  .get("/data/personal", async ({ set }): Promise<PersonalInfo> => {
    set.headers["content-type"] = "application/json; charset=utf-8";
    set.headers["cache-control"] = "public, max-age=60, s-maxage=60, stale-while-revalidate=60";
    const result = await getObjectBytes("personalInfo.json");
    if (!result) {
      set.status = 404;
      throw new Error("Personal info object 'personalInfo.json' not found in storage bucket.");
    }
    return JSON.parse(new TextDecoder().decode(result.data));
  })
  .get("/data/music", async ({ set }): Promise<MusicWorkData[]> => {
    set.headers["content-type"] = "application/json; charset=utf-8";
    set.headers["cache-control"] = "public, max-age=60, s-maxage=60, stale-while-revalidate=60";
    const result = await getObjectBytes("musicWorksData.json");
    if (!result) {
      set.status = 404;
      throw new Error("Music works object 'musicWorksData.json' not found in storage bucket.");
    }
    return JSON.parse(new TextDecoder().decode(result.data));
  })
  .get("/file/*", async ({ params, set }) => {
    const rawWildcard = params["*"] || "";
    const key = decodeURIComponent(rawWildcard);
    const result = await getObjectBytes(key);
    if (!result) {
      set.status = 404;
      return "Object Not Found";
    }

    set.headers["content-type"] = result.contentType;
    set.headers["cache-control"] = "public, max-age=3600, s-maxage=86400";

    const arrayBuffer = new ArrayBuffer(result.data.byteLength);
    new Uint8Array(arrayBuffer).set(result.data);

    return new Response(arrayBuffer, {
      headers: {
        "content-type": result.contentType,
        "cache-control": "public, max-age=3600, s-maxage=86400",
      },
    });
  });
