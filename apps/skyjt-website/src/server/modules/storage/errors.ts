export class StorageNotFoundError extends Error {
  readonly status = 404;
  readonly code = "STORAGE_NOT_FOUND" as const;

  constructor(key: string) {
    super(`Storage object '${key}' not found in storage bucket.`);
    this.name = "StorageNotFoundError";
  }
}

export class StorageConfigError extends Error {
  readonly status = 500;
  readonly code = "STORAGE_CONFIG_ERROR" as const;

  constructor(message: string) {
    super(message);
    this.name = "StorageConfigError";
  }
}

export class StorageOperationError extends Error {
  readonly status = 500;
  readonly code = "STORAGE_OPERATION_ERROR" as const;
  readonly cause?: unknown;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = "StorageOperationError";
    this.cause = cause;
  }
}

export type StorageError =
  | StorageNotFoundError
  | StorageConfigError
  | StorageOperationError;