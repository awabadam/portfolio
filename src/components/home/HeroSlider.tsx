"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
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
  image: string;
}

const SLIDES: Slide[] = [
  { id: "jouvence", title: "Jouvence", categoryKey: "jouvence", image: "/img/projects/jouvence-thumbnail.webp" },
  { id: "saphiredent", title: "SaphireDent", categoryKey: "saphiredent", image: "/img/projects/saphiredent-thumbnail.webp" },
  { id: "esteexpert", title: "EsteExpert Clinic", categoryKey: "esteexpert", image: "/img/projects/esteexpert-thumbnail.webp" },
];

// Image slides advance on a timer; showreel slides advance when the video ends.
const AUTO_ADVANCE_MS = 6000;
const CROSSFADE_S = 0.9;
// Showreels are 16:10, so they're only used where a landscape crop makes sense.
const VIDEO_QUERY = "(min-width: 768px)";

export default function HeroSlider() {
  const t = useTranslations("home");
  const locale = useLocale() as Locale;
  const rtl = isRtl(locale);
  const reducedMotion = useReducedMotion() ?? false;

  const [index, setIndex] = useState(0);
  const [hidden, setHidden] = useState(false);
  // Bumped on manual navigation so the auto-advance timer restarts.
  const [timerKey, setTimerKey] = useState(0);

  const [wide, setWide] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const progressRef = useRef<HTMLSpanElement | null>(null);

  const count = SLIDES.length;
  const paused = reducedMotion || hidden;
  const videoMode = wide && !reducedMotion && !videoFailed;

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

  useEffect(() => {
    const mq = window.matchMedia(VIDEO_QUERY);
    const onChange = () => setWide(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Keep the showreel in step with tab visibility.
  useEffect(() => {
    const video = videoRef.current;
    if (!videoMode || !video) return;
    if (hidden) video.pause();
    else video.play().catch(() => {});
  }, [hidden, index, videoMode]);

  // In video mode the progress bar tracks playback instead of a timer.
  useEffect(() => {
    if (!videoMode) return;
    let raf = 0;
    const tick = () => {
      const video = videoRef.current;
      const bar = progressRef.current;
      if (video && bar && video.duration) {
        bar.style.transform = `scaleX(${video.currentTime / video.duration})`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [videoMode, index]);

  // Auto-advance (image mode only).
  useEffect(() => {
    if (paused || videoMode) return;
    const id = window.setTimeout(() => {
      setIndex((i) => (i + 1) % count);
    }, AUTO_ADVANCE_MS);
    return () => window.clearTimeout(id);
  }, [index, timerKey, paused, videoMode, count]);

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
      {/* Media: project showreels, darkened so the message reads on top. */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <AnimatePresence initial={false}>
          <motion.div
            key={slide.id}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : CROSSFADE_S, ease: "linear" }}
          >
            <Image
              src={slide.image}
              alt=""
              fill
              sizes="100vw"
              quality={85}
              priority={index === 0}
              className="object-cover"
            />
            {videoMode && (
              <video
                ref={(el) => {
                  videoRef.current = el;
                  return () => {
                    if (videoRef.current === el) videoRef.current = null;
                  };
                }}
                className="absolute inset-0 h-full w-full object-cover"
                poster={`/video/projects/${slide.id}-poster.webp`}
                autoPlay
                muted
                playsInline
                preload="auto"
                onEnded={() => goTo(index + 1)}
                onError={() => setVideoFailed(true)}
              >
                <source src={`/video/projects/${slide.id}.webm`} type="video/webm" />
                <source
                  src={`/video/projects/${slide.id}.mp4`}
                  type="video/mp4"
                  onError={() => setVideoFailed(true)}
                />
              </video>
            )}
          </motion.div>
        </AnimatePresence>
        {/* Scrim: flat darkening plus a heavier band behind the copy and the bottom bar. */}
        <div className="pointer-events-none absolute inset-0 bg-black/45" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/75" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/55 via-black/15 to-transparent rtl:bg-gradient-to-l" />
      </div>

      {/* Message */}
      <div className="container flex flex-1 flex-col justify-center px-5 pb-10 pt-32 md:px-8 md:pb-16 md:pt-40">
        <div className="max-w-4xl">
          <p className="font-mono text-label text-white/70">{t("heroKicker")}</p>
          <h1 className="mt-5 max-w-[16ch] font-display text-hero text-white [text-wrap:balance]">
            {t("heroHeadline")}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/85 md:text-lg">{t("heroSubline")}</p>
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
                  {active && videoMode && (
                    <span
                      key={`${i}-video`}
                      ref={progressRef}
                      className="absolute inset-0 origin-left scale-x-0 bg-white rtl:origin-right"
                    />
                  )}
                  {active && !videoMode && (
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
