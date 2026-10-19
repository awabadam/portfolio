"use client";

import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Check, X, ChevronDown, ArrowRight } from "lucide-react";
import { GlassPill } from "@/components/ui/glass-pill";
import { testimonials } from "@/data/testimonials";
import { useTranslations } from "next-intl";
import { ScrollReveal } from "@/components/effects";
import FAQSchema from "@/components/seo/FAQSchema";
import RelatedLinks from "@/components/seo/RelatedLinks";
import StockPhoto from "@/components/ui/stock-photo";
// 💰 Pricing source of truth: edit prices in src/lib/pricing.ts
// Package + plan cards are shared with /services and
// /services/website-maintenance (names, features and prices come from
// lib/pricing + the `packages` namespace).
import PackageCards from "@/components/pricing/PackageCards";
import CarePlanCards from "@/components/pricing/CarePlanCards";
import { getCarePlan, formatPrice, includedCareMonths } from "@/lib/pricing";
import ClosingCard from "@/components/cta/ClosingCard";
import BookCallLink from "@/components/cta/BookCallLink";

const includedItems = [
  "included1",
  "included2",
  "included3",
  "included4",
  "included5",
  "included6",
  "included7",
  "included8",
];

const notIncludedItems = [
  "notIncluded1",
  "notIncluded2",
  "notIncluded3",
  "notIncluded4",
  "notIncluded5",
  "notIncluded6",
];

const faqKeys = ["faq1", "faq2", "faq3", "faq4", "faq5", "faq6", "faq7"];

export default function PricingPage() {
  const t = useTranslations("pricing");
  // One real client quote, shown full width. Add more to data/testimonials.ts
  // and this becomes a list.
  const quote = testimonials[0];
  // Copy that quotes the entry monthly price ("Site Care from {carePrice}/mo")
  const siteCare = getCarePlan("careStandard");
  const priceValues = {
    carePrice: formatPrice(siteCare.price),
  };

  return (
    <main className="min-h-screen bg-background pt-32">
      {/* Hero */}
      <section className="container mx-auto grid items-end gap-10 px-5 pb-12 md:px-8 md:pb-16 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-7">
          <ScrollReveal animation="fadeUp">
            <p className="mb-5 font-mono text-label text-muted-foreground">
              {t("heroEyebrow")}
            </p>
            <h1 className="max-w-4xl font-display text-hero text-balance">
              {t("heroHeading")}
            </h1>
          </ScrollReveal>
          <ScrollReveal animation="fadeUp" delay={0.1}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              {t("heroSubtitle")}
            </p>
          </ScrollReveal>
        </div>
        <ScrollReveal animation="fade" delay={0.15} className="lg:col-span-5">
          <StockPhoto
            slot="analytics-alt"
            priority
            // 3:2 photo in a 4:3 frame renders ~1.13x the frame width.
            sizes="(min-width: 1024px) 40vw, 113vw"
            className="aspect-[4/3]"
            imageClassName="object-[50%_55%]"
          />
        </ScrollReveal>
      </section>

      {/* Packages — sourced from lib/pricing.ts */}
      <section className="container mx-auto px-5 py-16 md:px-8">
        <PackageCards headingLevel="h2" />
      </section>

      {/* Monthly plans — sourced from lib/pricing.ts */}
      <section className="border-t border-border py-20 md:py-28">
        <div className="container mx-auto px-5 md:px-8">
          <ScrollReveal animation="fadeUp" className="mb-10 md:mb-12">
            <h2 className="max-w-3xl font-display text-heading text-balance">{t("plansHeading")}</h2>
            <p className="mt-4 max-w-xl text-lg text-muted-foreground">{t("plansSubtitle", { months: includedCareMonths })}</p>
          </ScrollReveal>
          <CarePlanCards />
        </div>
      </section>

      {/* What's Included / Not Included Comparison */}
      <section className="border-t border-border py-20 md:py-28">
        <div className="container mx-auto px-5 md:px-8">
          <ScrollReveal animation="fadeUp" className="mb-10 md:mb-12">
            <h2 className="max-w-3xl font-display text-heading text-balance">{t("comparisonHeading")}</h2>
            <p className="mt-4 max-w-xl text-lg text-muted-foreground">{t("comparisonSubtitle")}</p>
          </ScrollReveal>

          <div className="grid gap-5 md:grid-cols-2">
            <ScrollReveal animation="fadeUp">
              <div className="rounded-2xl border border-border bg-card p-8">
                <h3 className="mb-6 flex items-center gap-2 font-display text-xl font-bold text-primary">
                  <Check className="h-5 w-5" />
                  {t("includedHeading")}
                </h3>
                <ul className="space-y-3">
                  {includedItems.map((key) => (
                    <li key={key} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{t(key, priceValues)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fadeUp" delay={0.1}>
              <div className="rounded-2xl border border-border bg-card p-8">
                <h3 className="mb-6 flex items-center gap-2 font-display text-xl font-bold text-muted-foreground">
                  <X className="h-5 w-5" />
                  {t("notIncludedHeading")}
                </h3>
                <ul className="space-y-3">
                  {notIncludedItems.map((key) => (
                    <li
                      key={key}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <X className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{t(key, priceValues)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          </div>

        </div>
      </section>

      {/* Testimonial: a single real quote, centred, no star rating (no rating source) */}
      {quote && (
        <section className="border-t border-border py-24">
          <div className="container mx-auto grid items-center gap-10 px-5 md:px-8 lg:grid-cols-12 lg:gap-14">
            {/* The quoted client's live site (real work, not stock) */}
            <ScrollReveal animation="fade" className="lg:col-span-5">
              <Link href="/projects/saphiredent" className="group block">
                <div className="relative aspect-[16/10] overflow-hidden rounded-[10px] bg-neutral-900">
                  <Image
                    src="/img/projects/saphiredent/home.webp"
                    alt={`${quote.company} website`}
                    fill
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    quality={85}
                    className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                </div>
              </Link>
            </ScrollReveal>
            <ScrollReveal animation="fadeUp" className="lg:col-span-7">
              <p className="mb-6 font-mono text-label text-muted-foreground">
                {t("testimonialHeading")}
              </p>
              <figure>
                <blockquote
                  className="font-display text-2xl leading-snug text-foreground md:text-3xl"
                  lang="en"
                  dir="ltr"
                >
                  &ldquo;{quote.content}&rdquo;
                </blockquote>
                <figcaption className="mt-6 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{quote.name}</span>, {quote.role}, {quote.company}
                </figcaption>
              </figure>
              <div className="mt-8">
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
                >
                  {t("testimonialViewWork")}
                  <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="border-t border-border py-20 md:py-28">
        <div className="container mx-auto px-5 md:px-8">
          <ScrollReveal animation="fadeUp" className="mb-10 md:mb-12">
            <h2 className="max-w-3xl font-display text-heading text-balance">{t("faqHeading")}</h2>
            <p className="mt-4 max-w-xl text-lg text-muted-foreground">{t("faqSubtitle")}</p>
          </ScrollReveal>
          <div className="max-w-3xl divide-y divide-border">
            {faqKeys.map((key) => (
              <details key={key} className="group py-5">
                <summary className="flex cursor-pointer items-center justify-between text-lg font-medium">
                  <span>{t(`${key}Q`)}</span>
                  <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-muted-foreground">{t(`${key}A`, priceValues)}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FAQPage JSON-LD */}
      <FAQSchema
        items={faqKeys.map((key) => ({
          question: t(`${key}Q`),
          answer: t(`${key}A`, priceValues),
        }))}
      />

      {/* Internal links: what is included, free check, proof */}
      <div className="container mx-auto px-5 pb-20 md:px-8">
        <RelatedLinks items={["services", "audit", "caseStudies"]} />
      </div>

      {/* CTA: dark closing band, same voice as the home "Work with me" section */}
      <ClosingCard
        className="pt-0 md:pt-0"
        heading={t("ctaHeading")}
        text={t("ctaSubtitle")}
        actions={
          <>
            <GlassPill href="/contact" tone="dark" arrow>
              {t("ctaPrimary")}
            </GlassPill>
            <BookCallLink location="pricing_cta" />
          </>
        }
      />
    </main>
  );
}
