import * as v from "valibot";

/**
 * Permitted project link icon identifiers.
 */
export const PROJECT_LINK_ICONS = ["github", "external-link", "file-text"] as const;
export type ProjectLinkIcon = (typeof PROJECT_LINK_ICONS)[number];

/**
 * Schema for project link metadata.
 */
export const ProjectLinkSchema = v.object({
  label: v.string(),
  url: v.string(),
  icon: v.picklist(PROJECT_LINK_ICONS),
});
export type ProjectLink = v.InferOutput<typeof ProjectLinkSchema>;

/**
 * Schema for project image assets.
 */
export const ProjectImageSchema = v.object({
  src: v.string(),
  alt: v.string(),
});
export type ProjectImage = v.InferOutput<typeof ProjectImageSchema>;

/**
 * Schema validating complete ProjectData items.
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
export type ProjectData = v.InferOutput<typeof ProjectDataSchema>;

/**
 * Schema validating the software projects collection.
 */
export const WorksDataSchema = v.array(ProjectDataSchema);
export type WorksData = v.InferOutput<typeof WorksDataSchema>;

/**
 * Schema validating sheet music items from MuseScore.
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
export type MusicWorkData = v.InferOutput<typeof MusicWorkDataSchema>;

/**
 * Schema validating the sheet music collection.
 */
export const MusicWorksDataSchema = v.array(MusicWorkDataSchema);
export type MusicWorksData = v.InferOutput<typeof MusicWorksDataSchema>;

/**
 * Schema validating global personal information and profile metadata.
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
export type PersonalInfo = v.InferOutput<typeof PersonalInfoSchema>;
