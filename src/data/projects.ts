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
  },
  {
    id: "omar-marketing",
    title: "Omar Marketing",
    category: "Web Design",
    description: "ROI-driven marketing agency website with a bold dark theme, multilingual support, and animated scroll interactions.",
    live_url: "https://omar.marketing",
    featured: true,
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
