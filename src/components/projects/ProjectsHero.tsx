"use client";

import { useTranslations } from "next-intl";
import { ScrollReveal, Parallax, LineReveal } from "@/components/effects";

interface ProjectsHeroProps {
  projectCount: number;
}

export default function ProjectsHero({ projectCount }: ProjectsHeroProps) {
  const t = useTranslations("projects");
  return (
    <div className="container mx-auto mb-16 px-4 md:mb-24">
      <ScrollReveal animation="fadeUp">
        <Parallax speed={0.2}>
          <div className="flex items-end justify-between gap-8">
            <h1 className="font-display text-display-1 font-bold leading-none tracking-tighter">
              {t("selectedWorks")}
              <br />
              <span className="text-muted-foreground">{t("worksLabel")}</span>
            </h1>
            <span className="mb-2 hidden font-mono text-lg text-muted-foreground md:block">
              {projectCount} {projectCount === 1 ? "project" : "projects"}
            </span>
          </div>
          <LineReveal className="mt-6" delay={0.3} />
        </Parallax>
      </ScrollReveal>
    </div>
  );
}
