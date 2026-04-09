"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Link } from "@/i18n/routing";
import { ArrowRight, Globe } from "lucide-react";
import type { Project } from "@/types";

const IFRAME_WIDTH = 1440;
const IFRAME_HEIGHT = 1080;

interface ClinicProjectCardProps {
  project: Project;
  viewCaseStudyLabel: string;
}

/**
 * Clinic services page project card — mirrors the homepage ProjectCard
 * layered-preview pattern (placeholder → screenshot → iframe) but links
 * to the internal /projects/[id] case study page instead of the external
 * live URL. Used on /services/clinic-websites.
 */
export default function ClinicProjectCard({
  project,
  viewCaseStudyLabel,
}: ClinicProjectCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.3);
  const [screenshotError, setScreenshotError] = useState(false);
  const useIframe = project.live_url && !project.iframe_blocked;

  const updateScale = useCallback(() => {
    if (containerRef.current) {
      setScale(containerRef.current.offsetWidth / IFRAME_WIDTH);
    }
  }, []);

  useEffect(() => {
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [updateScale]);

  return (
    <Link
      href={`/projects/${project.id}`}
      className="group relative block overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/30 hover:shadow-lg"
    >
      <div
        ref={containerRef}
        className="relative aspect-[4/3] w-full overflow-hidden bg-muted"
      >
        {/* Layer 1: Gradient placeholder (final fallback) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-muted via-muted/80 to-muted/60">
          <Globe className="h-10 w-10 text-muted-foreground/40" />
          <span className="text-sm font-medium text-muted-foreground/60">
            {project.title}
          </span>
          {project.live_url && (
            <span className="text-xs text-muted-foreground/40">
              {new URL(project.live_url).hostname.replace("www.", "")}
            </span>
          )}
        </div>

        {/* Layer 2: Screenshot (covers placeholder while iframe loads) */}
        {project.live_url && !screenshotError && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={`/api/screenshot?url=${encodeURIComponent(project.live_url)}`}
            alt={project.title}
            width={800}
            height={600}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 z-[1] h-full w-full object-cover object-top"
            onError={() => setScreenshotError(true)}
          />
        )}

        {/* Layer 3: Iframe (covers screenshot if the site allows framing) */}
        {useIframe && (
          <iframe
            src={project.live_url}
            title={project.title}
            className="pointer-events-none absolute left-0 top-0 z-[2] origin-top-left border-0"
            style={{
              width: `${IFRAME_WIDTH}px`,
              height: `${IFRAME_HEIGHT}px`,
              transform: `scale(${scale})`,
            }}
            sandbox="allow-scripts allow-same-origin"
            loading="lazy"
          />
        )}
      </div>

      <div className="p-6">
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {project.category}
          </span>
        </div>
        <h3 className="mb-2 font-display text-2xl font-bold">{project.title}</h3>
        <p className="mb-4 text-sm text-muted-foreground">{project.description}</p>
        <span className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-all group-hover:gap-3">
          {viewCaseStudyLabel}
          <ArrowRight className="h-4 w-4 rtl:rotate-180" />
        </span>
      </div>
    </Link>
  );
}
