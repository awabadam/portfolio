import { Project } from "../types";
import { createAppServerClient } from "@/lib/supabase/server-app";

// Fallback projects data if Supabase is not available
export const fallbackProjects: Project[] = [
  {
    id: "omega-implants-webdesign",
    title: "Omega Implants Webdesign",
    category: "Web Design",
    description: "Website design for a dental implant company",
    behance_url: "https://www.behance.net/embed/project/168141271?ilo0=1",
    thumbnail_url: "/img/projects/omega-implants.png",
    featured: true,
    role: "Web Designer",
    overview: "This project involved creating a modern, professional website for Omega Implants, a leading dental implant provider. The website was designed to showcase their services, educate potential patients, and generate leads.",
    objectives: [
      "Create a professional and trustworthy online presence",
      "Educate visitors about dental implant procedures and benefits",
      "Highlight the company's expertise and technology",
      "Generate leads through contact forms and appointment scheduling",
      "Improve the overall user experience and accessibility"
    ],
    approach: [
      "Conducted thorough research on the dental implant industry",
      "Created wireframes and prototypes for client approval",
      "Developed a clean, medical-focused design with clear navigation",
      "Implemented responsive design for optimal viewing on all devices",
      "Integrated contact forms and appointment scheduling functionality"
    ],
    images: [
      "/img/projects/omega-implants.png",
      "/img/projects/january-campaign.png",
      "/img/projects/brand-identity.jpg"
    ],
    designConcept: "The design concept focused on creating a clean, professional aesthetic that inspires trust and confidence. Blue tones were used throughout to convey professionalism and reliability, while clear typography ensures readability for all users. The layout prioritizes important information and makes it easy for potential patients to learn about services and contact the clinic.",
    finalThoughts: "This project successfully delivered a modern, functional website that effectively communicates Omega Implants' services and expertise. The clean design and intuitive navigation have helped improve user engagement and lead generation since launch."
  },
  {
    id: "january-ad-campaign",
    title: "January Ad Campaign",
    category: "Advertising",
    description: "Marketing campaign for January promotions",
    behance_url: "https://www.behance.net/embed/project/104684137?ilo0=1",
    thumbnail_url: "/img/projects/january-campaign.png",
    featured: true
  },
  {
    id: "brand-identity-design",
    title: "Brand Identity Design",
    category: "Branding",
    description: "Complete brand identity package for a startup",
    behance_url: "https://www.behance.net/embed/project/125053859?ilo0=1",
    thumbnail_url: "/img/projects/brand-identity.jpg",
    featured: true
  },
  {
    id: "mobile-app-ui",
    title: "Mobile App UI Design",
    category: "UI/UX",
    description: "User interface design for a mobile application",
    behance_url: "https://www.behance.net/embed/project/124152191?ilo0=1",
    thumbnail_url: "/img/projects/mobile-app.png",
    featured: false
  },
  {
    id: "product-packaging",
    title: "Product Packaging Design",
    category: "Packaging",
    description: "Creative packaging design for consumer products",
    behance_url: "https://www.behance.net/embed/project/124161365?ilo0=1",
    thumbnail_url: "/img/projects/packaging.png",
    featured: false
  },
  {
    id: "social-media-campaign",
    title: "Social Media Campaign",
    category: "Social Media",
    description: "Comprehensive social media marketing campaign",
    behance_url: "https://www.behance.net/embed/project/104690015?ilo0=1",
    thumbnail_url: "/img/projects/social-campaign.png",
    featured: false
  }
];

export const getProjectById = async (id: string): Promise<Project | undefined> => {
  try {
    const supabase = createAppServerClient();
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching project:', error);
      // Fallback to local data if Supabase fails
      return fallbackProjects.find(project => project.id === id);
    }
    
    return data as Project;
  } catch (error) {
    console.error('Error in getProjectById:', error);
    // Fallback to local data if Supabase fails
    return fallbackProjects.find(project => project.id === id);
  }
};

export const getFeaturedProjects = async (count?: number): Promise<Project[]> => {
  try {
    const supabase = createAppServerClient();
    const query = supabase
      .from('projects')
      .select('*')
      .eq('featured', true)
      .order('created_at', { ascending: false });
    
    if (count) {
      query.limit(count);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching featured projects:', error);
      // Fallback to local data if Supabase fails
      const featuredProjects = fallbackProjects.filter(project => project.featured);
      return count ? featuredProjects.slice(0, count) : featuredProjects;
    }
    
    return data as Project[];
  } catch (error) {
    console.error('Error in getFeaturedProjects:', error);
    // Fallback to local data if Supabase fails
    const featuredProjects = fallbackProjects.filter(project => project.featured);
    return count ? featuredProjects.slice(0, count) : featuredProjects;
  }
};

export const getAllProjects = async (): Promise<Project[]> => {
  try {
    const supabase = createAppServerClient();
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching all projects:', error);
      // Fallback to local data if Supabase fails
      return fallbackProjects;
    }
    
    return data as Project[];
  } catch (error) {
    console.error('Error in getAllProjects:', error);
    // Fallback to local data if Supabase fails
    return fallbackProjects;
  }
};
