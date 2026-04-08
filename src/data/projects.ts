import { Project } from "@/types";
import { createStaticSupabaseClient } from "@/lib/supabase";

// Fallback data if Supabase is unavailable
const fallbackProjects: Project[] = [
  { id: "jouvence", title: "Jouvence", category: "Web Design", description: "Luxury aesthetics and beauty clinic website with multilingual support.", live_url: "https://www.jouvencetr.com/en", featured: true, technologies: ["Web Design", "UI/UX"], results: ["Multilingual site serving 3 markets"] },
  { id: "esteexpert", title: "EsteExpert Clinic", category: "Web Design", description: "Medical aesthetics clinic website designed for trust and conversions.", live_url: "https://esteexpert.clinic", featured: true, technologies: ["Web Design", "UI/UX"] },
  { id: "omar-marketing", title: "Omar Marketing", category: "Web Design", description: "ROI-driven marketing agency website with a bold dark theme.", live_url: "https://omar.marketing", featured: true, technologies: ["Next.js", "React", "Tailwind CSS"] },
];

export async function getAllProjects(): Promise<Project[]> {
  try {
    const supabase = createStaticSupabaseClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) return fallbackProjects;
    return data as Project[];
  } catch {
    return fallbackProjects;
  }
}

export async function getFeaturedProjects(limit = 3): Promise<Project[]> {
  try {
    const supabase = createStaticSupabaseClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("featured", true)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error || !data || data.length === 0) return fallbackProjects.filter((p) => p.featured).slice(0, limit);
    return data as Project[];
  } catch {
    return fallbackProjects.filter((p) => p.featured).slice(0, limit);
  }
}

export async function getProjectById(id: string): Promise<Project | null> {
  try {
    const supabase = createStaticSupabaseClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return fallbackProjects.find((p) => p.id === id) || null;
    return data as Project;
  } catch {
    return fallbackProjects.find((p) => p.id === id) || null;
  }
}
