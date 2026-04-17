import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
// 💰 Pricing source of truth: edit prices in src/lib/pricing.ts
// The OfferCatalog JSON-LD below is generated from projectTiers + addOns.
import { projectTiers, addOns, intlPriceMap } from "@/lib/pricing";
import Breadcrumbs from "@/components/seo/Breadcrumbs";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata.rateCalculator");
  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: "https://www.awab.design/rate-calculator",
      images: [
        {
          url: "/img/hero-image.jpg",
          width: 1200,
          height: 630,
          alt: "Awab Design — Rate Calculator",
        },
      ],
    },
    alternates: {
      canonical: "/rate-calculator",
      languages: {
        en: "/rate-calculator",
        ar: "/ar/rate-calculator",
        tr: "/tr/rate-calculator",
        fr: "/fr/rate-calculator",
      },
    },
  };
}

// Human-readable labels for schema (keyed by pricing.ts tier/add-on ids).
// Mirrors the English `rateCalculator` namespace so JSON-LD stays stable
// across locales while the UI itself is localized.
const tierSchemaLabels: Record<string, { name: string; description: string }> = {
  landing: {
    name: "Landing Page",
    description: "One focused page to showcase your product or service",
  },
  business: {
    name: "Business Website",
    description: "A complete site for your business — 3 to 5 pages, mobile-ready",
  },
  custom: {
    name: "Custom Website",
    description: "Tailored build with custom features and integrations",
  },
};

const addOnSchemaLabels: Record<string, string> = {
  seo: "SEO Setup",
  blog: "Blog System",
  cms: "Content Management",
  chatbot: "AI Chatbot Integration",
  multilang: "Multi-Language Support",
};

export default function RateCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Build offers from the shared pricing source so the schema tracks the
  // calculator UI automatically.
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
    name: "Web Design & Development",
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
      name: "Web Design Services",
      itemListElement: [...tierOffers, ...addOnOffers],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Breadcrumbs items={[
        { name: "Home", url: "/" },
        { name: "Rate Calculator", url: "/rate-calculator" },
      ]} />
      {children}
    </>
  );
}
