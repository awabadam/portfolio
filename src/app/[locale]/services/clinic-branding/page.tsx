import Image from "next/image";
import React from "react";
import { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { ArrowLeft, ArrowRight, ArrowUpRight, CheckCircle, ChevronDown, Clock, DollarSign } from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";
// 💰 Pricing source of truth: edit prices in src/lib/pricing.ts
// Name, timeframe and features come from the `packages` namespace, shared with
// the Brand Kit card on /pricing and /services.
import { brandKit, getBrandKitBundlePrice, formatPrice } from "@/lib/pricing";
import { GlassPill } from "@/components/ui/glass-pill";
import FAQSchema from "@/components/seo/FAQSchema";
import RelatedLinks from "@/components/seo/RelatedLinks";
import { ogLocale, pageAlternates, localeUrl } from "@/lib/seo";
import ClosingCard from "@/components/cta/ClosingCard";
import BookCallLink from "@/components/cta/BookCallLink";

const PAGE_PATH = "/services/clinic-branding";
const CONTACT_HREF = `/contact?plan=${brandKit.contactValue}`;

// OG image: ./opengraph-image.tsx
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata.clinicBranding");
  const locale = await getLocale();
  // The description quotes the Brand Kit price from pricing.ts.
  const description = t("description", { price: formatPrice(brandKit.price) });

  return {
    // Title already ends in "| Awab Design"; skip the root template.
    title: { absolute: t("title") },
    description,
    keywords: [
      "clinic branding",
      "clinic logo design",
      "dental clinic branding",
      "aesthetic clinic branding",
      "hair transplant clinic logo",
      "medical tourism branding",
      "clinic instagram templates",
      "klinik logo tasarımı",
      "klinik kurumsal kimlik",
    ],
    openGraph: {
      title: t("title"),
      description,
      url: localeUrl(PAGE_PATH, locale),
      locale: ogLocale(locale),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description,
    },
    alternates: pageAlternates(PAGE_PATH, locale),
  };
}

// Brand case studies at /projects/<id>. Names are the clients' own.
const brandProjects = [
  { id: "bespoke-clinic", key: "bespokeClinic", name: "Bespoke Clinics", year: 2022 },
  { id: "yasmina-beauty", key: "yasminaBeauty", name: "Yasmina Beauty", year: 2023 },
] as const;

const processSteps = [1, 2, 3, 4] as const;
const faqKeys = ["faq1", "faq2", "faq3", "faq4", "faq5"] as const;

const ClinicBrandingPage = async () => {
  const t = await getTranslations("services");
  const tPackages = await getTranslations("packages");
  const locale = await getLocale();

  const features = tPackages.raw(brandKit.featuresKey) as string[];
  const fromPrice = formatPrice(brandKit.price);
  const schemaPrice = String(brandKit.price);
  // Bundle copy (hero aside + FAQ) quotes the Growth System + Brand Kit price.
  const bundleValues = {
    bundlePrice: formatPrice(getBrandKitBundlePrice()),
    saving: formatPrice(brandKit.bundle.discount),
  };

  const faqItems = faqKeys.map((key) => ({
    question: t(`clinicBranding.${key}Q`),
    answer: t(`clinicBranding.${key}A`, bundleValues),
  }));

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: tPackages(brandKit.nameKey),
    serviceType: "Clinic branding",
    description: t("clinicBranding.lead"),
    inLanguage: locale,
    url: localeUrl(PAGE_PATH, locale),
    provider: {
      "@type": "Person",
      name: "Awab Elkhalil",
      url: "https://www.awab.design",
    },
    audience: {
      "@type": "BusinessAudience",
      audienceType: "Dental, aesthetic, hair transplant and medical tourism clinics",
    },
    areaServed: "Worldwide",
    offers: {
      "@type": "Offer",
      price: schemaPrice,
      priceCurrency: "USD",
      url: "https://www.awab.design/pricing",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: schemaPrice,
        priceCurrency: "USD",
        unitText: "project",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <FAQSchema items={faqItems} />
      <main className="min-h-screen bg-background pt-32">
        <div className="container px-5 py-16 md:px-8">
          <Link
            href="/services"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
            {t("backToServices")}
          </Link>

          {/* Hero */}
          <div className="mb-16">
            <p className="mb-5 font-mono text-label text-muted-foreground">{t("clinicBranding.eyebrow")}</p>
            <h1 className="mb-6 max-w-4xl font-display text-hero text-balance">
              {t("clinicBranding.heading")}
            </h1>
            <p className="mb-8 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              {t("clinicBranding.lead")}
            </p>

            <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-foreground" />
                <span className="text-lg font-medium">
                  {t("clinicBranding.pricing", { price: fromPrice })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span className="text-lg text-muted-foreground">{tPackages(brandKit.timeframeKey)}</span>
              </div>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
              <GlassPill href={CONTACT_HREF} tone="dark" arrow className="h-12 px-6 text-base">
                {t("clinicBranding.ctaPrimary")}
              </GlassPill>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground/60 transition-colors hover:text-foreground"
              >
                {t("clinicBranding.ctaSecondary")}
                <ArrowUpRight aria-hidden="true" className="h-4 w-4 rtl:-scale-x-100" />
              </Link>
            </div>
          </div>

          {/* Recent brand work: the two clinic brand case studies */}
          <section className="mb-20">
            <h2 className="mb-6 font-mono text-label text-muted-foreground">{t("clinicBranding.proofHeading")}</h2>
            <div className="grid gap-8 md:grid-cols-2 md:gap-6">
              {brandProjects.map(({ id, key, name, year }) => (
                <Link key={id} href={`/projects/${id}`} className="group flex h-full flex-col">
                  <div className="relative aspect-[16/9] overflow-hidden rounded-[10px] bg-neutral-900">
                    <Image
                      src={`/img/projects/${id}-thumbnail.webp`}
                      alt={t(`clinicBranding.proof.${key}`)}
                      fill
                      sizes="(min-width: 1312px) 614px, (min-width: 768px) 50vw, 100vw"
                      quality={85}
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    />
                  </div>
                  <p className="mt-5 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                    {name} · {year}
                  </p>
                  <h3 className="mt-3 flex-1 font-display text-xl leading-snug tracking-tight md:text-2xl">
                    {t(`clinicBranding.proof.${key}`)}
                  </h3>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-foreground/60 transition-colors group-hover:text-foreground">
                    {t("clinicBranding.proofLink")}
                    <ArrowUpRight aria-hidden="true" className="h-4 w-4 rtl:-scale-x-100" />
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* What's included, with the Growth System bundle beside it */}
          <section className="mb-20 grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7">
              <h2 className="mb-8 font-display text-heading">{t("whatsIncluded")}</h2>
              <div className="grid gap-5 md:grid-cols-2">
                {features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-foreground" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <aside className="self-start rounded-[10px] border border-border bg-card p-8 lg:col-span-5">
              <h3 className="font-display text-2xl leading-tight tracking-tight">
                {tPackages("brandKitBundleHeading")}
              </h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {tPackages("brandKitBundleText", bundleValues)}
              </p>
              <Link
                href={`/contact?plan=${brandKit.bundle.contactValue}`}
                className="mt-6 inline-flex min-h-11 items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline"
              >
                {tPackages("brandKitBundleCta")}
                <ArrowRight aria-hidden="true" className="h-4 w-4 rtl:rotate-180" />
              </Link>
            </aside>
          </section>

          {/* Process */}
          <section className="mb-20">
            <h2 className="mb-8 font-display text-heading">{t("processHeading")}</h2>
            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
              {processSteps.map((n) => (
                <div key={n} className="border-t border-border pt-5">
                  <span className="mb-3 block font-mono text-[11px] text-muted-foreground">0{n}</span>
                  <h3 className="mb-2 font-display text-2xl leading-tight tracking-tight">
                    {t(`clinicBranding.step${n}Title`)}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {t(`clinicBranding.step${n}Desc`)}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ (also emitted as FAQPage JSON-LD above) */}
          <section className="mb-20 grid gap-10 lg:grid-cols-12 lg:gap-14">
            <h2 className="font-display text-heading text-balance lg:col-span-4">
              {t("clinicBranding.faqHeading")}
            </h2>
            <div className="divide-y divide-border border-t border-border lg:col-span-8">
              {faqItems.map((item) => (
                <details key={item.question} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-start font-display text-lg leading-snug tracking-tight md:text-xl [&::-webkit-details-marker]:hidden">
                    <span>{item.question}</span>
                    <ChevronDown
                      aria-hidden="true"
                      className="mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
                    />
                  </summary>
                  <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">{item.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <RelatedLinks items={["services", "pricing", "caseStudies"]} className="mb-20" />

          {/* CTA */}
          <ClosingCard
            contained={false}
            heading={t("clinicBranding.ctaHeading")}
            text={t("clinicBranding.ctaDescription")}
            actions={
              <>
                <GlassPill href={CONTACT_HREF} tone="dark" arrow>
                  {t("clinicBranding.ctaPrimary")}
                </GlassPill>
                <BookCallLink location="clinic_branding_cta" />
              </>
            }
          />
        </div>
      </main>
    </>
  );
};

export default ClinicBrandingPage;
