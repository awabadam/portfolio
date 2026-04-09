export const FALLBACK_TRY_RATE = 38;

// Single source of truth for all pricing across the app:
// - /rate-calculator (interactive builder)
// - /pricing (SEO landing page)
// - /services (tier cards)
// - Chat AI assistant (openRouter.ts)
//
// Base prices are for the AR/TR local market. International prices (EN/FR)
// are overridden via intlPriceMap below.

export const projectTiers = [
  { id: "landing", nameKey: "landingPage" as const, descKey: "landingPageDesc" as const, basePrice: 100 },
  { id: "business", nameKey: "businessWebsite" as const, descKey: "businessWebsiteDesc" as const, basePrice: 300, popular: true },
  { id: "custom", nameKey: "customWebsite" as const, descKey: "customWebsiteDesc" as const, basePrice: 800 },
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
