import * as v from "valibot";
import { isServer } from "@solidjs/web";
import { getObjectText, type StorageError, StorageOperationError } from "~/server/modules/storage";
import {
  type PersonalInfo,
  type ProjectData,
  type MusicWorkData,
  type ContactData,
  WorksDataSchema,
  MusicWorksDataSchema,
  PersonalInfoSchema,
  ContactDataSchema,
} from "~/types";
import { type Result, ok, err } from "~/types/result";
import {
  isCacheFresh,
  getWorksCache,
  setWorksCache,
  getPersonalCache,
  setPersonalCache,
  getMusicCache,
  setMusicCache,
  getContactCache,
  setContactCache,
} from "./cache";

export type StorageDataType = "works" | "personal" | "music" | "contact";

export interface PortfolioValidationError {
  readonly name: "PortfolioValidationError";
  readonly message: string;
  readonly issues: readonly v.BaseIssue<unknown>[];
}

export interface PortfolioHttpError {
  readonly name: "PortfolioHttpError";
  readonly message: string;
  readonly status: number;
}

export type PortfolioFetchError =
  | StorageError
  | PortfolioValidationError
  | PortfolioHttpError;

type StorageFetcherOverride = (type: StorageDataType) => Promise<unknown>;
let testFetcherOverride: StorageFetcherOverride | null = null;

export function setFetcherForTesting(override: StorageFetcherOverride | null): void {
  testFetcherOverride = override;
}

const STORAGE_FILES: Record<StorageDataType, string> = {
  works: "worksData.json",
  personal: "personalInfo.json",
  music: "musicWorksData.json",
  contact: "contactData.json",
};

async function fetchStorageData<T>(
  type: StorageDataType,
  schema: v.BaseSchema<unknown, T, v.BaseIssue<unknown>>
): Promise<Result<T, PortfolioFetchError>> {
  if (testFetcherOverride) {
    try {
      const raw = await testFetcherOverride(type);
      const parsed = v.safeParse(schema, raw);
      if (!parsed.success) {
        return err({
          name: "PortfolioValidationError",
          message: `Validation failed for ${type} data`,
          issues: parsed.issues,
        });
      }
      return ok(parsed.output);
    } catch (e: unknown) {
      return err(
        new StorageOperationError(
          e instanceof Error ? e.message : String(e),
          e
        )
      );
    }
  }

  if (isServer) {
    const fileName = STORAGE_FILES[type];
    const [text, error] = await getObjectText(fileName);
    if (error) {
      return err(error);
    }

    try {
      const raw: unknown = JSON.parse(text);
      const parsed = v.safeParse(schema, raw);
      if (!parsed.success) {
        return err({
          name: "PortfolioValidationError",
          message: `Validation failed for ${type} JSON from storage`,
          issues: parsed.issues,
        });
      }
      return ok(parsed.output);
    } catch (e: unknown) {
      return err(
        new StorageOperationError(
          `Failed to parse ${type} JSON payload from storage`,
          e
        )
      );
    }
  }

  try {
    const endpoint = `/api/storage/data/${type}`;
    const res = await fetch(endpoint);
    if (!res.ok) {
      return err({
        name: "PortfolioHttpError",
        message: `Failed to fetch ${type} data: ${res.status} ${res.statusText}`,
        status: res.status,
      });
    }

    const json: unknown = await res.json();
    const parsed = v.safeParse(schema, json);
    if (!parsed.success) {
      return err({
        name: "PortfolioValidationError",
        message: `Validation failed for ${type} API response`,
        issues: parsed.issues,
      });
    }
    return ok(parsed.output);
  } catch (e: unknown) {
    return err(
      new StorageOperationError(
        e instanceof Error ? e.message : String(e),
        e
      )
    );
  }
}

export async function fetchWorksData(): Promise<Result<readonly ProjectData[], PortfolioFetchError>> {
  const cache = getWorksCache();
  if (isCacheFresh(cache)) {
    return ok(cache.data);
  }
  const [data, error] = await fetchStorageData("works", WorksDataSchema);
  if (error) {
    return err(error);
  }
  setWorksCache({ data, timestamp: Date.now() });
  return ok(data);
}

export async function fetchPersonalInfo(): Promise<Result<Readonly<PersonalInfo>, PortfolioFetchError>> {
  const cache = getPersonalCache();
  if (isCacheFresh(cache)) {
    return ok(cache.data);
  }
  const [data, error] = await fetchStorageData("personal", PersonalInfoSchema);
  if (error) {
    return err(error);
  }
  const frozen = Object.freeze(data);
  setPersonalCache({ data: frozen, timestamp: Date.now() });
  return ok(frozen);
}

export async function fetchMusicWorksData(): Promise<Result<readonly MusicWorkData[], PortfolioFetchError>> {
  const cache = getMusicCache();
  if (isCacheFresh(cache)) {
    return ok(cache.data);
  }
  const [data, error] = await fetchStorageData("music", MusicWorksDataSchema);
  if (error) {
    return err(error);
  }
setMusicCache({ data, timestamp: Date.now() });
  return ok(data);
}

export async function fetchContactData(): Promise<Result<Readonly<ContactData>, PortfolioFetchError>> {
  const cache = getContactCache();
  if (isCacheFresh(cache)) {
    return ok(cache.data);
  }
  const [data, error] = await fetchStorageData("contact", ContactDataSchema);
  if (error) {
    return err(error);
  }
  const frozen = Object.freeze(data);
  setContactCache({ data: frozen, timestamp: Date.now() });
  return ok(frozen);
}