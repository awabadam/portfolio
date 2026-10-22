import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { ogLocale, pageAlternates, localeUrl } from "@/lib/seo";
import HomePageContent from "./HomePageContent";

// OG/Twitter image comes from ./opengraph-image.tsx (file-based metadata wins).
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  // Unknown "locales" (e.g. /llms.txt, which skips the intl proxy) must 404
  // here: reading the locale from headers on this static page throws a 500.
  const { locale } = await params;
  if (!routing.locales.includes(locale as any)) notFound();
  const t = await getTranslations({ locale, namespace: "metadata.home" });

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
