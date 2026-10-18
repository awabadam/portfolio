"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { Project } from "@/types";
import { Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { ArrowUpRight, ArrowLeft, Globe, ArrowRight, CheckCircle } from "lucide-react";
import { GlassPill } from "@/components/ui/glass-pill";
import { getCaseStudy } from "@/data/case-studies";
import AuditCta from "@/components/audit/AuditCta";
import RelatedLinks from "@/components/seo/RelatedLinks";

const IFRAME_WIDTH = 1440;
const IFRAME_HEIGHT = 900;
const EASE = [0.22, 1, 0.36, 1] as const;

const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, delay, ease: EASE },
});

const SECTION_LABEL = "mb-6 font-mono text-xs uppercase tracking-wide text-muted-foreground";

interface ProjectDetailProps {
  project: Project;
  nextProject: Project;
}

export default function ProjectDetail({
  project,
  nextProject,
}: ProjectDetailProps) {
  const t = useTranslations("projects");
  const locale = useLocale();
  const caseStudy = getCaseStudy(project.id);
  const languageNames = new Intl.DisplayNames([locale], { type: "language" });
  const hostname = project.live_url ? new URL(project.live_url).hostname.replace("www.", "") : null;
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
      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative flex min-h-[70vh] flex-col justify-end px-4 pb-12 pt-32 md:min-h-[60vh] md:pb-16"
      >
        <div className="container mx-auto">
          {/* Back navigation sits in the flow so it never collides with the site header */}
          <Link
            href="/projects"
            className="group mb-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft
              aria-hidden="true"
              className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:translate-x-0.5"
            />
            {t("viewAllWork")}
          </Link>

          {/* Category + Number */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6 flex items-center gap-4"
          >
            <span className="rounded-md border border-border px-3 py-1 text-label text-muted-foreground">
              {project.category}
            </span>
            {project.role && (
              <span className="text-sm text-muted-foreground">
                {project.role}
              </span>
            )}
          </motion.div>

          {/* Title — case studies lead with the outcome, the client name sits above */}
          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            className={caseStudy ? "max-w-5xl font-display text-heading" : "font-display text-hero"}
          >
            {caseStudy ? (
              <>
                <span className="mb-4 block font-mono text-label text-muted-foreground">{project.title}</span>
                <span lang="en" dir="auto" className="block">{caseStudy.headline}</span>
              </>
            ) : (
              project.title
            )}
          </motion.h1>

          {!caseStudy && (
            <motion.p
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
              className="mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl"
            >
              {project.description}
            </motion.p>
          )}

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
            <div className={caseStudy ? "hidden" : "flex flex-wrap gap-2"}>
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="rounded-md bg-muted px-3 py-1 text-label text-muted-foreground"
                >
                  {tech}
                </span>
              ))}
            </div>

            {project.live_url && (
              <GlassPill href={project.live_url} external tone="dark" arrow>
                {t("visitLive")}
              </GlassPill>
            )}
          </motion.div>
        </div>
      </motion.section>

      {/* Snapshot */}
      {caseStudy ? (
        <section className="container mx-auto px-5 md:px-8">
          <motion.dl
            {...reveal()}
            className="grid grid-cols-2 gap-x-6 gap-y-8 border-y border-border py-8 md:grid-cols-5"
          >
            {[
              { label: t("snapshotMarket"), value: t(`markets.${caseStudy.market}`) },
              {
                label: t("snapshotLanguages"),
                value: caseStudy.languages.map((code) => languageNames.of(code) ?? code).join(", "),
              },
              {
                label: t("snapshotScope"),
                value: caseStudy.services.map((key) => t(`services.${key}`)).join(", "),
              },
              { label: t("snapshotYear"), value: caseStudy.year },
              { label: t("snapshotWebsite"), value: hostname, href: project.live_url },
            ].map(
              (item) =>
                item.value && (
                  <div key={item.label} className="min-w-0">
                    <dt className="mb-2 font-mono text-xs uppercase tracking-wide text-muted-foreground">
                      {item.label}
                    </dt>
                    <dd className="text-sm leading-relaxed">
                      {item.href ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 underline-offset-4 hover:underline"
                        >
                          {item.value}
                          <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5 rtl:-scale-x-100" />
                        </a>
                      ) : (
                        item.value
                      )}
                    </dd>
                  </div>
                ),
            )}
          </motion.dl>
        </section>
      ) : (
        <div className="container mx-auto px-4">
          <div className="h-px w-full bg-border" />
        </div>
      )}

      {/* Gallery: clean shots of the live site (home large, then treatment + RTL) */}
      {caseStudy?.gallery && caseStudy.gallery.length > 0 ? (
        <section className="px-4 py-16 md:py-24">
          <div className="container mx-auto">
            <h2 className={SECTION_LABEL}>{t("galleryHeading")}</h2>
            <div className="grid gap-5 md:grid-cols-2 md:gap-6">
              {caseStudy.gallery.map((image, i) => (
                <motion.figure
                  key={image.src}
                  {...reveal(i === 0 ? 0 : 0.08 * i)}
                  className={i === 0 ? "md:col-span-2" : undefined}
                >
                  <div className="relative aspect-[16/10] overflow-hidden rounded-[10px] border border-border/60 bg-muted">
                    <Image
                      src={image.src}
                      alt={`${project.title}: ${t(`gallery.${image.captionKey}`)}`}
                      fill
                      sizes={i === 0 ? "(min-width: 1312px) 1248px, 100vw" : "(min-width: 768px) 50vw, 100vw"}
                      quality={85}
                      priority={i === 0}
                      className="object-cover object-top"
                    />
                  </div>
                  <figcaption className="mt-3 flex items-center gap-3 font-mono text-xs uppercase tracking-wide text-muted-foreground">
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    <span>{t(`gallery.${image.captionKey}`)}</span>
                  </figcaption>
                </motion.figure>
              ))}
            </div>

            {project.live_url && (
              <motion.div {...reveal(0.2)} className="mt-10 flex justify-center">
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 text-lg font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  <span>{hostname}</span>
                  <ArrowUpRight aria-hidden="true" className="h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" />
                </a>
              </motion.div>
            )}
          </div>
        </section>
      ) : (
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
                loading="lazy"
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
      )}

      {caseStudy ? (
        <>
          {/* Metrics — only ever filled with client-confirmed numbers */}
          {caseStudy.metrics && caseStudy.metrics.length > 0 && (
            <section className="px-4 py-16 md:py-24">
              <div className="container mx-auto">
                <h2 className={SECTION_LABEL}>{t("resultsHeading")}</h2>
                <dl className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
                  {caseStudy.metrics.map((metric, i) => (
                    <motion.div key={metric.label} {...reveal(i * 0.08)} className="flex flex-col-reverse">
                      <dt className="mt-2 text-muted-foreground">{metric.label}</dt>
                      <dd className="font-display text-hero leading-none">{metric.value}</dd>
                    </motion.div>
                  ))}
                </dl>
              </div>
            </section>
          )}

          {/* Challenge */}
          <section className="border-t border-border px-4 py-16 md:py-24">
            <div className="container mx-auto grid gap-6 md:grid-cols-12">
              <h2 className={`${SECTION_LABEL} md:col-span-4`}>{t("challenge")}</h2>
              <motion.p {...reveal()} lang="en" dir="auto" className="text-xl leading-relaxed md:col-span-8 md:text-2xl">
                {caseStudy.challenge}
              </motion.p>
            </div>
          </section>

          {/* Key decisions */}
          <section className="border-t border-border px-4 py-16 md:py-24">
            <div className="container mx-auto grid gap-6 md:grid-cols-12">
              <h2 className={`${SECTION_LABEL} md:col-span-4`}>{t("decisionsHeading")}</h2>
              <ol className="divide-y divide-border md:col-span-8">
                {caseStudy.decisions.map((decision, i) => (
                  <motion.li
                    key={decision.title}
                    {...reveal(i * 0.05)}
                    className="grid gap-2 py-6 first:pt-0 sm:grid-cols-[3rem_1fr]"
                  >
                    <span className="font-mono text-sm text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div lang="en" dir="auto">
                      <h3 className="font-display text-card-title">{decision.title}</h3>
                      <p className="mt-2 text-lg leading-relaxed text-muted-foreground">{decision.body}</p>
                    </div>
                  </motion.li>
                ))}
              </ol>
            </div>
          </section>

          {/* Client quote */}
          {caseStudy.quote && (
            <section className="border-t border-border px-4 py-16 md:py-24">
              <motion.figure {...reveal()} className="container mx-auto max-w-4xl">
                <blockquote className="font-display text-heading">“{caseStudy.quote.text}”</blockquote>
                <figcaption className="mt-6 text-muted-foreground">
                  {caseStudy.quote.author}, {caseStudy.quote.role}
                </figcaption>
              </motion.figure>
            </section>
          )}
        </>
      ) : (
        <>
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
                  <h2 className="mb-4 font-mono text-xs uppercase tracking-wide text-muted-foreground">
                    {t("overviewHeading")}
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
                  <h2 className="mb-4 font-mono text-xs uppercase tracking-wide text-muted-foreground">
                    {t("objectivesHeading")}
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
              <h2 className="mb-8 font-mono text-xs uppercase tracking-wide text-muted-foreground">
                {t("approachHeading")}
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
              <h2 className="mb-6 font-mono text-xs uppercase tracking-wide text-muted-foreground">
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
        </>
      )}

      {/* Lead magnet: the free readiness check, shared with services and pricing */}
      <AuditCta variant="services" location="case_study" />

      {/* Internal links back to the offer */}
      <div className="container mx-auto px-4 pb-20 md:pb-24">
        <RelatedLinks items={["services", "pricing", "audit"]} />
      </div>

      {/* Next Project */}
      <section className="border-t border-border">
        <Link
          href={`/projects/${nextProject.id}`}
          className="group block px-4 py-24 transition-colors hover:bg-muted/30 md:py-32"
        >
          <div className="container mx-auto flex flex-col items-center text-center">
            <span className="mb-4 font-mono text-xs uppercase tracking-wide text-muted-foreground">
              {t("nextCaseStudy")}
            </span>
            <h2 className="font-display text-heading">
              {nextProject.title}
            </h2>
            <ArrowRight aria-hidden="true" className="mt-6 h-6 w-6 text-muted-foreground transition-transform duration-500 group-hover:translate-x-2 rtl:-scale-x-100 rtl:group-hover:-translate-x-2" />
          </div>
        </Link>
      </section>
    </main>
  );
}
