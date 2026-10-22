// Result-first case studies for client work, keyed by project id.
//
// Lives in code rather than the projects table so the case-study shape can
// evolve without a production migration. Rules for editing:
//   - Only add `metrics` and `quote` once the client has confirmed them.
//   - `scores` are Lighthouse numbers we measured ourselves on the public site,
//     so they don't need client approval. Re-measure before updating them.
//   - `constraints`, `deliverables`, `advisedAgainst` and `timeline` state only
//     facts from the challenge, decisions and services or confirmed by Awab.
//   - Headlines lead with the outcome for the clinic, not the tech.

// Client work in display order. Anything not listed here is shown as Lab.
export const CLIENT_WORK = ["saphiredent", "jouvence", "esteexpert", "omar-marketing"] as const;

// Projects shown under "Selected work" on the homepage.
export const HOME_FEATURED = ["saphiredent", "jouvence", "esteexpert", "omar-marketing"] as const;

export type MarketKey = "dental" | "aesthetics" | "medicalTourism" | "marketing";
export type ServiceKey =
  | "design"
  | "development"
  | "multilingual"
  | "seo"
  | "cms"
  | "aiChat"
  | "crm"
  | "ongoing";

// Caption keys live under `projects.gallery.*` in src/messages.
export type GalleryCaptionKey = "home" | "treatment" | "rtl" | "services" | "results" | "work";

export interface GalleryImage {
  // Clean 1440x900 viewport shots in public/img/projects/<id>/ (no cookie banners).
  src: string;
  captionKey: GalleryCaptionKey;
}

export interface CaseStudy {
  headline: string;
  market: MarketKey;
  // ISO 639-1 codes; names are rendered per visitor locale.
  languages: string[];
  services: ServiceKey[];
  year: string;
  challenge: string;
  // 2–3 genuinely hard things about the project, shown next to the challenge.
  constraints?: string[];
  // `image` is a 2000x1333 laptop photo mockup (laptop-decision-N.webp), shown full bleed.
  decisions: { title: string; body: string; image?: string }[];
  // Something we recommended NOT doing.
  advisedAgainst?: { title: string; body: string };
  // Concrete list of what was shipped.
  deliverables?: string[];
  timeline?: { phase: string; duration: string }[];
  // First image is the large hero shot; the rest render smaller with captions.
  gallery?: GalleryImage[];
  // Photo mockups of the home page, rendered from mockups-design.com scenes.
  // `laptop` (2000x1333) replaces the first gallery shot, `phone` (2000x2500)
  // shows mobile[0], so the phone row then starts at mobile[1].
  mockups?: { laptop: string; phone: string };
  // 780x1688 phone screenshots, 3 expected.
  mobile?: string[];
  metrics?: { value: string; label: string }[];
  // Self-measured Lighthouse mobile scores; `measured` is an ISO date.
  scores?: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
    measured: string;
  };
  quote?: { text: string; author: string; role: string };
}

const mockupsFor = (id: string) => ({
  laptop: `/img/projects/${id}/laptop-home.webp`,
  phone: `/img/projects/${id}/phone-1.webp`,
});

const galleryFor = (id: string, second: GalleryCaptionKey = "treatment"): GalleryImage[] => [
  { src: `/img/projects/${id}/home.webp`, captionKey: "home" },
  { src: `/img/projects/${id}/treatment.webp`, captionKey: second },
  { src: `/img/projects/${id}/rtl.webp`, captionKey: "rtl" },
];

export const CASE_STUDIES: Record<string, CaseStudy> = {
  saphiredent: {
    headline:
      "A nine-language dental site that captures every inquiry and feeds it to the clinic's CRM and Google Ads.",
    market: "dental",
    languages: ["en", "tr", "ar", "fr", "es", "it", "ru", "fa", "pl"],
    services: ["design", "development", "multilingual", "cms", "aiChat", "crm", "ongoing"],
    year: "2025 –",
    gallery: galleryFor("saphiredent"),
    challenge:
      "Saphiredent treats patients who travel to Istanbul from Europe, the Gulf and beyond. The clinic needed a site that spoke to each of those markets in its own language, and a way to follow every inquiry from first message to booked treatment.",
    timeline: [
      { phase: "Initial build", duration: "6 weeks · mid 2025" },
      { phase: "Retainer", duration: "Ongoing since launch" },
    ],
    deliverables: [
      "Nine-language site with right-to-left Arabic and Persian",
      "Lead admin panel with a country map",
      "Odoo CRM and Google Sheets sync",
      "Google Ads offline-conversion export",
      "AI dental chat assistant",
      "Role-based CMS for content, blog and media",
      "Ongoing support after launch",
    ],
    mockups: mockupsFor("saphiredent"),
    mobile: ["/img/projects/saphiredent/mobile-1.webp", "/img/projects/saphiredent/mobile-2.webp", "/img/projects/saphiredent/mobile-3.webp"],
    decisions: [
      {
        title: "Nine languages, one codebase",
        body: "English, Turkish, Arabic, French, Spanish, Italian, Russian, Persian and Polish, with right-to-left layouts for Arabic and Persian. Each patient lands on a site that reads as if it was written for them.",
        image: "/img/projects/saphiredent/laptop-decision-1.webp",
      },
      {
        title: "Every inquiry is tracked",
        body: "Leads from forms and the chat assistant land in an admin panel, are mapped by country, and are pushed to the clinic's Odoo CRM and Google Sheets.",
      },
      {
        title: "Ads that learn from real patients",
        body: "Leads are exported in Google Ads offline-conversion format, so campaigns can optimise for people who actually book, not just clicks.",
      },
      {
        title: "An assistant that answers at 3am",
        body: "An AI dental assistant answers treatment questions in the patient's language at any hour and hands warm leads to the team.",
        image: "/img/projects/saphiredent/laptop-decision-4.webp",
      },
      {
        title: "The clinic runs its own site",
        body: "A role-based admin for content, blog, services and media, so the team can update the site without waiting on a developer.",
      },
    ],
  },
  jouvence: {
    headline:
      "A luxury hair and dental clinic site in English, French and Arabic, where every button opens WhatsApp.",
    market: "aesthetics",
    languages: ["en", "fr", "ar"],
    services: ["design", "development", "multilingual", "seo", "ongoing"],
    year: "2025 – 2026",
    gallery: [
      { src: "/img/projects/jouvence/home.webp", captionKey: "home" },
      { src: "/img/projects/jouvence/results.webp", captionKey: "results" },
      { src: "/img/projects/jouvence/rtl.webp", captionKey: "rtl" },
    ],
    challenge:
      "Jouvence brings patients from abroad to Istanbul for hair transplants and dental work, and sells the whole trip as a VIP experience: private transfers, partner hotels and a translator at every step. For the 2026 redesign the clinic wanted a site that felt as premium as that trip, proved its work with real before-and-after photos, and still opened fast on a phone in English, French or Arabic.",
    advisedAgainst: {
      title: "A contact form",
      body: "International patients already plan their trip on WhatsApp, so there is no form to fill in. Every consultation button and the floating chat prompt open a conversation with the clinic's team instead.",
    },
    scores: { performance: 75, accessibility: 96, bestPractices: 100, seo: 100, measured: "2026-10-22" },
    timeline: [{ phase: "Redesign", duration: "1 week · May 2026" }],
    deliverables: [
      "2026 redesign in English, French and Arabic",
      "Before-and-after gallery with lightbox",
      "WhatsApp on every consultation button",
      "Native right-to-left Arabic layout and typeface",
      "Per-language SEO and structured data",
      "Ongoing support after launch",
    ],
    mockups: mockupsFor("jouvence"),
    mobile: ["/img/projects/jouvence/mobile-1.webp", "/img/projects/jouvence/mobile-2.webp", "/img/projects/jouvence/mobile-3.webp"],
    decisions: [
      {
        title: "Real results, shown properly",
        body: "New Hollywood smile, implant and hair transplant before-and-afters sit in a masonry gallery that keeps each photo's proportions, with a full-screen lightbox for a closer look.",
        image: "/img/projects/jouvence/laptop-decision-1.webp",
      },
      {
        title: "Every button opens WhatsApp",
        body: "International patients already plan their trip on WhatsApp, so every consultation button and the floating chat prompt open a conversation with the clinic's team. There is no form to fill in.",
        image: "/img/projects/jouvence/laptop-decision-2.webp",
      },
      {
        title: "Premium, but still fast",
        body: "A gold palette, smooth scrolling and scroll-driven motion, kept off the critical path: the first screen loads with plain CSS, images are WebP, and the intro animation steps aside as soon as the hero image is ready.",
        image: "/img/projects/jouvence/laptop-decision-3.webp",
      },
      {
        title: "Arabic that feels native",
        body: "A full right-to-left layout with its own Arabic typeface, loaded only on Arabic pages so English and French visitors don't download it.",
        image: "/img/projects/jouvence/laptop-decision-4.webp",
      },
      {
        title: "Found in every language",
        body: "Each language has its own URL, hreflang tags and medical-business structured data listing the treatments, so Google shows each patient the right version.",
      },
    ],
  },
  esteexpert: {
    headline:
      "A trust-first site for a JCI-accredited clinic, where the consultation button never leaves the screen.",
    market: "medicalTourism",
    languages: ["en", "ar", "tr", "fr"],
    services: ["design", "development", "multilingual", "seo"],
    year: "2026",
    gallery: galleryFor("esteexpert"),
    challenge:
      "EsteExpert offers medical check-ups and aesthetic treatments to patients from abroad, in one of the most saturated markets in Istanbul. The old template site was slow, looked dated and buried the consultation button. Visitors who had never heard of the clinic needed to see why they could trust it within seconds.",
    scores: { performance: 66, accessibility: 96, bestPractices: 100, seo: 100, measured: "2026-10-22" },
    timeline: [{ phase: "Design and build", duration: "2 weeks · early 2026" }],
    deliverables: [
      "Site in English, Arabic, Turkish and French",
      "Trust section with accreditation and certificates",
      "Sticky mobile consultation button",
      "Treatment page template with one button to book",
      "Mobile-first design",
      "MedicalBusiness, Physician and FAQ schema",
    ],
    mockups: mockupsFor("esteexpert"),
    mobile: ["/img/projects/esteexpert/mobile-1.webp", "/img/projects/esteexpert/mobile-2.webp", "/img/projects/esteexpert/mobile-3.webp"],
    decisions: [
      {
        title: "Trust in the first screen",
        body: "JCI accreditation, years of experience and certificates come straight after the hero, and the consultation button stays in view on mobile.",
        image: "/img/projects/esteexpert/laptop-decision-1.webp",
      },
      {
        title: "Treatment pages that answer the patient's questions",
        body: "Each page covers what the treatment is, the procedures and the technology behind it, then gives one clear button to book.",
      },
      {
        title: "Designed for the phone first",
        body: "Most medical-tourism visitors browse on a phone, so the mobile layout was designed first and desktop followed.",
      },
      {
        title: "Readable by Google",
        body: "MedicalBusiness, Physician and FAQPage schema so search results can show the clinic's details directly.",
      },
    ],
  },
  "omar-marketing": {
    headline:
      "A confident trilingual site for a performance marketing agency that sells measurable growth.",
    market: "marketing",
    languages: ["en", "fr", "ar"],
    services: ["design", "development", "multilingual"],
    year: "2026",
    gallery: galleryFor("omar-marketing", "work"),
    challenge:
      "Omar Marketing sells results, so its own site had to look as sharp as the campaigns it runs and make it obvious that the agency thinks in numbers.",
    timeline: [{ phase: "Design and build", duration: "1 week · April 2026" }],
    deliverables: [
      "Dark, high-contrast identity with scroll animation",
      "Site in English, French and Arabic, right-to-left included",
      "Built-in conversion tracking",
    ],
    mockups: mockupsFor("omar-marketing"),
    mobile: ["/img/projects/omar-marketing/mobile-1.webp", "/img/projects/omar-marketing/mobile-2.webp", "/img/projects/omar-marketing/mobile-3.webp"],
    decisions: [
      {
        title: "A bold dark identity",
        body: "A dark, high-contrast design with scroll-driven animation that sets the agency apart from template-built competitors.",
        image: "/img/projects/omar-marketing/laptop-decision-1.webp",
      },
      {
        title: "Three languages, right-to-left included",
        body: "English, French and Arabic from one codebase, with a full right-to-left layout for Arabic.",
        image: "/img/projects/omar-marketing/laptop-decision-2.webp",
      },
      {
        title: "Measured from day one",
        body: "Conversion tracking is built in, so the agency can show its own site's numbers the same way it reports to clients.",
      },
    ],
  },
};

export function getCaseStudy(id: string): CaseStudy | null {
  return CASE_STUDIES[id] ?? null;
}

export function isClientWork(id: string): boolean {
  return (CLIENT_WORK as readonly string[]).includes(id);
}

// Orders `items` by `ids`, dropping anything not listed.
export function pickInOrder<T extends { id: string }>(items: T[], ids: readonly string[]): T[] {
  return ids.flatMap((id) => items.find((item) => item.id === id) ?? []);
}
