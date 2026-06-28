export interface ProjectLink {
  label: string;
  url: string;
  icon: "github" | "external-link" | "file-text";
}

export interface ProjectImage {
  src: string;
  alt: string;
}

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

export const SOFTWARE_PROJECTS: ProjectData[] = [
  {
    id: "ruammitr",
    title: "RuamMitr",
    description:
      "A Super App developed in Flutter/Express.js for Software Development Practice course. Integrates multiple campus services into a single mobile-first experience.",
    thumbnailUrl:
      "https://kmqwwvhddlqvdmvnqved.supabase.co/storage/v1/object/public/skyjt-website-storage/RuamMitr%20Project/RuamMitr.jpg",
    images: [
      {
        src: "https://kmqwwvhddlqvdmvnqved.supabase.co/storage/v1/object/public/skyjt-website-storage/RuamMitr%20Project/RuamMitr%20Settings.png",
        alt: "RuamMitr Settings Screen",
      },
      {
        src: "https://kmqwwvhddlqvdmvnqved.supabase.co/storage/v1/object/public/skyjt-website-storage/RuamMitr%20Project/RuamMitr.jpg",
        alt: "RuamMitr Main Screen",
      },
      {
        src: "https://kmqwwvhddlqvdmvnqved.supabase.co/storage/v1/object/public/skyjt-website-storage/RuamMitr%20Project/TuachuayDekhor.png",
        alt: "TuachuayDekhor Feature",
      },
    ],
    links: [
      {
        label: "Frontend",
        url: "https://github.com/SkyJTx/Softdev-2-Group-1-Frontend",
        icon: "github",
      },
      {
        label: "Backend",
        url: "https://github.com/SkyJTx/Softdev-2-Group-1-Backend",
        icon: "github",
      },
    ],
    date: "March 2024 (Project Date)",
  },
  {
    id: "skyjtx-website",
    title: "SkyJTx Website",
    description:
      "Monorepo powering this personal website, GitHub profile, and published packages. Built with SolidJS and hosted on Vercel.",
    thumbnailUrl:
      "https://kmqwwvhddlqvdmvnqved.supabase.co/storage/v1/object/public/skyjt-website-storage/My%20Website/SkyJTx%20Website.png",
    images: [
      {
        src: "https://kmqwwvhddlqvdmvnqved.supabase.co/storage/v1/object/public/skyjt-website-storage/My%20Website/SkyJTx%20Website.png",
        alt: "SkyJTx Website Preview",
      },
    ],
    links: [
      {
        label: "Source Code",
        url: "https://github.com/SkyJTx/SkyJTx",
        icon: "github",
      },
      {
        label: "Live Site",
        url: "https://skyjt.vercel.app/",
        icon: "external-link",
      },
    ],
    date: "June 2026 (Project Date)",
  },
  {
    id: "aidm",
    title: "AIDM",
    description:
      "Mobile application for Artificial Insemination and Information Report and Tracking. Streamlines data collection and monitoring for livestock management.",
    thumbnailUrl:
      "https://kmqwwvhddlqvdmvnqved.supabase.co/storage/v1/object/public/skyjt-website-storage/AIDM/AIDM%20(1).jpg",
    images: [
      {
        src: "https://kmqwwvhddlqvdmvnqved.supabase.co/storage/v1/object/public/skyjt-website-storage/AIDM/AIDM%20(1).jpg",
        alt: "AIDM Screenshot 1",
      },
      {
        src: "https://kmqwwvhddlqvdmvnqved.supabase.co/storage/v1/object/public/skyjt-website-storage/AIDM/AIDM%20(2).jpg",
        alt: "AIDM Screenshot 2",
      },
      {
        src: "https://kmqwwvhddlqvdmvnqved.supabase.co/storage/v1/object/public/skyjt-website-storage/AIDM/AIDM%20(3).jpg",
        alt: "AIDM Screenshot 3",
      },
    ],
    links: [],
    date: "April 2024 (Project Date)",
  },
  {
    id: "multi-ai-agent-thesis",
    title: "Multi-AI Agent System for Manufacturing",
    description:
      "Design and Development of a Multi-AI Agent System for Intelligent Insights in Manufacturing. IEEE conference paper on applying agentic AI to optimize industrial processes.",
    thumbnailUrl:
      "https://kmqwwvhddlqvdmvnqved.supabase.co/storage/v1/object/public/skyjt-website-storage/Thesis/IEEE%20Conference%20V2.pdf",
    images: [],
    links: [
      {
        label: "View Paper",
        url: "https://kmqwwvhddlqvdmvnqved.supabase.co/storage/v1/object/public/skyjt-website-storage/Thesis/IEEE%20Conference%20V2.pdf",
        icon: "file-text",
      },
    ],
    pdfUrl:
      "https://kmqwwvhddlqvdmvnqved.supabase.co/storage/v1/object/public/skyjt-website-storage/Thesis/IEEE%20Conference%20V2.pdf",
    date: "May 2025 - March 2026",
  },
];
