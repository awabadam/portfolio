export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  behanceUrl: string;
  thumbnailUrl?: string;
  images?: string[];
  featured?: boolean;
}
