import type { Metadata } from "next";
import { getTranslations, getLocale, setRequestLocale } from "next-intl/server";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import AuditExperience from "@/components/audit/AuditExperience";
import { ogLocale, pageAlternates, localeUrl } from "@/lib/seo";
import { chapterPreview, getPlaybook, playbookExcerpts } from "@/lib/playbook";
import type { Locale } from "@/i18n/config";

// OG image: ./opengraph-image.tsx
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata.audit");
  const locale = await getLocale();

  return {
    title: { absolute: t("title") },
    description: t("description"),
    keywords: [
      "clinic website audit",
      "medical tourism website check",
      "international patient website",
      "dental clinic website istanbul",
      "hair transplant clinic website",
      "aesthetic clinic website audit",
      "sağlık turizmi web sitesi analizi",
      "klinik web sitesi testi",
    ],
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: localeUrl("/audit", locale),
      locale: ogLocale(locale),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
    alternates: pageAlternates("/audit", locale),
  };
}

export default async function AuditPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("audit");
  // Only the small previews (title, promise, minutes, template count) and the excerpts reach the client.
  const playbook = await getPlaybook(locale as Locale);
  const chapters = playbook.chapters.map(chapterPreview);
  // Plus three short real excerpts for the "peek inside" block.
  const excerpts = playbookExcerpts(playbook);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: t("heading"),
    url: "https://www.awab.design/audit",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description: t("intro"),
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    provider: {
      "@type": "Person",
      name: "Awab Elkhalil",
      url: "https://www.awab.design",
    },
  };

  return (
    <main className="min-h-screen bg-background pt-32">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumbs
        items={[
          { name: "Home", url: "/" },
          { name: "Free playbook", url: "/audit" },
        ]}
      />
      <AuditExperience chapters={chapters} excerpts={excerpts} />
    </main>
  );
}
