"use client";

import { useCallback, useEffect, useState, type KeyboardEvent } from "react";
import { getImageProps } from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { isRtl, type Locale } from "@/i18n/config";
import { GlassPill } from "@/components/ui/glass-pill";
import { trackCTAClick } from "@/lib/analytics/gtm";

type SlideCategoryKey = "jouvence" | "saphiredent" | "esteexpert";

interface Slide {
  id: string;
  title: string;
  categoryKey: SlideCategoryKey;
  // Photo mockups from public/img/projects/<id>/. `landscape` is a 2000x1333
  // laptop scene, `portrait` the 2000x2500 phone scene. The laptop scenes are
  // decision shots, so they don't repeat the laptop-home shots on the work cards.
  landscape: string;
  portrait: string;
}

const SLIDES: Slide[] = [
  {
    id: "jouvence",
    title: "Jouvence",
    categoryKey: "jouvence",
    landscape: "/img/projects/jouvence/laptop-decision-3.webp",
    portrait: "/img/projects/jouvence/phone-1.webp",
  },
  {
    id: "saphiredent",
    title: "SaphireDent",
    categoryKey: "saphiredent",
    landscape: "/img/projects/saphiredent/laptop-decision-4.webp",
    portrait: "/img/projects/saphiredent/phone-1.webp",
  },
  {
    id: "esteexpert",
    title: "EsteExpert Clinic",
    categoryKey: "esteexpert",
    landscape: "/img/projects/esteexpert/laptop-decision-1.webp",
    portrait: "/img/projects/esteexpert/phone-1.webp",
  },
];

const AUTO_ADVANCE_MS = 6000;
const CROSSFADE_S = 0.9;
// The laptop scene where the hero is wider than tall, the phone scene otherwise
// (phones and portrait tablets), so object-cover never crops much of either.
const LANDSCAPE_QUERY = "(orientation: landscape)";

function SlideImage({ slide, first }: { slide: Slide; first: boolean }) {
  // 75, not 85: it sits under a 45% black scrim, and it is the LCP image, so
  // bytes matter more than fine detail here.
  const common = { alt: "", fill: true, sizes: "100vw", quality: 75 } as const;
  const {
    props: { srcSet: landscape },
  } = getImageProps({ ...common, src: slide.landscape });
  // A <picture> only fetches the matching source, so eager loading the first
  // slide doesn't download both scenes.
  const {
    props: { srcSet: portrait, ...rest },
  } = getImageProps({
    ...common,
    // A 4:5 scene covering a tall box renders wider than the viewport.
    sizes: "125vw",
    src: slide.portrait,
    loading: first ? "eager" : "lazy",
    fetchPriority: first ? "high" : "auto",
  });

  return (
    <picture>
      <source media={LANDSCAPE_QUERY} srcSet={landscape} />
      {/* eslint-disable-next-line @next/next/no-img-element -- art direction needs a raw <img> */}
      <img {...rest} srcSet={portrait} className="object-cover" />
    </picture>
  );
}

export default function HeroSlider() {
  const t = useTranslations("home");
  const locale = useLocale() as Locale;
  const rtl = isRtl(locale);
  const reducedMotion = useReducedMotion() ?? false;

  const [index, setIndex] = useState(0);
  const [hidden, setHidden] = useState(false);
  // Bumped on manual navigation so the auto-advance timer restarts.
  const [timerKey, setTimerKey] = useState(0);

  const count = SLIDES.length;
  const paused = reducedMotion || hidden;

  const goTo = useCallback(
    (next: number) => {
      setIndex(((next % count) + count) % count);
      setTimerKey((k) => k + 1);
    },
    [count],
  );

  // Pause while the tab is hidden.
  useEffect(() => {
    const onVisibility = () => setHidden(document.hidden);
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  // Auto-advance.
  useEffect(() => {
    if (paused) return;
    const id = window.setTimeout(() => {
      setIndex((i) => (i + 1) % count);
    }, AUTO_ADVANCE_MS);
    return () => window.clearTimeout(id);
  }, [index, timerKey, paused, count]);

  // Arrow keys follow the visual order: in RTL the "next" slide is to the left.
  const forwardKey = rtl ? "ArrowLeft" : "ArrowRight";
  const backKey = rtl ? "ArrowRight" : "ArrowLeft";
  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === forwardKey) {
      e.preventDefault();
      goTo(index + 1);
    } else if (e.key === backKey) {
      e.preventDefault();
      goTo(index - 1);
    }
  };

  const slide = SLIDES[index];

  return (
    <section
      tabIndex={0}
      onKeyDown={onKeyDown}
      aria-roledescription="carousel"
      aria-label={t("heroKicker")}
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-black text-white outline-none"
    >
      {/* Media: project photo mockups, full bleed. The copy sits low, under the device screens. */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <AnimatePresence initial={false}>
          {/* Portrait: the phone scene fills the top of the hero and fades out behind
              the copy, so the phone screen sits above the headline, not under it. */}
          <motion.div
            key={slide.id}
            className="absolute inset-x-0 top-0 h-[72%] [mask-image:linear-gradient(to_bottom,#000_65%,transparent)] landscape:h-full landscape:[mask-image:none]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : CROSSFADE_S, ease: "linear" }}
          >
            <SlideImage slide={slide} first={index === 0} />
          </motion.div>
        </AnimatePresence>
        {/* Scrim: light overall so the scene keeps its colour, dark only behind the nav
            (top band) and behind the copy and the bottom bar (bottom band, start side). */}
        <div className="pointer-events-none absolute inset-0 bg-black/15" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 to-transparent to-25%" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 via-35% to-transparent to-70%" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/45 via-transparent via-60% to-transparent rtl:bg-gradient-to-l" />
      </div>

      {/* Message */}
      <div className="container flex flex-1 flex-col justify-end px-5 pb-8 pt-32 md:px-8 md:pb-10 md:pt-40">
        <div className="max-w-4xl">
          <p className="font-mono text-label text-white/70">{t("heroKicker")}</p>
          <h1 className="mt-5 max-w-[16ch] font-display text-hero text-white [text-wrap:balance]">
            {t("heroHeadline")}
          </h1>
          <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <GlassPill
              href="/audit"
              tone="light"
              arrow
              onClick={() => trackCTAClick("free_audit", "hero")}
            >
              {t("heroPrimary")}
            </GlassPill>
            <GlassPill
              href="/projects"
              arrow
              onClick={() => trackCTAClick("view_work", "hero")}
            >
              {t("heroSecondary")}
            </GlassPill>
          </div>
        </div>
      </div>

      {/* Bottom bar: demoted project caption on the start side, slide controls on the end side. */}
      {/* Physical right padding keeps the bar clear of the fixed chat bubble (bottom-4 right-4, 64px) in both directions. */}
      <div className="container flex items-end justify-between gap-6 px-5 pb-7 pr-24 md:px-8 md:pb-10 md:pr-28">
        <div className="min-w-0">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.45, ease: "easeOut" }}
              className="flex flex-col gap-1.5"
            >
              <p className="truncate font-mono text-[11px] uppercase tracking-wide text-white/55">
                {t(`heroSlides.${slide.categoryKey}`)}
              </p>
              <Link
                href={`/projects/${slide.id}`}
                onClick={() => trackCTAClick("view_project", "hero")}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-white/85 transition-colors hover:text-white"
              >
                <span className="truncate">{slide.title}</span>
                <span className="hidden text-white/55 sm:inline">· {t("viewProject")}</span>
                <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0 rtl:-scale-x-100" />
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex shrink-0 items-center gap-2" role="tablist" aria-label={t("slides")}>
          {SLIDES.map((s, i) => {
            const active = i === index;
            return (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={active}
                aria-label={`${s.title} (${i + 1}/${count})`}
                onClick={() => goTo(i)}
                className="group flex h-6 w-8 items-center focus-visible:outline-none md:w-10"
              >
                <span className="relative block h-0.5 w-full overflow-hidden bg-white/20 group-focus-visible:ring-2 group-focus-visible:ring-white/60">
                  {active && (
                    <motion.span
                      key={`${i}-${timerKey}`}
                      className="absolute inset-0 origin-left bg-white rtl:origin-right"
                      initial={{ scaleX: paused ? 1 : 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: paused ? 0 : AUTO_ADVANCE_MS / 1000, ease: "linear" }}
                    />
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
