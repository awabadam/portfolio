"use client";

import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Check, X, ChevronDown, ArrowRight, Sparkles, Zap, Crown } from "lucide-react";
import { useTranslations } from "next-intl";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/effects";
import FAQSchema from "@/components/seo/FAQSchema";

const starterFeatures = [
  "starterFeature1",
  "starterFeature2",
  "starterFeature3",
  "starterFeature4",
  "starterFeature5",
  "starterFeature6",
  "starterFeature7",
];

const businessFeatures = [
  "businessFeature1",
  "businessFeature2",
  "businessFeature3",
  "businessFeature4",
  "businessFeature5",
  "businessFeature6",
  "businessFeature7",
  "businessFeature8",
];

const premiumFeatures = [
  "premiumFeature1",
  "premiumFeature2",
  "premiumFeature3",
  "premiumFeature4",
  "premiumFeature5",
  "premiumFeature6",
  "premiumFeature7",
  "premiumFeature8",
  "premiumFeature9",
];

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

  return (
    <main className="min-h-screen bg-background pt-32">
      {/* Hero */}
      <section className="container mx-auto px-4 pb-16 text-center">
        <ScrollReveal animation="fadeUp">
          <p className="mb-4 font-mono text-sm uppercase tracking-widest text-muted-foreground">
            {t("heroEyebrow")}
          </p>
          <h1 className="mx-auto max-w-4xl font-display text-display-1 font-bold leading-none tracking-tighter">
            {t("heroHeading")}
          </h1>
        </ScrollReveal>
        <ScrollReveal animation="fadeUp" delay={0.1}>
          <p className="mx-auto mt-8 max-w-2xl text-xl leading-relaxed text-muted-foreground">
            {t("heroSubtitle")}
          </p>
        </ScrollReveal>
      </section>

      {/* Pricing Tiers */}
      <section className="container mx-auto px-4 py-16">
        <StaggerContainer className="grid gap-6 md:grid-cols-3" staggerDelay={0.1}>
          {/* Starter */}
          <StaggerItem animation="fadeUp">
            <div className="relative flex h-full flex-col rounded-2xl border-2 border-border bg-card p-8 transition-all duration-300 hover:border-primary/30 hover:shadow-lg">
              <div className="mb-4 text-primary">
                <Sparkles className="h-6 w-6" />
              </div>
              <h2 className="font-display text-2xl font-bold">{t("starterName")}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{t("starterTagline")}</p>
              <div className="mt-6 border-t border-border pt-6">
                <span className="font-display text-4xl font-bold">{t("starterPrice")}</span>
                <p className="mt-1 text-xs text-muted-foreground">{t("starterTimeframe")}</p>
              </div>
              <ul className="mt-6 flex-1 space-y-3">
                {starterFeatures.map((key) => (
                  <li key={key} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{t(key)}</span>
                  </li>
                ))}
              </ul>
              <Button asChild className="mt-8 rounded-full" size="lg" variant="outline">
                <Link href="/rate-calculator">
                  {t("tierCTA")}
                  <ArrowRight className="ml-2 rtl:ml-0 rtl:mr-2 rtl:rotate-180 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </StaggerItem>

          {/* Business (Popular) */}
          <StaggerItem animation="fadeUp">
            <div className="relative flex h-full flex-col rounded-2xl border-2 border-primary bg-primary/5 p-8 shadow-lg transition-all duration-300 hover:shadow-xl md:scale-105">
              <span className="absolute -top-3 right-6 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                {t("businessPopular")}
              </span>
              <div className="mb-4 text-primary">
                <Zap className="h-6 w-6" />
              </div>
              <h2 className="font-display text-2xl font-bold">{t("businessName")}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{t("businessTagline")}</p>
              <div className="mt-6 border-t border-border pt-6">
                <span className="font-display text-4xl font-bold text-primary">{t("businessPrice")}</span>
                <p className="mt-1 text-xs text-muted-foreground">{t("businessTimeframe")}</p>
              </div>
              <ul className="mt-6 flex-1 space-y-3">
                {businessFeatures.map((key) => (
                  <li key={key} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{t(key)}</span>
                  </li>
                ))}
              </ul>
              <Button asChild className="mt-8 rounded-full" size="lg">
                <Link href="/rate-calculator">
                  {t("tierCTA")}
                  <ArrowRight className="ml-2 rtl:ml-0 rtl:mr-2 rtl:rotate-180 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </StaggerItem>

          {/* Premium */}
          <StaggerItem animation="fadeUp">
            <div className="relative flex h-full flex-col rounded-2xl border-2 border-border bg-card p-8 transition-all duration-300 hover:border-primary/30 hover:shadow-lg">
              <div className="mb-4 text-primary">
                <Crown className="h-6 w-6" />
              </div>
              <h2 className="font-display text-2xl font-bold">{t("premiumName")}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{t("premiumTagline")}</p>
              <div className="mt-6 border-t border-border pt-6">
                <span className="font-display text-4xl font-bold">{t("premiumPrice")}</span>
                <p className="mt-1 text-xs text-muted-foreground">{t("premiumTimeframe")}</p>
              </div>
              <ul className="mt-6 flex-1 space-y-3">
                {premiumFeatures.map((key) => (
                  <li key={key} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{t(key)}</span>
                  </li>
                ))}
              </ul>
              <Button asChild className="mt-8 rounded-full" size="lg" variant="outline">
                <Link href="/rate-calculator">
                  {t("tierCTA")}
                  <ArrowRight className="ml-2 rtl:ml-0 rtl:mr-2 rtl:rotate-180 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </StaggerItem>
        </StaggerContainer>
      </section>

      {/* What's Included / Not Included Comparison */}
      <section className="border-t border-border py-24">
        <div className="container mx-auto px-4">
          <ScrollReveal animation="fadeUp">
            <h2 className="mb-2 text-center font-display text-3xl font-bold md:text-4xl">
              {t("comparisonHeading")}
            </h2>
            <p className="mb-12 text-center text-muted-foreground">
              {t("comparisonSubtitle")}
            </p>
          </ScrollReveal>

          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
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
                      <span>{t(key)}</span>
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
                    <li key={key} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <X className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{t(key)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Testimonial Placeholder */}
      <section className="border-t border-border py-24">
        <div className="container mx-auto px-4">
          <ScrollReveal animation="fadeUp">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-2 font-display text-3xl font-bold md:text-4xl">
                {t("testimonialHeading")}
              </h2>
              <p className="mb-8 text-muted-foreground">{t("testimonialSubtitle")}</p>
              <div className="rounded-2xl border border-dashed border-border bg-card/50 p-12">
                <p className="text-muted-foreground">{t("testimonialPlaceholder")}</p>
                <Button asChild variant="outline" className="mt-6 rounded-full">
                  <Link href="/projects">
                    {t("testimonialViewWork")}
                    <ArrowRight className="ml-2 rtl:ml-0 rtl:mr-2 rtl:rotate-180 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border py-24">
        <div className="container mx-auto px-4">
          <ScrollReveal animation="fadeUp">
            <h2 className="mb-2 text-center font-display text-3xl font-bold md:text-4xl">
              {t("faqHeading")}
            </h2>
            <p className="mb-12 text-center text-muted-foreground">{t("faqSubtitle")}</p>
          </ScrollReveal>
          <div className="mx-auto max-w-3xl divide-y divide-border">
            {faqKeys.map((key) => (
              <details key={key} className="group py-5">
                <summary className="flex cursor-pointer items-center justify-between text-lg font-medium">
                  <span>{t(`${key}Q`)}</span>
                  <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-muted-foreground">{t(`${key}A`)}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FAQPage JSON-LD */}
      <FAQSchema
        items={faqKeys.map((key) => ({
          question: t(`${key}Q`),
          answer: t(`${key}A`),
        }))}
      />

      {/* CTA */}
      <section className="border-t border-border py-24">
        <div className="container mx-auto px-4 text-center">
          <ScrollReveal animation="fadeUp">
            <h2 className="mb-4 font-display text-3xl font-bold md:text-4xl">
              {t("ctaHeading")}
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-lg text-muted-foreground">
              {t("ctaSubtitle")}
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="h-14 rounded-full px-8 text-base">
                <Link href="/rate-calculator">
                  {t("ctaPrimary")}
                  <ArrowRight className="ml-2 rtl:ml-0 rtl:mr-2 rtl:rotate-180 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-14 rounded-full px-8 text-base">
                <Link href="/contact">{t("ctaSecondary")}</Link>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
