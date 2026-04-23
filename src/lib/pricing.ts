// ============================================================================
// 💰 PRICING — SINGLE SOURCE OF TRUTH
// ============================================================================
//
// This file is the ONLY place prices should be edited. Every consumer below
// reads from projectTiers / addOns / intlPriceMap and computes prices via
// getPrice() + formatPrice() for locale-aware display.
//
// Consumers (anywhere that shows or references prices):
//   • src/app/[locale]/rate-calculator/page.tsx   — interactive calculator
//   • src/app/[locale]/rate-calculator/layout.tsx — OfferCatalog JSON-LD
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

export const projectTiers = [
  { id: "landing", nameKey: "landingPage" as const, descKey: "landingPageDesc" as const, basePrice: 100 },
  { id: "business", nameKey: "businessWebsite" as const, descKey: "businessWebsiteDesc" as const, basePrice: 300, popular: true },
  { id: "custom", nameKey: "customWebsite" as const, descKey: "customWebsiteDesc" as const, basePrice: 800 },
  { id: "app", nameKey: "appDevelopment" as const, descKey: "appDevelopmentDesc" as const, basePrice: 1000 },
];

export const addOns = [
  { id: "seo", nameKey: "seoSetup" as const, price: 80 },
  { id: "blog", nameKey: "blogSystem" as const, price: 80 },
  { id: "cms", nameKey: "contentManagement" as const, price: 150 },
  { id: "chatbot", nameKey: "aiChatbotAddon" as const, price: 300 },
  { id: "multilang", nameKey: "multiLanguage" as const, price: 100 },
];

// International (EN/FR) prices — higher tier
export const intlPriceMap: Record<string, number> = {
  landing: 150,
  business: 500,
  custom: 1500,
  seo: 120,
  blog: 120,
  cms: 250,
  chatbot: 500,
  multilang: 150,
  app: 2000,
};

export function getPrice(id: string, basePrice: number, locale: string): number {
  if ((locale === "en" || locale === "fr") && intlPriceMap[id] !== undefined) return intlPriceMap[id];
  return basePrice;
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
