"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Project } from "@/types";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { ClipReveal } from "@/components/effects";

interface ProjectListProps {
  projects: Project[];
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });
  const [useFallback, setUseFallback] = useState(false);
  const [screenshotError, setScreenshotError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const thumbnailSrc = `/img/projects/${project.id}-thumbnail.webp`;
  const screenshotSrc = project.live_url
    ? `/api/screenshot?url=${encodeURIComponent(project.live_url)}`
    : null;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 80 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 80 }}
      transition={{
        duration: 0.8,
        delay: index * 0.15,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link
        href={`/projects/${project.id}`}
        className="group block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Thumbnail Container */}
        <ClipReveal mode="center-x">
        <div className="relative aspect-[19/10] w-full overflow-hidden rounded-lg bg-muted shadow-[0_2px_4px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.06)] transition-shadow duration-500 group-hover:shadow-[0_8px_24px_rgba(0,0,0,0.1),0_24px_60px_rgba(0,0,0,0.14)] [clip-path:inset(0_round_0.5rem)]">
          {/* Layer 1: Gradient placeholder */}
          <div className="absolute inset-0 bg-gradient-to-br from-muted via-muted/80 to-muted/60" />

          {/* Layer 2: Local thumbnail → screenshot API fallback */}
          {!useFallback && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={thumbnailSrc}
              alt={project.title}
              className="absolute inset-0 z-[1] h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
              loading="lazy"
              decoding="async"
              onError={() => setUseFallback(true)}
            />
          )}
          {useFallback && screenshotSrc && !screenshotError && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={screenshotSrc}
              alt={project.title}
              className="absolute inset-0 z-[1] h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
              loading="lazy"
              decoding="async"
              onError={() => setScreenshotError(true)}
            />
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 z-10 flex items-end bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <div className="flex w-full items-end justify-between p-6 md:p-8">
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-black transition-transform duration-300 group-hover:scale-110">
                <ArrowUpRight className="h-5 w-5" />
              </div>
            </div>
          </div>

          {/* Subtle scale on hover */}
          <motion.div
            className="absolute inset-0 z-[3]"
            animate={{ scale: isHovered ? 1.03 : 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ pointerEvents: "none" }}
          />
        </div>
        </ClipReveal>

        {/* Project Info */}
        <div className="mt-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-bold tracking-tight transition-colors duration-300 group-hover:text-muted-foreground md:text-2xl">
              {project.title}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground md:text-base">
              {project.description}
            </p>
          </div>
          <span className="shrink-0 rounded-full border border-border px-3 py-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {project.category}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

export default function ProjectList({ projects }: ProjectListProps) {
  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 gap-10 md:gap-14 lg:grid-cols-2">
        {projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </div>
  );
}
