import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import HomePageContent from "./HomePageContent";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata.home");
  const locale = await getLocale();
  const ogLocale = locale === "ar" ? "ar_SA" : locale === "tr" ? "tr_TR" : locale === "fr" ? "fr_FR" : "en_US";

  return {
    title: t("title"),
    description: t("description"),
    keywords: [
      "web designer istanbul",
      "freelance web designer istanbul",
      "next.js developer istanbul",
      "multilingual website design",
      "ai chatbot integration",
      "clinic website design istanbul",
      "medical tourism website",
      "web tasarım istanbul",
      "web sitesi yaptırmak",
      "React developer istanbul",
    ],
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: "https://www.awab.design",
      locale: ogLocale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
    alternates: {
      canonical: "/",
      languages: {
        en: "/",
        ar: "/ar",
        tr: "/tr",
        fr: "/fr",
      },
    },
  };
}

export default function HomePage() {
  return <HomePageContent />;
}
