import React from "react";
import { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, Clock, DollarSign } from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";
// 💰 Pricing source of truth: edit prices in src/lib/pricing.ts
// Plan cards are shared with /pricing (names/features from the `packages` namespace).
import { getCarePlan, formatPrice } from "@/lib/pricing";
import CarePlanCards from "@/components/pricing/CarePlanCards";
import StockPhoto from "@/components/ui/stock-photo";
import RelatedLinks from "@/components/seo/RelatedLinks";
import { ogLocale, pageAlternates, localeUrl } from "@/lib/seo";
import ClosingCard from "@/components/cta/ClosingCard";
import BookCallLink from "@/components/cta/BookCallLink";
import { GlassPill } from "@/components/ui/glass-pill";

const PAGE_PATH = "/services/website-maintenance";

// OG image: ./opengraph-image.tsx
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata.websiteMaintenance');
  const locale = await getLocale();
  // The description quotes the Site Care price from pricing.ts.
  const description = t('description', { carePrice: formatPrice(getCarePlan("careStandard").price) });

  return {
    // Title already ends in "| Awab Design"; skip the root template.
    title: { absolute: t('title') },
    description,
    keywords: [
      "clinic website maintenance",
      "clinic website hosting",
      "website maintenance Istanbul",
      "website care plan",
      "clinic lead report",
      "klinik web sitesi bakım",
    ],
    openGraph: {
      title: t('title'),
      description,
      url: localeUrl(PAGE_PATH, locale),
      locale: ogLocale(locale),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t('title'),
      description,
    },
    alternates: pageAlternates(PAGE_PATH, locale),
  };
}

const WebsiteMaintenancePage = async () => {
  const t = await getTranslations('services');
  const inclusions = t.raw('websiteMaintenance.inclusions') as string[];

  // Entry plan (Site Care) drives the "from" price and the JSON-LD offer.
  const entryPlan = getCarePlan("careStandard");
  const fromPrice = formatPrice(entryPlan.price);
  const schemaPrice = String(entryPlan.price);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: t('websiteMaintenance.title'),
    description: t('websiteMaintenance.lead'),
    provider: { "@type": "Person", name: "Awab Design", url: "https://www.awab.design" },
    areaServed: "Worldwide",
    offers: {
      "@type": "Offer",
      price: schemaPrice,
      priceCurrency: "USD",
      priceSpecification: { "@type": "UnitPriceSpecification", price: schemaPrice, priceCurrency: "USD", unitText: "month" },
    },
  };

  return (
    <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    <main className="min-h-screen bg-background pt-32">
      <div className="container mx-auto px-4 py-16">
        <Link
          href="/services"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          {t('backToServices')}
        </Link>

        <div className="mb-16">
          <h1 className="mb-6 font-display text-5xl font-bold leading-tight tracking-tight md:text-6xl">
            {t('websiteMaintenance.heading')}
          </h1>
          <p className="lead mb-8 max-w-3xl text-2xl leading-relaxed text-muted-foreground md:text-3xl">
            {t('websiteMaintenance.lead')}
          </p>

          <div className="flex flex-wrap items-center gap-8">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <span className="text-xl font-semibold text-primary">
                {t('websiteMaintenance.pricing', { price: fromPrice })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span className="text-lg text-muted-foreground">{t('websiteMaintenance.deliveryTime')}</span>
            </div>
          </div>
        </div>

        <section className="mb-16 grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <h2 className="mb-8 font-display text-3xl font-bold">
              {t('whatsIncluded')}
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {inclusions.map((benefit: string) => (
                <div key={benefit} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 shrink-0 text-primary" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
          <StockPhoto
            slot="workspace"
            sizes="(min-width: 1024px) 46vw, 100vw"
            className="aspect-[16/10] lg:col-span-5 lg:aspect-[4/3]"
          />
        </section>

        <section className="mb-16">
          <h2 className="mb-8 font-display text-3xl font-bold">
            {t('websiteMaintenance.maintenancePlans')}
          </h2>
          <CarePlanCards />
        </section>

        {/* Ownership / transfer — no lock-in */}
        <section className="mb-16 grid items-center gap-8 rounded-2xl border-2 border-primary/30 bg-primary/5 p-5 md:p-6 lg:grid-cols-12 lg:gap-12">
          <StockPhoto
            slot="analytics"
            // 3:2 photo in a 16:10 frame: renders at about the frame width.
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="aspect-[16/10] lg:col-span-5"
          />
          <div className="px-3 pb-3 md:px-4 lg:col-span-7 lg:p-0">
            <h2 className="mb-3 font-display text-2xl font-bold md:text-3xl">
              {t('websiteMaintenance.transferTitle')}
            </h2>
            <p className="max-w-3xl leading-relaxed text-muted-foreground">
              {t('websiteMaintenance.transferText')}
            </p>
          </div>
        </section>

        <RelatedLinks items={["services", "pricing", "audit"]} className="mb-16" />

        <ClosingCard
          contained={false}
          heading={t('websiteMaintenance.ctaHeading')}
          text={t('websiteMaintenance.ctaDescription')}
          actions={
            <>
              <GlassPill href="/contact" tone="dark" arrow>
                {t('contactMe')}
              </GlassPill>
              <BookCallLink location="maintenance_cta" />
            </>
          }
        />
      </div>
    </main>
    </>
  );
};

export default WebsiteMaintenancePage;
