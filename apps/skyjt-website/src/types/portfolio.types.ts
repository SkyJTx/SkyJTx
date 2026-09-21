/**
 * Link associated with a project.
 */
export interface ProjectLink {
  label: string;
  url: string;
  icon: "github" | "external-link" | "file-text";
}

/**
 * Image associated with a project.
 */
export interface ProjectImage {
  src: string;
  alt: string;
}

/**
 * Complete project portfolio item.
 */
export interface ProjectData {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  images: ProjectImage[];
  links: ProjectLink[];
  pdfUrl?: string;
  date?: string;
}

/**
 * Global personal information and profile metadata structure.
 */
export interface PersonalInfo {
  fullName: string;
  tagline: string;
  description: string;
  location: string;
  email: string;
  phone: string;
  githubUrl: string;
  linkedinUrl: string;
  musescoreUrl: string;
  resumeUrl: string;
  myselfPhotoUrl: string;
}
