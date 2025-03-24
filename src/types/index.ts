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
