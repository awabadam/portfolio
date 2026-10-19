import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
// 💰 Pricing source of truth: edit prices in src/lib/pricing.ts
// The OfferCatalog JSON-LD below is generated from projectTiers + carePlans.
import { projectTiers, carePlans, getTier, formatPrice } from "@/lib/pricing";
import { ogLocale, pageAlternates, localeUrl } from "@/lib/seo";

// OG image: ./opengraph-image.tsx
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata.pricing");
  const locale = await getLocale();
  // The description quotes both package prices from pricing.ts.
  const prices = {
    clinicPrice: formatPrice(getTier("business").price),
    growthPrice: formatPrice(getTier("custom").price),
  };
  const description = t("description", prices);

  return {
    title: t("title"),
    description,
    keywords: [
      "clinic website price istanbul",
      "dental clinic website cost",
      "medical tourism website price",
      "hair transplant clinic website",
      "aesthetic clinic website istanbul",
      "klinik web sitesi fiyatları",
      "multilingual clinic website",
      "google ads offline conversions clinic",
      "clinic lead tracking",
    ],
    openGraph: {
      title: t("title"),
      description,
      url: localeUrl("/pricing", locale),
      locale: ogLocale(locale),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description,
    },
    alternates: pageAlternates("/pricing", locale),
  };
}

export default async function PricingLayout({ children }: { children: React.ReactNode }) {
  // Schema labels come from the English `packages` namespace (the same strings
  // the cards render), so the JSON-LD stays stable across locales while the UI
  // itself is localized. Prices are USD (the only currency we quote).
  const tEn = await getTranslations({ locale: "en", namespace: "packages" });

  const tierOffers = projectTiers.map((tier) => ({
    "@type": "Offer",
    itemOffered: {
      "@type": "Service",
      name: tEn(tier.nameKey),
      description: tEn(tier.descKey),
    },
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      price: String(tier.price),
      priceCurrency: "USD",
      unitText: "project",
    },
  }));

  const planOffers = carePlans.map((plan) => ({
    "@type": "Offer",
    itemOffered: {
      "@type": "Service",
      name: tEn(plan.nameKey),
      description: tEn(plan.descKey),
    },
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      ...(plan.fromPrice ? { minPrice: String(plan.price) } : { price: String(plan.price) }),
      priceCurrency: "USD",
      unitText: "month",
    },
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Patient-Acquisition Websites for Clinics",
    provider: {
      "@type": "Person",
      name: "Awab Design",
      url: "https://www.awab.design",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Istanbul",
        addressCountry: "TR",
      },
    },
    areaServed: "Worldwide",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Clinic Website Packages",
      itemListElement: [...tierOffers, ...planOffers],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Breadcrumbs
        items={[
          { name: "Home", url: "/" },
          { name: "Pricing", url: "/pricing" },
        ]}
      />
      {children}
    </>
  );
}
