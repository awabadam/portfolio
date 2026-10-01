// ============================================================================
// 💰 PRICING — SINGLE SOURCE OF TRUTH
// ============================================================================
//
// This file is the ONLY place prices should be edited. Every consumer below
// reads from projectTiers / addOns / intlPriceMap and computes prices via
// getPrice() + formatPrice() for locale-aware display.
//
// Consumers (anywhere that shows or references prices):
//   • src/app/[locale]/pricing/page.tsx           — SEO pricing landing page
//   • src/app/[locale]/pricing/layout.tsx         — OfferCatalog JSON-LD
//   • src/app/[locale]/services/page.tsx          — services tier cards
//   • src/lib/chat/openRouter.ts                  — chat assistant system prompt
//   • src/lib/chat/chatBot.ts                     — fallback pricing reply
//
// Translation labels (tier names, descriptions, add-on labels) live in the
// `rateCalculator` namespace of src/messages/{en,tr,ar,fr}.json.
//
// Pricing model:
//   • Base prices = AR/TR local market rates
//   • intlPriceMap overrides for EN/FR (international / higher tier)
//   • formatPrice() converts USD → TRY on the fly using FALLBACK_TRY_RATE
//     (or a live rate from /api/exchange-rate when available)
// ============================================================================

export const FALLBACK_TRY_RATE = 38;

// Local/regional (AR/TR) base prices. Kept as the discounted tier — roughly
// 0.4x of the international rates in intlPriceMap below. Benchmarked 2026
// against Istanbul agency pricing (Longway Media) + global market research.
export const projectTiers = [
  { id: "landing", nameKey: "landingPage" as const, descKey: "landingPageDesc" as const, basePrice: 300 },
  { id: "business", nameKey: "businessWebsite" as const, descKey: "businessWebsiteDesc" as const, basePrice: 700, popular: true },
  { id: "custom", nameKey: "customWebsite" as const, descKey: "customWebsiteDesc" as const, basePrice: 1800 },
  { id: "app", nameKey: "appDevelopment" as const, descKey: "appDevelopmentDesc" as const, basePrice: 3500 },
];

// Add-on base (AR/TR) prices. The intlPriceMap value doubles as the
// "valued at" figure shown when an add-on is bundled free into a package.
export const addOns = [
  { id: "seo", nameKey: "seoSetup" as const, price: 250 },
  { id: "blog", nameKey: "blogSystem" as const, price: 180 },
  { id: "cms", nameKey: "contentManagement" as const, price: 400 },
  { id: "chatbot", nameKey: "aiChatbotAddon" as const, price: 700 },
  { id: "multilang", nameKey: "multiLanguage" as const, price: 300 },
];

// Care Plans — one managed monthly plan per site tier, bundling hosting +
// domain registration/renewal + SSL + a tier-appropriate change allowance.
// Names/features live in the `services.websiteMaintenance` translation namespace.
// `basePrice` is the local (AR/TR) monthly rate; intlPriceMap holds EN/FR.
export const carePlans = [
  { id: "careLite", nameKey: "careLite", featuresKey: "careLiteFeatures", forTier: "landing", basePrice: 15 },
  { id: "careStandard", nameKey: "careStandard", featuresKey: "careStandardFeatures", forTier: "business", basePrice: 39, popular: true },
  { id: "carePro", nameKey: "carePro", featuresKey: "careProFeatures", forTier: "custom", basePrice: 79 },
];

// Add-ons bundled FREE into each package. Consumers render these as
// "<name> — free, valued at <price>" and exclude them from the payable
// add-on grid so they're never double-charged.
export const includedAddOns: Record<string, string[]> = {
  landing: ["seo"],
  business: ["seo", "blog", "multilang"],
  custom: ["seo", "blog", "cms", "multilang"],
  app: ["seo", "cms", "chatbot", "multilang"],
};

// International (EN/FR) prices — higher tier. Add-on values here are also
// what we show as the "valued at" figure for bundled-in add-ons.
export const intlPriceMap: Record<string, number> = {
  landing: 900,
  business: 2200,
  custom: 4500,
  seo: 600,
  blog: 400,
  cms: 900,
  chatbot: 1500,
  multilang: 700,
  app: 8000,
  careLite: 29,
  careStandard: 79,
  carePro: 149,
};

export function getPrice(id: string, basePrice: number, locale: string): number {
  if ((locale === "en" || locale === "fr") && intlPriceMap[id] !== undefined) return intlPriceMap[id];
  return basePrice;
}

// Resolve the add-on objects bundled into a given tier, in addOns order.
export function getIncludedAddOns(tierId: string) {
  const ids = includedAddOns[tierId] ?? [];
  return addOns.filter((a) => ids.includes(a.id));
}

export function formatPrice(amount: number, locale: string, tryRate: number): string {
  if (locale === "tr") {
    const tryAmount = Math.round((amount * tryRate) / 100) * 100;
    return `₺${tryAmount.toLocaleString("tr-TR")}`;
  }
  if (locale === "fr") {
    return `${amount.toLocaleString("fr-FR")} €`;
  }
  return `$${amount.toLocaleString()}`;
}
