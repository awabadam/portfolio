import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import { ogLocale, pageAlternates, localeUrl } from "@/lib/seo";
import HomePageContent from "./HomePageContent";

// OG/Twitter image comes from ./opengraph-image.tsx (file-based metadata wins).
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata.home");
  const locale = await getLocale();

  return {
    title: { absolute: t("title") },
    description: t("description"),
    keywords: [
      "clinic website design istanbul",
      "dental clinic website",
      "aesthetic clinic website",
      "hair transplant clinic website",
      "medical tourism website design",
      "multilingual clinic website",
      "arabic clinic website",
      "klinik web sitesi tasarımı istanbul",
      "تصميم موقع عيادة اسطنبول",
      "site web clinique istanbul",
    ],
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: localeUrl("/", locale),
      locale: ogLocale(locale),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
    alternates: pageAlternates("/", locale),
  };
}

export default function HomePage() {
  return <HomePageContent />;
}
