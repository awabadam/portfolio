"use client";

import { useEffect, useMemo, useState } from "react";
import { animate, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Lock, RotateCcw } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/effects";
import { QUESTION_IDS, computeResult, type Answer, type ClinicProfile, type QuestionId } from "@/lib/audit";
import type { ScanChecks } from "@/lib/auditScan";
import type { ChapterPreview } from "@/lib/playbook";
import { PLAYBOOK_META } from "@/lib/playbookMeta";
import { formatPrice, getTier } from "@/lib/pricing";
import AuditLeadForm from "./AuditLeadForm";
import { hostOf } from "./AuditScanStep";

interface AuditResultProps {
  answers: Record<QuestionId, Answer>;
  /** Website entered in the scan step, used to prefill the form. */
  website?: string;
  /** Scan checks to send along with the submission. */
  scan?: ScanChecks | null;
  /** Lead question answers (around the site questions), sent with the submission. */
  profile?: Partial<ClinicProfile>;
  /** Playbook chapter previews for this locale (all 10), to show the 3 matching the fixes. */
  chapters?: ChapterPreview[];
  /** Email from the first step, shown in the form. */
  email?: string;
  /** Token of the partial lead saved on the email step; the form completes that lead. */
  partialToken?: string | null;
  /** The form was sent: the partial lead is now complete. */
  onSubmitted?: () => void;
  onRetake: () => void;
}

const RING_SIZE = 220;
const RING_STROKE = 6;
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRC = 2 * Math.PI * RING_RADIUS;

export default function AuditResult({
  answers,
  website = "",
  scan = null,
  profile = {},
  chapters = [],
  email = "",
  partialToken = null,
  onSubmitted,
  onRetake,
}: AuditResultProps) {
  const t = useTranslations("audit");
  const reduceMotion = useReducedMotion();
  const result = useMemo(() => computeResult(answers), [answers]);
  const { score, band, fixes } = result;
  const yes = QUESTION_IDS.filter((id) => answers[id] === "yes").length;
  const summary =
    yes === QUESTION_IDS.length || !fixes[0]
      ? t("summaryAllDone")
      : t("summaryLine", { yes, gap: t(`gaps.${fixes[0]}`) });
  const previewChapters = fixes
    .map((id) => ({ id, chapter: chapters.find((c) => c.id === id), n: chapters.findIndex((c) => c.id === id) + 1 }))
    .filter((x): x is { id: QuestionId; chapter: ChapterPreview; n: number } => x.chapter !== undefined);

  // Count up from 0 to the score once the result mounts.
  const [shown, setShown] = useState(reduceMotion ? score : 0);
  useEffect(() => {
    if (reduceMotion) {
      setShown(score);
      return;
    }
    const controls = animate(0, score, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setShown(Math.round(v)),
    });
    return () => controls.stop();
  }, [score, reduceMotion]);

  return (
    <>
      {/* Score */}
      <section className="bg-black text-white">
        <div className="container mx-auto px-5 py-12 md:px-8 md:py-28">
          <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-16">
            <div className="flex justify-center lg:col-span-5 lg:justify-start">
              {/* Smaller ring on phones so the score and the band stay above the fold at 390px. */}
              <div className="relative h-40 w-40 md:h-[220px] md:w-[220px]">
                <svg
                  viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
                  className="h-full w-full -rotate-90"
                  aria-hidden="true"
                >
                  <circle
                    cx={RING_SIZE / 2}
                    cy={RING_SIZE / 2}
                    r={RING_RADIUS}
                    fill="none"
                    stroke="rgba(255,255,255,0.15)"
                    strokeWidth={RING_STROKE}
                  />
                  <motion.circle
                    cx={RING_SIZE / 2}
                    cy={RING_SIZE / 2}
                    r={RING_RADIUS}
                    fill="none"
                    stroke="#fff"
                    strokeWidth={RING_STROKE}
                    strokeLinecap="round"
                    strokeDasharray={RING_CIRC}
                    initial={{ strokeDashoffset: RING_CIRC }}
                    animate={{ strokeDashoffset: RING_CIRC * (1 - score / 100) }}
                    transition={{ duration: reduceMotion ? 0 : 1.4, ease: [0.22, 1, 0.36, 1] }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-display text-[56px] leading-none tracking-tighter tabular-nums md:text-[72px]">
                    {shown}
                  </span>
                  <span className="mt-2 font-mono text-[11px] uppercase tracking-widest text-white/60">
                    {t("resultOutOf")}
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-5 font-mono text-label text-white/60"
              >
                {website ? t("resultEyebrowSite", { host: hostOf(website) }) : t("resultEyebrow")}
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="font-display text-hero text-balance"
              >
                {t(`bands.${band}.name`)}
              </motion.h1>
              {/* What's in place and the one gap that costs the most. */}
              <motion.p
                initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="mt-5 max-w-xl border-s-2 border-white/30 ps-4 text-base leading-relaxed text-white/90 md:mt-6 md:text-lg"
              >
                {summary}
              </motion.p>
              <motion.button
                type="button"
                onClick={onRetake}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-white/60 transition-colors hover:text-white"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                {t("retake")}
              </motion.button>
            </div>
          </div>
        </div>
      </section>

      {/* Fixes */}
      <section className="border-b border-border">
        <div className="container mx-auto px-5 py-12 md:px-8 md:py-28">
          <ScrollReveal animation="fadeUp" threshold={0.1}>
            <h2 className="font-display text-heading text-balance">{t("fixesHeading")}</h2>
            <p className="mt-3 max-w-xl text-muted-foreground">{t("fixesIntro")}</p>
          </ScrollReveal>

          <StaggerContainer className="mt-8 grid gap-4 md:mt-12 lg:grid-cols-3" staggerDelay={0.1}>
            {fixes.map((id, i) => (
              <StaggerItem key={id} animation="fadeUp">
                <article className="flex h-full flex-col rounded-[10px] border border-border bg-card p-5 md:p-8">
                  <div className="mb-5 flex items-center justify-between md:mb-6">
                    <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                      {t("fixLabel", { n: i + 1 })}
                    </span>
                    <span className="rounded-full border border-border px-2.5 py-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                      {t("yourAnswer")}: {t(answers[id])}
                    </span>
                  </div>
                  <h3 className="font-display text-card-title text-balance">{t(`questions.${id}.q`)}</h3>
                  <p className="mt-4 flex-1 text-base leading-relaxed text-muted-foreground">
                    {t(`questions.${id}.fix`)}
                  </p>
                  <p className="mt-5 border-t border-border pt-4 text-sm leading-relaxed">
                    <span className="me-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                      {t("impactLabel")}
                    </span>
                    <span className="font-medium">{t(`questions.${id}.impact`)}</span>
                  </p>
                </article>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Your playbook: the 3 chapters that match the fixes, locked until the form is sent */}
      {previewChapters.length > 0 && (
        <section className="border-b border-border bg-muted/40">
          <div className="container mx-auto px-5 py-12 md:px-8 md:py-24">
            <ScrollReveal animation="fadeUp" threshold={0.1}>
              <p className="mb-5 font-mono text-label text-muted-foreground">{t("playbook.previewEyebrow")}</p>
              <h2 className="font-display text-heading text-balance">{t("playbook.previewHeading")}</h2>
              <p className="mt-3 max-w-xl text-muted-foreground">
                {t("playbook.previewText", { templates: PLAYBOOK_META.templates })}
              </p>
            </ScrollReveal>
            <StaggerContainer className="mt-8 grid gap-4 md:mt-12 lg:grid-cols-3" staggerDelay={0.1}>
              {previewChapters.map(({ id, chapter, n }) => (
                <StaggerItem key={id} animation="fadeUp">
                  <article className="flex h-full flex-col rounded-[10px] border border-border bg-card p-5 md:p-8">
                    <div className="mb-5 flex items-center justify-between md:mb-6">
                      <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                        {t("playbook.chapterLabel", { n })} · {t("playbook.minutes", { n: chapter.minutes })}
                      </span>
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground"
                        title={t("playbook.locked")}
                      >
                        <Lock className="h-3 w-3" aria-hidden="true" />
                        <span className="sr-only">{t("playbook.locked")}</span>
                      </span>
                    </div>
                    <h3 className="font-display text-card-title text-balance">{chapter.title}</h3>
                    <p className="mt-4 flex-1 text-base leading-relaxed text-muted-foreground">{chapter.promise}</p>
                    <p className="mt-5 border-t border-border pt-4 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                      {t("playbook.included", { n: chapter.templates })}
                    </p>
                  </article>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      )}

      {/* Personal audit */}
      <section id="personal-audit" className="scroll-mt-24">
        <div className="container mx-auto px-5 py-20 md:px-8 md:py-28">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <ScrollReveal animation="fadeUp" threshold={0.1} className="lg:col-span-5">
              <p className="mb-5 font-mono text-label text-muted-foreground">
                {t("ctaBlock.eyebrow")}
              </p>
              <h2 className="font-display text-heading text-balance">{t("ctaHeading")}</h2>
              <p className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg">{t("ctaText")}</p>
              {/* Reason to act now: true by construction (limited by Awab's time), no counters. */}
              <p className="mt-5 border-s-2 border-foreground/30 ps-4 text-base leading-relaxed">{t("ctaReason")}</p>
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{t("ctaDiy", { price: formatPrice(getTier("business").price) })}</p>
            </ScrollReveal>
            <ScrollReveal animation="fadeUp" delay={0.1} threshold={0.1} className="lg:col-span-7">
              <p className="mb-4 flex items-start gap-3 text-base font-medium leading-relaxed">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
                  <Lock className="h-3 w-3" aria-hidden="true" />
                </span>
                {t("playbook.formLine", { templates: PLAYBOOK_META.templates })}
              </p>
              <AuditLeadForm
                answers={answers}
                result={result}
                initialWebsite={website}
                initialEmail={email}
                partialToken={partialToken}
                onSubmitted={onSubmitted}
                scan={scan}
                profile={profile}
              />
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  );
}
