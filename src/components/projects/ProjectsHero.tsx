"use client";

import { useTranslations } from "next-intl";
import { ScrollReveal, Parallax } from "@/components/effects";

interface ProjectsHeroProps {
  projectCount: number;
}

export default function ProjectsHero({ projectCount }: ProjectsHeroProps) {
  const t = useTranslations('projects');
  return (
    <div className="container mx-auto mb-24 px-4">
      <ScrollReveal animation="fadeUp">
        <Parallax speed={0.2}>
          <h1 className="font-display text-display-1 font-bold leading-none tracking-tighter">
            {t('selectedWorks')}
            <br />
            <span className="text-muted-foreground">{t('worksLabel')}</span>
            <span className="ms-4 text-lg font-normal tracking-normal text-muted-foreground md:text-xl">
              ({projectCount})
            </span>
          </h1>
        </Parallax>
      </ScrollReveal>
    </div>
  );
}
