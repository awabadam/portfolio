"use client";

import { useTranslations } from "next-intl";
import ScrollReveal from "@/components/effects/ScrollReveal";

export default function ProjectsHero() {
  const t = useTranslations("projects");
  return (
    <div className="container mx-auto px-5 pb-12 pt-32 md:px-8 md:pb-16">
      <ScrollReveal animation="fadeUp">
        <p className="mb-5 font-mono text-label text-muted-foreground">
          {t("heroEyebrow")}
        </p>
        <h1 className="max-w-4xl font-display text-hero text-balance">{t("heroTitle")}</h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
          {t("heroIntro")}
        </p>
      </ScrollReveal>
    </div>
  );
}
