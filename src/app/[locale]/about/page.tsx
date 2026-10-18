"use client";

import Image from "next/image";
import { Link } from "@/i18n/routing";
import { ArrowUpRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/effects";
import { GlassPill } from "@/components/ui/glass-pill";
import { CASE_STUDIES, CLIENT_WORK } from "@/data/case-studies";
import { testimonials } from "@/data/testimonials";
import { trackCTAClick } from "@/lib/analytics/gtm";
import StockPhoto from "@/components/ui/stock-photo";
import ClosingCard from "@/components/cta/ClosingCard";
import BookCallLink from "@/components/cta/BookCallLink";

// Display names for client work. Facts (headline, market, languages) come
// from src/data/case-studies.ts; only the names and thumbnails live here.
const CLIENT_NAMES: Record<(typeof CLIENT_WORK)[number], string> = {
  saphiredent: "Saphiredent",
  jouvence: "Jouvence",
  esteexpert: "EsteExpert",
  "omar-marketing": "Omar Marketing",
};

const APPROACH = ["approach1", "approach2", "approach3"] as const;

export default function AboutPage() {
  const t = useTranslations("about");
  const tp = useTranslations("projects");
  const locale = useLocale();
  const languageNames = new Intl.DisplayNames([locale], { type: "language" });
  // Only quotes from clinic clients belong here.
  const quote = testimonials.find((item) => item.company === "Saphiredent");

  return (
    <div className="relative bg-background">
      {/* Who I work with — dark lead section (navbar sits transparent over it) */}
      <section className="bg-black pb-20 pt-32 text-white md:pb-28 md:pt-40">
        <div className="container grid items-center gap-12 px-5 md:grid-cols-12 md:px-8">
          <div className="md:col-span-7">
            <p className="mb-5 font-mono text-label text-white/60">{t("kicker")}</p>
            <h1 className="font-display text-hero text-white text-balance">{t("heading")}</h1>
            <p className="mt-6 max-w-prose text-lg text-white/75">{t("intro")}</p>
            <p className="mt-4 max-w-prose text-lg text-white/75">{t("intro2")}</p>
          </div>
          <div className="md:col-span-4 md:col-start-9">
            <div className="relative aspect-[4/5] max-w-sm overflow-hidden rounded-[10px] bg-white/10 md:max-w-md">
              <Image
                src="/img/awab-portrait.webp"
                alt={t("portraitAlt")}
                fill
                priority
                sizes="(min-width: 768px) 28rem, 100vw"
                quality={90}
                className="object-cover object-[50%_30%]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Client work */}
      <section className="py-20 md:py-28">
        <div className="container px-5 md:px-8">
          <ScrollReveal animation="fadeUp" className="mb-10 max-w-3xl md:mb-14">
            <p className="mb-4 font-mono text-label text-muted-foreground">{t("workKicker")}</p>
            <h2 className="font-display text-heading text-foreground">{t("workHeading")}</h2>
            <p className="mt-5 max-w-prose text-lg text-muted-foreground">{t("workIntro")}</p>
          </ScrollReveal>

          <StaggerContainer className="grid gap-5 md:grid-cols-2" staggerDelay={0.1}>
            {CLIENT_WORK.map((id) => {
              const study = CASE_STUDIES[id];
              if (!study) return null;
              return (
                <StaggerItem key={id} animation="fadeUp">
                  <Link
                    href={`/projects/${id}`}
                    onClick={() => trackCTAClick(`case_study_${id}`, "about_clients")}
                    className="group flex h-full flex-col overflow-hidden rounded-[10px] border border-border/60 bg-card transition-colors hover:border-foreground/30"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                      <Image
                        src={`/img/projects/${id}-thumbnail.webp`}
                        alt=""
                        fill
                        sizes="(min-width: 768px) 50vw, 100vw"
                        quality={85}
                        className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-5 md:p-6">
                      <h3 className="font-display text-card-title text-foreground">{CLIENT_NAMES[id]}</h3>
                      <p className="mt-3 text-muted-foreground">
                        {locale === "en" ? study.headline : t(`clientHeadlines.${id}`)}
                      </p>
                      <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
                        <dt className="font-mono text-label text-muted-foreground">{t("workMarket")}</dt>
                        <dd>{tp(`markets.${study.market}`)}</dd>
                        <dt className="font-mono text-label text-muted-foreground">{t("workLanguages")}</dt>
                        <dd>{study.languages.map((code) => languageNames.of(code) ?? code).join(", ")}</dd>
                      </dl>
                      <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-foreground/60 transition-colors group-hover:text-foreground">
                        {t("workLink")}
                        <ArrowUpRight aria-hidden="true" className="h-4 w-4 rtl:-scale-x-100" />
                      </span>
                    </div>
                  </Link>
                </StaggerItem>
              );
            })}
          </StaggerContainer>

          {quote && (
            <ScrollReveal animation="fadeUp" className="mt-14 max-w-3xl md:mt-20">
              <figure>
                <blockquote className="font-display text-2xl leading-snug text-foreground md:text-3xl" lang="en" dir="ltr">
                  &ldquo;{quote.content}&rdquo;
                </blockquote>
                <figcaption className="mt-5 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{quote.name}</span>, {quote.role}, {quote.company}
                </figcaption>
              </figure>
            </ScrollReveal>
          )}
        </div>
      </section>

      {/* How I work */}
      <section className="border-t border-border/40 py-20 md:py-28">
        <div className="container grid gap-10 px-5 md:grid-cols-12 md:gap-14 md:px-8">
          {/* Istanbul, where the work (and most of the clinics) are based */}
          <ScrollReveal animation="fade" className="md:col-span-5">
            <StockPhoto
              slot="istanbul-galata"
              // 3:2 photo in a 4:5 frame renders ~1.9x the frame width.
              sizes="(min-width: 768px) 70vw, 100vw"
              className="aspect-[3/2] md:aspect-[4/5]"
              imageClassName="object-[30%_50%]"
            />
          </ScrollReveal>
          <div className="md:col-span-7 md:self-center">
            <ScrollReveal animation="fadeUp" className="mb-10 md:mb-12">
              <h2 className="font-display text-heading text-foreground">{t("approachHeading")}</h2>
            </ScrollReveal>
            <StaggerContainer className="grid gap-8 md:gap-10" staggerDelay={0.1}>
              {APPROACH.map((key) => (
                <StaggerItem key={key} animation="fadeUp" className="border-t border-border/60 pt-5">
                  <h3 className="font-display text-card-title text-foreground">{t(`${key}Title`)}</h3>
                  <p className="mt-3 max-w-prose text-muted-foreground">{t(`${key}Body`)}</p>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* CTA */}
      <ClosingCard
        heading={t("ctaHeading")}
        text={t("ctaText")}
        actions={
          <>
            <GlassPill
              href="/contact"
              tone="dark"
              arrow
              onClick={() => trackCTAClick("contact", "about_cta")}
            >
              {t("ctaButton")}
            </GlassPill>
            <BookCallLink location="about_cta" />
          </>
        }
      />
    </div>
  );
}
