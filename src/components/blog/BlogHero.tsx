"use client";

import { useTranslations } from "next-intl";
import { ScrollReveal } from "@/components/effects";

interface BlogHeroProps {
  postCount: number;
}

export default function BlogHero({ postCount }: BlogHeroProps) {
  const t = useTranslations('blog');
  return (
    <div className="container mx-auto mb-24 px-4">
      <ScrollReveal animation="fadeUp">
        <h1 className="font-display text-display-1 font-bold leading-none tracking-tighter">
          {t('heroTitle')}
          <span className="ms-4 text-lg font-normal tracking-normal text-muted-foreground md:text-xl">
            ({postCount})
          </span>
        </h1>
      </ScrollReveal>
      <ScrollReveal animation="fadeUp" delay={0.1}>
        <p className="mt-8 max-w-2xl text-xl leading-relaxed text-muted-foreground">
          {t('heroSubtitle')}
        </p>
      </ScrollReveal>
    </div>
  );
}
