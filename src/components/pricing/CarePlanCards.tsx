"use client";

import { ArrowRight, CheckCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";
// 💰 Pricing source of truth: edit prices in src/lib/pricing.ts
// Plan names and features come from the `packages` namespace, shared with
// PackageCards so /pricing and /services/website-maintenance always agree.
import { carePlans, formatPrice } from "@/lib/pricing";

export default function CarePlanCards() {
  const t = useTranslations("packages");

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {carePlans.map((plan) => {
        const features = t.raw(plan.featuresKey) as string[];
        const price = formatPrice(plan.price);
        return (
          <div
            key={plan.id}
            className={`relative flex flex-col rounded-2xl border-2 p-8 ${
              plan.popular ? "border-primary bg-primary/5" : "border-border bg-card"
            }`}
          >
            {plan.popular && (
              <span className="absolute -top-3 right-6 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground rtl:left-6 rtl:right-auto">
                {t("popular")}
              </span>
            )}
            <h3 className="font-display text-2xl font-bold">{t(plan.nameKey)}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{t(plan.descKey)}</p>
            <p className="mb-6 mt-4 text-2xl font-semibold text-primary">
              {plan.fromPrice ? t("fromPrice", { price }) : price}
              {t("perMonth")}
            </p>
            <ul className="flex-1 space-y-3">
              {features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button
              asChild
              className="mt-8 rounded-full"
              size="lg"
              variant={plan.popular ? "default" : "outline"}
            >
              <Link
                href={`/contact?plan=${plan.contactValue}`}
                onClick={() => trackEvent("care_plan_click", { plan: plan.contactValue, price: plan.price })}
              >
                {t("planCta")}
                <ArrowRight className="ml-2 rtl:ml-0 rtl:mr-2 rtl:rotate-180 h-4 w-4" />
              </Link>
            </Button>
          </div>
        );
      })}
    </div>
  );
}
