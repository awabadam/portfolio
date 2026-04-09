import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
// 💰 Pricing source of truth: edit prices in src/lib/pricing.ts
// The OfferCatalog JSON-LD below is generated from projectTiers + addOns.
import { projectTiers, addOns, intlPriceMap } from "@/lib/pricing";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata.pricing");
  const locale = await getLocale();
  const ogLocale = locale === "ar" ? "ar_SA" : locale === "tr" ? "tr_TR" : locale === "fr" ? "fr_FR" : "en_US";

  return {
    title: t("title"),
    description: t("description"),
    keywords: [
      "web design pricing istanbul",
      "freelance web designer rates",
      "web tasarım fiyatları istanbul",
      "website cost istanbul",
      "next.js developer pricing",
      "multilingual website price",
      "ai chatbot website cost",
      "clinic website design price",
      "transparent web design pricing",
    ],
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: "https://awab.design/pricing",
      locale: ogLocale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
    alternates: {
      canonical: "/pricing",
      languages: {
        en: "/pricing",
        ar: "/ar/pricing",
        tr: "/tr/pricing",
        fr: "/fr/pricing",
      },
    },
  };
}

// Human-readable labels for schema (keyed by pricing.ts tier and add-on ids).
// These intentionally mirror the English `rateCalculator` namespace so the
// JSON-LD stays stable across locales while the UI itself is localized.
const tierSchemaLabels: Record<string, { name: string; description: string }> = {
  landing: {
    name: "Landing Page",
    description: "One focused page to showcase your product or service",
  },
  business: {
    name: "Business Website",
    description: "A complete 3-5 page site for your business, mobile-ready and SEO-optimized",
  },
  custom: {
    name: "Custom Website",
    description: "Tailored Next.js build with custom features, integrations, and advanced SEO",
  },
};

const addOnSchemaLabels: Record<string, string> = {
  seo: "SEO Setup",
  blog: "Blog System",
  cms: "Content Management",
  chatbot: "AI Chatbot Integration",
  multilang: "Multi-Language Support",
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  // Build the OfferCatalog from the shared pricing source of truth so the
  // schema can never drift from what the calculator shows.
  const tierOffers = projectTiers.map((tier) => {
    const labels = tierSchemaLabels[tier.id];
    const price = intlPriceMap[tier.id] ?? tier.basePrice;
    return {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: labels?.name ?? tier.id,
        description: labels?.description,
      },
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: String(price),
        priceCurrency: "USD",
        unitText: "project",
      },
    };
  });

  const addOnOffers = addOns.map((addOn) => {
    const price = intlPriceMap[addOn.id] ?? addOn.price;
    return {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: addOnSchemaLabels[addOn.id] ?? addOn.id,
      },
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: String(price),
        priceCurrency: "USD",
        unitText: "project",
      },
    };
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Web Design & Development Packages",
    provider: {
      "@type": "Person",
      name: "Awab Design",
      url: "https://awab.design",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Istanbul",
        addressCountry: "TR",
      },
    },
    areaServed: "Worldwide",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Web Design Packages",
      itemListElement: [...tierOffers, ...addOnOffers],
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
