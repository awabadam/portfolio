"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowUpRight, MessageCircle, Plus } from "lucide-react";
import { Link } from "@/i18n/routing";
import { GlassPill } from "@/components/ui/glass-pill";
import type { QuestionId } from "@/lib/audit";
import type { ChapterPreview, PlaybookExcerpts } from "@/lib/playbook";
import { PLAYBOOK_META } from "@/lib/playbookMeta";

/**
 * Landing-page blocks for /audit (intro stage): real playbook excerpts, an
 * example result, the maker, the FAQ and the closing CTA. Copy in audit.*,
 * excerpts from src/data/playbook/<locale>.ts via playbookExcerpts().
 */

const chapterNo = (n: number) => String(n).padStart(2, "0");

/** Small header shared by the excerpt "pages": chapter number and template title. */
function PageHeader({ chapter, title }: { chapter: number; title: string }) {
  const t = useTranslations("audit");
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-border pb-4">
      <p className="min-w-0 text-base font-medium leading-snug">{title}</p>
      <p className="shrink-0 font-mono text-xs text-muted-foreground">
        {t("playbook.chapterLabel", { n: chapterNo(chapter) })}
      </p>
    </div>
  );
}

export function PeekInside({ excerpts }: { excerpts: PlaybookExcerpts }) {
  const t = useTranslations("audit");
  const { whatsapp, prices, quickWins } = excerpts;
  const shownWins = quickWins.slice(0, 4);

  return (
    <div>
      <p className="mb-4 font-mono text-label text-muted-foreground">{t("peek.eyebrow")}</p>
      <h2 className="max-w-3xl font-display text-heading text-balance">{t("peek.heading")}</h2>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">{t("peek.text")}</p>

      <div className="mt-10 grid gap-4 md:gap-5 lg:grid-cols-12">
        {whatsapp && (
          <article className="flex min-w-0 flex-col rounded-[10px] border border-border bg-card p-5 md:p-7 lg:col-span-5 lg:row-span-2">
            <PageHeader chapter={whatsapp.chapter} title={whatsapp.replyTitle} />

            <p className="mt-5 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              {t("peek.waPatientLabel")}
            </p>
            <div className="mt-2 flex flex-col items-start gap-1.5">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground">
                <MessageCircle className="h-3 w-3" aria-hidden="true" />
                {whatsapp.treatment}
              </span>
              <p className="max-w-[90%] rounded-[10px] rounded-ss-[3px] bg-muted px-4 py-3 text-sm leading-relaxed">
                <span className="sr-only">{t("peek.patient")}: </span>
                {whatsapp.patientMessage}
              </p>
            </div>

            <p className="mt-6 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              {t("peek.waReplyLabel")}
            </p>
            <div className="mt-2 flex justify-end">
              <p className="max-w-[94%] whitespace-pre-line rounded-[10px] rounded-se-[3px] bg-foreground px-4 py-3 text-sm leading-relaxed text-background">
                <span className="sr-only">{t("peek.clinic")}: </span>
                {whatsapp.reply}
              </p>
            </div>
            {whatsapp.replyNote && (
              <p className="mt-6 border-t border-border pt-4 text-sm leading-relaxed text-muted-foreground lg:mt-auto">
                {whatsapp.replyNote}
              </p>
            )}
          </article>
        )}

        {prices && (
          <article className="min-w-0 rounded-[10px] border border-border bg-card p-5 md:p-7 lg:col-span-7">
            <PageHeader chapter={prices.chapter} title={prices.title} />
            {prices.note && <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{prices.note}</p>}

            {/* Table from sm up; stacked rows on phones so nothing scrolls sideways. */}
            <table className="mt-5 hidden w-full border-collapse text-start text-sm sm:table">
              <thead>
                <tr>
                  {prices.header.map((h) => (
                    <th
                      key={h}
                      scope="col"
                      className="border-b border-border pb-2 pe-4 text-start font-mono text-[11px] font-normal uppercase tracking-wider text-muted-foreground last:pe-0"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {prices.rows.map((row, i) => (
                  <tr key={i} className="align-top">
                    {row.map((cell, j) => (
                      <td
                        key={j}
                        className={
                          "border-b border-border py-3 pe-4 leading-snug last:pe-0 " +
                          (j === 0 ? "font-medium" : j === 1 ? "whitespace-nowrap font-mono text-xs" : "text-muted-foreground")
                        }
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <dl className="mt-4 divide-y divide-border sm:hidden">
              {prices.rows.map((row, i) => (
                <div key={i} className="py-3">
                  <dt className="text-sm font-medium">{row[0]}</dt>
                  {row.slice(1).map((cell, j) => (
                    <dd key={j} className="mt-1 flex gap-2 text-sm leading-snug">
                      <span className="shrink-0 text-muted-foreground">{prices.header[j + 1]}:</span>
                      <span className="min-w-0">{cell}</span>
                    </dd>
                  ))}
                </div>
              ))}
            </dl>
          </article>
        )}

        {shownWins.length > 0 && (
          <article className="min-w-0 rounded-[10px] border border-border bg-card p-5 md:p-7 lg:col-span-7">
            <div className="flex items-baseline justify-between gap-4 border-b border-border pb-4">
              <p className="min-w-0 text-base font-medium leading-snug">{t("playbook.reader.quickWinsHeading")}</p>
              <p className="shrink-0 font-mono text-xs text-muted-foreground">{t("playbook.reader.quickWinsEyebrow")}</p>
            </div>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2 sm:gap-x-6">
              {shownWins.map((w, i) => (
                <li key={i} className="flex items-start gap-3 text-sm leading-relaxed">
                  <span className="mt-1 h-3.5 w-3.5 shrink-0 rounded-[4px] border border-foreground/40" aria-hidden="true" />
                  <span>{w}</span>
                </li>
              ))}
            </ul>
            {quickWins.length > shownWins.length && (
              <p className="mt-4 font-mono text-xs text-muted-foreground">
                {t("peek.quickWinsMore", { n: quickWins.length - shownWins.length })}
              </p>
            )}
          </article>
        )}
      </div>
    </div>
  );
}

const SAMPLE_SCORE = 52;
const SAMPLE_FIXES: QuestionId[] = ["whatsapp", "treatments", "tracking"];

/** A mock result card, clearly marked as an example. 52 falls in the "starting" band (40-64). */
export function SampleResult({ chapters }: { chapters: ChapterPreview[] }) {
  const t = useTranslations("audit");
  return (
    <figure className="relative rounded-[10px] bg-black p-6 text-white md:p-8">
      <figcaption className="sr-only">{t("sample.note")}</figcaption>
      <div className="flex items-center justify-between gap-4">
        <p className="font-mono text-label text-white/55">{t("sample.eyebrow")}</p>
        <span className="rounded-full border border-dashed border-white/40 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-white/75">
          {t("sample.tag")}
        </span>
      </div>
      <div className="mt-6 flex flex-wrap items-end gap-x-6 gap-y-3" aria-hidden="true">
        <p className="flex items-baseline gap-2">
          <span className="font-display text-[64px] leading-none tracking-tighter tabular-nums">{SAMPLE_SCORE}</span>
          <span className="font-mono text-[11px] uppercase tracking-widest text-white/55">{t("resultOutOf")}</span>
        </p>
        <p className="pb-1 font-display text-2xl leading-tight">{t("bands.starting.name")}</p>
      </div>
      <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-white/15" aria-hidden="true">
        <div className="h-full rounded-full bg-white" style={{ width: `${SAMPLE_SCORE}%` }} />
      </div>
      <p className="mt-6 font-mono text-[11px] uppercase tracking-widest text-white/55">{t("fixesHeading")}</p>
      <ol className="mt-3 divide-y divide-white/15 border-y border-white/15">
        {SAMPLE_FIXES.map((id, i) => {
          const title = chapters.find((c) => c.id === id)?.title;
          return (
            <li key={id} className="flex items-start gap-4 py-3.5">
              <span className="min-w-12 shrink-0 whitespace-nowrap font-mono text-xs leading-6 text-white/45">{t("fixLabel", { n: i + 1 })}</span>
              <span className="min-w-0">
                {title && <span className="block text-base leading-snug">{title}</span>}
                <span className="mt-0.5 block text-sm leading-snug text-white/60">{t(`questions.${id}.impact`)}</span>
              </span>
            </li>
          );
        })}
      </ol>
      <p className="mt-5 text-sm leading-relaxed text-white/55">{t("sample.note")}</p>
    </figure>
  );
}

const CLINICS = [
  { id: "saphiredent", name: "Saphiredent", market: "dental" },
  { id: "jouvence", name: "Jouvence", market: "aesthetics" },
  { id: "esteexpert", name: "EsteExpert", market: "medicalTourism" },
] as const;

export function MakerBlock() {
  const t = useTranslations("audit.maker");
  const tp = useTranslations("projects.markets");
  return (
    <div className="grid gap-8 md:grid-cols-12 md:gap-10 lg:gap-16">
      <div className="flex items-start gap-5 md:col-span-4 md:flex-col md:gap-0">
        <div className="relative aspect-[4/5] w-28 shrink-0 overflow-hidden rounded-[10px] bg-muted sm:w-36 md:w-full md:max-w-[300px]">
          <Image
            src="/img/awab-portrait.webp"
            alt={t("imageAlt")}
            fill
            sizes="(min-width: 768px) 300px, 144px"
            className="object-cover object-[50%_30%]"
          />
        </div>
        <div className="min-w-0 md:hidden">
          <p className="mb-3 font-mono text-label text-muted-foreground">{t("eyebrow")}</p>
          <h2 className="font-display text-2xl leading-tight text-balance">{t("heading")}</h2>
        </div>
      </div>
      <div className="min-w-0 md:col-span-8">
        <p className="mb-4 hidden font-mono text-label text-muted-foreground md:block">{t("eyebrow")}</p>
        <h2 className="hidden font-display text-heading text-balance md:block">{t("heading")}</h2>
        <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:mt-5 md:text-lg">{t("text")}</p>

        <p className="mb-4 mt-8 font-mono text-label text-muted-foreground md:mt-10">{t("clinicsLabel")}</p>
        <ul className="grid grid-cols-3 gap-3 md:gap-4">
          {CLINICS.map((c) => (
            <li key={c.id} className="min-w-0">
              <Link href={`/projects/${c.id}`} className="group block focus-visible:outline-none">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[10px] border border-border bg-muted group-focus-visible:ring-2 group-focus-visible:ring-foreground/60">
                  <Image
                    src={`/img/projects/${c.id}-thumbnail.webp`}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 220px, 33vw"
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <p className="mt-2 flex items-center gap-1 text-sm font-medium leading-snug">
                  <span className="truncate">{c.name}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 shrink-0 rtl:-scale-x-100" aria-hidden="true" />
                </p>
                <p className="truncate text-xs text-muted-foreground">{tp(c.market)}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function AuditFaq() {
  const t = useTranslations("audit.faq");
  const items = t.raw("items") as { q: string; a: string }[];
  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-16">
      <div className="lg:col-span-4">
        <p className="mb-4 font-mono text-label text-muted-foreground">{t("eyebrow")}</p>
        <h2 className="font-display text-heading text-balance">{t("heading")}</h2>
      </div>
      <div className="divide-y divide-border border-y border-border lg:col-span-8">
        {items.map((item, i) => (
          <details key={i} className="group" open={i === 0}>
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-base font-medium leading-snug md:text-lg [&::-webkit-details-marker]:hidden">
              {item.q}
              <Plus className="h-4 w-4 shrink-0 transition-transform group-open:rotate-45" aria-hidden="true" />
            </summary>
            <p className="max-w-2xl pb-5 text-base leading-relaxed text-muted-foreground">{item.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}

export function ClosingCta({ onOpen, onCheck }: { onOpen: () => void; onCheck: () => void }) {
  const t = useTranslations("audit");
  return (
    <div className="rounded-[10px] bg-black px-6 py-10 text-white md:px-12 md:py-14">
      <div className="grid items-end gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <p className="mb-4 font-mono text-label text-white/55">{t("closing.eyebrow")}</p>
          <h2 className="max-w-2xl font-display text-heading text-balance">{t("closing.heading")}</h2>
          <p className="mt-4 max-w-xl text-base text-white/70 md:text-lg">
            {t("closing.text", { templates: PLAYBOOK_META.templates })}
          </p>
        </div>
        <div className="flex flex-col items-start gap-3 lg:col-span-4 lg:items-end">
          <GlassPill tone="light" arrow onClick={onOpen} className="h-12 px-6 text-base">
            {t("choice.playbook")}
          </GlassPill>
          <button
            type="button"
            onClick={onCheck}
            className="inline-flex min-h-11 items-center gap-1 text-sm font-medium text-white/80 underline-offset-4 hover:text-white hover:underline"
          >
            {t("ctaBlock.checkLink")}
            <ArrowUpRight className="h-3.5 w-3.5 rtl:-scale-x-100" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
