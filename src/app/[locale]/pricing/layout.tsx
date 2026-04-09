import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import Breadcrumbs from "@/components/seo/Breadcrumbs";

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

export default function PricingLayout({ children }: { children: React.ReactNode }) {
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
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Starter Package",
            description: "Single landing page with basic SEO and mobile-responsive design",
          },
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: "500",
            priceCurrency: "USD",
            unitText: "project",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Business Package",
            description: "5-page website with full SEO, 2 languages, and CMS",
          },
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: "1500",
            priceCurrency: "USD",
            unitText: "project",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Premium Package",
            description: "Custom Next.js build with 4 languages, AI chatbot, and advanced SEO",
          },
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: "3000",
            priceCurrency: "USD",
            unitText: "project",
          },
        },
      ],
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
