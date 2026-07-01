import React from "react";
import { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, Clock, DollarSign } from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";
// 💰 Pricing source of truth: edit prices in src/lib/pricing.ts
import { carePlans, getPrice, formatPrice, FALLBACK_TRY_RATE } from "@/lib/pricing";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata.websiteMaintenance');
  const locale = await getLocale();
  const ogLocale = locale === 'ar' ? 'ar_SA' : locale === 'tr' ? 'tr_TR' : 'en_US';

  return {
    title: t('title'),
    description: t('description'),
    keywords: [
      "website maintenance Istanbul",
      "webdesign Istanbul maintenance",
      "website updates Istanbul",
      "Istanbul website support",
      "website security Istanbul",
      "website optimization Istanbul",
      "content management Istanbul",
      "SEO maintenance Istanbul",
    ],
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: "https://www.awab.design/services/website-maintenance",
      locale: ogLocale,
    },
    alternates: {
      canonical: "/services/website-maintenance",
      languages: { en: '/services/website-maintenance', ar: '/ar/services/website-maintenance', tr: '/tr/services/website-maintenance', fr: '/fr/services/website-maintenance' },
    },
  };
}

const WebsiteMaintenancePage = async () => {
  const t = await getTranslations('services');
  const tCalc = await getTranslations('rateCalculator');
  const locale = await getLocale();
  const inclusions = t.raw('websiteMaintenance.inclusions') as string[];
  const perMonth = t('websiteMaintenance.perMonth');

  // Care Plans sourced from lib/pricing.ts — one per site tier.
  const plans = carePlans.map((p) => ({
    id: p.id,
    name: t(`websiteMaintenance.${p.nameKey}`),
    price: formatPrice(getPrice(p.id, p.basePrice, locale), locale, FALLBACK_TRY_RATE) + perMonth,
    features: t.raw(`websiteMaintenance.${p.featuresKey}`) as string[],
    popular: !!p.popular,
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: t('websiteMaintenance.title'),
    description: t('websiteMaintenance.lead'),
    provider: { "@type": "Person", name: "Awab Design", url: "https://www.awab.design" },
    areaServed: "Worldwide",
    offers: {
      "@type": "Offer",
      price: "29",
      priceCurrency: "USD",
      priceSpecification: { "@type": "UnitPriceSpecification", price: "29", priceCurrency: "USD", unitText: "month" },
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
                {t('websiteMaintenance.pricing')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span className="text-lg text-muted-foreground">{t('websiteMaintenance.deliveryTime')}</span>
            </div>
          </div>
        </div>

        <section className="mb-16">
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
        </section>

        <section className="mb-16">
          <h2 className="mb-8 font-display text-3xl font-bold">
            {t('websiteMaintenance.maintenancePlans')}
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-2xl border-2 p-8 ${
                  plan.popular ? "border-primary bg-primary/5" : "border-border bg-card"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 right-6 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                    {tCalc('popular')}
                  </span>
                )}
                <h3 className="mb-2 font-display text-2xl font-bold">{plan.name}</h3>
                <p className="mb-6 text-2xl font-semibold text-primary">{plan.price}</p>
                <ul className="space-y-3">
                  {plan.features.map((feature: string) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 shrink-0 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Ownership / transfer — no lock-in */}
        <section className="mb-16 rounded-2xl border-2 border-primary/30 bg-primary/5 p-8 md:p-10">
          <h2 className="mb-3 font-display text-2xl font-bold md:text-3xl">
            {t('websiteMaintenance.transferTitle')}
          </h2>
          <p className="max-w-3xl leading-relaxed text-muted-foreground">
            {t('websiteMaintenance.transferText')}
          </p>
        </section>

        <section className="rounded-2xl border border-border bg-muted/30 p-12 text-center">
          <h2 className="mb-4 font-display text-3xl font-bold">
            {t('websiteMaintenance.ctaHeading')}
          </h2>
          <p className="mb-8 text-muted-foreground">
            {t('websiteMaintenance.ctaDescription')}
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="h-14 px-8 text-lg">
              <Link href="/contact">{t('contactMe')}</Link>
            </Button>
          </div>
        </section>
      </div>
    </main>
    </>
  );
};

export default WebsiteMaintenancePage;
