import * as v from "valibot";
import { isServer } from "@solidjs/web";
import { edenClient, type EdenClient } from "./eden-client";
import type { EdenServer } from "./eden-server";
import { getOwner, useContext } from "solid-js";
import { query, RouterContext } from "@solidjs/router";
import type {
  PersonalInfo,
  ProjectData,
  MusicWorkData,
} from "~/types";
import {
  STORAGE_BASE_URL,
  WORKS_DATA_URL,
  PERSONAL_INFO_URL,
  MUSIC_WORKS_DATA_URL,
  SUPABASE_BASE_URL,
  SUPABASE_WORKS_URL,
  SUPABASE_PERSONAL_URL,
  SUPABASE_MUSIC_WORKS_URL,
  PORTFOLIO_CACHE_TTL_MS,
  PORTFOLIO_QUERY_KEYS,
  PROJECT_LINK_ICONS,
  NOT_FOUND_PERSONAL_INFO,
  NOT_FOUND_PROJECTS,
  NOT_FOUND_MUSIC_WORKS,
} from "~/constants";

// Re-export constants for seamless backward compatibility
export {
  STORAGE_BASE_URL,
  WORKS_DATA_URL,
  PERSONAL_INFO_URL,
  MUSIC_WORKS_DATA_URL,
  SUPABASE_BASE_URL,
  SUPABASE_WORKS_URL,
  SUPABASE_PERSONAL_URL,
  SUPABASE_MUSIC_WORKS_URL,
  PORTFOLIO_CACHE_TTL_MS,
  PORTFOLIO_QUERY_KEYS,
  PROJECT_LINK_ICONS,
  NOT_FOUND_PERSONAL_INFO,
  NOT_FOUND_PROJECTS,
  NOT_FOUND_MUSIC_WORKS,
};

/**
 * Schema for project link metadata.
 */
export const ProjectLinkSchema = v.object({
  label: v.string(),
  url: v.string(),
  icon: v.picklist(PROJECT_LINK_ICONS),
});

/**
 * Schema for project image assets.
 */
export const ProjectImageSchema = v.object({
  src: v.string(),
  alt: v.string(),
});

/**
 * Schema validating complete ProjectData items from untrusted JSON sources.
 */
export const ProjectDataSchema = v.object({
  id: v.string(),
  title: v.string(),
  description: v.string(),
  thumbnailUrl: v.string(),
  images: v.array(ProjectImageSchema),
  links: v.array(ProjectLinkSchema),
  pdfUrl: v.optional(v.string()),
  date: v.optional(v.string()),
});

/**
 * Schema validating the software projects collection.
 */
export const WorksDataSchema = v.array(ProjectDataSchema);

/**
 * Schema validating sheet music items from untrusted JSON sources.
 */
export const MusicWorkDataSchema = v.object({
  id: v.string(),
  title: v.string(),
  scoreUrl: v.string(),
  thumbnailUrl: v.string(),
  partsCount: v.optional(v.string()),
  pagesCount: v.optional(v.string()),
  duration: v.optional(v.string()),
  date: v.optional(v.string()),
  views: v.optional(v.string()),
  instruments: v.array(v.string()),
});

/**
 * Schema validating the sheet music collection.
 */
export const MusicWorksDataSchema = v.array(MusicWorkDataSchema);

/**
 * Schema validating personal information attributes from untrusted JSON sources.
 */
export const PersonalInfoSchema = v.object({
  fullName: v.string(),
  tagline: v.string(),
  description: v.string(),
  location: v.string(),
  email: v.string(),
  phone: v.string(),
  githubUrl: v.string(),
  linkedinUrl: v.string(),
  musescoreUrl: v.string(),
  resumeUrl: v.string(),
  myselfPhotoUrl: v.string(),
});

interface CacheEntry<T> {
  readonly data: T;
  readonly timestamp: number;
}

let worksCache: CacheEntry<readonly ProjectData[]> | null = null;
let personalCache: CacheEntry<Readonly<PersonalInfo>> | null = null;
let musicCache: CacheEntry<readonly MusicWorkData[]> | null = null;

/**
 * Evaluates whether an in-memory cache entry exists and is within its freshness TTL window.
 */
function isCacheFresh<T>(
  entry: CacheEntry<T> | null,
  ttlMs = PORTFOLIO_CACHE_TTL_MS
): entry is CacheEntry<T> {
  return entry !== null && Date.now() - entry.timestamp < ttlMs;
}

/**
 * Clears in-memory portfolio data caches (used primarily in test suites).
 */
export function clearPortfolioCache(): void {
  worksCache = null;
  personalCache = null;
  musicCache = null;
  cachedEdenServer = null;
}

export function setEdenForTesting(eden: EdenClient | EdenServer | null): void {
  cachedEdenServer = eden as EdenServer;
}

/**
 * Inspects whether a valid Router context provider exists above the current owner.
 */
function hasRouterContext(): boolean {
  try {
    return Boolean(useContext(RouterContext));
  } catch {
    return false;
  }
}



let cachedEdenServer: EdenServer | null = null;

/**
 * Resolves the appropriate Eden Treaty instance for the current execution context.
 * Dynamically loads edenServer during SSR to prevent bundling server modules into client assets.
 */
export async function getEden(): Promise<EdenClient | EdenServer> {
  if (cachedEdenServer) {
    return cachedEdenServer;
  }
  if (isServer) {
    const serverModulePath = "./eden-server";
    const mod = (await import(serverModulePath)) as { edenServer: EdenServer };
    cachedEdenServer = mod.edenServer;
    return cachedEdenServer;
  }
  return edenClient;
}

/**
 * Fetches portfolio projects from storage proxy with in-memory TTL caching.
 */
export async function fetchWorksData(): Promise<readonly ProjectData[]> {
  if (isCacheFresh(worksCache)) {
    return worksCache.data;
  }
  const eden = await getEden();
  const res = await eden.api.storage.data.works.get();
  if (res.error) {
    throw new Error(`Failed to fetch works data: ${JSON.stringify((res.error as { value?: unknown })?.value || res.error)}`);
  }
  const output = v.parse(WorksDataSchema, res.data);
  worksCache = { data: output, timestamp: Date.now() };
  return output;
}

/**
 * Fetches personal profile metadata from storage proxy with in-memory TTL caching.
 */
export async function fetchPersonalInfo(): Promise<Readonly<PersonalInfo>> {
  if (isCacheFresh(personalCache)) {
    return personalCache.data;
  }
  const eden = await getEden();
  const res = await eden.api.storage.data.personal.get();
  if (res.error) {
    throw new Error(`Failed to fetch personal info: ${JSON.stringify((res.error as { value?: unknown })?.value || res.error)}`);
  }
  const output = v.parse(PersonalInfoSchema, res.data);
  personalCache = { data: output, timestamp: Date.now() };
  return output;
}

/**
 * Fetches music scores from storage proxy with in-memory TTL caching.
 */
export async function fetchMusicWorksData(): Promise<readonly MusicWorkData[]> {
  if (isCacheFresh(musicCache)) {
    return musicCache.data;
  }
  const eden = await getEden();
  const res = await eden.api.storage.data.music.get();
  if (res.error) {
    throw new Error(`Failed to fetch music works data: ${JSON.stringify((res.error as { value?: unknown })?.value || res.error)}`);
  }
  const output = v.parse(MusicWorksDataSchema, res.data);
  musicCache = { data: output, timestamp: Date.now() };
  return output;
}

const rawWorksQuery = query(fetchWorksData, PORTFOLIO_QUERY_KEYS.WORKS);
const rawPersonalQuery = query(fetchPersonalInfo, PORTFOLIO_QUERY_KEYS.PERSONAL);
const rawMusicQuery = query(fetchMusicWorksData, PORTFOLIO_QUERY_KEYS.MUSIC);

/**
 * Solid Router query for software projects with deduplication and SSR serialization.
 */
export function getWorksDataQuery(): Promise<readonly ProjectData[]> {
  if (getOwner() && !hasRouterContext()) {
    return fetchWorksData();
  }
  return rawWorksQuery();
}
getWorksDataQuery.key = rawWorksQuery.key;

/**
 * Solid Router query for personal profile metadata with deduplication and SSR serialization.
 */
export function getPersonalInfoQuery(): Promise<Readonly<PersonalInfo>> {
  if (getOwner() && !hasRouterContext()) {
    return fetchPersonalInfo();
  }
  return rawPersonalQuery();
}
getPersonalInfoQuery.key = rawPersonalQuery.key;

/**
 * Solid Router query for sheet music portfolio with deduplication and SSR serialization.
 */
export function getMusicWorksDataQuery(): Promise<readonly MusicWorkData[]> {
  if (getOwner() && !hasRouterContext()) {
    return fetchMusicWorksData();
  }
  return rawMusicQuery();
}
getMusicWorksDataQuery.key = rawMusicQuery.key;
