import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { ogLocale, pageAlternates, localeUrl } from "@/lib/seo";

// OG image: ./opengraph-image.tsx
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata.about");
  const locale = await getLocale();

  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: localeUrl("/about", locale),
      locale: ogLocale(locale),
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
    alternates: pageAlternates("/about", locale),
  };
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Breadcrumbs items={[
        { name: "Home", url: "/" },
        { name: "About", url: "/about" },
      ]} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfilePage",
            dateCreated: "2024-01-01",
            dateModified: "2026-10-17",
            mainEntity: {
              "@type": "Person",
              "@id": "https://www.awab.design/#person",
              name: "Awab Elkhalil",
              jobTitle: "Web Designer & Developer",
              description:
                "Web designer and developer in Istanbul building multilingual websites for clinics that treat international patients, with lead tracking, CRM handoff and Google Ads offline conversions.",
              image: "https://www.awab.design/img/awab-portrait.webp",
              workLocation: {
                "@type": "Place",
                name: "Istanbul, Türkiye",
              },
              url: "https://www.awab.design",
              sameAs: [
                "https://www.linkedin.com/in/awab-adam/",
                "https://www.instagram.com/awabeladam/",
                "https://github.com/awabadam",
              ],
              knowsAbout: [
                "Clinic Website Design",
                "Multilingual Websites",
                "Medical Tourism Marketing",
                "Lead Tracking",
                "Google Ads Offline Conversions",
                "CRM Integration",
                "Next.js",
              ],
            },
          }),
        }}
      />
      {children}
    </>
  );
}
