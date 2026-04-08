"use client";

import { useState, useEffect } from "react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import {
  Layout, Palette, Search, FileText, Code, Bot,
  Globe, Brush, Shield, Server, ArrowRight, ChevronDown,
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/effects";
import { projectTiers, getPrice, formatPrice, FALLBACK_TRY_RATE } from "@/lib/pricing";

const processSteps = [
  { num: "01", key: "process1" },
  { num: "02", key: "process2" },
  { num: "03", key: "process3" },
  { num: "04", key: "process4" },
];

const capabilities = [
  { key: "capWebDesign", icon: <Layout className="h-5 w-5" /> },
  { key: "capUiUx", icon: <Palette className="h-5 w-5" /> },
  { key: "capSeo", icon: <Search className="h-5 w-5" /> },
  { key: "capBlog", icon: <FileText className="h-5 w-5" /> },
  { key: "capCms", icon: <Code className="h-5 w-5" /> },
  { key: "capChatbot", icon: <Bot className="h-5 w-5" /> },
  { key: "capMultilang", icon: <Globe className="h-5 w-5" /> },
  { key: "capBrand", icon: <Brush className="h-5 w-5" /> },
  { key: "capDomain", icon: <Shield className="h-5 w-5" /> },
  { key: "capHosting", icon: <Server className="h-5 w-5" /> },
];

const faqKeys = ["faq1", "faq2", "faq3", "faq4", "faq5", "faq6", "faq7", "faq8"];

const tierIcons = [
  <Globe key="landing" className="h-6 w-6" />,
  <Code key="business" className="h-6 w-6" />,
  <Layout key="custom" className="h-6 w-6" />,
];

export default function ServicesPage() {
  const t = useTranslations("services");
  const tCalc = useTranslations("rateCalculator");
  const locale = useLocale();
  const [tryRate, setTryRate] = useState(FALLBACK_TRY_RATE);

  useEffect(() => {
    if (locale === "tr") {
      fetch("/api/exchange-rate")
        .then((r) => r.json())
        .then((d) => { if (d.rate) setTryRate(d.rate); })
        .catch(() => {});
    }
  }, [locale]);

  return (
    <main className="min-h-screen bg-background pt-32">
      {/* Hero */}
      <section className="container mx-auto px-4 pb-24">
        <ScrollReveal animation="fadeUp">
          <h1 className="font-display text-display-1 font-bold leading-none tracking-tighter">
            {t("heading")}
          </h1>
        </ScrollReveal>
        <ScrollReveal animation="fadeUp" delay={0.1}>
          <p className="mt-8 max-w-2xl text-xl leading-relaxed text-muted-foreground">
            {t("description")}
          </p>
        </ScrollReveal>
      </section>

      {/* Process */}
      <section className="border-t border-border py-24">
        <div className="container mx-auto px-4">
          <ScrollReveal animation="fadeUp">
            <h2 className="mb-4 font-mono text-sm uppercase tracking-widest text-muted-foreground">
              {t("processHeading")}
            </h2>
          </ScrollReveal>
          <StaggerContainer className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4" staggerDelay={0.1}>
            {processSteps.map((step) => (
              <StaggerItem key={step.key} animation="fadeUp">
                <div className="group">
                  <span className="font-mono text-4xl font-bold text-primary/20 transition-colors group-hover:text-primary/40">
                    {step.num}
                  </span>
                  <h3 className="mt-3 font-display text-xl font-semibold">
                    {t(`${step.key}Title`)}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {t(`${step.key}Desc`)}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Capabilities */}
      <section className="border-t border-border py-24">
        <div className="container mx-auto px-4">
          <ScrollReveal animation="fadeUp">
            <h2 className="mb-4 font-mono text-sm uppercase tracking-widest text-muted-foreground">
              {t("capabilitiesHeading")}
            </h2>
          </ScrollReveal>
          <StaggerContainer className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5" staggerDelay={0.05}>
            {capabilities.map((cap) => (
              <StaggerItem key={cap.key} animation="fadeUp">
                <div className="rounded-xl border border-border/40 bg-card p-5 transition-all duration-300 hover:border-primary/30 hover:shadow-md">
                  <div className="mb-3 text-primary">{cap.icon}</div>
                  <h3 className="font-semibold">{t(cap.key)}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {t(`${cap.key}Desc`)}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Pricing */}
      <section className="border-t border-border py-24">
        <div className="container mx-auto px-4">
          <ScrollReveal animation="fadeUp">
            <h2 className="mb-2 font-display text-3xl font-bold md:text-4xl">
              {t("pricingHeading")}
            </h2>
            <p className="mb-12 text-muted-foreground">
              {t("pricingSubtitle")}
            </p>
          </ScrollReveal>

          <StaggerContainer className="grid gap-6 md:grid-cols-3" staggerDelay={0.1}>
            {projectTiers.map((tier, i) => (
              <StaggerItem key={tier.id} animation="fadeUp">
                <div
                  className={`relative flex flex-col rounded-2xl border-2 p-8 transition-all duration-300 hover:shadow-lg ${
                    tier.popular
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  {tier.popular && (
                    <span className="absolute -top-3 right-6 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                      {tCalc("popular")}
                    </span>
                  )}
                  <div className="mb-4 text-primary">{tierIcons[i]}</div>
                  <h3 className="font-display text-xl font-bold">
                    {tCalc(tier.nameKey)}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {tCalc(tier.descKey)}
                  </p>
                  <div className="mt-6 border-t border-border pt-4">
                    <span className="text-2xl font-bold text-primary">
                      {formatPrice(getPrice(tier.id, tier.basePrice, locale), locale, tryRate)}+
                    </span>
                  </div>
                  <Button asChild className="mt-6 rounded-full" size="lg">
                    <Link href="/rate-calculator">
                      {t("tierGetQuote")}
                      <ArrowRight className="ml-2 rtl:ml-0 rtl:mr-2 rtl:rotate-180 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border py-24">
        <div className="container mx-auto px-4">
          <ScrollReveal animation="fadeUp">
            <h2 className="mb-12 font-display text-3xl font-bold md:text-4xl">
              {t("faqHeading")}
            </h2>
          </ScrollReveal>
          <div className="mx-auto max-w-3xl divide-y divide-border">
            {faqKeys.map((key) => (
              <details key={key} className="group py-5">
                <summary className="flex cursor-pointer items-center justify-between text-lg font-medium">
                  {t(`${key}Q`)}
                  <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-muted-foreground">
                  {t(`${key}A`)}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FAQPage JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqKeys.map((key) => ({
              "@type": "Question",
              name: t(`${key}Q`),
              acceptedAnswer: {
                "@type": "Answer",
                text: t(`${key}A`),
              },
            })),
          }),
        }}
      />

      {/* CTA */}
      <section className="border-t border-border py-24">
        <div className="container mx-auto px-4 text-center">
          <ScrollReveal animation="fadeUp">
            <p className="font-mono text-sm uppercase tracking-widest text-muted-foreground">
              {t("ctaHeading")}
            </p>
            <Link
              href="/rate-calculator"
              className="mt-6 inline-block rounded-full bg-primary px-10 py-4 text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              {t("getQuote")}
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
