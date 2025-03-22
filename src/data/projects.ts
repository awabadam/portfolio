import { Project } from "../types";

export const projects: Project[] = [
  {
    id: "omega-implants-webdesign",
    title: "Omega Implants Webdesign",
    category: "Web Design",
    description: "Website design for a dental implant company",
    behanceUrl: "https://www.behance.net/embed/project/168141271?ilo0=1",
    thumbnailUrl: "/img/projects/omega-implants.jpg",
    featured: true
  },
  {
    id: "january-ad-campaign",
    title: "January Ad Campaign",
    category: "Advertising",
    description: "Marketing campaign for January promotions",
    behanceUrl: "https://www.behance.net/embed/project/104684137?ilo0=1",
    thumbnailUrl: "/img/projects/january-campaign.jpg",
    featured: true
  },
  {
    id: "brand-identity-design",
    title: "Brand Identity Design",
    category: "Branding",
    description: "Complete brand identity package for a startup",
    behanceUrl: "https://www.behance.net/embed/project/125053859?ilo0=1",
    thumbnailUrl: "/img/projects/brand-identity.jpg",
    featured: true
  },
  {
    id: "mobile-app-ui",
    title: "Mobile App UI Design",
    category: "UI/UX",
    description: "User interface design for a mobile application",
    behanceUrl: "https://www.behance.net/embed/project/124152191?ilo0=1",
    thumbnailUrl: "/img/projects/mobile-app.jpg",
    featured: false
  },
  {
    id: "product-packaging",
    title: "Product Packaging Design",
    category: "Packaging",
    description: "Creative packaging design for consumer products",
    behanceUrl: "https://www.behance.net/embed/project/124161365?ilo0=1",
    thumbnailUrl: "/img/projects/packaging.jpg",
    featured: false
  },
  {
    id: "social-media-campaign",
    title: "Social Media Campaign",
    category: "Social Media",
    description: "Comprehensive social media marketing campaign",
    behanceUrl: "https://www.behance.net/embed/project/104690015?ilo0=1",
    thumbnailUrl: "/img/projects/social-campaign.jpg",
    featured: false
  }
];

export const getProjectById = (id: string): Project | undefined => {
  return projects.find(project => project.id === id);
};

export const getFeaturedProjects = (count?: number): Project[] => {
  const featuredProjects = projects.filter(project => project.featured);
  return count ? featuredProjects.slice(0, count) : featuredProjects;
};

export const getAllProjects = (): Project[] => {
  return projects;
};
