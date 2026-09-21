import * as v from "valibot";
import type {
  PersonalInfo,
  ProjectData,
} from "~/types";

/**
 * Default fallback when personal info cannot be fetched from remote storage.
 */
export const NOT_FOUND_PERSONAL_INFO: PersonalInfo = {
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
};

/**
 * Default fallback when projects cannot be fetched from remote storage.
 */
export const NOT_FOUND_PROJECTS: readonly ProjectData[] = [];

/**
 * Public Supabase storage bucket endpoints for runtime content loading.
 */
const SUPABASE_BASE_URL =
  "https://kmqwwvhddlqvdmvnqved.supabase.co/storage/v1/object/public/skyjt-website-storage/data";
export const SUPABASE_WORKS_URL = `${SUPABASE_BASE_URL}/worksData.json`;
export const SUPABASE_PERSONAL_URL = `${SUPABASE_BASE_URL}/personalInfo.json`;

/**
 * Schema for project link metadata.
 */
export const ProjectLinkSchema = v.object({
  label: v.string(),
  url: v.string(),
  icon: v.picklist(["github", "external-link", "file-text"]),
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
 * Fetches portfolio projects exclusively from remote Supabase bucket.
 */
export async function fetchWorksData(): Promise<readonly ProjectData[]> {
  return fetchFromSupabase(
    SUPABASE_WORKS_URL,
    WorksDataSchema,
    NOT_FOUND_PROJECTS
  );
}

/**
 * Fetches personal profile metadata exclusively from remote Supabase bucket.
 */
export async function fetchPersonalInfo(): Promise<PersonalInfo> {
  return fetchFromSupabase(
    SUPABASE_PERSONAL_URL,
    PersonalInfoSchema,
    NOT_FOUND_PERSONAL_INFO
  );
}
