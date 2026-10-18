"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { AlertCircle, ArrowLeft, Check, ChevronDown, X } from "lucide-react";
import { GlassPill } from "@/components/ui/glass-pill";
import { cn } from "@/lib/utils";
import { ANSWER_VALUES, QUESTION_IDS, type Answer, type Answers, type QuestionId } from "@/lib/audit";
import { questionEvidence, type ScanSuccess } from "@/lib/auditScan";

interface AuditReviewProps {
  scan: ScanSuccess;
  answers: Answers;
  /** Host shown above the list. */
  host: string;
  /** Seconds the scan took, shown in the note. */
  seconds: number;
  onChange: (id: QuestionId, value: Answer) => void;
  onContinue: () => void;
  onRescan: () => void;
  onBack: () => void;
}

const ANSWER_CLASS: Record<Answer, string> = {
  yes: "bg-foreground text-background",
  partly: "bg-amber-500 text-black",
  no: "bg-red-600 text-white",
};

const ease = [0.22, 1, 0.36, 1] as const;

function AnswerIcon({ value }: { value: Answer }) {
  const Icon = value === "yes" ? Check : value === "partly" ? AlertCircle : X;
  return (
    <span
      className={cn("mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full", ANSWER_CLASS[value])}
      aria-hidden="true"
    >
      <Icon className="h-3 w-3" strokeWidth={3} />
    </span>
  );
}

/**
 * "We checked {n} things on your site": one row per question the scan
 * answered, with what it saw. Tapping a row opens yes / partly / no to
 * correct it; the answers here replace those questions in the sequence.
 */
export default function AuditReview({
  scan,
  answers,
  host,
  seconds,
  onChange,
  onContinue,
  onRescan,
  onBack,
}: AuditReviewProps) {
  const t = useTranslations("audit");
  const tScan = useTranslations("audit.scan");
  const reduceMotion = useReducedMotion();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [open, setOpen] = useState<QuestionId | null>(null);

  const evidence = questionEvidence(scan.checks);
  const ids = QUESTION_IDS.filter((id) => scan.suggestedAnswers[id] !== undefined);

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, []);

  const pick = (id: QuestionId, value: Answer) => {
    onChange(id, value);
    setOpen(null);
    // Return focus to the row so keyboard users keep their place.
    requestAnimationFrame(() => document.getElementById(`audit-review-${id}`)?.focus());
  };

  return (
    <div className="mx-auto max-w-2xl pt-4 md:pt-8">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{t("review.eyebrow")}</p>
        <p className="truncate font-mono text-xs text-foreground" dir="ltr">
          {host}
        </p>
      </div>
      <h2 ref={headingRef} tabIndex={-1} className="font-display text-heading text-balance outline-none">
        {t("review.heading", { n: ids.length })}
      </h2>
      <p className="mt-4 text-base leading-relaxed text-muted-foreground">{t("review.text")}</p>

      <ul className="mt-8 divide-y divide-border border-y border-border">
        {ids.map((id) => {
          const value = answers[id] ?? scan.suggestedAnswers[id]!;
          const ev = evidence[id];
          const changed = value !== scan.suggestedAnswers[id];
          const isOpen = open === id;
          const label = tScan(`rows.${id}`);
          return (
            <li key={id}>
              <button
                type="button"
                id={`audit-review-${id}`}
                onClick={() => setOpen(isOpen ? null : id)}
                aria-expanded={isOpen}
                aria-controls={`audit-review-${id}-choices`}
                className="group flex w-full items-start gap-3 py-3.5 text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <AnswerIcon value={value} />
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <span className="text-base font-medium leading-tight">{label}</span>
                    {changed && (
                      <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                        {t("review.changed")}
                      </span>
                    )}
                  </span>
                  {ev && (
                    <span className="mt-1 block text-sm leading-snug text-muted-foreground">
                      {tScan(`evidence.${ev.code}`, ev.params)}
                    </span>
                  )}
                </span>
                <span className="inline-flex h-8 min-w-[5.5rem] shrink-0 items-center justify-between gap-1.5 rounded-full border border-border bg-card ps-3 pe-2 text-sm font-medium transition-colors group-hover:border-foreground/60">
                  <span className="sr-only">{t("review.answerLabel")}: </span>
                  {t(value)}
                  <ChevronDown
                    className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform", isOpen && "rotate-180")}
                    aria-hidden="true"
                  />
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="choices"
                    initial={{ opacity: 0, height: reduceMotion ? "auto" : 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: reduceMotion ? "auto" : 0 }}
                    transition={{ duration: 0.25, ease }}
                    className="overflow-hidden"
                  >
                    <div
                      id={`audit-review-${id}-choices`}
                      role="group"
                      aria-label={t(`questions.${id}.q`)}
                      className="pb-4 ps-8"
                    >
                      <p className="mb-2.5 text-sm leading-snug">{t(`questions.${id}.q`)}</p>
                      <div className="grid grid-cols-3 gap-2">
                        {ANSWER_VALUES.map((a) => {
                          const selected = value === a;
                          return (
                            <button
                              key={a}
                              type="button"
                              onClick={() => pick(id, a)}
                              aria-pressed={selected}
                              className={cn(
                                "h-11 rounded-[8px] border text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                                selected
                                  ? "border-foreground bg-foreground text-background"
                                  : "border-border bg-card hover:border-foreground/60",
                              )}
                            >
                              {t(a)}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>

      <p className="mt-4 text-xs leading-snug text-muted-foreground">
        {t("review.note", { seconds })}
        {scan.checks.speed.pagespeed ? "" : ` ${tScan("speedNote")}`}
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
        <GlassPill tone="dark" arrow onClick={onContinue} className="h-12 px-6 text-base">
          {tScan("continue")}
        </GlassPill>
        <button
          type="button"
          onClick={onRescan}
          className="inline-flex min-h-11 items-center text-sm font-medium underline-offset-4 hover:underline"
        >
          {tScan("rescan")}
        </button>
      </div>

      <div className="mt-10 flex items-center">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
          {t("back")}
        </button>
      </div>
    </div>
  );
}
