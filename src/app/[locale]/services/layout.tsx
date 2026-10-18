import { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { ogLocale, pageAlternates, localeUrl } from "@/lib/seo";

// Sub-pages (webdesign-istanbul, website-maintenance) override title,
// description, openGraph and alternates in their own generateMetadata.
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata.services");
  const locale = await getLocale();

  return {
    // Title already ends in "| Awab Design"; skip the root template.
    title: { absolute: t("title") },
    description: t("description"),
    keywords: [
      "medical tourism website design",
      "clinic website design istanbul",
      "dental clinic website",
      "aesthetic clinic website",
      "hair transplant clinic website",
      "multilingual clinic website",
      "sağlık turizmi web sitesi",
      "klinik web sitesi tasarımı istanbul",
    ],
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: localeUrl("/services", locale),
      locale: ogLocale(locale),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
    alternates: pageAlternates("/services", locale),
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
