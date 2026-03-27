"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { ScrollReveal, StaggerContainer, StaggerItem, ScrollRotate } from "@/components/effects";

const serviceKeys = [
  { id: "webdesign-istanbul", key: "webdesign", slug: "webdesign-istanbul" },
  { id: "graphic-design-istanbul", key: "graphicDesign", slug: "graphic-design-istanbul" },
  { id: "ai-chatbot-integration", key: "aiChatbot", slug: "ai-chatbot-integration" },
] as const;

const ServicesPage = () => {
  const t = useTranslations('services');

  return (
    <main className="flex min-h-screen w-full flex-col bg-background pt-32">
      {/* Hero Section */}
      <section className="container mx-auto mb-24 px-4">
        <ScrollReveal animation="fadeUp">
          <h1 className="font-display text-display-1 font-bold leading-none tracking-tighter">
            {t('heading')}
          </h1>
        </ScrollReveal>
        <ScrollReveal animation="fadeUp" delay={0.1}>
          <p className="mt-8 max-w-2xl text-xl leading-relaxed text-muted-foreground">
            {t('description')}
          </p>
        </ScrollReveal>
      </section>

      {/* Services Grid */}
      <section className="container mx-auto mb-24 px-4">
        <StaggerContainer className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto" staggerDelay={0.15}>
          {serviceKeys.map((service, index) => (
            <StaggerItem key={service.id} animation="fadeUp">
              <ScrollRotate degrees={3} direction={index % 2 === 0 ? "cw" : "ccw"}>
                <Link
                  href={`/services/${service.slug}`}
                  className="group relative block overflow-hidden rounded-2xl border border-border/40 bg-card p-8 transition-all duration-500 hover:border-primary/50 hover:shadow-xl"
                >
                  <div className="mb-4">
                    <h2 className="mb-2 font-display text-2xl font-bold transition-colors group-hover:text-primary">
                      {t(`${service.key}.title`)}
                    </h2>
                    <p className="mb-4 text-muted-foreground">
                      {t(`${service.key}.description`)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-border/40 pt-4">
                    <div>
                      <p className="text-sm font-medium text-primary">
                        {t(`${service.key}.priceRange`)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t(`${service.key}.timeframe`)}
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 -rotate-45 transition-transform duration-500 group-hover:rotate-0 rtl:rotate-[135deg] rtl:group-hover:rotate-180" />
                  </div>
                </Link>
              </ScrollRotate>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border py-24">
        <div className="container mx-auto px-4 text-center">
          <ScrollReveal animation="fadeUp">
            <h2 className="mb-4 font-display text-4xl font-bold md:text-5xl">
              {t('ctaHeading')}
            </h2>
          </ScrollReveal>
          <ScrollReveal animation="fadeUp" delay={0.1}>
            <p className="mb-8 text-lg text-muted-foreground">
              {t('ctaDescription')}
            </p>
          </ScrollReveal>
          <ScrollReveal animation="fadeUp" delay={0.2}>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="h-14 px-8 text-lg">
                <Link href="/rate-calculator">{t('getQuote')}</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-14 px-8 text-lg">
                <Link href="/contact">{t('contactMe')}</Link>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
};

export default ServicesPage;
