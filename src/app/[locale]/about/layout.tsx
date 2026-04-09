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
      {children}
    </>
  );
}
