import { S3Client } from "@aws-sdk/client-s3";
import { FetchHttpHandler } from "@smithy/fetch-http-handler";
import { type S3StorageConfig, getS3Config } from "./config";
import { StorageConfigError } from "./errors";
import { type Result, ok, err } from "~/types/result";

export interface S3Context {
  readonly client: S3Client;
  readonly bucket: string;
}

let storageContext: S3Context | null = null;

export function getStorageContext(envOrEvent?: unknown): Result<S3Context, StorageConfigError> {
  if (storageContext && !envOrEvent) {
    return ok(storageContext);
  }

  const config: S3StorageConfig | null = getS3Config(envOrEvent);
  if (!config) {
    return err(
      new StorageConfigError(
        "Missing or invalid Cloudflare R2 / S3 storage credentials in environment variables."
      )
    );
  }

  const client = new S3Client({
    region: "auto",
    endpoint: config.endpoint,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
    requestHandler: new FetchHttpHandler(),
  });

  const context: S3Context = {
    client,
    bucket: config.bucket,
  };

  if (!envOrEvent) {
    storageContext = context;
  }

  return ok(context);
}

export function resetStorageContext(): void {
  storageContext = null;
}

export function getS3Client(envOrEvent?: unknown): Result<S3Client, StorageConfigError> {
  const [context, error] = getStorageContext(envOrEvent);
  if (error) {
    return err(error);
  }
  return ok(context.client);
}

export function resetS3Client(): void {
  resetStorageContext();
}