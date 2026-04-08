"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { trackCTAClick } from "@/lib/analytics/gtm";

export default function BlogCTA() {
  const t = useTranslations("blog");

  return (
    <div className="mt-16 rounded-2xl border border-border bg-muted/30 p-8 text-center md:p-12">
      <h3 className="text-2xl font-bold">{t("ctaHeading")}</h3>
      <p className="mx-auto mt-3 max-w-md text-muted-foreground">
        {t("ctaDescription")}
      </p>
      <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button asChild size="lg" className="rounded-full px-8">
          <Link
            href="/rate-calculator"
            onClick={() => trackCTAClick("free_quote", "blog_post")}
          >
            {t("ctaGetQuote")}
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="rounded-full px-8">
          <Link
            href="/contact"
            onClick={() => trackCTAClick("contact", "blog_post")}
          >
            {t("ctaContactMe")}
          </Link>
        </Button>
      </div>
    </div>
  );
}
