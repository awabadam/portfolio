import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import { ogLocale, pageAlternates, localeUrl } from "@/lib/seo";

// OG image: ./opengraph-image.tsx
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata.contact");
  const locale = await getLocale();

  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: localeUrl("/contact", locale),
      locale: ogLocale(locale),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
    alternates: pageAlternates("/contact", locale),
  };
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Breadcrumbs items={[
        { name: "Home", url: "/" },
        { name: "Contact", url: "/contact" },
      ]} />
      {children}
    </>
  );
}
