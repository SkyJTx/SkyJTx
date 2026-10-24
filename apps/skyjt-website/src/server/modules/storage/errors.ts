import { HTTPError } from "elysia";

export class StorageNotFoundError extends HTTPError.id("STORAGE_NOT_FOUND", 404) {
  constructor(key: string) {
    super(`Storage object '${key}' not found in storage bucket.`);
  }
}

export class StorageConfigError extends HTTPError.id("STORAGE_CONFIG_ERROR", 500) {
  constructor(message: string) {
    super(message);
  }
}
