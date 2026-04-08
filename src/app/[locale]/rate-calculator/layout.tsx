import { getTranslations } from "next-intl/server";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata.rateCalculator");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function RateCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Web Design & Development",
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
      name: "Web Design Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Landing Page",
            description:
              "One focused page to showcase your product or service",
          },
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: "150",
            priceCurrency: "USD",
            unitText: "project",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Business Website",
            description:
              "A complete site for your business — 3 to 5 pages, mobile-ready",
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
            name: "Custom Website",
            description:
              "Tailored build with custom features and integrations",
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
            name: "SEO Setup",
          },
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: "120",
            priceCurrency: "USD",
            unitText: "project",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "AI Chatbot Integration",
          },
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: "500",
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
      {children}
    </>
  );
}
