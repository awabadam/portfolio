import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import Breadcrumbs from "@/components/seo/Breadcrumbs";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata.about");
  const locale = await getLocale();
  const ogLocale = locale === "ar" ? "ar_SA" : locale === "tr" ? "tr_TR" : locale === "fr" ? "fr_FR" : "en_US";

  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: "https://www.awab.design/about",
      locale: ogLocale,
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
    alternates: {
      canonical: "/about",
      languages: {
        en: "/about",
        ar: "/ar/about",
        tr: "/tr/about",
        fr: "/fr/about",
      },
    },
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
            dateModified: "2026-04-16",
            mainEntity: {
              "@type": "Person",
              "@id": "https://www.awab.design/#person",
              name: "Awab Elkhalil",
              jobTitle: "Web Designer & Developer",
              description:
                "Professional web designer and developer in Istanbul specializing in modern, conversion-focused websites, UI/UX design, SEO, and AI chatbot integration.",
              image: "https://www.awab.design/img/hero-image.jpg",
              url: "https://www.awab.design",
              sameAs: [
                "https://www.linkedin.com/in/awab-adam/",
                "https://www.instagram.com/awabeladam/",
              ],
              knowsAbout: [
                "Web Design",
                "Web Development",
                "UI/UX Design",
                "SEO",
                "AI Chatbot Integration",
                "Next.js",
                "React",
                "TypeScript",
              ],
            },
          }),
        }}
      />
      {children}
    </>
  );
}
