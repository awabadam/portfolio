"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowDown, ArrowUpRight, Check, Copy, Download, Printer } from "lucide-react";
import { Link } from "@/i18n/routing";
import { GlassPill } from "@/components/ui/glass-pill";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import { AUDIT_VERSION, computeResult, isAnswer, isComplete, isQuestionId, type Answers, type QuestionId } from "@/lib/audit";
import { PLAYBOOK_CHECKLIST_STORAGE } from "@/lib/playbookMeta";
import type { Chapter, Playbook, Template } from "@/data/playbook/types";

interface PlaybookReaderProps {
  playbook: Playbook;
}

type Ticks = Record<string, boolean>;

/** Same key AuditExperience writes; read only, to put the reader's 3 fixes first. */
const AUDIT_DRAFT_KEY = `clinic-audit-v${AUDIT_VERSION}`;

function readAuditFixes(): { score: number; fixes: QuestionId[] } | null {
  try {
    const raw = window.sessionStorage.getItem(AUDIT_DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { stage?: string; answers?: Record<string, unknown> };
    if (parsed.stage !== "result" || !parsed.answers) return null;
    const answers: Answers = {};
    for (const [k, v] of Object.entries(parsed.answers)) {
      if (isQuestionId(k) && isAnswer(v)) answers[k] = v;
    }
    if (!isComplete(answers)) return null;
    const result = computeResult(answers);
    return { score: result.score, fixes: result.fixes };
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

export default function PlaybookReader({ playbook }: PlaybookReaderProps) {
  const t = useTranslations("audit.playbook.reader");
  const tp = useTranslations("audit.playbook");

  const [ticks, setTicks] = useState<Ticks>({});
  const [audit, setAudit] = useState<{ score: number; fixes: QuestionId[] } | null>(null);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    setTicks(readTicks());
    setAudit(readAuditFixes());
  }, []);

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

  const totalMinutes = useMemo(() => playbook.chapters.reduce((n, c) => n + c.minutes, 0), [playbook.chapters]);
  const totalTemplates = useMemo(() => playbook.chapters.reduce((n, c) => n + c.templates.length, 0), [playbook.chapters]);
  const chapterIndex = (id: QuestionId) => playbook.chapters.findIndex((c) => c.id === id);

  const print = () => {
    trackEvent("playbook_print");
    window.print();
  };

  return (
    <main className="min-h-screen bg-background pt-32 print:pt-0">
      {/* Title */}
      <header className="container mx-auto px-5 md:px-8">
        <p className={cn("mb-5", eyebrowClass)}>{t("eyebrow")}</p>
        <h1 className="max-w-4xl font-display text-hero text-balance">{playbook.title}</h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">{playbook.subtitle}</p>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-[12px] uppercase tracking-widest text-muted-foreground">
          <span>{playbook.chapters.length} {t("contents")}</span>
          <span>{totalTemplates} {t("templatesLabel")}</span>
          <span>{t("minutesTotal", { n: totalMinutes })}</span>
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 print:hidden">
          <GlassPill tone="dark" onClick={print} className="h-12 px-6 text-base">
            <span className="inline-flex items-center gap-2">
              <Printer className="h-4 w-4" aria-hidden="true" />
              {t("savePdf")}
            </span>
          </GlassPill>
          <Link href="/audit" className="inline-flex items-center gap-1 text-sm font-medium underline-offset-4 hover:underline">
            {t("backToCheck")}
            <ArrowUpRight className="h-3.5 w-3.5 rtl:-scale-x-100" aria-hidden="true" />
          </Link>
        </div>
      </header>

      {/* Your 3 fixes first (only when the check was finished in this browser) */}
      {audit && (
        <section className="container mx-auto mt-12 px-5 md:mt-16 md:px-8 print:hidden">
          <div className="rounded-[10px] bg-black p-6 text-white md:p-8">
            <p className="mb-2 font-mono text-label text-white/60">{t("fixesFirstEyebrow")}</p>
            <p className="max-w-xl text-base text-white/80">{t("fixesFirstText", { score: audit.score })}</p>
            <ol className="mt-6 grid gap-3 md:grid-cols-3">
              {audit.fixes.map((id, i) => {
                const chapter = playbook.chapters.find((c) => c.id === id);
                if (!chapter) return null;
                return (
                  <li key={id}>
                    <a
                      href={`#chapter-${id}`}
                      onClick={(e) => jumpTo(e, `chapter-${id}`)}
                      className="group flex h-full flex-col rounded-[8px] border border-white/15 p-4 transition-colors hover:border-white/50"
                    >
                      <span className="font-mono text-[11px] uppercase tracking-widest text-white/60">
                        {i + 1} · {tp("chapterLabel", { n: chapterIndex(id) + 1 })} · {tp("minutes", { n: chapter.minutes })}
                      </span>
                      <span className="mt-2 font-display text-xl leading-tight tracking-tight">{chapter.title}</span>
                      <span className="mt-3 inline-flex items-center gap-1 text-sm text-white/70 group-hover:text-white">
                        <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
                      </span>
                    </a>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>
      )}

      <div className="container mx-auto px-5 pb-24 pt-12 md:px-8 md:pt-16 lg:grid lg:grid-cols-12 lg:gap-12">
        {/* Chapter nav: sticky on desktop, a plain list on phones */}
        <aside className="mb-12 lg:col-span-3 lg:mb-0 print:hidden">
          <nav aria-label={t("contents")} className="lg:sticky lg:top-28">
            <p className={cn("mb-4", eyebrowClass)}>{t("contents")}</p>
            <ol className="space-y-1">
              {playbook.chapters.map((c, i) => {
                const id = `chapter-${c.id}`;
                const isActive = active === id;
                return (
                  <li key={c.id}>
                    <a
                      href={`#${id}`}
                      onClick={(e) => jumpTo(e, id)}
                      aria-current={isActive ? "true" : undefined}
                      className={cn(
                        "flex items-baseline gap-3 rounded-[6px] px-2 py-1.5 text-sm leading-snug transition-colors hover:text-foreground",
                        isActive ? "bg-muted text-foreground" : "text-muted-foreground",
                      )}
                    >
                      <span className="w-5 shrink-0 font-mono text-[11px] tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                      <span>{c.title}</span>
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
          </nav>
        </aside>

        {/* Body */}
        <div className="max-w-prose lg:col-span-8 lg:col-start-5">
          <p className="text-base leading-relaxed text-muted-foreground md:text-lg">{playbook.intro}</p>

          {playbook.chapters.map((chapter, i) => (
            <ChapterSection
              key={chapter.id}
              chapter={chapter}
              index={i}
              next={playbook.chapters[i + 1] ?? null}
              ticks={ticks}
              onToggle={toggle}
            />
          ))}

          {/* Quick wins */}
          <section id="quick-wins" className="mt-16 scroll-mt-28 border-t border-border pt-12 print:break-before-page">
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

          <p className="mt-16 border-t border-border pt-8 text-sm leading-relaxed text-muted-foreground print:hidden">{t("help")}</p>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 print:hidden">
            <GlassPill tone="dark" onClick={print} className="h-11 px-5">
              <span className="inline-flex items-center gap-2">
                <Printer className="h-4 w-4" aria-hidden="true" />
                {t("savePdf")}
              </span>
            </GlassPill>
            <span className="text-xs text-muted-foreground">{t("savePdfHint")}</span>
          </div>
        </div>
      </div>
    </main>
  );
}

function ChapterSection({
  chapter,
  index,
  next,
  ticks,
  onToggle,
}: {
  chapter: Chapter;
  index: number;
  next: Chapter | null;
  ticks: Ticks;
  onToggle: (key: string) => void;
}) {
  const t = useTranslations("audit.playbook.reader");
  const tp = useTranslations("audit.playbook");
  const done = chapter.checklist.filter((_, i) => ticks[`${chapter.id}:${i}`]).length;

  return (
    <section id={`chapter-${chapter.id}`} className="mt-16 scroll-mt-28 border-t border-border pt-12 print:break-before-page">
      <p className={cn("mb-4", eyebrowClass)}>
        {tp("chapterLabel", { n: index + 1 })} · {tp("minutes", { n: chapter.minutes })}
      </p>
      <h2 className="font-display text-heading text-balance">{chapter.title}</h2>

      <div className="mt-6 border-s-2 border-foreground/30 ps-4">
        <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">{t("promiseLabel")}</p>
        <p className="mt-2 text-base leading-relaxed md:text-lg">{chapter.promise}</p>
      </div>

      {/* Why */}
      <div className="mt-10">
        <p className={cn("mb-4", eyebrowClass)}>{t("whyLabel")}</p>
        <div className="space-y-4">
          {chapter.why.map((p, i) => (
            <p key={i} className="text-base leading-relaxed text-muted-foreground">
              {p}
            </p>
          ))}
        </div>
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
                    className="mt-1 h-4 w-4 shrink-0 cursor-pointer appearance-none rounded-[4px] border border-foreground/50 bg-background checked:border-foreground checked:bg-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background print:appearance-auto"
                  />
                  <span className={cn("text-base leading-relaxed", checked && "text-muted-foreground line-through")}>{item}</span>
                </label>
              </li>
            );
          })}
        </ul>
        <p className="mt-4 text-xs text-muted-foreground print:hidden">{t("checklistSaved")}</p>
      </div>

      {/* Templates */}
      {chapter.templates.length > 0 && (
        <div className="mt-10">
          <p className={cn("mb-4", eyebrowClass)}>{t("templatesLabel")}</p>
          <div className="space-y-6">
            {chapter.templates.map((tpl) => (
              <TemplateBlock key={tpl.id} template={tpl} />
            ))}
          </div>
        </div>
      )}

      {/* Mistakes */}
      <div className="mt-10">
        <p className={cn("mb-4", eyebrowClass)}>{t("mistakesLabel")}</p>
        <ul className="space-y-2.5">
          {chapter.mistakes.map((m, i) => (
            <li key={i} className="flex gap-3 text-base leading-relaxed text-muted-foreground">
              <span aria-hidden="true" className="mt-[11px] h-px w-3 shrink-0 bg-foreground/40" />
              <span>{m}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Done when */}
      <div className="mt-10 rounded-[10px] bg-black p-5 text-white md:p-6">
        <p className="mb-2 font-mono text-label text-white/60">{t("doneLabel")}</p>
        <p className="text-base leading-relaxed">{chapter.done}</p>
      </div>

      {next && (
        <a
          href={`#chapter-${next.id}`}
          onClick={(e) => jumpTo(e, `chapter-${next.id}`)}
          className="mt-8 inline-flex items-center gap-2 text-sm font-medium underline-offset-4 hover:underline print:hidden"
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
    <article className="overflow-hidden rounded-[10px] border border-border bg-card print:break-inside-avoid">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3 md:px-5">
        <div className="min-w-0">
          <h4 className="text-sm font-medium leading-snug">{template.title}</h4>
          <p className="mt-0.5 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">{template.kind}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2 print:hidden">
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
