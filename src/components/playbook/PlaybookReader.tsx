"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowDown, ArrowUpRight, Check, ChevronDown, Copy, Download } from "lucide-react";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import { AUDIT_VERSION, computeResult, isAnswer, isComplete, isQuestionId, topFixes, type Answer, type Answers, type QuestionId } from "@/lib/audit";
import { PLAYBOOK_CHECKLIST_STORAGE, playbookPdf } from "@/lib/playbookMeta";
import type { Chapter, Playbook, Template } from "@/data/playbook/types";

interface PlaybookReaderProps {
  playbook: Playbook;
  /** Answers from the reader's latest finished check (looked up by the key's email), if any. */
  auditAnswers?: Answers | null;
}

type Ticks = Record<string, boolean>;

/**
 * Same key AuditExperience writes; read only. Fallback for when the server had
 * no answers for this key (e.g. the lead failed to save).
 */
const AUDIT_DRAFT_KEY = `clinic-audit-v${AUDIT_VERSION}`;

function readAuditAnswers(): Answers | null {
  try {
    const raw = window.sessionStorage.getItem(AUDIT_DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { stage?: string; answers?: Record<string, unknown> };
    if (parsed.stage !== "result" || !parsed.answers) return null;
    const answers: Answers = {};
    for (const [k, v] of Object.entries(parsed.answers)) {
      if (isQuestionId(k) && isAnswer(v)) answers[k] = v;
    }
    return isComplete(answers) ? answers : null;
  } catch {
    return null;
  }
}

function readTicks(): Ticks {
  try {
    const raw = window.localStorage.getItem(PLAYBOOK_CHECKLIST_STORAGE);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as Ticks) : {};
  } catch {
    return {};
  }
}

function writeTicks(ticks: Ticks) {
  try {
    window.localStorage.setItem(PLAYBOOK_CHECKLIST_STORAGE, JSON.stringify(ticks));
  } catch {
    // Blocked storage: ticks still work for this visit.
  }
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.insetInlineStart = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}

function downloadCsv(filename: string, body: string) {
  const content = "\ufeff" + body.replace(/\r?\n/g, "\r\n") + "\r\n";
  const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const eyebrowClass = "font-mono text-label text-muted-foreground";

/** In-page jump that works with Lenis (which can swallow native hash jumps on desktop). */
function jumpTo(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  e.preventDefault();
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  try {
    window.history.replaceState(null, "", `#${id}`);
  } catch {
    // ignore
  }
}

/** How a chapter relates to the reader's check: their answer, and its rank among the top fixes (1-3). */
interface ChapterFocus {
  answer: Answer;
  fixRank: number | null;
}

/** Without a check, open the three chapters that move inquiries the most (FIX_PRIORITY order). */
const DEFAULT_PRIORITY: QuestionId[] = topFixes({});

/** Package a "do it for me" request from a chapter maps to on the contact form. */
const DFY_PLAN: Partial<Record<QuestionId, string>> = { tracking: "growth-system" };

function isChapterDone(chapter: Chapter, ticks: Ticks): boolean {
  return chapter.checklist.every((_, i) => ticks[`${chapter.id}:${i}`]);
}

export default function PlaybookReader({ playbook, auditAnswers = null }: PlaybookReaderProps) {
  const t = useTranslations("audit.playbook.reader");
  const tp = useTranslations("audit.playbook");
  const locale = useLocale();

  const [ticks, setTicks] = useState<Ticks>({});
  const [answers, setAnswers] = useState<Answers | null>(auditAnswers);
  const [active, setActive] = useState<string>("");
  // Chapters opened by hand on top of the priority ones; "all" opens every chapter.
  const [opened, setOpened] = useState<Set<QuestionId>>(() => new Set());
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    setTicks(readTicks());
    if (!auditAnswers) setAnswers(readAuditAnswers());
  }, [auditAnswers]);

  const audit = useMemo(() => (answers ? computeResult(answers) : null), [answers]);
  const focusFor = (id: QuestionId): ChapterFocus | null => {
    const answer = answers?.[id];
    if (!answer || !audit) return null;
    const rank = audit.fixes.indexOf(id);
    // A "yes" never counts as a fix, even when it fills one of the 3 slots.
    return { answer, fixRank: rank === -1 || answer === "yes" ? null : rank + 1 };
  };

  // The chapters to start with: the reader's real fixes (gaps only), else the default three.
  const priority = useMemo(() => {
    const gaps = audit && answers ? audit.fixes.filter((id) => answers[id] !== "yes") : [];
    return gaps.length > 0 ? gaps : DEFAULT_PRIORITY;
  }, [audit, answers]);

  const isOpen = (id: QuestionId) => showAll || priority.includes(id) || opened.has(id);

  const openChapter = useCallback((id: QuestionId) => {
    setOpened((prev) => (prev.has(id) ? prev : new Set(prev).add(id)));
  }, []);

  /** Jump to a chapter, opening it first if it is collapsed. */
  const goToChapter = (e: React.MouseEvent<HTMLAnchorElement>, id: QuestionId) => {
    e.preventDefault();
    openChapter(id);
    // Wait a frame so the opened chapter has its full height before scrolling.
    requestAnimationFrame(() => {
      const el = document.getElementById(`chapter-${id}`);
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      try {
        window.history.replaceState(null, "", `#chapter-${id}`);
      } catch {
        // ignore
      }
    });
  };

  // Highlight the chapter in view in the sticky nav.
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const sections = playbook.chapters
      .map((c) => document.getElementById(`chapter-${c.id}`))
      .filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          setActive(visible[0].target.id);
        } else if (sections[0] && sections[0].getBoundingClientRect().top > window.innerHeight * 0.35) {
          // Above the first chapter (e.g. jumped back to the top): no chapter is current.
          setActive("");
        }
      },
      { rootMargin: "-20% 0px -65% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [playbook.chapters]);

  const toggle = useCallback((key: string) => {
    setTicks((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      if (!next[key]) delete next[key];
      writeTicks(next);
      return next;
    });
  }, []);

  const chapterIndex = (id: QuestionId) => playbook.chapters.findIndex((c) => c.id === id);
  const priorityChapters = priority
    .map((id) => playbook.chapters.find((c) => c.id === id))
    .filter((c): c is Chapter => c !== undefined);
  const priorityMinutes = priorityChapters.reduce((n, c) => n + c.minutes, 0);
  const fixesDone = priorityChapters.filter((c) => isChapterDone(c, ticks)).length;
  const itemsTotal = priorityChapters.reduce((n, c) => n + c.checklist.length, 0);
  const itemsDone = priorityChapters.reduce((n, c) => n + c.checklist.filter((_, i) => ticks[`${c.id}:${i}`]).length, 0);
  // First unfinished priority chapter, and its first unticked item: what to do today.
  const today = priorityChapters.find((c) => !isChapterDone(c, ticks)) ?? null;

  const pdf = playbookPdf(locale);
  const onPdf = () => trackEvent("playbook_pdf_download", { locale: pdf.locale });

  const pdfLink = (className: string) => (
    <a href={pdf.href} download onClick={onPdf} className={className}>
      <span className="inline-flex items-center gap-2">
        <Download className="h-4 w-4" aria-hidden="true" />
        {t("downloadPdf")}
      </span>
    </a>
  );

  return (
    <main className="min-h-screen bg-background pt-32">
      {/* Title */}
      <header className="container mx-auto px-5 md:px-8">
        <p className={cn("mb-5", eyebrowClass)}>{t("eyebrow")}</p>
        <h1 className="max-w-4xl font-display text-hero text-balance">{playbook.title}</h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">{playbook.subtitle}</p>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          {pdfLink(
            "inline-flex h-12 items-center rounded-full bg-foreground px-6 text-base font-medium text-background transition-colors hover:bg-foreground/85",
          )}
          {pdf.locale !== locale && <span className="text-xs text-muted-foreground">{t("pdfEnglish")}</span>}
          <Link href="/audit" className="inline-flex items-center gap-1 text-sm font-medium underline-offset-4 hover:underline">
            {t(audit ? "backToCheck" : "takeCheck")}
            <ArrowUpRight className="h-3.5 w-3.5 rtl:-scale-x-100" aria-hidden="true" />
          </Link>
        </div>
      </header>

      {/* Start here: the 3 chapters to read first, today's step and progress */}
      <section className="container mx-auto mt-12 px-5 md:mt-16 md:px-8">
        <div className="rounded-[10px] bg-black p-6 text-white md:p-8">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <p className="font-mono text-label text-white/60">{t(audit ? "fixesFirstEyebrow" : "startEyebrow")}</p>
            <p className="font-mono text-[11px] uppercase tracking-widest text-white/60">
              {t("progress", { done: fixesDone, total: priorityChapters.length, items: itemsDone, itemsTotal })}
            </p>
          </div>
          <p className="mt-2 max-w-xl text-base text-white/80">
            {audit
              ? t("fixesFirstText", { score: audit.score, n: priorityChapters.length, minutes: priorityMinutes })
              : t("startText", { minutes: priorityMinutes })}
          </p>
          <ol className={cn("mt-6 grid gap-3", priorityChapters.length > 1 && "md:grid-cols-3")}>
            {priorityChapters.map((chapter, i) => {
              const finished = isChapterDone(chapter, ticks);
              return (
                <li key={chapter.id}>
                  <a
                    href={`#chapter-${chapter.id}`}
                    onClick={(e) => goToChapter(e, chapter.id)}
                    className="group flex h-full flex-col rounded-[8px] border border-white/15 p-4 transition-colors hover:border-white/50"
                  >
                    <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-white/60">
                      {finished && <Check className="h-3.5 w-3.5 text-white" aria-hidden="true" />}
                      {i + 1} · {tp("chapterLabel", { n: chapterIndex(chapter.id) + 1 })} · {tp("minutes", { n: chapter.minutes })}
                    </span>
                    <span className={cn("mt-2 font-display text-xl leading-tight tracking-tight", finished && "text-white/50 line-through")}>
                      {chapter.title}
                    </span>
                    <span className="mt-3 inline-flex items-center gap-1 text-sm text-white/70 group-hover:text-white">
                      <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                  </a>
                </li>
              );
            })}
          </ol>
          {today && (
            <div className="mt-6 border-t border-white/15 pt-5">
              <p className="font-mono text-[11px] uppercase tracking-widest text-white/60">
                {t("todayLabel")} · {tp("chapterLabel", { n: chapterIndex(today.id) + 1 })}
              </p>
              <p className="mt-2 text-lg leading-snug">{today.steps[0]?.title}</p>
              {today.steps[0]?.body && <p className="mt-1 max-w-2xl text-sm leading-relaxed text-white/70">{today.steps[0].body}</p>}
            </div>
          )}
        </div>
      </section>

      <div className="container mx-auto px-5 pb-24 pt-12 md:px-8 md:pt-16 lg:grid lg:grid-cols-12 lg:gap-12">
        {/* Chapter nav: sticky on desktop, a plain list on phones */}
        <aside className="mb-12 lg:col-span-3 lg:mb-0">
          <nav aria-label={t("contents")} className="lg:sticky lg:top-28">
            <p className={cn("mb-4", eyebrowClass)}>{t("contents")}</p>
            <ol className="space-y-1">
              {playbook.chapters.map((c, i) => {
                const id = `chapter-${c.id}`;
                const isActive = active === id;
                const focus = focusFor(c.id);
                const isGap = priority.includes(c.id) || (focus !== null && focus.answer !== "yes");
                const rank = focus?.fixRank ?? (audit ? null : DEFAULT_PRIORITY.indexOf(c.id) + 1 || null);
                const finished = isChapterDone(c, ticks);
                return (
                  <li key={c.id}>
                    <a
                      href={`#${id}`}
                      onClick={(e) => goToChapter(e, c.id)}
                      aria-current={isActive ? "true" : undefined}
                      className={cn(
                        "flex items-baseline gap-3 rounded-[6px] px-2 py-1.5 text-sm leading-snug transition-colors hover:text-foreground",
                        isActive ? "bg-muted text-foreground" : "text-muted-foreground",
                      )}
                    >
                      <span className="w-5 shrink-0 font-mono text-[11px] tabular-nums">
                        {finished ? <Check className="inline h-3.5 w-3.5 text-foreground" aria-label={t("chapterDone")} /> : String(i + 1).padStart(2, "0")}
                      </span>
                      <span className={cn(isGap && !finished && "text-foreground", finished && "line-through")}>{c.title}</span>
                      {isGap && !finished && (
                        <span
                          className={cn(
                            "ms-auto shrink-0 self-center rounded-full font-mono text-[10px] leading-none",
                            rank ? "bg-foreground px-1.5 py-1 text-background" : "h-1.5 w-1.5 bg-foreground/50",
                          )}
                          title={rank ? t("navFix", { n: rank }) : t("navGap")}
                        >
                          {rank ? (
                            <>
                              {rank}
                              <span className="sr-only"> {t("navFix", { n: rank })}</span>
                            </>
                          ) : (
                            <span className="sr-only">{t("navGap")}</span>
                          )}
                        </span>
                      )}
                    </a>
                  </li>
                );
              })}
              <li className="pt-2">
                <a href="#quick-wins" onClick={(e) => jumpTo(e, "quick-wins")} className="flex items-baseline gap-3 rounded-[6px] px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground">
                  <span className="w-5 shrink-0 font-mono text-[11px]">+</span>
                  <span>{t("quickWinsEyebrow")}</span>
                </a>
              </li>
              <li>
                <a href="#summary" onClick={(e) => jumpTo(e, "summary")} className="flex items-baseline gap-3 rounded-[6px] px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground">
                  <span className="w-5 shrink-0 font-mono text-[11px]">=</span>
                  <span>{t("summaryEyebrow")}</span>
                </a>
              </li>
            </ol>
            <button
              type="button"
              onClick={() => {
                setShowAll((v) => !v);
                trackEvent("playbook_show_all", { on: !showAll });
              }}
              aria-pressed={showAll}
              className="mt-4 inline-flex min-h-11 items-center px-2 text-sm font-medium underline-offset-4 hover:underline"
            >
              {t(showAll ? "showFocus" : "showAll")}
            </button>
          </nav>
        </aside>

        {/* Body */}
        <div className="max-w-prose lg:col-span-8 lg:col-start-5">
          <p className="text-base leading-relaxed text-muted-foreground md:text-lg">{playbook.intro}</p>

          {playbook.chapters.map((chapter, i) => {
            const focus = focusFor(chapter.id);
            const next = playbook.chapters[i + 1] ?? null;
            const isGap = priority.includes(chapter.id) || (focus !== null && focus.answer !== "yes");
            return isOpen(chapter.id) ? (
              <ChapterSection
                key={chapter.id}
                chapter={chapter}
                index={i}
                next={next}
                focus={focus}
                offerHelp={isGap}
                ticks={ticks}
                onToggle={toggle}
                onNext={goToChapter}
              />
            ) : (
              <CollapsedChapter
                key={chapter.id}
                chapter={chapter}
                index={i}
                focus={focus}
                finished={isChapterDone(chapter, ticks)}
                onOpen={() => {
                  openChapter(chapter.id);
                  trackEvent("playbook_chapter_open", { chapter: chapter.id });
                }}
              />
            );
          })}

          {/* Quick wins */}
          <section id="quick-wins" className="mt-16 scroll-mt-28 border-t border-border pt-12">
            <p className={cn("mb-4", eyebrowClass)}>{t("quickWinsEyebrow")}</p>
            <h2 className="font-display text-heading text-balance">{t("quickWinsHeading")}</h2>
            <ol className="mt-8 space-y-4">
              {playbook.quickWins.map((win, i) => (
                <li key={i} className="flex gap-4">
                  <span className="w-7 shrink-0 font-mono text-[12px] tabular-nums text-muted-foreground pt-1">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-base leading-relaxed">{win}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* Summary */}
          <section id="summary" className="mt-16 scroll-mt-28 border-t border-border pt-12">
            <p className={cn("mb-4", eyebrowClass)}>{t("summaryEyebrow")}</p>
            <h2 className="font-display text-heading text-balance">{t("summaryHeading")}</h2>
            <ol className="mt-8 space-y-4">
              {playbook.summary.map((line, i) => (
                <li key={i} className="flex gap-4">
                  <span className="w-7 shrink-0 font-mono text-[12px] tabular-nums text-muted-foreground pt-1">{String(i + 1).padStart(2, "0")}</span>
                  <span className={cn("text-base leading-relaxed", i === playbook.summary.length - 1 && "text-muted-foreground")}>{line}</span>
                </li>
              ))}
            </ol>
          </section>

          <p className="mt-16 border-t border-border pt-8 text-sm leading-relaxed text-muted-foreground">{t("help")}</p>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            {pdfLink(
              "inline-flex h-11 items-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-foreground/85",
            )}
            <span className="text-xs text-muted-foreground">{t(pdf.locale !== locale ? "pdfEnglish" : "pdfHint")}</span>
          </div>
        </div>
      </div>
    </main>
  );
}

/** A chapter the reader has not opened: one row with its promise, their answer and time. */
function CollapsedChapter({
  chapter,
  index,
  focus,
  finished,
  onOpen,
}: {
  chapter: Chapter;
  index: number;
  focus: ChapterFocus | null;
  finished: boolean;
  onOpen: () => void;
}) {
  const t = useTranslations("audit.playbook.reader");
  const tp = useTranslations("audit.playbook");

  return (
    <section id={`chapter-${chapter.id}`} className="mt-6 scroll-mt-28 first-of-type:mt-16">
      <button
        type="button"
        onClick={onOpen}
        aria-expanded={false}
        className="group flex w-full items-start gap-4 rounded-[10px] border border-border bg-card p-5 text-start transition-colors hover:border-foreground/40 md:p-6"
      >
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            {tp("chapterLabel", { n: index + 1 })} · {tp("minutes", { n: chapter.minutes })}
            {focus && <> · {t(answerKey(focus.answer, true))}</>}
            {finished && <> · {t("chapterDone")}</>}
          </p>
          <h2 className="mt-2 font-display text-xl leading-tight tracking-tight md:text-2xl">{chapter.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{chapter.promise}</p>
        </div>
        <span className="mt-1 inline-flex shrink-0 items-center gap-1 text-sm font-medium">
          <span className="hidden sm:inline">{t("openChapter")}</span>
          <ChevronDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" aria-hidden="true" />
        </span>
      </button>
    </section>
  );
}

/** i18n key for the reader's answer: the full line in an open chapter, the short label on a collapsed row. */
function answerKey(answer: Answer, short = false): string {
  const base = answer === "yes" ? "answerYes" : answer === "partly" ? "answerPartly" : "answerNo";
  return short ? `${base}Short` : base;
}

/** Folded section (why it matters, templates, mistakes): the label stays visible, the content opens on click. */
function Fold({ label, children, defaultOpen = false }: { label: string; children: React.ReactNode; defaultOpen?: boolean }) {
  return (
    <details open={defaultOpen} className="group mt-6 border-t border-border pt-4">
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">
        <span className={eyebrowClass}>{label}</span>
        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden="true" />
      </summary>
      <div className="pb-2 pt-4">{children}</div>
    </details>
  );
}

function ChapterSection({
  chapter,
  index,
  next,
  focus,
  offerHelp,
  ticks,
  onToggle,
  onNext,
}: {
  chapter: Chapter;
  index: number;
  next: Chapter | null;
  focus: ChapterFocus | null;
  offerHelp: boolean;
  ticks: Ticks;
  onToggle: (key: string) => void;
  onNext: (e: React.MouseEvent<HTMLAnchorElement>, id: QuestionId) => void;
}) {
  const t = useTranslations("audit.playbook.reader");
  const tp = useTranslations("audit.playbook");
  const done = chapter.checklist.filter((_, i) => ticks[`${chapter.id}:${i}`]).length;
  const dfyPlan = DFY_PLAN[chapter.id] ?? "clinic-website";

  return (
    <section id={`chapter-${chapter.id}`} className="mt-16 scroll-mt-28 border-t border-border pt-12">
      <p className={cn("mb-4", eyebrowClass)}>
        {tp("chapterLabel", { n: index + 1 })} · {tp("minutes", { n: chapter.minutes })}
      </p>
      <h2 className="font-display text-heading text-balance">{chapter.title}</h2>

      {focus && (
        <p
          className={cn(
            "mt-5 inline-flex flex-wrap items-center gap-x-2 gap-y-1 rounded-[8px] px-3 py-2 text-sm",
            focus.answer === "yes" ? "bg-muted text-muted-foreground" : "bg-foreground text-background",
          )}
        >
          {focus.fixRank && (
            <span className="font-mono text-[11px] uppercase tracking-widest opacity-70">{t("fixTag", { n: focus.fixRank })}</span>
          )}
          <span>{t(answerKey(focus.answer))}</span>
        </p>
      )}

      <div className="mt-6 border-s-2 border-foreground/30 ps-4">
        <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">{t("promiseLabel")}</p>
        <p className="mt-2 text-base leading-relaxed md:text-lg">{chapter.promise}</p>
      </div>

      {/* Steps */}
      <div className="mt-10">
        <p className={cn("mb-4", eyebrowClass)}>{t("stepsLabel")}</p>
        <ol className="space-y-6">
          {chapter.steps.map((step, i) => (
            <li key={i} className="flex gap-4">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-foreground font-mono text-[12px] text-background">
                {i + 1}
              </span>
              <div>
                <h3 className="text-base font-medium leading-snug md:text-lg">{step.title}</h3>
                <p className="mt-1.5 text-base leading-relaxed text-muted-foreground">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Checklist */}
      <div className="mt-10 rounded-[10px] border border-border bg-card p-5 md:p-6">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <p className={eyebrowClass}>{t("checklistLabel")}</p>
          <span className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            {t("checklistProgress", { done, total: chapter.checklist.length })}
          </span>
        </div>
        <ul className="space-y-2.5">
          {chapter.checklist.map((item, i) => {
            const key = `${chapter.id}:${i}`;
            const checked = Boolean(ticks[key]);
            return (
              <li key={i}>
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggle(key)}
                    className="mt-1 h-4 w-4 shrink-0 cursor-pointer appearance-none rounded-[4px] border border-foreground/50 bg-background checked:border-foreground checked:bg-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  />
                  <span className={cn("text-base leading-relaxed", checked && "text-muted-foreground line-through")}>{item}</span>
                </label>
              </li>
            );
          })}
        </ul>
        <p className="mt-4 text-xs text-muted-foreground">{t("checklistSaved")}</p>
      </div>

      {/* Done when */}
      <div className="mt-6 rounded-[10px] bg-black p-5 text-white md:p-6">
        <p className="mb-2 font-mono text-label text-white/60">{t("doneLabel")}</p>
        <p className="text-base leading-relaxed">{chapter.done}</p>
      </div>

      {/* Reference material, folded so the chapter reads as a to-do list */}
      <div className="mt-8">
        {chapter.templates.length > 0 && (
          <Fold label={`${t("templatesLabel")} (${chapter.templates.length})`}>
            <div className="space-y-6">
              {chapter.templates.map((tpl) => (
                <TemplateBlock key={tpl.id} template={tpl} />
              ))}
            </div>
          </Fold>
        )}
        <Fold label={t("whyLabel")}>
          <div className="space-y-4">
            {chapter.why.map((p, i) => (
              <p key={i} className="text-base leading-relaxed text-muted-foreground">
                {p}
              </p>
            ))}
          </div>
        </Fold>
        <Fold label={`${t("mistakesLabel")} (${chapter.mistakes.length})`}>
          <ul className="space-y-2.5">
            {chapter.mistakes.map((m, i) => (
              <li key={i} className="flex gap-3 text-base leading-relaxed text-muted-foreground">
                <span aria-hidden="true" className="mt-[11px] h-px w-3 shrink-0 bg-foreground/40" />
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </Fold>
      </div>

      {/* Done for you: one quiet line on the chapters that are gaps for this reader */}
      {offerHelp && (
        <p className="mt-8 text-sm leading-relaxed text-muted-foreground">
          {t("dfyText")}{" "}
          <Link
            href={`/contact?plan=${dfyPlan}`}
            onClick={() => trackEvent("playbook_dfy_click", { chapter: chapter.id, plan: dfyPlan })}
            className="font-medium text-foreground underline underline-offset-4 hover:no-underline"
          >
            {t("dfyCta")}
          </Link>
        </p>
      )}

      {next && (
        <a
          href={`#chapter-${next.id}`}
          onClick={(e) => onNext(e, next.id)}
          className="mt-8 inline-flex items-center gap-2 text-sm font-medium underline-offset-4 hover:underline"
        >
          {t("nextChapter")}: {next.title}
          <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      )}
    </section>
  );
}

function TemplateBlock({ template }: { template: Template }) {
  const t = useTranslations("audit.playbook.reader");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(id);
  }, [copied]);

  const onCopy = async () => {
    const ok = await copyText(template.body);
    if (ok) {
      setCopied(true);
      trackEvent("playbook_copy", { template: template.id });
    }
  };

  const onDownload = () => {
    downloadCsv(`${template.id}.csv`, template.body);
    trackEvent("playbook_download", { template: template.id });
  };

  // Tables and CSV are English identifiers laid out in columns; keep them LTR in every locale.
  const ltr = template.kind === "csv" || template.kind === "table";

  return (
    <article className="overflow-hidden rounded-[10px] border border-border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3 md:px-5">
        <div className="min-w-0">
          <h4 className="text-sm font-medium leading-snug">{template.title}</h4>
          <p className="mt-0.5 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">{template.kind}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {template.kind === "csv" && (
            <button
              type="button"
              onClick={onDownload}
              className="inline-flex h-8 items-center gap-1.5 rounded-[6px] border border-border px-3 text-xs font-medium transition-colors hover:border-foreground/60"
            >
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              {t("download")}
            </button>
          )}
          <button
            type="button"
            onClick={onCopy}
            aria-live="polite"
            className="inline-flex h-8 items-center gap-1.5 rounded-[6px] bg-foreground px-3 text-xs font-medium text-background transition-colors hover:bg-foreground/85"
          >
            {copied ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
            {copied ? t("copied") : t("copy")}
          </button>
        </div>
      </div>
      {template.note && <p className="px-4 pt-3 text-sm leading-relaxed text-muted-foreground md:px-5">{template.note}</p>}
      <pre
        dir={ltr ? "ltr" : "auto"}
        className={cn(
          "overflow-x-auto whitespace-pre-wrap break-words px-4 py-4 font-mono text-[13px] leading-relaxed md:px-5",
          ltr && "text-left",
        )}
      >
        {template.body}
      </pre>
    </article>
  );
}
