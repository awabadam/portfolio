"use client";

import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

// Internal-linking block. Labels live in the `related` namespace; keys here
// map to routes so pages only name what they link to.
export type RelatedKey =
  | "services"
  | "pricing"
  | "audit"
  | "caseStudies"
  | "webdesign"
  | "maintenance"
  | "clinicBranding"
  | "contact"
  | "blog";

const HREFS: Record<RelatedKey, string> = {
  services: "/services",
  pricing: "/pricing",
  audit: "/audit",
  caseStudies: "/projects",
  webdesign: "/services/webdesign-istanbul",
  maintenance: "/services/website-maintenance",
  clinicBranding: "/services/clinic-branding",
  contact: "/contact",
  blog: "/blog",
};

interface RelatedLinksProps {
  items: RelatedKey[];
  /** Dark variant for black sections. */
  tone?: "light" | "dark";
  className?: string;
}

/**
 * Small "Related" row: mono eyebrow, then one bordered link per item with a
 * title, one-line description and an arrow. Usage:
 * <RelatedLinks items={["pricing", "audit", "caseStudies"]} />
 */
export default function RelatedLinks({ items, tone = "light", className }: RelatedLinksProps) {
  const t = useTranslations("related");
  const dark = tone === "dark";

  return (
    <nav aria-label={t("heading")} className={cn("border-t", dark ? "border-white/15" : "border-border/60", className)}>
      <p className={cn("mt-6 font-mono text-[11px] uppercase tracking-wide", dark ? "text-white/60" : "text-muted-foreground")}>
        {t("heading")}
      </p>
      <ul className="mt-5 grid gap-x-8 gap-y-6 sm:grid-cols-3">
        {items.map((key) => (
          <li key={key}>
            <Link
              href={HREFS[key]}
              className={cn(
                "group flex h-full flex-col border-t pt-4 transition-colors",
                dark ? "border-white/15 hover:border-white/40" : "border-border/60 hover:border-foreground/40",
              )}
            >
              <span className="flex items-center justify-between gap-3 font-display text-lg leading-snug tracking-tight">
                {t(`items.${key}.title`)}
                <ArrowUpRight
                  aria-hidden="true"
                  className={cn(
                    "h-4 w-4 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5",
                    dark ? "text-white/60" : "text-muted-foreground",
                  )}
                />
              </span>
              <span className={cn("mt-1.5 text-sm leading-relaxed", dark ? "text-white/60" : "text-muted-foreground")}>
                {t(`items.${key}.desc`)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
