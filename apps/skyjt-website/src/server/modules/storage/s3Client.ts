import { S3Client } from "@aws-sdk/client-s3";
import { type S3StorageConfig, getS3Config } from "./config";
import { StorageConfigError } from "./errors";

export interface S3Context {
  readonly client: S3Client;
  readonly bucket: string;
}

let storageContext: S3Context | null = null;

export function getStorageContext(): S3Context {
  if (storageContext) {
    return storageContext;
  }

  const config: S3StorageConfig | null = getS3Config();
  if (!config) {
    throw new StorageConfigError(
      "Missing or invalid Cloudflare R2 / S3 storage credentials in environment variables."
    );
  }

  const client = new S3Client({
    region: "auto",
    endpoint: config.endpoint,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });

  storageContext = {
    client,
    bucket: config.bucket,
  };

  return storageContext;
}

export function resetStorageContext(): void {
  storageContext = null;
}

export function getS3Client(): S3Client {
  return getStorageContext().client;
}

export function resetS3Client(): void {
  resetStorageContext();
}
