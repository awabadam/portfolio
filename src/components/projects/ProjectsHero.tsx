"use client";

import { useTranslations } from "next-intl";
import ScrollReveal from "@/components/effects/ScrollReveal";

interface ProjectsHeroProps {
  projectCount: number;
}

export default function ProjectsHero({ projectCount }: ProjectsHeroProps) {
  const t = useTranslations("projects");
  return (
    <div className="container mx-auto px-5 pb-12 pt-32 md:px-8">
      <ScrollReveal animation="fadeUp">
        <p className="mb-4 font-mono text-label text-muted-foreground">
          {t("count", { count: projectCount })}
        </p>
        <h1 className="font-display text-heading">
          {t("selectedWorks")} {t("worksLabel")}
        </h1>
      </ScrollReveal>
    </div>
  );
}
