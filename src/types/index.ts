export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  thumbnail_url?: string;
  live_url?: string;
  iframe_blocked?: boolean; // Set true for sites that send X-Frame-Options: DENY
  github_url?: string;
  technologies: string[];
  featured?: boolean;
  
  // Case Study Fields
  role?: string;
  overview?: string;
  objectives?: string[];
  approach?: string[];
  designConcept?: string;
  finalThoughts?: string;
  behance_url?: string;
  images?: string[];
  results?: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  slug: string;
  cover_image?: string;
  featured_image_url?: string;
  published_at: string;
  published: boolean;
  category: string;
  author?: {
    name: string;
    avatar: string;
  };
  author_id?: string;
  tags: string[];
  meta_title?: string;
  meta_description?: string;
  reading_time?: number;
  view_count?: number;
  created_at: string;
  updated_at: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
  updated_at: string;
}
