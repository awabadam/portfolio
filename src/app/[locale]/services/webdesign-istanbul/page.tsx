import Image from "next/image";
import React from "react";
import { Metadata } from "next";
import { Link } from "@/i18n/routing";
import { ArrowLeft, ArrowUpRight, CheckCircle, Clock, DollarSign } from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";
// 💰 Pricing source of truth: edit prices in src/lib/pricing.ts
import { getTier, getCarePlan, formatPrice } from "@/lib/pricing";
import StockPhoto from "@/components/ui/stock-photo";
import { GlassPill } from "@/components/ui/glass-pill";
import RelatedLinks from "@/components/seo/RelatedLinks";
import { ogLocale, pageAlternates, localeUrl } from "@/lib/seo";
import ClosingCard from "@/components/cta/ClosingCard";
import BookCallLink from "@/components/cta/BookCallLink";

const PAGE_PATH = "/services/webdesign-istanbul";

// OG image: ./opengraph-image.tsx
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata.webdesign");
  const locale = await getLocale();
  // The description quotes the entry package price from pricing.ts.
  const description = t("description", { clinicPrice: formatPrice(getTier("business").price) });

  return {
    // Title already ends in "| Awab Design"; skip the root template.
    title: { absolute: t("title") },
    description,
    keywords: [
      "web design istanbul",
      "webdesign istanbul",
      "clinic website design istanbul",
      "dental clinic website istanbul",
      "aesthetic clinic website istanbul",
      "hair transplant clinic website",
      "medical tourism website turkey",
      "web tasarım istanbul",
      "klinik web sitesi tasarımı istanbul",
      "sağlık turizmi web sitesi",
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

// FAQ copy is English-only (also emitted as FAQPage JSON-LD); prices come from
// lib/pricing.ts (USD in every locale).
const clinicTier = getTier("business");
const growthTier = getTier("custom");
const siteCarePlan = getCarePlan("careStandard");

const faqItems = [
  {
    question: "How much does a clinic website cost in Istanbul?",
    answer: `The Clinic Website starts at ${formatPrice(clinicTier.price)}: up to 3 languages, a page for each treatment, WhatsApp on every page, lead tracking and medical SEO. The Clinic Growth System starts at ${formatPrice(growthTier.price)} and adds 6 or more languages, an admin panel, an AI patient assistant, CRM handoff and Google Ads offline conversions. Both are fixed prices in US dollars with no hourly billing.`,
  },
  {
    question: "How long does it take to build a clinic website?",
    answer:
      "A Clinic Website takes 3-4 weeks and a Clinic Growth System 6-8 weeks, depending on how many treatments and languages you need. You see the first designs in the first week.",
  },
  {
    question: "Which languages can the site be in?",
    answer:
      "Any language your patients speak. Istanbul clinics usually start with English, Turkish and Arabic, then add Russian, German or French. Arabic gets a true right-to-left layout, not a mirrored English page. Saphiredent, a dental clinic in Istanbul, runs in nine languages on this setup.",
  },
  {
    question: "Do you only work with clinics?",
    answer:
      "Yes. Dental, aesthetic, hair transplant and medical tourism clinics that treat patients from abroad. Working in one niche means each project starts from what already worked for the last clinic, not from a blank page.",
  },
  {
    question: "What is different from an Istanbul web agency?",
    answer:
      "One person designs, builds and supports the site, and that is the person you talk to. Every WhatsApp click, form and call is tracked, inquiries are saved with the patient's country and passed to your CRM, and the code, domain and hosting are in your clinic's name. Prices are published, not quoted on request.",
  },
  {
    question: "Why Next.js instead of WordPress for a clinic site?",
    answer:
      "A clinic site has to open fast on a phone in another country, read properly in Arabic and keep working without plugin updates. A site built with Next.js does that without page builders, translation plugins or a WordPress login that attackers target.",
  },
  {
    question: "Is SEO included?",
    answer:
      "Yes. Every clinic site includes a page per treatment with the right structure, medical schema for treatments and doctors, hreflang for each language, a sitemap and Google Search Console setup. Ongoing content and landing pages for new treatments are part of the Growth Retainer.",
  },
  {
    question: "Do you work with clinics outside Istanbul?",
    answer:
      "Yes. Everything happens over WhatsApp, email and video calls, and most clients I met online first. Clinics across Turkey and abroad use the same process.",
  },
  {
    question: "What happens after launch?",
    answer: `Site Care costs ${formatPrice(siteCarePlan.price)}/month and covers hosting, domain, SSL, security updates and small content changes. The Growth Retainer adds a monthly lead report by country and source and keeps your Google Ads conversion tracking working. You own everything and can transfer it at any time.`,
  },
  {
    question: "Can I see clinic websites you have built?",
    answer:
      "Yes. The services page shows three Istanbul clinic case studies: Saphiredent (dental, nine languages, CRM and Google Ads integration), Jouvence (aesthetics, English, French and Arabic) and EsteExpert (medical tourism, four languages). Each case study explains what was built and why.",
  },
];

type CompareRow = { feature: string; us: string; wp: string };

const WebdesignIstanbulPage = async () => {
  const t = await getTranslations("services");
  const inclusions = t.raw("webdesign.inclusions") as string[];
  const compareRows = t.raw("webdesign.compareRows") as CompareRow[];
  const fromPrice = formatPrice(clinicTier.price);
  const schemaPrice = String(clinicTier.price);

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: t("webdesign.title"),
    serviceType: "Medical Clinic Website Design",
    description: t("webdesign.lead"),
    url: "https://www.awab.design/services/webdesign-istanbul",
    provider: {
      "@type": "Person",
      name: "Awab Elkhalil",
      url: "https://www.awab.design",
    },
    audience: {
      "@type": "BusinessAudience",
      audienceType: "Dental, aesthetic, hair transplant and medical tourism clinics",
    },
    areaServed: [
      { "@type": "City", name: "Istanbul" },
      { "@type": "AdministrativeArea", name: "Besiktas, Istanbul" },
      { "@type": "AdministrativeArea", name: "Kadikoy, Istanbul" },
      { "@type": "AdministrativeArea", name: "Sisli, Istanbul" },
      { "@type": "AdministrativeArea", name: "Atasehir, Istanbul" },
      { "@type": "AdministrativeArea", name: "Bakirkoy, Istanbul" },
      { "@type": "AdministrativeArea", name: "Beyoglu, Istanbul" },
      { "@type": "AdministrativeArea", name: "Uskudar, Istanbul" },
      { "@type": "AdministrativeArea", name: "Maslak, Istanbul" },
      { "@type": "Country", name: "Turkey" },
    ],
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

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
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
            <p className="mb-5 font-mono text-label text-muted-foreground">{t("webdesign.eyebrow")}</p>
            <h1 className="mb-6 max-w-4xl font-display text-hero text-balance">
              {t("webdesign.heading")}
            </h1>
            <p className="mb-8 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              {t("webdesign.lead")}
            </p>

            <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-foreground" />
                <span className="text-lg font-medium">
                  {t("webdesign.pricing", { price: fromPrice })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span className="text-lg text-muted-foreground">{t("webdesign.deliveryTime")}</span>
              </div>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
              <GlassPill href="/audit" tone="dark" arrow className="h-12 px-6 text-base">
                {t("webdesign.ctaPrimary")}
              </GlassPill>
              <Link
                href="/services"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground/60 transition-colors hover:text-foreground"
              >
                {t("webdesign.ctaSecondary")}
                <ArrowUpRight aria-hidden="true" className="h-4 w-4 rtl:-scale-x-100" />
              </Link>
            </div>
          </div>

          <StockPhoto
            slot="istanbul-bosphorus-alt"
            priority
            sizes="(min-width: 1312px) 1248px, 100vw"
            className="mb-16 aspect-[16/10] md:aspect-[21/9]"
            imageClassName="object-[50%_60%]"
          />

          {/* What's Included */}
          <section className="mb-20 grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7">
              <h2 className="mb-8 font-display text-heading">{t("whatsIncluded")}</h2>
              <div className="grid gap-5 md:grid-cols-2">
                {inclusions.map((benefit: string) => (
                  <div key={benefit} className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-foreground" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <StockPhoto
              slot="istanbul-street"
              sizes="(min-width: 1024px) 35vw, 100vw"
              className="hidden aspect-[4/5] lg:col-span-4 lg:col-start-9 lg:block"
            />
          </section>

          {/* Next.js vs WordPress, framed for clinic sites */}
          <section className="mb-20">
            <div className="mb-8 max-w-2xl">
              <h2 className="mb-4 font-display text-heading text-balance">{t("webdesign.compareHeading")}</h2>
              <p className="text-muted-foreground">{t("webdesign.compareIntro")}</p>
            </div>
            <div className="overflow-x-auto rounded-[10px] border border-border">
              <table className="w-full min-w-[560px] text-start">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th scope="col" className="px-4 py-4 text-start font-mono text-[11px] font-medium uppercase tracking-wide text-muted-foreground md:px-6">
                      {t("webdesign.compareFeature")}
                    </th>
                    <th scope="col" className="px-4 py-4 text-start font-mono text-[11px] font-medium uppercase tracking-wide text-foreground md:px-6">
                      {t("webdesign.compareUs")}
                    </th>
                    <th scope="col" className="px-4 py-4 text-start font-mono text-[11px] font-medium uppercase tracking-wide text-muted-foreground md:px-6">
                      {t("webdesign.compareWp")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {compareRows.map((row) => (
                    <tr key={row.feature}>
                      <th scope="row" className="px-4 py-4 text-start align-top text-sm font-medium md:px-6">
                        {row.feature}
                      </th>
                      <td className="px-4 py-4 align-top text-sm md:px-6">{row.us}</td>
                      <td className="px-4 py-4 align-top text-sm text-muted-foreground md:px-6">{row.wp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Real client build: the same Next.js site in English and right-to-left Arabic */}
            <Link href="/projects/saphiredent" className="group mt-8 grid gap-5 sm:grid-cols-2">
              {(["home", "rtl"] as const).map((shot) => (
                <div key={shot} className="relative aspect-[16/10] overflow-hidden rounded-[10px] bg-neutral-900">
                  <Image
                    src={`/img/projects/saphiredent/${shot}.webp`}
                    alt={shot === "home" ? "Saphiredent clinic website, English home page" : "Saphiredent clinic website in Arabic, right-to-left layout"}
                    fill
                    sizes="(min-width: 1312px) 614px, (min-width: 640px) 50vw, 100vw"
                    quality={85}
                    className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                  />
                </div>
              ))}
            </Link>
          </section>

          {/* Process */}
          <section className="mb-20">
            <h2 className="mb-8 font-display text-heading">{t("ourProcess")}</h2>
            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="border-t border-border pt-5">
                  <span className="mb-3 block font-mono text-[11px] text-muted-foreground">
                    {t(`webdesign.phase${n}Step`)}
                  </span>
                  <h3 className="mb-2 font-display text-2xl leading-tight tracking-tight">
                    {t(`webdesign.phase${n}Title`)}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {t(`webdesign.phase${n}Desc`)}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ (English, also emitted as FAQPage JSON-LD) */}
          <section className="mb-20">
            <h2 className="mb-8 font-display text-heading">{t("webdesign.faqHeading")}</h2>
            <div className="divide-y divide-border border-t border-border">
              {faqItems.map((item) => (
                <div key={item.question} className="py-6">
                  <h3 className="mb-3 font-display text-xl leading-snug tracking-tight">{item.question}</h3>
                  <p className="max-w-3xl leading-relaxed text-muted-foreground">{item.answer}</p>
                </div>
              ))}
            </div>
          </section>

          <RelatedLinks items={["pricing", "audit", "caseStudies"]} className="mb-20" />

          {/* CTA */}
          <ClosingCard
            contained={false}
            heading={t("webdesign.ctaHeading")}
            text={t("webdesign.ctaDescription")}
            actions={
              <>
                <GlassPill href="/audit" tone="dark" arrow>
                  {t("webdesign.ctaPrimary")}
                </GlassPill>
                <BookCallLink location="webdesign_cta" />
                <Link
                  href="/contact"
                  className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {t("contactMe")}
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4 rtl:-scale-x-100" />
                </Link>
              </>
            }
          />
        </div>
      </main>
    </>
  );
};

export default WebdesignIstanbulPage;
