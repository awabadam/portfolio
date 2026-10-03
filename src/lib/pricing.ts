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
//   • src/app/[locale]/services/website-maintenance/page.tsx — Care Plan cards
//   • src/app/[locale]/services/webdesign-istanbul/page.tsx  — hero + FAQ copy
//   • src/lib/chat/openRouter.ts                  — chat assistant system prompt
//   • src/lib/chat/chatBot.ts                     — fallback pricing reply
//
// Translation labels (tier names, descriptions, add-on labels) live in the
// `rateCalculator` namespace of src/messages/{en,tr,ar,fr}.json.
//
// Pricing model:
//   • Base prices = AR local market rates (USD)
//   • intlPriceMap overrides for EN/FR (international / higher tier)
//   • tryPriceMap overrides for TR — fixed TL prices (Turkish buyers compare
//     TL price lists). Review quarterly: lira loses ~1.5-2%/month.
// ============================================================================

// Local/regional (AR) base prices in USD (TR uses tryPriceMap). Kept as the discounted tier — roughly
// 0.3x of the international rates in intlPriceMap below. Benchmarked Oct 2026
// against Turkish freelancer/agency rates and global small-business budgets.
export const projectTiers = [
  { id: "landing", nameKey: "landingPage" as const, descKey: "landingPageDesc" as const, basePrice: 200 },
  { id: "business", nameKey: "businessWebsite" as const, descKey: "businessWebsiteDesc" as const, basePrice: 450, popular: true },
  { id: "custom", nameKey: "customWebsite" as const, descKey: "customWebsiteDesc" as const, basePrice: 1100 },
];

// Add-ons are not sold separately — they exist only as features bundled into
// packages (see includedAddOns). Their price is the "valued at" figure shown
// next to each bundled add-on; intlPriceMap holds the EN/FR value.
export const addOns = [
  { id: "seo", nameKey: "seoSetup" as const, price: 150 },
  { id: "blog", nameKey: "blogSystem" as const, price: 100 },
  { id: "cms", nameKey: "contentManagement" as const, price: 250 },
  { id: "chatbot", nameKey: "aiChatbotAddon" as const, price: 400 },
  { id: "multilang", nameKey: "multiLanguage" as const, price: 180 },
];

// Care Plans — one managed monthly plan per site tier, bundling hosting +
// domain registration/renewal + SSL + a tier-appropriate change allowance.
// Names/features live in the `services.websiteMaintenance` translation namespace.
// `basePrice` is the local (AR) monthly rate; intlPriceMap holds EN/FR, tryPriceMap TR.
export const carePlans = [
  { id: "careLite", nameKey: "careLite", featuresKey: "careLiteFeatures", forTier: "landing", basePrice: 15 },
  { id: "careStandard", nameKey: "careStandard", featuresKey: "careStandardFeatures", forTier: "business", basePrice: 39, popular: true },
  { id: "carePro", nameKey: "carePro", featuresKey: "careProFeatures", forTier: "custom", basePrice: 79 },
];

// Add-ons bundled FREE into each package. Consumers render these as
// "<name> — free, valued at <price>".
export const includedAddOns: Record<string, string[]> = {
  landing: ["seo"],
  business: ["seo", "blog", "multilang"],
  custom: ["seo", "blog", "cms", "chatbot", "multilang"],
};

// International (EN/FR) prices — higher tier. Add-on values here are also
// what we show as the "valued at" figure for bundled-in add-ons.
export const intlPriceMap: Record<string, number> = {
  landing: 600,
  business: 1500,
  custom: 3000,
  seo: 400,
  blog: 250,
  cms: 600,
  chatbot: 900,
  multilang: 450,
  careLite: 29,
  careStandard: 79,
  carePro: 149,
};

// Turkish (TR) prices in TL — set natively, not converted from USD. Benchmarked
// 2026-10-03 against Istanbul freelancer/agency price lists (upper-freelancer /
// lower-agency band; ~49 TRY/USD at the time). Add-on values are the
// "valued at" figures for bundled add-ons.
export const tryPriceMap: Record<string, number> = {
  landing: 11900,
  business: 24900,
  custom: 59900,
  seo: 7900,
  blog: 4900,
  cms: 12900,
  chatbot: 21900,
  multilang: 9900,
  careLite: 990,
  careStandard: 2490,
  carePro: 4490,
};

// Returns the price in the locale's display currency: TL for tr, USD otherwise.
export function getPrice(id: string, basePrice: number, locale: string): number {
  if (locale === "tr" && tryPriceMap[id] !== undefined) return tryPriceMap[id];
  if ((locale === "en" || locale === "fr") && intlPriceMap[id] !== undefined) return intlPriceMap[id];
  return basePrice;
}

// Resolve the add-on objects bundled into a given tier, in addOns order.
export function getIncludedAddOns(tierId: string) {
  const ids = includedAddOns[tierId] ?? [];
  return addOns.filter((a) => ids.includes(a.id));
}

// `amount` must come from getPrice() for the same locale (TL for tr).
export function formatPrice(amount: number, locale: string): string {
  if (locale === "tr") {
    return `₺${amount.toLocaleString("tr-TR")}`;
  }
  if (locale === "fr") {
    return `${amount.toLocaleString("fr-FR")} €`;
  }
  // Explicit locale: a bare toLocaleString() formats with the server's locale
  // during SSR and the browser's locale on the client (hydration mismatch).
  return `$${amount.toLocaleString("en-US")}`;
}
