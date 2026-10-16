"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Project } from "@/types";
import HeroSlider from "@/components/home/HeroSlider";
import CtaSection from "@/components/home/CtaSection";
import ClientMarquee, { CLIENT_LOGOS } from "@/components/home/ClientMarquee";
import WorkCard from "@/components/cards/WorkCard";
import { GlassPill } from "@/components/ui/glass-pill";
import ScrollReveal from "@/components/effects/ScrollReveal";
import { trackCTAClick } from "@/lib/analytics/gtm";

// dubs-style grey inline link: muted at rest, full foreground on hover.
const GREY_LINK =
  "inline-flex items-center gap-1.5 text-sm font-medium text-foreground/60 transition-colors hover:text-foreground";

// The two "doorway" cards under the intro — one to services, one to pricing.
const DOOR_CARDS = [
  {
    href: "/services",
    image: "/img/projects/esteexpert-thumbnail.webp",
    kicker: "card1Kicker",
    heading: "card1Heading",
    link: "card1Link",
    cta: "services",
  },
  {
    href: "/pricing",
    image: "/img/projects/omar-marketing-thumbnail.webp",
    kicker: "card2Kicker",
    heading: "card2Heading",
    link: "card2Link",
    cta: "pricing",
  },
] as const;

export default function HomePageContent() {
  const t = useTranslations("home");

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch via the API route instead of importing the DB helper directly —
    // that would pull the whole server data layer into the homepage bundle.
    const controller = new AbortController();
    fetch("/api/projects?limit=4", { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : { projects: [] }))
      .then((data) => {
        setProjects((data.projects ?? []).slice(0, 4));
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
          {/* /img/hero-image.jpg is a 1200x630 landscape — the frame matches it
              so the portrait isn't cropped away. Swap for a real 4/5 portrait
              asset when one exists. */}
          <div className="relative aspect-[16/10] overflow-hidden rounded-[10px] bg-muted">
            <Image
              src="/img/hero-image.jpg"
              alt={t("whoImageAlt")}
              fill
              sizes="(min-width: 768px) 40vw, 100vw"
              className="object-cover"
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
              src={card.image}
              alt=""
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover object-top opacity-80 transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{ background: "linear-gradient(180deg, rgba(84,84,84,0) 35%, rgba(0,0,0,0.4) 100%)" }}
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

      {/* Client logos */}
      <section className="border-y border-border/40 bg-background py-12">
        <div className="container px-5 md:px-8">
          <ScrollReveal animation="fadeUp">
            <p className="mb-8 font-mono text-label text-muted-foreground">{t("clientsHeading")}</p>
          </ScrollReveal>
        </div>
        <ClientMarquee logos={CLIENT_LOGOS} />
      </section>

      <CtaSection />
    </div>
  );
}
