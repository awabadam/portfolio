import { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import Breadcrumbs from "@/components/seo/Breadcrumbs";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata.services");
  const locale = await getLocale();
  const ogLocale =
    locale === "ar" ? "ar_SA" : locale === "tr" ? "tr_TR" : locale === "fr" ? "fr_FR" : "en_US";

  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: "https://www.awab.design/services",
      locale: ogLocale,
    },
    alternates: {
      canonical: "/services",
      languages: {
        en: "/services",
        ar: "/ar/services",
        tr: "/tr/services",
        fr: "/fr/services",
      },
    },
  };
}

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Breadcrumbs items={[
        { name: "Home", url: "/" },
        { name: "Services", url: "/services" },
      ]} />
      {children}
    </>
  );
}
