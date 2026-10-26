import * as v from "valibot";

declare global {
  var __env__: Record<string, string | undefined> | undefined;
}

export const S3EnvSchema = v.object({
  R2_ENDPOINT: v.pipe(v.string(), v.nonEmpty("R2_ENDPOINT must not be empty")),
  R2_BUCKET: v.pipe(v.string(), v.nonEmpty("R2_BUCKET must not be empty")),
  R2_ACCESS_KEY_ID: v.pipe(v.string(), v.nonEmpty("R2_ACCESS_KEY_ID must not be empty")),
  R2_SECRET_ACCESS_KEY: v.pipe(v.string(), v.nonEmpty("R2_SECRET_ACCESS_KEY must not be empty")),
});

export interface S3StorageConfig {
  readonly endpoint: string;
  readonly bucket: string;
  readonly accessKeyId: string;
  readonly secretAccessKey: string;
}

export function getEnvRecord(customEnv?: unknown): Record<string, string | undefined> {
  let candidate: Record<string, string | undefined> | undefined;

  if (typeof customEnv === "object" && customEnv !== null) {
    if ("context" in customEnv) {
      const contextObj = (customEnv as Record<string, unknown>).context;
      if (typeof contextObj === "object" && contextObj !== null && "cloudflare" in contextObj) {
        const cloudflare = (contextObj as Record<string, unknown>).cloudflare;
        if (typeof cloudflare === "object" && cloudflare !== null && "env" in cloudflare) {
          candidate = cloudflare.env as Record<string, string | undefined>;
        }
      }
    } else if ("R2_ENDPOINT" in customEnv || "R2_BUCKET" in customEnv) {
      candidate = customEnv as Record<string, string | undefined>;
    }
  }

  if (candidate && candidate.R2_ENDPOINT && candidate.R2_BUCKET) {
    return candidate;
  }

  if (typeof globalThis !== "undefined" && typeof globalThis.__env__ === "object" && globalThis.__env__ !== null) {
    return globalThis.__env__;
  }
  if (typeof process !== "undefined" && process.env) {
    return process.env as Record<string, string | undefined>;
  }
  return candidate ?? {};
}

export function getS3Config(customEnv?: unknown): S3StorageConfig | null {
  const env = getEnvRecord(customEnv);
  const result = v.safeParse(S3EnvSchema, env);
  if (!result.success) {
    return null;
  }
  return {
    endpoint: result.output.R2_ENDPOINT,
    bucket: result.output.R2_BUCKET,
    accessKeyId: result.output.R2_ACCESS_KEY_ID,
    secretAccessKey: result.output.R2_SECRET_ACCESS_KEY,
  };
}