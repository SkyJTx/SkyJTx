import type { PersonalInfo, ProjectData, MusicWorkData } from "~/types";

/**
 * Public Supabase storage bucket base endpoint for runtime content assets.
 */
export const SUPABASE_BASE_URL =
  "https://kmqwwvhddlqvdmvnqved.supabase.co/storage/v1/object/public/skyjt-website-storage/Data";

/**
 * Supabase storage endpoint for software projects payload.
 */
export const SUPABASE_WORKS_URL = `${SUPABASE_BASE_URL}/worksData.json` as const;

/**
 * Supabase storage endpoint for personal profile metadata payload.
 */
export const SUPABASE_PERSONAL_URL = `${SUPABASE_BASE_URL}/personalInfo.json` as const;

/**
 * Supabase storage endpoint for sheet music scores payload.
 */
export const SUPABASE_MUSIC_WORKS_URL = `${SUPABASE_BASE_URL}/musicWorksData.json` as const;

/**
 * Default cache duration (in milliseconds) for in-memory portfolio data.
 */
export const PORTFOLIO_CACHE_TTL_MS = 60 * 1000;

/**
 * Stable query keys used by Solid Router for portfolio queries.
 */
export const PORTFOLIO_QUERY_KEYS = {
  WORKS: "works-data",
  PERSONAL: "personal-info",
  MUSIC: "music-works-data",
} as const;

/**
 * Permitted project link icon identifiers.
 */
export const PROJECT_LINK_ICONS = ["github", "external-link", "file-text"] as const;

/**
 * Default fallback when personal info cannot be fetched from remote storage.
 */
export const NOT_FOUND_PERSONAL_INFO: Readonly<PersonalInfo> = Object.freeze({
  fullName: "Not Found",
  tagline: "Profile Not Found",
  description: "Profile information could not be loaded.",
  location: "Not Found",
  email: "notfound@example.com",
  phone: "",
  githubUrl: "",
  linkedinUrl: "",
  musescoreUrl: "",
  resumeUrl: "",
  myselfPhotoUrl: "",
});

/**
 * Default fallback when projects cannot be fetched from remote storage.
 */
export const NOT_FOUND_PROJECTS: readonly ProjectData[] = Object.freeze([]);

/**
 * Default fallback when music works cannot be fetched from remote storage.
 */
export const NOT_FOUND_MUSIC_WORKS: readonly MusicWorkData[] = Object.freeze([]);
