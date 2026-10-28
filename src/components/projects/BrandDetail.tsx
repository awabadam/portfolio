"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Project } from "@/types";
import { Link } from "@/i18n/routing";
import type { BrandStudy } from "@/data/brand-studies";
import { GlassPill } from "@/components/ui/glass-pill";
import AuditCta from "@/components/audit/AuditCta";
import RelatedLinks from "@/components/seo/RelatedLinks";

const EASE = [0.22, 1, 0.36, 1] as const;

const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, delay, ease: EASE },
});

const SECTION_LABEL = "mb-6 font-mono text-xs uppercase tracking-wide text-muted-foreground";

interface BrandDetailProps {
  project: Project;
  study: BrandStudy;
  nextProject: Project;
}

// Image-led case study for brand work: a short hero, the snapshot, then the
// Behance boards as one continuous stack. Website case studies use ProjectDetail.
export default function BrandDetail({ project, study, nextProject }: BrandDetailProps) {
  const t = useTranslations("projects");
  const behance = study.behance || project.behance_url;

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="container mx-auto px-5 pb-12 pt-32 md:px-8 md:pb-16">
        <div>
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mb-6 flex flex-wrap items-center gap-4"
          >
            <span className="rounded-md border border-border px-3 py-1 text-label text-muted-foreground">
              {project.category}
            </span>
            {project.role && <span className="text-sm text-muted-foreground">{project.role}</span>}
          </motion.div>

          {/* The headline leads with the outcome, the client name sits above */}
          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            className="max-w-5xl font-display text-heading"
          >
            <span className="mb-4 block font-mono text-label text-muted-foreground">{project.title}</span>
            <span lang="en" dir="auto" className="block">{study.headline}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
            lang="en"
            dir="auto"
            className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-xl"
          >
            {study.intro}
          </motion.p>

          {behance && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
              className="mt-8"
            >
              <GlassPill href={behance} external tone="dark" arrow>
                {t("viewOnBehance")}
              </GlassPill>
            </motion.div>
          )}
        </div>
      </section>

      {/* Snapshot */}
      <section className="container mx-auto px-5 md:px-8">
        <motion.dl
          {...reveal()}
          className="grid grid-cols-2 gap-x-6 gap-y-8 border-y border-border py-8 md:grid-cols-4"
        >
          {[
            { label: t("snapshotClient"), value: study.client },
            { label: t("snapshotMarket"), value: t(`markets.${study.market}`) },
            { label: t("snapshotScope"), value: study.scope.map((key) => t(`brandScope.${key}`)).join(", ") },
            { label: t("snapshotYear"), value: study.year },
          ].map((item) => (
            <div key={item.label} className="min-w-0">
              <dt className="mb-2 font-mono text-xs uppercase tracking-wide text-muted-foreground">
                {item.label}
              </dt>
              <dd className="text-sm leading-relaxed">{item.value}</dd>
            </div>
          ))}
        </motion.dl>
      </section>

      {/* Boards: designed as one Behance-style stack, so they sit edge to edge
          with no gaps, capped at their 2000px source width. */}
      <section className="pt-16 md:pt-24">
        <div className="container mx-auto px-5 md:px-8">
          <h2 className={SECTION_LABEL}>{t("brandBoardsHeading")}</h2>
        </div>
        <div className="mx-auto max-w-[2000px]">
          {study.boards.map((board, i) => (
            <Image
              key={board.src}
              src={board.src}
              alt={board.alt}
              lang="en"
              width={board.width}
              height={board.height}
              sizes="(min-width: 2000px) 2000px, 100vw"
              quality={85}
              priority={i === 0}
              className="block h-auto w-full"
            />
          ))}
        </div>
      </section>

      {/* The offer behind this work */}
      <section className="border-t border-border py-16 md:py-24">
        <div className="container mx-auto grid gap-6 px-5 md:grid-cols-12 md:px-8">
          <p className={`${SECTION_LABEL} md:col-span-4`}>{t("brandServiceKicker")}</p>
          <motion.div {...reveal()} className="md:col-span-8">
            <h2 className="max-w-2xl text-balance font-display text-heading">{t("brandServiceHeading")}</h2>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {t("brandServiceText")}
            </p>
            <GlassPill href="/services/clinic-branding" tone="dark" arrow className="mt-8">
              {t("brandServiceButton")}
            </GlassPill>
          </motion.div>
        </div>
      </section>

      {/* Lead magnet: the free readiness check, shared with services and pricing */}
      <AuditCta variant="services" location="brand_case_study" />

      {/* Internal links back to the offer */}
      <div className="container mx-auto px-5 pb-20 md:px-8 md:pb-24">
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
            <h2 className="font-display text-heading">{nextProject.title}</h2>
            <ArrowRight
              aria-hidden="true"
              className="mt-6 h-6 w-6 text-muted-foreground transition-transform duration-500 group-hover:translate-x-2 rtl:-scale-x-100 rtl:group-hover:-translate-x-2"
            />
          </div>
        </Link>
      </section>
    </main>
  );
}
