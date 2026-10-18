// ============================================================================
// 💰 PRICING — SINGLE SOURCE OF TRUTH
// ============================================================================
//
// This file is the ONLY place prices should be edited. Every consumer below
// reads from projectTiers / carePlans / addOns and formats prices with
// formatPrice() (always USD).
//
// Consumers (anywhere that shows or references prices):
//   • src/components/pricing/PackageCards.tsx      — package cards (used by /pricing + /services)
//   • src/components/pricing/CarePlanCards.tsx     — monthly plan cards (used by /pricing + /services/website-maintenance)
//   • src/app/[locale]/pricing/page.tsx           — SEO pricing landing page
//   • src/app/[locale]/pricing/layout.tsx         — OfferCatalog JSON-LD
//   • src/app/[locale]/services/page.tsx          — services page (renders PackageCards)
//   • src/app/[locale]/services/website-maintenance/page.tsx — monthly plans + JSON-LD
//   • src/app/[locale]/services/webdesign-istanbul/page.tsx  — hero + FAQ copy
//   • src/app/[locale]/services/page.tsx          — FAQ answers + Service JSON-LD offers
//   • src/lib/chat/openRouter.ts                  — chat assistant system prompt
//   • src/lib/chat/chatBot.ts                     — fallback pricing reply
//   • src/lib/chat/knowledgeBase.ts               — chat service list
//
// Translation labels (package + plan names, descriptions, feature lists,
// add-on labels) live in the `packages` namespace of src/messages/{en,tr,ar,fr}.json.
// Both /pricing and /services render from that one namespace.
//
// Pricing model (2026-10-17): ONE price list in ONE currency (USD) for every
// locale. No per-locale or regional prices. Set at Turkish-market premium
// level: above typical Istanbul agency rates because each package includes
// lead tracking and CRM/ads handoff, not just the site.
// ============================================================================

// One offer: patient-acquisition websites for clinics that treat international
// patients. Two packages, priced 2026-10-17: the price covers lead tracking and
// CRM/ads handoff, not just the site itself. `price` is USD.
// `featuresKey` points at a string array in the `packages` namespace.
export const projectTiers = [
  { id: "business", nameKey: "clinicWebsite" as const, descKey: "clinicWebsiteDesc" as const, featuresKey: "clinicWebsiteFeatures" as const, timeframeKey: "clinicWebsiteTimeframe" as const, price: 2500 },
  { id: "custom", nameKey: "growthSystem" as const, descKey: "growthSystemDesc" as const, featuresKey: "growthSystemFeatures" as const, timeframeKey: "growthSystemTimeframe" as const, price: 5000, popular: true },
];

// Add-ons are not sold separately — they exist only as features bundled into
// packages (see includedAddOns). `price` is the USD "valued at" figure shown
// next to each bundled add-on.
export const addOns = [
  { id: "seo", nameKey: "seoSetup" as const, price: 400 },
  { id: "blog", nameKey: "blogSystem" as const, price: 250 },
  { id: "cms", nameKey: "contentManagement" as const, price: 600 },
  { id: "chatbot", nameKey: "aiChatbotAddon" as const, price: 900 },
  { id: "multilang", nameKey: "multiLanguage" as const, price: 450 },
];

// Monthly plans. Site Care keeps any site running; Growth Retainer adds the
// lead reporting and ads-tracking upkeep that the Growth System is built for.
// Names/features live in the `packages` translation namespace. `price` is USD/month.
// Positioning note (2026-10-17): Site Care sits at the upper end of local
// hosting + updates plans; Growth Retainer is priced as a reporting/ads-tracking
// retainer, not a maintenance plan. Review against Istanbul agency rates yearly.
export const carePlans = [
  { id: "careStandard", nameKey: "siteCare" as const, descKey: "siteCareDesc" as const, featuresKey: "siteCareFeatures" as const, forTier: "business", price: 79 },
  { id: "carePro", nameKey: "growthRetainer" as const, descKey: "growthRetainerDesc" as const, featuresKey: "growthRetainerFeatures" as const, forTier: "custom", price: 450, popular: true },
];

// Add-ons bundled FREE into each package. Consumers render these as
// "<name> — free, valued at <price>".
export const includedAddOns: Record<string, string[]> = {
  business: ["seo", "multilang"],
  custom: ["seo", "blog", "cms", "chatbot", "multilang"],
};

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
export function getIncludedAddOns(tierId: string) {
  const ids = includedAddOns[tierId] ?? [];
  return addOns.filter((a) => ids.includes(a.id));
}

// Always USD with en-US grouping ("$2,500") in every locale. Explicit locale:
// a bare toLocaleString() formats with the server's locale during SSR and the
// browser's locale on the client (hydration mismatch).
export function formatPrice(amount: number): string {
  return `$${amount.toLocaleString("en-US")}`;
}
