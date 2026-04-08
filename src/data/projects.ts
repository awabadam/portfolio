import { Project } from "@/types";

export const projects: Project[] = [
  {
    id: "awab-design",
    title: "Awab.Design",
    category: "Portfolio",
    description: "Personal design portfolio showcasing creative work and web design projects.",
    live_url: "https://awab.design",
    thumbnail_url: "/img/projects/omega-implants.png",
    featured: false,
    technologies: ["Next.js", "React", "Tailwind CSS"],
  },
  {
    id: "jouvence",
    title: "Jouvence",
    category: "Web Design",
    description: "Luxury aesthetics and beauty clinic website with multilingual support.",
    live_url: "https://www.jouvencetr.com/en",
    thumbnail_url: "/img/projects/january-campaign.png",
    featured: true,
    technologies: ["Web Design", "UI/UX"],
    results: [
      "Multilingual site serving 3 markets (EN, TR, AR)",
      "Luxury brand positioning with high-end visual design",
      "Mobile-first experience optimized for patient conversions",
    ],
  },
  {
    id: "esteexpert",
    title: "EsteExpert Clinic",
    category: "Web Design",
    description: "Medical aesthetics clinic website designed for trust and conversions.",
    live_url: "https://esteexpert.clinic",
    thumbnail_url: "/img/projects/brand-identity.jpg",
    featured: true,
    technologies: ["Web Design", "UI/UX"],
    results: [
      "Modern booking-focused patient experience",
      "SEO-optimized structure for medical aesthetics keywords",
      "Trust-building design with doctor profiles and certifications",
    ],
  },
  {
    id: "omar-marketing",
    title: "Omar Marketing",
    category: "Web Design",
    description: "ROI-driven marketing agency website with a bold dark theme, multilingual support, and animated scroll interactions.",
    live_url: "https://omar.marketing",
    featured: true,
    technologies: ["Next.js", "React", "Tailwind CSS"],
    results: [
      "ROI-driven design with built-in conversion tracking",
      "Bilingual site (EN/AR) with animated scroll interactions",
      "Performance-optimized dark theme with 95+ Lighthouse score",
    ],
  },
  {
    id: "awab-cv",
    title: "Awab CV",
    category: "Portfolio",
    description: "Print-inspired digital CV with elegant serif typography, ornamental details, and a refined paper-and-ink aesthetic.",
    live_url: "https://cv.awab.design/",
    featured: false,
    technologies: ["Next.js", "React", "Tailwind CSS"],
  },
  {
    id: "quran-app",
    title: "Quran App",
    category: "Web App",
    description: "Modern Quran reading platform with all 114 surahs, daily Athkar, search, and a clean dark-themed interface.",
    live_url: "https://quran.awab.design/",
    featured: false,
    technologies: ["Next.js", "React", "Tailwind CSS"],
  },
  {
    id: "saphiredent",
    title: "SaphireDent",
    category: "Web Design",
    description: "Modern dental clinic website with a clean, professional aesthetic.",
    live_url: "https://saphiredent.com",
    iframe_blocked: true,
    thumbnail_url: "/img/projects/january-campaign.png",
    featured: false,
    technologies: ["Web Design", "UI/UX"],
    results: [
      "40% increase in patient inquiries",
      "Professional online presence replacing outdated site",
      "Optimized for local Istanbul dental search terms",
    ],
  },
];

export async function getAllProjects(): Promise<Project[]> {
  return projects;
}

export async function getFeaturedProjects(limit = 3): Promise<Project[]> {
  return projects.filter(p => p.featured).slice(0, limit);
}

export async function getProjectById(id: string): Promise<Project | null> {
  return projects.find(p => p.id === id) || null;
}
