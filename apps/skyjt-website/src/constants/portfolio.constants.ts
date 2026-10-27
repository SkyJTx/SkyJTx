import type { PersonalInfo, ProjectData, MusicWorkData, ContactData } from "~/types";

/**
 * Storage proxy endpoint for runtime content assets.
 */
export const STORAGE_BASE_URL = "/api/storage";

/**
 * Storage endpoint for software projects payload.
 */
export const WORKS_DATA_URL = `${STORAGE_BASE_URL}/data/works` as const;

/**
 * Storage endpoint for personal profile metadata payload.
 */
export const PERSONAL_INFO_URL = `${STORAGE_BASE_URL}/data/personal` as const;

/**
 * Storage endpoint for sheet music scores payload.
 */
export const MUSIC_WORKS_DATA_URL = `${STORAGE_BASE_URL}/data/music` as const;

/**
 * Storage endpoint for contact channels payload.
 */
export const CONTACT_DATA_URL = `${STORAGE_BASE_URL}/data/contact` as const;

/**
 * Backward compatibility aliases for legacy Supabase constants.
 */
export const SUPABASE_BASE_URL = `${STORAGE_BASE_URL}/data`;
export const SUPABASE_WORKS_URL = WORKS_DATA_URL;
export const SUPABASE_PERSONAL_URL = PERSONAL_INFO_URL;
export const SUPABASE_MUSIC_WORKS_URL = MUSIC_WORKS_DATA_URL;

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
  CONTACT: "contact-data",
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

/**
 * Default fallback when contact data cannot be fetched from remote storage.
 */
export const NOT_FOUND_CONTACT_DATA: Readonly<ContactData> = Object.freeze({
  contact: Object.freeze({
    email: "notfound@example.com",
    phone: "",
    location: "Not Found",
    availabilityStatus: "Contact information could not be loaded.",
    openTo: [],
  }),
  socialMedia: [],
  workMedia: [],
});
