import { Project } from "@/types";
import { createSimpleBrowserClient as createBrowserClient } from "@/lib/supabase";

// Fallback projects data if Supabase is not available
export const fallbackProjects: Project[] = [
  {
    id: "omega-implants-webdesign",
    title: "Omega Implants Webdesign",
    category: "Web Design",
    description: "Modern corporate website for a dental implants manufacturer in Istanbul.",
    behance_url: "https://www.behance.net/gallery/215767839/Omega-Implants-Webdesign",
    thumbnail_url: "/img/projects/omega-implants.png",
    featured: true,
    technologies: ["React", "Next.js", "Tailwind CSS"],
    role: "Lead Designer & Developer",
    overview: "Omega Implants needed a modern, responsive website to showcase their high-quality dental products. The goal was to create a professional online presence that builds trust with dental professionals and clinics.",
    objectives: [
      "Modernize the brand's digital presence",
      "Improve product catalog accessibility",
      "Create a lead generation funnel",
      "Optimize for mobile devices"
    ],
    approach: [
      "Conducted competitor analysis in the dental industry",
      "Developed a clean, medical-grade aesthetic",
      "Built a responsive layout for all devices",
      "Implemented a fast-loading static site architecture"
    ],
    images: [
      "/img/projects/omega-implants.png"
    ],
    designConcept: "The design focuses on sterility, precision, and trust - core values in the dental implant industry. We used a clean color palette of white and medical blue, with high-quality product photography and ample whitespace.",
    finalThoughts: "The new website successfully positions Omega Implants as a modern, reliable partner for dental professionals, with improved user engagement and inquiry rates."
  },
  {
    id: "january-campaign",
    title: "January Campaign",
    category: "Social Media Design",
    description: "Creative social media campaign designs for brand awareness.",
    behance_url: "https://www.behance.net/gallery/216262447/January-Campaign-Designs",
    thumbnail_url: "/img/projects/january-campaign.png",
    featured: true,
    technologies: ["Photoshop", "Illustrator", "After Effects"],
    role: "Graphic Designer",
    overview: "A series of engaging social media visuals designed to boost brand engagement during the January promotional period. The campaign focused on fresh starts and new beginnings.",
    objectives: [
      "Increase social media engagement",
      "Promote seasonal offers",
      "Strengthen brand visual identity",
      "Drive traffic to the website"
    ],
    approach: [
      "Developed a cohesive visual theme",
      "Created versatile templates for different platforms",
      "Incorporated bold typography and vibrant colors",
      "Designed for maximum scroll-stopping power"
    ],
    images: [
      "/img/projects/january-campaign.png"
    ],
    designConcept: "We utilized dynamic compositions and high-contrast visuals to grab attention in crowded social feeds. The designs maintain brand consistency while introducing a fresh seasonal look.",
    finalThoughts: "The campaign resulted in a 40% increase in social engagement and helped establish a strong start to the marketing year."
  },
  {
    id: "brand-identity",
    title: "Brand Identity Design",
    category: "Branding",
    description: "Comprehensive brand identity package for a local startup.",
    behance_url: "https://www.behance.net/awabelkhalil",
    thumbnail_url: "/img/projects/brand-identity.jpg",
    featured: true,
    technologies: ["Illustrator", "Indesign", "Figma"],
    role: "Brand Strategist & Designer",
    overview: "Developing a unique and memorable brand identity for a new market entrant. The project included logo design, color palette selection, typography, and brand guidelines.",
    objectives: [
      "Create a distinct visual identity",
      "Ensure versatility across applications",
      "Reflect the company's core values",
      "Build a foundation for future marketing"
    ],
    approach: [
      "Researched market positioning and target audience",
      "Iterated through multiple logo concepts",
      "Selected a modern and scalable color scheme",
      "Documented guidelines for consistent usage"
    ],
    images: [
      "/img/projects/brand-identity.jpg"
    ],
    designConcept: "The identity is built around simplicity and boldness, ensuring the brand is easily recognizable even at small sizes. The visual language communicates innovation and reliability.",
    finalThoughts: "The new brand identity provided the client with a professional toolkit to launch their business with confidence and consistency."
  }
];

export async function getAllProjects(): Promise<Project[]> {
  try {
    const supabase = createBrowserClient();
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching projects from Supabase:', error);
      return fallbackProjects;
    }

    return projects && projects.length > 0 ? projects.map(p => ({
      ...p,
      technologies: p.technologies || []
    })) : fallbackProjects;
  } catch (error) {
    console.error('Error in getAllProjects:', error);
    return fallbackProjects;
  }
}

export async function getFeaturedProjects(limit = 3): Promise<Project[]> {
  try {
    const supabase = createBrowserClient();
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .eq('featured', true)
      .limit(limit)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching featured projects from Supabase:', error);
      return fallbackProjects.filter(p => p.featured).slice(0, limit);
    }

    return projects && projects.length > 0 ? projects.map(p => ({
      ...p,
      technologies: p.technologies || []
    })) : fallbackProjects.filter(p => p.featured).slice(0, limit);
  } catch (error) {
    console.error('Error in getFeaturedProjects:', error);
    return fallbackProjects.filter(p => p.featured).slice(0, limit);
  }
}

export async function getProjectById(id: string): Promise<Project | null> {
  try {
    // First try to find in fallback data to avoid network request if possible for static pages
    const fallbackProject = fallbackProjects.find(p => p.id === id);
    if (fallbackProject) return fallbackProject;

    const supabase = createBrowserClient();
    const { data: project, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching project ${id} from Supabase:`, error);
      return null;
    }

    return project ? {
      ...project,
      technologies: project.technologies || []
    } : null;
  } catch (error) {
    console.error(`Error in getProjectById for ${id}:`, error);
    return fallbackProjects.find(p => p.id === id) || null;
  }
}
