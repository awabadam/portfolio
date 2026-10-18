"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";
import { GlassPill } from "@/components/ui/glass-pill";
import { cn } from "@/lib/utils";
import ChoiceButton from "./ChoiceButton";

export interface QuestionOption {
  value: string;
  label: string;
}

interface AuditQuestionProps {
  /** Changes per question: drives the swap animation and the focus move. */
  stepKey: string;
  /** 1-based position and total, shown as "Question {current} of {total}". */
  current: number;
  total: number;
  question: string;
  /** Short line or block under the question. */
  note?: ReactNode;
  options: QuestionOption[];
  isSelected: (value: string) => boolean;
  onChoose: (value: string) => void;
  /** Multi-select: answers toggle, and a Continue button moves on. */
  multi?: boolean;
  onContinue?: () => void;
  onBack: () => void;
}

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * One question of the check: counter, progress bar, the question, numbered
 * answers (keys 1-n), Continue for multi-select and Back. Every question of
 * the check (lead and site questions) renders through this one component.
 */
export default function AuditQuestion({
  stepKey,
  current,
  total,
  question,
  note,
  options,
  isSelected,
  onChoose,
  multi = false,
  onContinue,
  onBack,
}: AuditQuestionProps) {
  const t = useTranslations("audit");
  const reduceMotion = useReducedMotion();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const canContinue = multi && options.some((o) => isSelected(o.value));
  const progressLabel = t("progress", { current, total });

  // Keyboard: number keys pick, Enter continues a multi-select, Backspace goes back.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      // Enter on a focused button already clicks it.
      if (e.key === "Enter" && target?.tagName === "BUTTON") return;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const n = Number(e.key);
      if (Number.isInteger(n) && n >= 1 && n <= options.length) {
        e.preventDefault();
        onChoose(options[n - 1].value);
      } else if (e.key === "Enter" && canContinue && onContinue) {
        e.preventDefault();
        onContinue();
      } else if (e.key === "Backspace") {
        e.preventDefault();
        onBack();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // Move focus to the new question so screen readers and keyboard users follow along.
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, [stepKey]);

  return (
    <div className="mx-auto max-w-2xl pt-4 md:pt-8">
      {/* Progress */}
      <div className="mb-10 flex items-center justify-between gap-4">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{progressLabel}</p>
        <p className="hidden font-mono text-xs text-muted-foreground md:block">
          {t("keyboardHint", { n: options.length })}
        </p>
      </div>
      <div
        className="mb-12 h-px w-full bg-border"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={current - 1}
        aria-label={progressLabel}
      >
        <motion.div
          className="h-px origin-left bg-foreground rtl:origin-right"
          initial={false}
          animate={{ scaleX: Math.max((current - 1) / total, 0.02) }}
          transition={{ duration: reduceMotion ? 0 : 0.5, ease }}
          style={{ width: "100%" }}
        />
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={stepKey}
          initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduceMotion ? 0 : -12, transition: { duration: 0.18 } }}
          transition={{ duration: 0.4, ease }}
        >
          <h2 ref={headingRef} tabIndex={-1} className="font-display text-heading text-balance outline-none">
            {question}
          </h2>
          {note && <div className="mt-4">{note}</div>}

          <div
            className={cn("mt-10 grid gap-3", options.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2")}
            role="group"
            aria-label={question}
          >
            {options.map((o, i) => (
              <ChoiceButton
                key={o.value}
                n={i + 1}
                label={o.label}
                selected={isSelected(o.value)}
                multi={multi}
                onClick={() => onChoose(o.value)}
              />
            ))}
          </div>

          {multi && (
            <GlassPill
              tone="dark"
              arrow
              onClick={canContinue ? onContinue : undefined}
              className={cn("mt-8 h-12 px-6 text-base", !canContinue && "pointer-events-none opacity-40")}
            >
              {t("continue")}
            </GlassPill>
          )}
        </motion.div>
      </AnimatePresence>

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
