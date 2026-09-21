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
 * Featured software engineering projects.
 */
export const SOFTWARE_PROJECTS: readonly ProjectData[] = [
  {
    id: "clean-food-good-router",
    title: "Clean Food Good Router",
    description:
      "Clean food good router is the intelligence layer for the multi-model AI era. Instead of sending every request to one expensive model, it analyzes each user need and routes it to the best-fit AI engine based on speciality for quality, speed, and cost. This gives better overall answers, lower inference spend, and stronger governance through controlled model access. It also reduces vendor lock-in, letting teams adapt as providers and pricing change. In short, it turns fragmented AI usage into a scalable, policy-driven, ROI-focused system that improves product performance while protecting margins.",
    thumbnailUrl:
      "https://storage.googleapis.com/lablab-static-eu/images/submissions/r5hyxsttrmazqpnct6q1ggrq/z2dwmd52qsy3hgt1ecynqwjt_imageLink_xqmq4tqceok4fbnt3aebezar.jpg&w=640&q=75",
    images: [
      {
        src: "https://kmqwwvhddlqvdmvnqved.supabase.co/storage/v1/object/public/skyjt-website-storage/AMD%20Hackathon%20Act%20II/Clean%20Food%20Good%20Router.png",
        alt: "Clean Food Good Router Preview",
      },
    ],
    links: [
      {
        label: "Source Code",
        url: "https://github.com/PS-Open-Fruit/model-router",
        icon: "github",
      },
      {
        label: "LabLab Submission",
        url: "https://lablab.ai/ai-hackathons/amd-developer-hackathon-act-ii/clean-food-good-silicon/clean-food-good-router",
        icon: "external-link",
      },
      {
        label: "Presentation",
        url: "https://storage.googleapis.com/lablab-static-eu/presentations/submissions/r5hyxsttrmazqpnct6q1ggrq/r5hyxsttrmazqpnct6q1ggrq-1783871575269_l344t26cc50blle63ooio08x.pdf",
        icon: "file-text",
      },
      {
        label: "Certificate",
        url: "https://kmqwwvhddlqvdmvnqved.supabase.co/storage/v1/object/public/skyjt-website-storage/AMD%20Hackathon%20Act%20II/AMD%20Developer%20Hackathon_%20ACT%20II-certificate.pdf",
        icon: "file-text",
      },
    ],
    pdfUrl:
      "https://storage.googleapis.com/lablab-static-eu/presentations/submissions/r5hyxsttrmazqpnct6q1ggrq/r5hyxsttrmazqpnct6q1ggrq-1783871575269_l344t26cc50blle63ooio08x.pdf",
    date: "July 2026 (Project Date)",
  },
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
