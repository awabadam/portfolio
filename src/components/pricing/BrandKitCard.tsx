"use client";

import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, ArrowUpRight, Palette } from "lucide-react";
import { useTranslations } from "next-intl";
import { ScrollReveal } from "@/components/effects";
import { trackEvent } from "@/lib/analytics";
// 💰 Pricing source of truth: edit prices in src/lib/pricing.ts
// The Clinic Brand Kit, shown under PackageCards on /pricing and /services.
// It sits outside projectTiers (see the note on `brandKit`), so it gets its own
// full-width card, kept quieter than the two website packages above it.
import { brandKit, getBrandKitBundlePrice, formatPrice } from "@/lib/pricing";

interface BrandKitCardProps {
  // Match PackageCards: h2 on /pricing, h3 on /services
  headingLevel?: "h2" | "h3";
  className?: string;
}

export default function BrandKitCard({ headingLevel = "h3", className = "" }: BrandKitCardProps) {
  const t = useTranslations("packages");
  const Heading = headingLevel;
  const features = t.raw(brandKit.featuresKey) as string[];
  const bundlePrice = getBrandKitBundlePrice();

  return (
    <ScrollReveal animation="fadeUp" className={className}>
      <div className="rounded-2xl border border-border bg-card p-8">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="flex flex-col lg:col-span-5">
            <p className="mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              <Palette aria-hidden="true" className="h-4 w-4" />
              {t("clinicBrandKitEyebrow")}
            </p>
            <Heading className="font-display text-2xl font-bold">{t(brandKit.nameKey)}</Heading>
            <p className="mt-1 text-sm text-muted-foreground">{t(brandKit.descKey)}</p>
            <div className="mt-6 border-t border-border pt-6">
              <span className="font-display text-3xl font-bold">
                {t("fromPrice", { price: formatPrice(brandKit.price) })}
              </span>
              <p className="mt-1 text-xs text-muted-foreground">{t(brandKit.timeframeKey)}</p>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4 lg:mt-auto lg:pt-8">
              <Button asChild className="rounded-full" size="lg" variant="outline">
                <Link
                  href={`/contact?plan=${brandKit.contactValue}`}
                  onClick={() => trackEvent("package_click", { plan: brandKit.contactValue, price: brandKit.price })}
                >
                  {t("cta")}
                  <ArrowRight className="ml-2 rtl:ml-0 rtl:mr-2 rtl:rotate-180 h-4 w-4" />
                </Link>
              </Button>
              <Link
                href="/services/clinic-branding"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground/60 transition-colors hover:text-foreground"
              >
                {t("clinicBrandKitLink")}
                <ArrowUpRight aria-hidden="true" className="h-4 w-4 rtl:-scale-x-100" />
              </Link>
            </div>
          </div>
          <ul className="grid content-start gap-x-8 gap-y-3 sm:grid-cols-2 lg:col-span-7 lg:border-s lg:border-border lg:ps-12">
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bundle with the Growth System (price and saving from pricing.ts) */}
        <div className="mt-8 flex flex-col gap-4 border-t border-border pt-6 md:flex-row md:items-center md:justify-between md:gap-10">
          <div className="max-w-2xl">
            <p className="font-medium">{t("brandKitBundleHeading")}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {t("brandKitBundleText", {
                bundlePrice: formatPrice(bundlePrice),
                saving: formatPrice(brandKit.bundle.discount),
              })}
            </p>
          </div>
          <Link
            href={`/contact?plan=${brandKit.bundle.contactValue}`}
            onClick={() => trackEvent("package_click", { plan: brandKit.bundle.contactValue, price: bundlePrice })}
            className="inline-flex min-h-11 shrink-0 items-center gap-1.5 self-start text-sm font-medium underline-offset-4 hover:underline md:self-auto"
          >
            {t("brandKitBundleCta")}
            <ArrowRight aria-hidden="true" className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </div>
      </div>
    </ScrollReveal>
  );
}
