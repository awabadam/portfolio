"use client";

import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { GlassPill } from "@/components/ui/glass-pill";
import ClosingCard from "@/components/cta/ClosingCard";
import BookCallLink from "@/components/cta/BookCallLink";
import { trackCTAClick } from "@/lib/analytics/gtm";
import { PLAYBOOK_META } from "@/lib/playbookMeta";

export type AuditCtaVariant = "default" | "pricing" | "services";

interface AuditCtaProps {
  /** Picks the heading: default ("Stop losing international patients...") | pricing ("Not sure which package...") | services ("The 30-day plan..."). */
  variant?: AuditCtaVariant;
  /** Where the click came from, for analytics (e.g. "pricing_footer"). */
  location?: string;
  className?: string;
}

const headingKey: Record<AuditCtaVariant, string> = {
  default: "headingDefault",
  pricing: "headingPricing",
  services: "headingServices",
};

/**
 * Drop-in banner that leads with the free playbook: the button opens the
 * playbook form on /audit (#playbook), the text link starts the 2-minute check.
 * Copy lives in audit.ctaBlock. Usage: <AuditCta variant="pricing" location="pricing_footer" />
 */
export default function AuditCta({
  variant = "default",
  location = "audit_cta",
  className,
}: AuditCtaProps) {
  const t = useTranslations("audit.ctaBlock");

  return (
    <ClosingCard
      className={className}
      eyebrow={t("eyebrow")}
      heading={t(headingKey[variant])}
      text={t("text", { templates: PLAYBOOK_META.templates })}
      actions={
        <>
          <GlassPill
            href="/audit#playbook"
            tone="dark"
            arrow
            className="h-11 px-5"
            onClick={() => trackCTAClick("free_playbook", location)}
          >
            {t("button")}
          </GlassPill>
          <BookCallLink location={location} />
          <Link
            href="/audit"
            onClick={() => trackCTAClick("free_audit", location)}
            className="inline-flex min-h-11 basis-full items-center gap-1 text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline lg:justify-end"
          >
            {t("checkLink")}
            <ArrowUpRight
              className="h-3.5 w-3.5 rtl:-scale-x-100"
              aria-hidden="true"
            />
          </Link>
        </>
      }
    />
  );
}
