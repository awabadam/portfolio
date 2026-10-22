"use client";

import { useRef, useState, type PointerEvent } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Project } from "@/types";
import { cn } from "@/lib/utils";
import { GlassPill } from "@/components/ui/glass-pill";
import { trackProjectClick } from "@/lib/analytics/gtm";

export interface WorkCardProps {
  project: Project;
  index?: number;
  priority?: boolean;
  aspect?: "wide" | "tall";
  className?: string;
}

const ASPECT_CLASS: Record<NonNullable<WorkCardProps["aspect"]>, string> = {
  wide: "aspect-[16/11]",
  tall: "aspect-[4/5]",
};

// Projects with a rendered showreel in public/video/projects (see showreel/).
const SHOWREELS = new Set(["jouvence", "saphiredent", "esteexpert", "omar-marketing", "gymtrack", "quran-app"]);

const IMAGE_CLASS =
  "absolute inset-0 z-[1] h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]";

export default function WorkCard({
  project,
  index = 0,
  priority = false,
  aspect = "wide",
  className,
}: WorkCardProps) {
  const t = useTranslations("home");
  const tp = useTranslations("projects");
  const imageAlt = tp("imageAlt", { title: project.title });
  const reduceMotion = useReducedMotion();
  const [useFallback, setUseFallback] = useState(false);
  const [screenshotError, setScreenshotError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoOn, setVideoOn] = useState(false);
  const hasVideo = SHOWREELS.has(project.id) && !reduceMotion;

  // Play the showreel on hover (fine pointers only); rewind on leave.
  const startVideo = (e: PointerEvent) => {
    if (!hasVideo || e.pointerType !== "mouse") return;
    setVideoOn(true);
    videoRef.current?.play().catch(() => setVideoOn(false));
  };
  const stopVideo = () => {
    const video = videoRef.current;
    setVideoOn(false);
    if (!video) return;
    video.pause();
    video.currentTime = 0;
  };

  const thumbnailSrc = `/img/projects/${project.id}-thumbnail.webp`;
  const screenshotSrc = project.live_url
    ? `/api/screenshot?url=${encodeURIComponent(project.live_url)}`
    : null;

  const handleClick = () => {
    trackProjectClick(project.title, "work_card");
  };

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      <Link
        href={`/projects/${project.id}`}
        onClick={handleClick}
        onPointerEnter={startVideo}
        onPointerLeave={stopVideo}
        className={cn(
          "group relative isolate block w-full overflow-hidden rounded-[10px] bg-neutral-900 text-white",
          ASPECT_CLASS[aspect]
        )}
      >
        {/* Layer 0: Gradient placeholder (final fallback) */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-neutral-800 via-neutral-900 to-black">
          <span className="px-6 text-center font-display text-card-title text-white/60">
            {project.title}
          </span>
        </div>

        {/* Layer 1: Local thumbnail (optimized, 2x-ready) -> screenshot API fallback */}
        {!useFallback ? (
          <Image
            src={thumbnailSrc}
            alt={imageAlt}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            quality={85}
            priority={priority}
            className={IMAGE_CLASS}
            onError={() => setUseFallback(true)}
          />
        ) : null}
        {useFallback && screenshotSrc && !screenshotError ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={screenshotSrc}
            alt={imageAlt}
            width={1600}
            height={1100}
            loading="lazy"
            decoding="async"
            className={IMAGE_CLASS}
            onError={() => setScreenshotError(true)}
          />
        ) : null}

        {hasVideo ? (
          <video
            ref={videoRef}
            aria-hidden="true"
            className={cn(
              "absolute inset-0 z-[1] h-full w-full object-cover transition-opacity duration-500",
              videoOn ? "opacity-100" : "opacity-0"
            )}
            muted
            loop
            playsInline
            preload="none"
          >
            <source src={`/video/projects/${project.id}.webm`} type="video/webm" />
            <source src={`/video/projects/${project.id}.mp4`} type="video/mp4" />
          </video>
        ) : null}

        {/* Layer 2: Scrim */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[2]"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,0.55) 100%)",
          }}
        />

        {/* Layer 3: Content row */}
        <div className="absolute inset-x-0 bottom-0 z-[3] flex items-end justify-between gap-4 p-5 md:p-6">
          <div className="min-w-0">
            <p className="mb-2 text-label text-white/80">{project.category}</p>
            <h3 className="font-display text-card-title text-white">
              {project.title}
            </h3>
          </div>
          <GlassPill as="span" className="hidden group-hover:bg-white/25 md:inline-flex">
            {t("viewProject")}
          </GlassPill>
        </div>
      </Link>
    </motion.div>
  );
}
