"use client";

import { useState } from "react";
import { Link } from "@/i18n/routing";
import { ArrowRight, Globe } from "lucide-react";
import type { Project } from "@/types";

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
  const [useFallback, setUseFallback] = useState(false);
  const [screenshotError, setScreenshotError] = useState(false);

  const thumbnailSrc = `/img/projects/${project.id}-thumbnail.webp`;
  const screenshotSrc = project.live_url
    ? `/api/screenshot?url=${encodeURIComponent(project.live_url)}`
    : null;

  return (
    <Link
      href={`/projects/${project.id}`}
      className="group relative block overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/30 hover:shadow-lg"
    >
      <div className="relative aspect-[19/10] w-full overflow-hidden bg-muted">
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

        {/* Layer 2: Local thumbnail → screenshot API fallback */}
        {!useFallback && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={thumbnailSrc}
            alt={project.title}
            width={800}
            height={600}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 z-[1] h-full w-full object-cover object-top"
            onError={() => setUseFallback(true)}
          />
        )}
        {useFallback && screenshotSrc && !screenshotError && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={screenshotSrc}
            alt={project.title}
            width={800}
            height={600}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 z-[1] h-full w-full object-cover object-top"
            onError={() => setScreenshotError(true)}
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
