import * as v from "valibot";
import { getOwner, useContext } from "solid-js";
import { query, RouterContext } from "@solidjs/router";
import type {
  PersonalInfo,
  ProjectData,
  MusicWorkData,
} from "~/types";
import {
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

/**
 * Fetches JSON directly from remote Supabase storage bucket with safe fallback to Not Found.
 */
async function fetchFromSupabase<T>(
  url: string,
  schema: v.BaseSchema<unknown, T, v.BaseIssue<unknown>>,
  fallbackData: T
): Promise<T> {
  try {
    const res = await fetch(url);
    if (res.ok) {
      const json: unknown = await res.json();
      const parseResult = v.safeParse(schema, json);
      if (parseResult.success) {
        return parseResult.output;
      }
    }
  } catch {
    // Remote fetch failure handled gracefully by falling back to Not Found data
  }

  return fallbackData;
}

/**
 * Fetches portfolio projects exclusively from remote Supabase bucket with in-memory TTL caching.
 */
export async function fetchWorksData(): Promise<readonly ProjectData[]> {
  if (isCacheFresh(worksCache)) {
    return worksCache.data;
  }
  const data = await fetchFromSupabase(
    SUPABASE_WORKS_URL,
    WorksDataSchema,
    NOT_FOUND_PROJECTS
  );
  worksCache = { data, timestamp: Date.now() };
  return data;
}

/**
 * Fetches personal profile metadata exclusively from remote Supabase bucket with in-memory TTL caching.
 */
export async function fetchPersonalInfo(): Promise<Readonly<PersonalInfo>> {
  if (isCacheFresh(personalCache)) {
    return personalCache.data;
  }
  const data = await fetchFromSupabase(
    SUPABASE_PERSONAL_URL,
    PersonalInfoSchema,
    NOT_FOUND_PERSONAL_INFO
  );
  personalCache = { data, timestamp: Date.now() };
  return data;
}

/**
 * Fetches music scores exclusively from remote Supabase bucket with in-memory TTL caching.
 */
export async function fetchMusicWorksData(): Promise<readonly MusicWorkData[]> {
  if (isCacheFresh(musicCache)) {
    return musicCache.data;
  }
  const data = await fetchFromSupabase(
    SUPABASE_MUSIC_WORKS_URL,
    MusicWorksDataSchema,
    NOT_FOUND_MUSIC_WORKS
  );
  musicCache = { data, timestamp: Date.now() };
  return data;
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
