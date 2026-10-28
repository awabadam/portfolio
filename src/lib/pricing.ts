// ============================================================================
// 💰 PRICING — SINGLE SOURCE OF TRUTH
// ============================================================================
//
// This file is the ONLY place prices should be edited. Every consumer below
// reads from projectTiers / carePlans / addOns / brandKit and formats prices with
// formatPrice() (always USD).
//
// Consumers (anywhere that shows or references prices):
//   • src/components/pricing/PackageCards.tsx      — package cards (used by /pricing + /services)
//   • src/components/pricing/CarePlanCards.tsx     — monthly plan cards (used by /pricing + /services/website-maintenance)
//   • src/components/pricing/BrandKitCard.tsx      — Clinic Brand Kit + bundle card (used by /pricing + /services)
//   • src/app/[locale]/pricing/page.tsx           — SEO pricing landing page
//   • src/app/[locale]/pricing/layout.tsx         — OfferCatalog JSON-LD
//   • src/app/[locale]/services/page.tsx          — services page (renders PackageCards + BrandKitCard)
//   • src/app/[locale]/services/website-maintenance/page.tsx — monthly plans + JSON-LD
//   • src/app/[locale]/services/webdesign-istanbul/page.tsx  — hero + FAQ copy
//   • src/app/[locale]/services/clinic-branding/page.tsx     — Brand Kit hero, bundle, FAQ + JSON-LD
//   • src/app/[locale]/contact/page.tsx           — PROJECT_TYPES must list every contactValue
//   • src/app/[locale]/services/page.tsx          — FAQ answers + Service JSON-LD offers
//   • src/app/layout.tsx                          — site-wide OfferCatalog JSON-LD (incl. "Clinic branding" catalog)
//   • src/app/llms.txt/route.ts                   — /llms.txt prices + Brand Kit
//   • src/lib/chat/openRouter.ts                 — chat assistant system prompt
//   • src/lib/chat/chatBot.ts                     — fallback pricing reply
//   • src/lib/chat/knowledgeBase.ts               — chat service list
//
// Translation labels (package + plan names, descriptions, feature lists,
// add-on labels) live in the `packages` namespace of src/messages/{en,tr,ar,fr}.json.
// Both /pricing and /services render from that one namespace.
//
// Pricing model (2026-10-17): ONE price list in ONE currency (USD) for every
// locale. No per-locale or regional prices. Repriced 2026-10-28 to the middle
// of what experienced Istanbul freelancers charge, to compete on price (at
// 1 USD = 49.84 TL: Clinic Website about 60k TL, Growth System about 125k TL,
// Brand Kit about 30k TL).
// ============================================================================

// One offer: patient-acquisition websites for clinics that treat international
// patients. Two packages, repriced 2026-10-28 (see the pricing model above):
// the price covers lead tracking and CRM/ads handoff, not just the site itself.
// `price` is USD.
// `featuresKey` points at a string array in the `packages` namespace.
// `contactValue` is the matching <option> on the contact form (/contact?plan=...).
export const projectTiers = [
  { id: "business", nameKey: "clinicWebsite" as const, descKey: "clinicWebsiteDesc" as const, featuresKey: "clinicWebsiteFeatures" as const, timeframeKey: "clinicWebsiteTimeframe" as const, contactValue: "clinic-website", price: 1200 },
  { id: "custom", nameKey: "growthSystem" as const, descKey: "growthSystemDesc" as const, featuresKey: "growthSystemFeatures" as const, timeframeKey: "growthSystemTimeframe" as const, contactValue: "growth-system", price: 2500, popular: true },
];

// Add-ons are not sold separately — they exist only as features bundled into
// packages (see includedAddOns). `price` is the USD "valued at" figure shown
// next to each bundled add-on. Scaled with the 2026-10-28 repricing so the
// bundled value stays well under each package price.
export const addOns = [
  { id: "seo", nameKey: "seoSetup" as const, price: 200 },
  { id: "blog", nameKey: "blogSystem" as const, price: 150 },
  { id: "cms", nameKey: "contentManagement" as const, price: 300 },
  { id: "chatbot", nameKey: "aiChatbotAddon" as const, price: 450 },
  { id: "multilang", nameKey: "multiLanguage" as const, price: 250 },
];

// Monthly plans. Site Care keeps any site running; Growth Retainer adds the
// lead reporting and ads-tracking upkeep that the Growth System is built for.
// Names/features live in the `packages` translation namespace. `price` is USD/month.
// `fromPrice` shows "From $X/month" (scope varies by clinic); otherwise a fixed price.
// `contactValue` is the matching <option> on the contact form (/contact?plan=...).
// Positioning note (2026-10-19): priced at the top of the freelancer range, not
// agency retainers (those include ads management, which isn't offered here).
// Site Care ($79 since 2026-10-28) sits at the top of experienced-freelancer
// care plans in Istanbul (about 4,000 TL a month); Growth Retainer
// is a reporting/ads-tracking retainer, priced from $450 and quoted up per clinic.
export const carePlans = [
  { id: "careStandard", nameKey: "siteCare" as const, descKey: "siteCareDesc" as const, featuresKey: "siteCareFeatures" as const, forTier: "business", contactValue: "site-care", price: 79 },
  { id: "carePro", nameKey: "growthRetainer" as const, descKey: "growthRetainerDesc" as const, featuresKey: "growthRetainerFeatures" as const, forTier: "custom", contactValue: "growth-retainer", price: 450, fromPrice: true, popular: true },
];

// Months of the matching care plan (carePlans[].forTier) bundled into each
// package after launch. Shown on the package cards as an included item.
export const includedCareMonths = 3;

// Add-ons bundled FREE into each package. Consumers render these as
// "<name> — free, valued at <price>".
export const includedAddOns: Record<string, string[]> = {
  business: ["seo", "multilang"],
  custom: ["seo", "blog", "cms", "chatbot", "multilang"],
};

// Clinic Brand Kit (2026-10-27, repriced 2026-10-28 to the top of experienced
// freelancer identity packages): the one design service, for the same clinics.
// Kept out of projectTiers on purpose: those are the website packages, and the
// audit's entry price, the 2-column package grid, the pricing fit quiz and the
// "Included in both packages" copy all assume exactly two of them.
// Sold on its own, or with the Growth System for `bundle.discount` off.
// Names/features live in the `packages` translation namespace. `price` is USD.
export const brandKit = {
  id: "brandKit",
  nameKey: "clinicBrandKit" as const,
  descKey: "clinicBrandKitDesc" as const,
  featuresKey: "clinicBrandKitFeatures" as const,
  timeframeKey: "clinicBrandKitTimeframe" as const,
  contactValue: "clinic-brand-kit",
  price: 600,
  bundle: { withTier: "custom", contactValue: "growth-brand-bundle", discount: 100 },
};

// Growth System + Brand Kit bought together.
export function getBrandKitBundlePrice(): number {
  return getTier(brandKit.bundle.withTier).price + brandKit.price - brandKit.bundle.discount;
}

// Look up a package or monthly plan by id (throws on a typo so consumers fail
// at build time instead of rendering an empty price).
export function getTier(id: string) {
  const tier = projectTiers.find((t) => t.id === id);
  if (!tier) throw new Error(`Unknown pricing tier: ${id}`);
  return tier;
}

export function getCarePlan(id: string) {
  const plan = carePlans.find((p) => p.id === id);
  if (!plan) throw new Error(`Unknown care plan: ${id}`);
  return plan;
}

// Resolve the add-on objects bundled into a given tier, in addOns order.
// The care plan bundled with a package (matched by forTier), if any.
export function getIncludedCarePlan(tierId: string) {
  return carePlans.find((p) => p.forTier === tierId);
}

// "$149" or "from $450" in plain English (chat prompts, JSON-LD descriptions).
export function formatPlanPrice(plan: (typeof carePlans)[number]): string {
  return `${plan.fromPrice ? "from " : ""}${formatPrice(plan.price)}`;
}

export function getIncludedAddOns(tierId: string) {
  const ids = includedAddOns[tierId] ?? [];
  return addOns.filter((a) => ids.includes(a.id));
}

/**
 * What one international patient typically spends at a clinic in Turkey, per
 * treatment (keys match TREATMENT_IDS in audit.ts). Kept cautious, near the low
 * end of public package prices, because it is shown as a fact. Used only to put
 * the website price next to the value of a patient in the check's budget question.
 */
export const patientValueRanges: Record<string, readonly [number, number]> = {
  dental: [2000, 6000],
  hair: [2000, 4000],
  aesthetic: [3000, 7000],
  several: [2000, 6000],
};

/**
 * "$2,000–$6,000" as one left-to-right isolate (U+2066…U+2069) with word joiners
 * around the dash, so Arabic text neither reorders nor wraps the range.
 */
export function formatPriceRange([min, max]: readonly [number, number]): string {
  return `\u2066${formatPrice(min)}\u2060–\u2060${formatPrice(max)}\u2069`;
}

// Always USD with en-US grouping ("$2,500") in every locale. Explicit locale:
// a bare toLocaleString() formats with the server's locale during SSR and the
// browser's locale on the client (hydration mismatch).
export function formatPrice(amount: number): string {
  return `$${amount.toLocaleString("en-US")}`;
}
