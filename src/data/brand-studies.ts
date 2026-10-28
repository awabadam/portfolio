// Image-led case studies for brand identity work, keyed by project id.
//
// Like CASE_STUDIES, this lives in code rather than the projects table. Brand
// projects may have no database row at all: pages pick them with
// `pickWithFallback` so the static entry in src/data/projects.ts is used until
// a row exists. Rules for editing:
//   - State only facts from the project files (handover, review deck, exports).
//   - `boards` are the Behance boards as 2000px-wide WebP in
//     public/img/projects/<id>/, designed to stack edge to edge. Keep `width`
//     and `height` equal to the real pixel size of each file.
//   - Set `behance` once the project is published there; the pill only shows
//     when it is set.
import type { MarketKey } from "@/data/case-studies";

// Brand work in display order, shown as its own group on /projects.
export const BRAND_WORK = ["bespoke-clinic", "yasmina-beauty"] as const;

// Labels live under `projects.brandScope.*` in src/messages.
export type BrandScopeKey = "stylescapes" | "logo" | "stationery" | "socialTemplates" | "salesKit";

export interface BrandBoard {
  src: string;
  width: number;
  height: number;
  alt: string;
}

export interface BrandStudy {
  client: string;
  market: MarketKey;
  year: string;
  scope: BrandScopeKey[];
  headline: string;
  intro: string;
  behance?: string;
  // First board is the cover and loads with priority.
  boards: BrandBoard[];
}

const board = (id: string, name: string, height: number, alt: string): BrandBoard => ({
  src: `/img/projects/${id}/${name}.webp`,
  width: 2000,
  height,
  alt,
});

export const BRAND_STUDIES: Record<string, BrandStudy> = {
  "bespoke-clinic": {
    client: "Bespoke Clinics",
    market: "medicalTourism",
    year: "2022",
    scope: ["stylescapes", "logo", "stationery", "socialTemplates", "salesKit"],
    headline:
      "A warm clinic brand that looks the same on the sign, the feed and every WhatsApp chat with a patient.",
    intro:
      "Bespoke Clinics treats international patients in Istanbul for dental, hair, face, body and bariatric procedures. They wanted a brand that felt personal and premium rather than clinical. I agreed the mood with stylescapes first, then designed the monogram, the stationery, social media templates and a WhatsApp kit for each sales consultant.",
    boards: [
      board("bespoke-clinic", "01-cover", 1500, "Bespoke Clinics logo in coral and peach on navy, with the words brand identity, dental and aesthetics, Istanbul, 2022"),
      board("bespoke-clinic", "06-logo", 1429, "Primary logo: a coral B and a peach C share one stroke beside the Bespoke Clinics wordmark"),
      board("bespoke-clinic", "07-monogram", 2000, "The BC monogram on peach, navy and coral, and inside a round Beauty Reimagined badge"),
      board("bespoke-clinic", "09-colours", 1286, "Colour palette: navy #172B40, peach #FCBD8D, coral #D96058 and a peach, coral and navy gradient"),
      board("bespoke-clinic", "11-signage", 1200, "Round wall sign with the monogram and the Beauty Reimagined badge"),
      board("bespoke-clinic", "16-business-cards-mockup", 1200, "Business cards in coral, peach and navy"),
      board("bespoke-clinic", "18-letterhead-mockup-1", 1200, "Letterhead with the monogram as a large outline watermark"),
      board("bespoke-clinic", "20-shopping-bag", 1334, "White carry bag with the Bespoke Clinics logo and a gradient band"),
      board("bespoke-clinic", "24-before-after-mockup", 1200, "Before-and-after post template for a smile result, shown on a phone"),
      board("bespoke-clinic", "26-sales-kit", 1200, "WhatsApp kit for a sales consultant: profile picture, contact card and story"),
    ],
  },
  "yasmina-beauty": {
    client: "Yasmina Beauty",
    market: "aesthetics",
    year: "2023",
    scope: ["logo", "socialTemplates"],
    headline:
      "A jasmine mark chosen from three directions, and before-and-after templates the clinic fills with each new patient result, no designer needed.",
    intro:
      "Yasmina Beauty treats men and women, Arab and European patients, for dental, hair, face, body and bariatric procedures. For the rebrand I presented three logo directions: Calmness, Youth and Class. The clinic chose Class, a Y whose arms grow into a jasmine sprig (yasmina is Arabic for jasmine), and after two colour rounds, a deep red. I then built the social media kit and the before-and-after templates around it.",
    boards: [
      board("yasmina-beauty", "01-cover", 1500, "The Yasmina Beauty logo in white on deep red: a Y with two leaves above YASMINA BEAUTY and Beauty Clinic in script"),
      board("yasmina-beauty", "03-directions", 1800, "Three logo directions side by side: Calmness, a teal lotus with an orange star; Youth, a teal and orange jasmine flower with a script wordmark; and Class, an upright Y with two leaves, marked as chosen. Mockups sit under each one"),
      board("yasmina-beauty", "04-colour", 3344, "Colour rounds for the Class logo: first on purple roses, light blue petals and red roses, then a gold-foil card on red set against the same card on purple"),
      board("yasmina-beauty", "05-logo", 2713, "The final mark in red: a Y whose arms open into a jasmine sprig above YASMINA BEAUTY in spaced capitals, a round badge version, and the logo in white over dark red roses"),
      board("yasmina-beauty", "06-in-use", 3946, "Presentation mockups in the final red: a T-shirt, box and bag set, two letterheads, and a red and a white carry bag"),
      board("yasmina-beauty", "07-social-kit", 3321, "Social media kit: a red cover image reading Beauty, Elegance & Class, round and square profile images, story highlight icons and treatment icons for the website"),
      board("yasmina-beauty", "08-templates", 2457, "Before-and-after templates with empty frames labelled before and after: two posts, one red and one white, and three stories on phones"),
      board("yasmina-beauty", "09-colours", 743, "Colour palette: red #B52525, white and light grey #E7E7E7"),
    ],
  },
};

export function getBrandStudy(id: string): BrandStudy | null {
  return BRAND_STUDIES[id] ?? null;
}

export function isBrandWork(id: string): boolean {
  return (BRAND_WORK as readonly string[]).includes(id);
}
