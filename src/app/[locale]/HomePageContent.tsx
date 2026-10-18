"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Project } from "@/types";
import HeroSlider from "@/components/home/HeroSlider";
import CtaSection from "@/components/home/CtaSection";
import WorkCard from "@/components/cards/WorkCard";
import { GlassPill } from "@/components/ui/glass-pill";
import ScrollReveal from "@/components/effects/ScrollReveal";
import { trackCTAClick } from "@/lib/analytics/gtm";
import { CASE_STUDIES, CLIENT_WORK, HOME_FEATURED, pickInOrder } from "@/data/case-studies";
import { IMAGE_CREDITS } from "@/data/image-credits";

// dubs-style grey inline link: muted at rest, full foreground on hover.
const GREY_LINK =
  "inline-flex items-center gap-1.5 text-sm font-medium text-foreground/60 transition-colors hover:text-foreground";

// Thin proof strip under the hero. Every line is backed by src/data/case-studies.ts
// (Saphiredent: nine languages, leads mapped by country, Google Ads offline
// conversions; Jouvence: WhatsApp on every treatment page). No invented numbers.
const PROOF = ["languages", "countries", "ads", "whatsapp"] as const;

// The two "doorway" cards under the intro — one to services, one to pricing.
// Stock photos rather than project shots, which already appear in the work grid.
const DOOR_CARDS = [
  {
    href: "/services",
    image: IMAGE_CREDITS["phone-message-alt"],
    kicker: "card1Kicker",
    heading: "card1Heading",
    link: "card1Link",
    cta: "services",
  },
  {
    href: "/pricing",
    image: IMAGE_CREDITS["clinic-interior-alt"],
    kicker: "card2Kicker",
    heading: "card2Heading",
    link: "card2Link",
    cta: "pricing",
  },
] as const;

// Display names for the client row (the projects table is fetched async, and
// this row should not wait on it).
const CLIENT_NAMES: Record<(typeof CLIENT_WORK)[number], string> = {
  saphiredent: "SaphireDent",
  jouvence: "Jouvence",
  esteexpert: "EsteExpert",
  "omar-marketing": "Omar Marketing",
};

export default function HomePageContent() {
  const t = useTranslations("home");

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch via the API route instead of importing the DB helper directly —
    // that would pull the whole server data layer into the homepage bundle.
    const controller = new AbortController();
    fetch("/api/projects", { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : { projects: [] }))
      .then((data) => {
        setProjects(pickInOrder<Project>(data.projects ?? [], HOME_FEATURED));
        setLoading(false);
      })
      .catch((err) => {
        if (err?.name === "AbortError") return;
        setLoading(false);
      });
    return () => controller.abort();
  }, []);

  return (
    <div className="relative bg-background">
      <HeroSlider />

      {/* Proof strip */}
      <section className="border-b border-border/40 bg-background">
        <ul className="container grid grid-cols-2 gap-x-6 gap-y-4 px-5 py-5 md:grid-cols-4 md:px-8 md:py-6">
          {PROOF.map((key, i) => (
            <li key={key} className="flex items-baseline gap-3">
              <span className="shrink-0 font-mono text-[11px] text-muted-foreground">0{i + 1}</span>
              <span className="text-sm font-medium leading-snug text-foreground/80">{t(`proof.${key}`)}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Featured work */}
      <section id="work" className="bg-background py-20 md:py-28">
        <div className="container px-5 md:px-8">
          <ScrollReveal animation="fadeUp" className="mb-8 md:mb-10">
            <p className="font-mono text-label text-muted-foreground">{t("featuredKicker")}</p>
          </ScrollReveal>

          <div className="grid gap-5 md:grid-cols-2">
            {loading
              ? [0, 1, 2, 3].map((i) => (
                  <div key={i} className="aspect-[16/11] w-full animate-pulse rounded-[10px] bg-muted" />
                ))
              : projects.map((project, index) => (
                  <WorkCard key={project.id} project={project} index={index} aspect="wide" priority={index === 0} />
                ))}
          </div>

          <div className="mt-8 md:mt-10">
            <Link
              href="/projects"
              className={GREY_LINK}
              onClick={() => trackCTAClick("view_work", "home_featured")}
            >
              {t("allProjects")}
              <ArrowUpRight aria-hidden="true" className="h-4 w-4 rtl:-scale-x-100" />
            </Link>
          </div>
        </div>
      </section>

      {/* Who I am */}
      <section className="container grid items-center gap-10 px-5 py-20 md:grid-cols-12 md:px-8 md:py-28">
        <div className="md:col-span-5">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[10px] bg-muted max-w-sm md:max-w-md">
            <Image
              src="/img/awab-portrait.webp"
              alt={t("whoImageAlt")}
              fill
              sizes="(min-width: 768px) 28rem, 100vw"
              quality={90}
              className="object-cover object-[50%_30%]"
            />
          </div>
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <ScrollReveal animation="fadeUp">
            <p className="mb-4 font-mono text-label text-muted-foreground">{t("whoKicker")}</p>
            <h2 className="font-display text-heading text-foreground">{t("whoHeading")}</h2>
            <p className="mt-5 max-w-prose text-lg text-muted-foreground">{t("whoText")}</p>
            <div className="mt-8">
              <Link
                href="/about"
                className={GREY_LINK}
                onClick={() => trackCTAClick("about", "home_who")}
              >
                {t("whoLink")}
                <ArrowUpRight aria-hidden="true" className="h-4 w-4 rtl:-scale-x-100" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Services / Pricing doorway cards */}
      <section className="container grid gap-5 px-5 pb-20 md:grid-cols-2 md:px-8 md:pb-28">
        {DOOR_CARDS.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            onClick={() => trackCTAClick(card.cta, "home_cards")}
            className="group relative isolate block aspect-[4/3] overflow-hidden rounded-[10px] bg-black text-white md:aspect-[16/10]"
          >
            <Image
              src={card.image.src}
              alt=""
              fill
              // 3:2 photos: on phones the 4:3 frame crops them, so they render ~1.13x wide.
              sizes="(min-width: 768px) 50vw, 113vw"
              quality={85}
              className="object-cover opacity-80 transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0.75) 100%)" }}
            />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 md:p-6">
              <div className="min-w-0">
                <p className="mb-2 text-label text-white/80">{t(card.kicker)}</p>
                <h3 className="font-display text-card-title text-white">{t(card.heading)}</h3>
              </div>
              <GlassPill as="span" arrow className="hidden group-hover:bg-white/25 md:inline-flex">
                {t(card.link)}
              </GlassPill>
            </div>
          </Link>
        ))}
      </section>

      {/* Clients: the four case studies by name. No logos, nothing invented. */}
      <section className="border-y border-border/40 bg-background py-14 md:py-20">
        <div className="container px-5 md:px-8">
          <ScrollReveal animation="fadeUp">
            <p className="mb-8 font-mono text-label text-muted-foreground md:mb-10">{t("clientsHeading")}</p>
          </ScrollReveal>
          <ul className="grid grid-cols-1 gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
            {CLIENT_WORK.map((id) => {
              const study = CASE_STUDIES[id];
              return (
                <li key={id} className="border-t border-border/60">
                  <Link
                    href={`/projects/${id}`}
                    onClick={() => trackCTAClick("view_project", "home_clients")}
                    className="group flex h-full flex-col gap-3 py-5 md:py-6"
                  >
                    <span className="flex items-start justify-between gap-3">
                      <span className="font-display text-card-title text-foreground">{CLIENT_NAMES[id]}</span>
                      <ArrowUpRight
                        aria-hidden="true"
                        className="mt-1.5 h-4 w-4 shrink-0 text-foreground/40 transition-all group-hover:text-foreground rtl:-scale-x-100 ltr:group-hover:translate-x-0.5"
                      />
                    </span>
                    <span className="font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
                      {t(`clients.${study.market}`)} · {t("clients.languages", { count: study.languages.length })}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <CtaSection />
    </div>
  );
}
