import { Project } from "@/types";
import { desc, eq } from "drizzle-orm";
import { projects } from "@/db/schema";

// The database client is imported lazily so builds without DATABASE_URL
// (where `@/db` throws on import) fall back to the static data below.
const getDb = async () => (await import("@/db")).db;

// Drizzle returns timestamps as Date objects; convert them to ISO strings.
function serializeRow<T>(row: Record<string, unknown>): T {
  return Object.fromEntries(
    Object.entries(row).map(([key, value]) => [key, value instanceof Date ? value.toISOString() : value])
  ) as T;
}

// Fallback data if the database is unavailable
const fallbackProjects: Project[] = [
  {
    id: "jouvence",
    title: "Jouvence",
    category: "Medical Clinic",
    description:
      "A luxury hair transplant and dental clinic in Istanbul serving international patients — built with Next.js in English, French and Arabic, redesigned in 2026.",
    live_url: "https://www.jouvencetr.com/en",
    featured: true,
    role: "Design & Development",
    technologies: [
      "Next.js",
      "React",
      "Tailwind CSS",
      "next-intl",
      "Multilingual (EN/FR/AR)",
      "WhatsApp Integration",
      "GSAP",
    ],
    overview:
      "Jouvence is a high-end aesthetics and beauty clinic competing for international patients in Istanbul's crowded medical tourism market. They needed a site that felt as premium as their in-person experience, loaded instantly on mobile, and spoke English, French and Arabic fluently — not just machine-translated paragraphs.",
    objectives: [
      "Attract patients from the Middle East, Europe, and CIS countries with a proper multilingual experience",
      "Build instant trust through clean visual design, doctor credentials, and before/after galleries",
      "Make booking a consultation as frictionless as possible — one tap on mobile",
      "Rank locally for aesthetic treatment keywords in all three target languages",
    ],
    approach: [
      "Built on Next.js 16 with next-intl for EN/FR/AR routing, including a full right-to-left Arabic layout with its own typeface, loaded only on Arabic pages",
      "2026 redesign: gold palette, smooth scrolling and scroll-driven motion, with the first screen rendered in plain CSS so animation never delays it",
      "WhatsApp-first contact flow: every consultation button and the floating chat prompt open a conversation with the clinic's team",
      "Masonry before-and-after gallery for Hollywood smiles, implants and hair transplants, with a full-screen lightbox",
      "Separate URLs, hreflang tags and MedicalBusiness structured data for each language",
    ],
    results: [
      "Multilingual site serving 3 markets (Middle East, Europe, Turkey) from a single codebase",
      "Real patient results front and center, with WebP images to keep pages light",
      "WhatsApp-only contact flow replaces slower email/form-based lead capture",
      "Proper hreflang and schema for each locale so Google ranks the right language to the right user",
    ],
  },
  {
    id: "esteexpert",
    title: "EsteExpert Clinic",
    category: "Medical Clinic",
    description:
      "A medical aesthetics clinic in Istanbul focused on trust, conversions, and international patient acquisition — built to convert first-time visitors into consultation bookings.",
    live_url: "https://esteexpert.clinic",
    featured: true,
    role: "Design & Development",
    technologies: [
      "Next.js",
      "React",
      "Tailwind CSS",
      "SEO Optimized",
      "Mobile-First",
      "Core Web Vitals Optimized",
    ],
    overview:
      "EsteExpert is a medical aesthetics clinic competing in Istanbul's highly saturated cosmetic surgery market. The existing site was a generic template that loaded slowly, looked dated, and buried the consultation CTA. They needed a site that signaled medical expertise in the first 3 seconds and made booking effortless.",
    objectives: [
      "Rebuild trust from the first scroll — credentials, testimonials, and real results front and center",
      "Make the consultation booking path the dominant action on every page",
      "Rank for high-intent treatment keywords like 'rhinoplasty Istanbul' and 'hair transplant cost Turkey'",
      "Be fast enough on mobile that Google's mobile-first indexing actually ranks it",
    ],
    approach: [
      "Hero designed around trust signals — doctor credentials, international accreditation badges, and a prominent consultation CTA that never leaves the viewport on mobile",
      "Treatment pages structured around patient intent: what it is, who it's for, what it costs, how long recovery takes, and a single-click CTA to book",
      "Mobile-first design from the ground up — 80%+ of Istanbul medical tourism traffic is on phones, so desktop was treated as the secondary experience",
      "Schema markup for MedicalBusiness, Physician, and FAQPage so Google can surface the clinic's information directly in rich results",
      "Built with Next.js for instant page transitions between treatments — visitors can explore 5-6 services without the page feeling slow",
    ],
    results: [
      "Sub-second mobile page loads on 4G — matches the best clinic websites in Turkey",
      "Consultation CTA visible and one-tap accessible on every page, every language",
      "Trust-first hero design converts visitors who've never heard of the clinic before",
      "Schema-rich pages eligible for Google's medical business rich results",
    ],
  },
  {
    id: "omar-marketing",
    title: "Omar Marketing",
    category: "Marketing Agency",
    description:
      "ROI-driven marketing agency website with a bold dark theme — built to attract high-ticket clients through a portfolio-driven narrative.",
    live_url: "https://omar.marketing",
    featured: true,
    technologies: ["Next.js", "React", "Tailwind CSS"],
  },
  // Brand work (see src/data/brand-studies.ts). These have no database rows,
  // so pages pick them with `pickWithFallback`.
  {
    id: "bespoke-clinic",
    title: "Bespoke Clinics",
    category: "Brand Identity",
    description:
      "A brand identity for a dental and aesthetics clinic in Istanbul: monogram, stationery, social media templates and a sales team kit.",
    role: "Brand Identity Design",
    technologies: ["Adobe Illustrator", "Adobe Photoshop", "Adobe InDesign"],
  },
  {
    id: "yasmina-beauty",
    title: "Yasmina Beauty",
    category: "Brand Identity",
    description:
      "A rebrand chosen from three logo directions, with a social media kit and before-and-after templates for a dental, hair and aesthetics clinic.",
    role: "Logo & Social Media Design",
    technologies: ["Adobe Illustrator", "Adobe InDesign"],
  },
];

// Picks `ids` in order from `rows`, using the static entry above for any id
// without a database row (a row, once added, wins).
export function pickWithFallback(rows: Project[], ids: readonly string[]): Project[] {
  return ids.flatMap((id) => rows.find((p) => p.id === id) ?? fallbackProjects.find((p) => p.id === id) ?? []);
}

export async function getAllProjects(): Promise<Project[]> {
  try {
    const db = await getDb();
    const data = await db
      .select()
      .from(projects)
      .orderBy(desc(projects.created_at));

    if (data.length === 0) return fallbackProjects;
    return data.map((row) => serializeRow<Project>(row));
  } catch {
    return fallbackProjects;
  }
}

export async function getFeaturedProjects(limit = 3): Promise<Project[]> {
  try {
    const db = await getDb();
    const data = await db
      .select()
      .from(projects)
      .where(eq(projects.featured, true))
      .orderBy(desc(projects.created_at))
      .limit(limit);

    if (data.length === 0) return fallbackProjects.filter((p) => p.featured).slice(0, limit);
    return data.map((row) => serializeRow<Project>(row));
  } catch {
    return fallbackProjects.filter((p) => p.featured).slice(0, limit);
  }
}

export async function getProjectById(id: string): Promise<Project | null> {
  try {
    const db = await getDb();
    const [data] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, id))
      .limit(1);

    if (!data) return fallbackProjects.find((p) => p.id === id) || null;
    return serializeRow<Project>(data);
  } catch {
    return fallbackProjects.find((p) => p.id === id) || null;
  }
}
