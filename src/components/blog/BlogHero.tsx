"use client";

import { useTranslations } from "next-intl";
import { ScrollReveal } from "@/components/effects";
import StockPhoto from "@/components/ui/stock-photo";

export default function BlogHero() {
  const t = useTranslations('blog');
  return (
    <div className="container mx-auto mb-12 px-5 md:mb-16 md:px-8">
      <ScrollReveal animation="fadeUp">
        <p className="mb-5 font-mono text-label text-muted-foreground">
          {t('heroEyebrow')}
        </p>
        <h1 className="max-w-4xl font-display text-hero text-balance">{t('heroTitle')}</h1>
      </ScrollReveal>
      <ScrollReveal animation="fadeUp" delay={0.1}>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
          {t('heroSubtitle')}
        </p>
      </ScrollReveal>
      <ScrollReveal animation="fadeUp" delay={0.2}>
        <StockPhoto
          slot="istanbul-bosphorus"
          priority
          sizes="(min-width: 1312px) 1248px, 100vw"
          className="mt-12 aspect-[5/2] md:mt-16 md:aspect-[4/1]"
          imageClassName="object-[50%_65%]"
        />
      </ScrollReveal>
    </div>
  );
}
