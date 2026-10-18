"use client";

import { useEffect, useState } from "react";
import { Check, ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { ScrollReveal } from "@/components/effects";
import { trackCTAClick } from "@/lib/analytics/gtm";
import { CAL_BOOKING_URL, calEmbedUrl } from "@/lib/contactLinks";

/**
 * Contact page: the Cal.com 15-minute call booked inline. The iframe only
 * loads when the section scrolls near (loading="lazy"), so the contact form
 * stays fast; the new-tab link is the fallback if Cal.com is blocked.
 */
export default function BookingSection() {
  const t = useTranslations("contact");
  const { resolvedTheme } = useTheme();
  // Theme is unknown on the server; pick it after mount so the iframe src is stable.
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);
  useEffect(() => setTheme(resolvedTheme === "dark" ? "dark" : "light"), [resolvedTheme]);
  const points = t.raw("bookPoints") as string[];

  return (
    <section id="book" className="scroll-mt-24 border-t border-border/60 py-16 md:py-24">
      <div className="container mx-auto grid gap-10 px-5 md:px-8 lg:grid-cols-12 lg:gap-12">
        <ScrollReveal animation="fadeUp" className="lg:col-span-4">
          <p className="mb-4 font-mono text-label text-muted-foreground">{t("bookEyebrow")}</p>
          <h2 className="font-display text-heading text-balance">{t("bookHeading")}</h2>
          <p className="mt-4 text-base text-muted-foreground md:text-lg">{t("bookText")}</p>
          <ul className="mt-6 space-y-3">
            {points.map((point) => (
              <li key={point} className="flex items-start gap-3 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                {point}
              </li>
            ))}
          </ul>
          <a
            href={CAL_BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCTAClick("book_call", "contact_booking_newtab")}
            className="mt-8 inline-flex min-h-11 items-center gap-2 text-sm font-medium underline-offset-4 hover:underline"
          >
            {t("bookOpen")}
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </ScrollReveal>
        <div className="overflow-hidden rounded-[10px] border border-border bg-card lg:col-span-8">
          {theme && (
            <iframe
              key={theme}
              src={calEmbedUrl(theme)}
              title={t("bookHeading")}
              loading="lazy"
              className="block h-[720px] w-full md:h-[580px]"
            />
          )}
        </div>
      </div>
    </section>
  );
}
