export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  behance_url: string;
  thumbnail_url?: string;
  images?: string[];
  featured?: boolean;
  
  // Case study fields
  role?: string;               // e.g., "Graphic Designer"
  overview?: string;           // Detailed project overview
  objectives?: string[];       // Bullet points of project goals
  approach?: string[];         // Bullet points of approach taken
  designConcept?: string;      // Design concept description
  finalThoughts?: string;      // Concluding remarks
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image_url?: string;
  category: string;
  tags: string[];
  author_id?: string;
  published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
  meta_title?: string;
  meta_description?: string;
  reading_time: number;
  view_count: number;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
  updated_at: string;
}
