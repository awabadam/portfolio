"use client";

import { useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import {
  Check,
  X,
  ChevronDown,
  ArrowRight,
  Globe,
  Code,
  Layout,
  Zap,
  Mail,
  Bot,
  Calculator,
  Quote,
  Star,
} from "lucide-react";
import { testimonials } from "@/data/testimonials";
import { useTranslations, useLocale } from "next-intl";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/effects";
import FAQSchema from "@/components/seo/FAQSchema";
// 💰 Pricing source of truth: edit prices in src/lib/pricing.ts
// This page only defines feature lists + icons; all prices and tier
// names/descriptions come from lib/pricing + the rateCalculator namespace.
import {
  projectTiers,
  addOns,
  getPrice,
  formatPrice,
  FALLBACK_TRY_RATE,
  getIncludedAddOns,
} from "@/lib/pricing";

// Feature list keys per tier id — defined in the `pricing` translation namespace
const tierFeatureKeys: Record<string, string[]> = {
  landing: [
    "landingFeature1",
    "landingFeature2",
    "landingFeature3",
    "landingFeature4",
    "landingFeature5",
    "landingFeature6",
  ],
  business: [
    "businessFeature1",
    "businessFeature2",
    "businessFeature3",
    "businessFeature4",
    "businessFeature5",
    "businessFeature6",
    "businessFeature7",
  ],
  custom: [
    "customFeature1",
    "customFeature2",
    "customFeature3",
    "customFeature4",
    "customFeature5",
    "customFeature6",
    "customFeature7",
    "customFeature8",
  ],
};

// Icons for the 3 project tiers (keyed by pricing.ts tier id)
const tierIcons: Record<string, React.ReactNode> = {
  landing: <Globe className="h-6 w-6" />,
  business: <Code className="h-6 w-6" />,
  custom: <Layout className="h-6 w-6" />,
};

// Icons for add-ons (keyed by pricing.ts add-on id)
const addOnIcons: Record<string, React.ReactNode> = {
  seo: <Zap className="h-5 w-5" />,
  blog: <Mail className="h-5 w-5" />,
  cms: <Code className="h-5 w-5" />,
  chatbot: <Bot className="h-5 w-5" />,
  multilang: <Globe className="h-5 w-5" />,
};

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
  const tCalc = useTranslations("rateCalculator");
  const locale = useLocale();
  const [tryRate, setTryRate] = useState(FALLBACK_TRY_RATE);

  useEffect(() => {
    if (locale === "tr") {
      fetch("/api/exchange-rate")
        .then((r) => r.json())
        .then((d) => {
          if (d.rate) setTryRate(d.rate);
        })
        .catch(() => {});
    }
  }, [locale]);

  return (
    <main className="min-h-screen bg-background pt-32">
      {/* Hero */}
      <section className="container mx-auto px-4 pb-16 text-center">
        <ScrollReveal animation="blurUp">
          <p className="mb-4 font-mono text-sm uppercase tracking-widest text-muted-foreground">
            {t("heroEyebrow")}
          </p>
          <h1 className="mx-auto max-w-4xl font-display text-display-1 font-bold leading-none tracking-tighter">
            {t("heroHeading")}
          </h1>
        </ScrollReveal>
        <ScrollReveal animation="blurUp" delay={0.1}>
          <p className="mx-auto mt-8 max-w-2xl text-xl leading-relaxed text-muted-foreground">
            {t("heroSubtitle")}
          </p>
        </ScrollReveal>
      </section>

      {/* Pricing Tiers — sourced from lib/pricing.ts */}
      <section className="container mx-auto px-4 py-16">
        <StaggerContainer className="grid gap-6 md:grid-cols-3" staggerDelay={0.1}>
          {/* Only the three website tiers have feature lists here; app is shown as a callout below. */}
          {projectTiers.filter((tier) => tierFeatureKeys[tier.id]).map((tier) => {
            const price = getPrice(tier.id, tier.basePrice, locale);
            const featureKeys = tierFeatureKeys[tier.id] ?? [];
            const timeframeKey = `${tier.id}Timeframe`;
            return (
              <StaggerItem key={tier.id} animation="fadeUp">
                <div
                  className={`relative flex h-full flex-col rounded-2xl border-2 p-8 transition-all duration-300 hover:shadow-lg ${
                    tier.popular
                      ? "border-primary bg-primary/5 shadow-lg md:scale-105"
                      : "border-border bg-card hover:border-primary/30"
                  }`}
                >
                  {tier.popular && (
                    <span className="absolute -top-3 right-6 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                      {tCalc("popular")}
                    </span>
                  )}
                  <div className="mb-4 text-primary">{tierIcons[tier.id]}</div>
                  <h2 className="font-display text-2xl font-bold">{tCalc(tier.nameKey)}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{tCalc(tier.descKey)}</p>
                  <div className="mt-6 border-t border-border pt-6">
                    <span
                      className={`font-display text-4xl font-bold ${
                        tier.popular ? "text-primary" : ""
                      }`}
                    >
                      {formatPrice(price, locale, tryRate)}
                      {t("tierPriceSuffix")}
                    </span>
                    <p className="mt-1 text-xs text-muted-foreground">{t(timeframeKey)}</p>
                  </div>
                  <ul className="mt-6 flex-1 space-y-3">
                    {featureKeys.map((key) => (
                      <li key={key} className="flex items-start gap-2 text-sm">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>{t(key)}</span>
                      </li>
                    ))}
                    {getIncludedAddOns(tier.id).map((addOn) => (
                      <li key={addOn.id} className="flex items-start gap-2 text-sm">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>
                          <span className="font-medium">{tCalc(addOn.nameKey)}</span>
                          <span className="text-muted-foreground">
                            {" — "}
                            {tCalc("valuedAt", {
                              value: formatPrice(getPrice(addOn.id, addOn.price, locale), locale, tryRate),
                            })}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    className="mt-8 rounded-full"
                    size="lg"
                    variant={tier.popular ? "default" : "outline"}
                  >
                    <Link href="/contact">
                      {t("tierCTA")}
                      <ArrowRight className="ml-2 rtl:ml-0 rtl:mr-2 rtl:rotate-180 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        {/* App development callout — app tier lives on its own service page */}
        <ScrollReveal animation="fadeUp" delay={0.1}>
          <div className="mx-auto mt-8 flex max-w-3xl flex-col items-center justify-between gap-4 rounded-2xl border border-border bg-card px-8 py-6 text-center sm:flex-row sm:text-left rtl:sm:text-right">
            <p className="text-base text-muted-foreground">
              {t("appCalloutText", {
                price: formatPrice(getPrice("app", 3500, locale), locale, tryRate),
              })}
            </p>
            <Button asChild variant="outline" className="shrink-0 rounded-full">
              <Link href="/services/app-development">
                {t("appCalloutCta")}
                <ArrowRight className="ml-2 rtl:ml-0 rtl:mr-2 rtl:rotate-180 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </ScrollReveal>
      </section>

      {/* Add-ons — sourced from lib/pricing.ts */}
      <section className="border-t border-border py-24">
        <div className="container mx-auto px-4">
          <ScrollReveal animation="fadeUp">
            <h2 className="mb-2 text-center font-display text-3xl font-bold md:text-4xl">
              {t("addOnsHeading")}
            </h2>
            <p className="mb-12 text-center text-muted-foreground">
              {t("addOnsSubtitle")}
            </p>
          </ScrollReveal>

          <StaggerContainer
            className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3"
            staggerDelay={0.05}
          >
            {addOns.map((addOn) => {
              const price = getPrice(addOn.id, addOn.price, locale);
              return (
                <StaggerItem key={addOn.id} animation="fadeUp">
                  <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-md">
                    <div className="text-primary">{addOnIcons[addOn.id]}</div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold">{tCalc(addOn.nameKey)}</div>
                      <div className="text-sm text-primary">
                        +{formatPrice(price, locale, tryRate)}
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>

          <ScrollReveal animation="fadeUp" delay={0.2} className="mt-10 text-center">
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/contact">
                <Calculator className="mr-2 rtl:ml-2 rtl:mr-0 h-4 w-4" />
                {t("addOnsCalculatorCTA")}
              </Link>
            </Button>
          </ScrollReveal>
        </div>
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
                    <li
                      key={key}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
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

      {/* Testimonials — real client quotes */}
      <section className="border-t border-border py-24">
        <div className="container mx-auto px-4">
          <ScrollReveal animation="fadeUp">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <h2 className="mb-2 font-display text-3xl font-bold md:text-4xl">
                {t("testimonialHeading")}
              </h2>
              <p className="text-muted-foreground">{t("testimonialSubtitle")}</p>
            </div>
          </ScrollReveal>
          <StaggerContainer className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3" staggerDelay={0.1}>
            {testimonials.slice(0, 3).map((testimonial) => (
              <StaggerItem key={testimonial.id} animation="fadeUp">
                <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6">
                  <Quote className="h-7 w-7 text-primary/30" />
                  <div className="mt-3 flex gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>
                  <div className="mt-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {testimonial.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.role}, {testimonial.company}</p>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
          <ScrollReveal animation="fadeUp" delay={0.2} className="mt-10 text-center">
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/projects">
                {t("testimonialViewWork")}
                <ArrowRight className="ml-2 rtl:ml-0 rtl:mr-2 rtl:rotate-180 h-4 w-4" />
              </Link>
            </Button>
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
                <Link href="/contact">
                  {t("ctaPrimary")}
                  <ArrowRight className="ml-2 rtl:ml-0 rtl:mr-2 rtl:rotate-180 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-14 rounded-full px-8 text-base"
              >
                <Link href="/contact">{t("ctaSecondary")}</Link>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
