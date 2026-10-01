import { blogPosts } from "@/db/schema";

export interface TopicTemplate {
  titleTemplate: string;
  keywords: string[];
  category: string;
}

const topicTemplates: TopicTemplate[] = [
  { titleTemplate: "How Much Does a Website Cost in {year}? Complete Guide", keywords: ["website cost", "web design pricing"], category: "Web Design" },
  { titleTemplate: "5 Signs Your Business Needs a New Website in {year}", keywords: ["business website", "website redesign"], category: "Web Design" },
  { titleTemplate: "Web Design vs Web Development: What's the Difference?", keywords: ["web design", "web development", "difference"], category: "Web Design" },
  { titleTemplate: "Why Every Business Needs a Mobile-Friendly Website", keywords: ["mobile website", "responsive design"], category: "Web Design" },
  { titleTemplate: "AI Chatbots for Small Businesses: Is It Worth It?", keywords: ["ai chatbot", "small business", "automation"], category: "Tools & Resources" },
  { titleTemplate: "How to Choose a Freelance Web Designer in {year}", keywords: ["freelance web designer", "hire designer"], category: "Freelancing" },
  { titleTemplate: "SEO Basics Every Business Owner Should Know", keywords: ["seo basics", "seo guide", "beginner"], category: "SEO" },
  { titleTemplate: "Landing Page vs Full Website: Which Do You Need?", keywords: ["landing page", "website", "comparison"], category: "Web Design" },
  { titleTemplate: "The Importance of SSL Certificates for Your Website", keywords: ["ssl", "website security", "https"], category: "Web Design" },
  { titleTemplate: "How Website Speed Affects Your Business Revenue", keywords: ["page speed", "website performance", "core web vitals"], category: "SEO" },
  { titleTemplate: "What is UI/UX Design and Why Does It Matter?", keywords: ["ui design", "ux design", "user experience"], category: "UI/UX Design" },
  { titleTemplate: "The Complete Guide to Website Maintenance in {year}", keywords: ["website maintenance", "website updates", "security"], category: "Web Design" },
  { titleTemplate: "How to Write Website Content That Converts", keywords: ["website content", "copywriting", "conversions"], category: "Digital Marketing" },
  { titleTemplate: "Why Your Website Needs a Blog: SEO Benefits Explained", keywords: ["business blog", "seo benefits", "content marketing"], category: "SEO" },
  { titleTemplate: "Brand Identity Design: More Than Just a Logo", keywords: ["brand identity", "branding", "logo design"], category: "Graphic Design" },
  { titleTemplate: "Multi-Language Websites: A Guide for Global Businesses", keywords: ["multilingual website", "internationalization", "i18n"], category: "Web Design" },
  { titleTemplate: "Domain Name Tips: How to Choose the Perfect Domain", keywords: ["domain name", "domain registration", "website domain"], category: "Web Design" },
  { titleTemplate: "Web Hosting Explained: What You Need to Know", keywords: ["web hosting", "hosting types", "website hosting"], category: "Tools & Resources" },
  { titleTemplate: "E-Commerce vs Service Website: Key Design Differences", keywords: ["ecommerce design", "service website", "web design"], category: "Web Design" },
  { titleTemplate: "How to Optimize Images for Faster Websites", keywords: ["image optimization", "website speed", "webp"], category: "SEO" },
  { titleTemplate: "The Role of Color in Web Design: A Practical Guide", keywords: ["color theory", "web design colors", "design psychology"], category: "UI/UX Design" },
  { titleTemplate: "What is CMS and Do You Need One for Your Website?", keywords: ["cms", "content management", "wordpress alternatives"], category: "Tools & Resources" },
  { titleTemplate: "Google Business Profile: Why It Matters for Local SEO", keywords: ["google business profile", "local seo", "google maps"], category: "SEO" },
  { titleTemplate: "How to Get More Clients as a Freelance Designer", keywords: ["freelance clients", "freelance marketing", "portfolio"], category: "Freelancing" },
  { titleTemplate: "Website Accessibility: Why It's Important for Your Business", keywords: ["web accessibility", "a11y", "inclusive design"], category: "UI/UX Design" },
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function pickTopic(): Promise<{
  title: string;
  slug: string;
  keywords: string[];
  category: string;
} | null> {
  const { db } = await import("@/db");

  // Get existing slugs to avoid duplicates
  const existing = await db.select({ slug: blogPosts.slug }).from(blogPosts);

  const usedSlugs = new Set(existing.map((p) => p.slug));

  const year = new Date().getFullYear().toString();

  // Filter to unused topics
  const available = topicTemplates
    .map((t) => {
      const title = t.titleTemplate.replace("{year}", year);
      const slug = slugify(title);
      return { ...t, title, slug };
    })
    .filter((t) => !usedSlugs.has(t.slug));

  if (available.length === 0) return null;

  // Pick a random one
  return available[Math.floor(Math.random() * available.length)];
}
