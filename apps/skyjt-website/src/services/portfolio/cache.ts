import type { ProjectData, PersonalInfo, MusicWorkData, ContactData } from "~/types";
import { PORTFOLIO_CACHE_TTL_MS } from "~/constants";

export interface CacheEntry<T> {
  readonly data: T;
  readonly timestamp: number;
}

let worksCache: CacheEntry<readonly ProjectData[]> | null = null;
let personalCache: CacheEntry<Readonly<PersonalInfo>> | null = null;
let musicCache: CacheEntry<readonly MusicWorkData[]> | null = null;
let contactCache: CacheEntry<Readonly<ContactData>> | null = null;

export function isCacheFresh<T>(cache: CacheEntry<T> | null, ttl = PORTFOLIO_CACHE_TTL_MS): cache is CacheEntry<T> {
  return cache !== null && Date.now() - cache.timestamp < ttl;
}

export function getWorksCache(): CacheEntry<readonly ProjectData[]> | null {
  return worksCache;
}

export function setWorksCache(entry: CacheEntry<readonly ProjectData[]> | null): void {
  worksCache = entry;
}

export function getPersonalCache(): CacheEntry<Readonly<PersonalInfo>> | null {
  return personalCache;
}

export function setPersonalCache(entry: CacheEntry<Readonly<PersonalInfo>> | null): void {
  personalCache = entry;
}

export function getMusicCache(): CacheEntry<readonly MusicWorkData[]> | null {
  return musicCache;
}

export function setMusicCache(entry: CacheEntry<readonly MusicWorkData[]> | null): void {
  musicCache = entry;
}

export function getContactCache(): CacheEntry<Readonly<ContactData>> | null {
  return contactCache;
}

export function setContactCache(entry: CacheEntry<Readonly<ContactData>> | null): void {
  contactCache = entry;
}

export function clearPortfolioCache(): void {
  worksCache = null;
  personalCache = null;
  musicCache = null;
  contactCache = null;
}