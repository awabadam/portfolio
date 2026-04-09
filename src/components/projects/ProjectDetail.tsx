"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Project } from "@/types";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { ArrowUpRight, ArrowLeft, Globe, ArrowRight, CheckCircle } from "lucide-react";

const IFRAME_WIDTH = 1440;
const IFRAME_HEIGHT = 900;

interface ProjectDetailProps {
  project: Project;
  nextProject: Project;
}

export default function ProjectDetail({
  project,
  nextProject,
}: ProjectDetailProps) {
  const t = useTranslations("projects");
  const heroRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [screenshotError, setScreenshotError] = useState(false);
  const [scale, setScale] = useState(0.5);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const updateScale = useCallback(() => {
    if (previewRef.current) {
      setScale(previewRef.current.offsetWidth / IFRAME_WIDTH);
    }
  }, []);

  useEffect(() => {
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [updateScale]);

  return (
    <main className="min-h-screen bg-background">
      {/* Back Navigation */}
      <div className="fixed left-6 top-6 z-50">
        <Link
          href="/projects"
          className="group flex items-center gap-2 rounded-full border border-border/50 bg-background/80 px-4 py-2 text-sm font-medium backdrop-blur-md transition-all hover:border-foreground/20 hover:bg-background"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          {t("viewAllWork")}
        </Link>
      </div>

      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative flex min-h-[70vh] flex-col justify-end px-4 pb-12 pt-32 md:min-h-[60vh] md:pb-16"
      >
        <div className="container mx-auto">
          {/* Category + Number */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6 flex items-center gap-4"
          >
            <span className="rounded-full border border-border px-3 py-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {project.category}
            </span>
            {project.role && (
              <span className="text-sm text-muted-foreground">
                {project.role}
              </span>
            )}
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="font-display text-5xl font-bold leading-none tracking-tighter md:text-7xl lg:text-8xl"
          >
            {project.title}
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl"
          >
            {project.description}
          </motion.p>

          {/* Tech + Visit Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.3,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-8 flex flex-wrap items-center gap-6"
          >
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
                >
                  {tech}
                </span>
              ))}
            </div>

            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-all hover:gap-3"
              >
                {t("visitLive")}
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            )}
          </motion.div>
        </div>
      </motion.section>

      {/* Divider */}
      <div className="container mx-auto px-4">
        <div className="h-px w-full bg-border" />
      </div>

      {/* Live Preview Section */}
      <section className="px-4 py-16 md:py-24">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            ref={previewRef}
            className="relative w-full overflow-hidden rounded-xl border border-border/50 bg-muted shadow-2xl [clip-path:inset(0_round_0.75rem)]"
            style={{ aspectRatio: "16 / 10" }}
          >
            {/* Layer 1: Placeholder */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-muted via-muted/80 to-muted/60">
              <Globe className="h-12 w-12 text-muted-foreground/30" />
              <span className="text-sm text-muted-foreground/50">
                {project.title}
              </span>
            </div>

            {/* Layer 2: Screenshot */}
            {project.live_url && !screenshotError && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={`/api/screenshot?url=${encodeURIComponent(project.live_url)}`}
                alt={project.title}
                className="absolute inset-0 z-[1] h-full w-full object-cover object-top"
                onError={() => setScreenshotError(true)}
              />
            )}

            {/* Layer 3: Iframe */}
            {project.live_url && !project.iframe_blocked && (
              <iframe
                src={project.live_url}
                title={project.title}
                className="pointer-events-none absolute left-0 top-0 z-[2] border-0"
                style={{
                  width: IFRAME_WIDTH,
                  height: IFRAME_HEIGHT,
                  transform: `scale(${scale})`,
                  transformOrigin: "top left",
                }}
                sandbox="allow-scripts allow-same-origin"
                loading="eager"
              />
            )}
          </motion.div>

          {/* Visit button below preview */}
          {project.live_url && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-8 flex justify-center"
            >
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 text-lg font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <span>
                  {new URL(project.live_url).hostname.replace("www.", "")}
                </span>
                <ArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </motion.div>
          )}
        </div>
      </section>

      {/* Project Info Grid */}
      {(project.overview || project.objectives) && (
        <section className="px-4 py-16 md:py-24">
          <div className="container mx-auto">
            <div className="grid gap-16 md:grid-cols-2">
              {project.overview && (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.8,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <h2 className="mb-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    Overview
                  </h2>
                  <p className="text-lg leading-relaxed">{project.overview}</p>
                </motion.div>
              )}

              {project.objectives && project.objectives.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.8,
                    delay: 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <h2 className="mb-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    Objectives
                  </h2>
                  <ul className="space-y-3">
                    {project.objectives.map((obj, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-lg leading-relaxed"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground" />
                        {obj}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Approach */}
      {project.approach && project.approach.length > 0 && (
        <section className="border-t border-border px-4 py-16 md:py-24">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto max-w-3xl"
            >
              <h2 className="mb-8 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                Approach
              </h2>
              <ul className="space-y-6">
                {project.approach.map((step, i) => (
                  <li key={i} className="flex items-start gap-4 text-lg leading-relaxed">
                    <span className="mt-1 font-mono text-sm text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </section>
      )}

      {/* Results */}
      {project.results && project.results.length > 0 && (
        <section className="px-4 py-16 md:py-24">
          <div className="container mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <h2 className="mb-6 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                {t("resultsHeading")}
              </h2>
              <ul className="space-y-4">
                {project.results.map((result, i) => (
                  <li key={i} className="flex items-start gap-3 text-lg leading-relaxed">
                    <CheckCircle className="mt-1 h-5 w-5 shrink-0 text-primary" />
                    {result}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="border-t border-border py-24 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <p className="font-mono text-sm uppercase tracking-widest text-muted-foreground">
            {t("ctaHeading")}
          </p>
          <Link
            href="/rate-calculator"
            className="mt-6 inline-block rounded-full bg-foreground px-10 py-4 text-base font-medium text-background transition-opacity hover:opacity-90"
          >
            {t("ctaButton")}
          </Link>
        </div>
      </section>

      {/* Next Project */}
      <section className="border-t border-border">
        <Link
          href={`/projects/${nextProject.id}`}
          className="group block px-4 py-24 transition-colors hover:bg-muted/30 md:py-32"
        >
          <div className="container mx-auto flex flex-col items-center text-center">
            <span className="mb-4 font-mono text-xs uppercase tracking-wider text-muted-foreground">
              {t("nextCaseStudy")}
            </span>
            <h2 className="font-display text-5xl font-bold tracking-tight transition-all duration-500 group-hover:tracking-normal md:text-7xl lg:text-8xl">
              {nextProject.title}
            </h2>
            <ArrowRight className="mt-6 h-6 w-6 text-muted-foreground transition-transform duration-500 group-hover:translate-x-2" />
          </div>
        </Link>
      </section>
    </main>
  );
}
