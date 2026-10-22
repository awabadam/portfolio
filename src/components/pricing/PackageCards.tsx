"use client";

import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Globe, TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { StaggerContainer, StaggerItem } from "@/components/effects";
import { trackEvent } from "@/lib/analytics";
// 💰 Pricing source of truth: edit prices in src/lib/pricing.ts
// Package names, descriptions and feature lists come from the `packages`
// namespace. /pricing and /services both render this component so the two
// pages can never show different packages or prices.
import { projectTiers, formatPrice, getIncludedAddOns, getIncludedCarePlan, includedCareMonths } from "@/lib/pricing";

// Icons keyed by pricing.ts tier id
const tierIcons: Record<string, React.ReactNode> = {
  business: <Globe className="h-6 w-6" />,
  custom: <TrendingUp className="h-6 w-6" />,
};

interface PackageCardsProps {
  // h2 on /pricing (cards are the page's main sections), h3 on /services
  headingLevel?: "h2" | "h3";
  /**
   * Tier id to highlight as the visitor's fit (badge "Recommended for you"),
   * null to highlight none. Left out, the tier marked `popular` is highlighted.
   */
  recommended?: string | null;
}

export default function PackageCards({ headingLevel = "h3", recommended }: PackageCardsProps) {
  const t = useTranslations("packages");
  const Heading = headingLevel;

  return (
    <StaggerContainer className="grid gap-6 md:grid-cols-2" staggerDelay={0.1}>
      {projectTiers.map((tier) => {
        const features = t.raw(tier.featuresKey) as string[];
        const bundled = getIncludedAddOns(tier.id);
        const care = getIncludedCarePlan(tier.id);
        const highlighted = recommended === undefined ? Boolean(tier.popular) : recommended === tier.id;
        return (
          <StaggerItem key={tier.id} animation="fadeUp">
            <div
              className={`relative flex h-full flex-col rounded-2xl border-2 p-8 transition-all duration-300 hover:shadow-lg ${
                highlighted
                  ? "border-primary bg-primary/5 shadow-lg"
                  : "border-border bg-card hover:border-primary/30"
              }`}
            >
              {highlighted && (
                <span className="absolute -top-3 right-6 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground rtl:left-6 rtl:right-auto">
                  {recommended === undefined ? t("popular") : t("fitBadge")}
                </span>
              )}
              <div className="mb-4 text-primary">{tierIcons[tier.id]}</div>
              <Heading className="font-display text-2xl font-bold">{t(tier.nameKey)}</Heading>
              <p className="mt-1 text-sm text-muted-foreground">{t(tier.descKey)}</p>
              <div className="mt-6 border-t border-border pt-6">
                <span className={`font-display text-4xl font-bold ${highlighted ? "text-primary" : ""}`}>
                  {t("fromPrice", { price: formatPrice(tier.price) })}
                </span>
                <p className="mt-1 text-xs text-muted-foreground">{t(tier.timeframeKey)}</p>
              </div>
              <ul className="mt-6 flex-1 space-y-3">
                {features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              {(bundled.length > 0 || care) && (
                <div className="mt-6 border-t border-border pt-6">
                  <p className="mb-3 font-mono text-xs uppercase tracking-widest text-primary">
                    {t("includedTitle")}
                  </p>
                  <ul className="space-y-2">
                    {bundled.map((addOn) => (
                      <li key={addOn.id} className="flex items-start gap-2 text-sm">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>
                          <span className="font-medium">{t(addOn.nameKey)}</span>
                          <span className="text-muted-foreground">
                            {" · "}
                            {t("valuedAt", {
                              value: formatPrice(addOn.price),
                            })}
                          </span>
                        </span>
                      </li>
                    ))}
                    {care && (
                      <li className="flex items-start gap-2 text-sm">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>
                          <span className="font-medium">
                            {t("careIncluded", { months: includedCareMonths, plan: t(care.nameKey) })}
                          </span>
                          <span className="text-muted-foreground">
                            {" · "}
                            {t("valuedAt", {
                              value: formatPrice(care.price * includedCareMonths),
                            })}
                          </span>
                        </span>
                      </li>
                    )}
                  </ul>
                </div>
              )}
              <Button
                asChild
                className="mt-8 rounded-full"
                size="lg"
                variant={highlighted ? "default" : "outline"}
              >
                <Link
                  href={`/contact?plan=${tier.contactValue}`}
                  onClick={() => trackEvent("package_click", { plan: tier.contactValue, price: tier.price })}
                >
                  {t("cta")}
                  <ArrowRight className="ml-2 rtl:ml-0 rtl:mr-2 rtl:rotate-180 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </StaggerItem>
        );
      })}
    </StaggerContainer>
  );
}
