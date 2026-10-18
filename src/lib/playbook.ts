/**
 * Playbook helpers shared by the /audit/playbook page, the result page and
 * the /api/audit email. Content lives in src/data/playbook/<locale>.ts.
 *
 * Client components import the counts from ./playbookMeta instead; getPlaybook()
 * pulls in the full ~70-95 KB locale file and belongs in server components and
 * route handlers.
 */

import type { Locale } from "@/i18n/config";
import type { Chapter, Playbook } from "@/data/playbook/types";
import type { QuestionId } from "@/lib/audit";

export { PLAYBOOK_META } from "@/lib/playbookMeta";

export async function getPlaybook(locale: Locale): Promise<Playbook> {
  switch (locale) {
    case "ar":
      return (await import("@/data/playbook/ar")).PLAYBOOK;
    case "fr":
      return (await import("@/data/playbook/fr")).PLAYBOOK;
    case "tr":
      return (await import("@/data/playbook/tr")).PLAYBOOK;
    default:
      return (await import("@/data/playbook/en")).PLAYBOOK;
  }
}

export function chapterById(playbook: Playbook, id: QuestionId): Chapter | undefined {
  return playbook.chapters.find((c) => c.id === id);
}

export function countTemplates(playbook: Playbook): number {
  return playbook.chapters.reduce((n, c) => n + c.templates.length, 0);
}

/** The lead tracker CSV body (header + sample rows) from the tracking chapter, or null if missing. */
export function leadTrackerCsv(playbook: Playbook): { filename: string; content: string } | null {
  for (const chapter of playbook.chapters) {
    const tpl = chapter.templates.find((t) => t.kind === "csv");
    if (tpl) {
      // CRLF line endings and a BOM so Excel opens UTF-8 names correctly.
      const content = "\ufeff" + tpl.body.replace(/\r?\n/g, "\r\n") + "\r\n";
      return { filename: "lead-tracker.csv", content };
    }
  }
  return null;
}

/** Chapter preview for the result page and the email: promise, minutes, template count. */
export interface ChapterPreview {
  id: QuestionId;
  title: string;
  promise: string;
  minutes: number;
  templates: number;
}

export function chapterPreview(chapter: Chapter): ChapterPreview {
  return {
    id: chapter.id,
    title: chapter.title,
    promise: chapter.promise,
    minutes: chapter.minutes,
    templates: chapter.templates.length,
  };
}

/** Real excerpts for the "peek inside" block on the /audit landing page. */
export interface PlaybookExcerpts {
  whatsapp: {
    chapter: number;
    prefilledTitle: string;
    treatment: string;
    patientMessage: string;
    replyTitle: string;
    reply: string;
    /** How to use the reply scripts (the template's note). */
    replyNote: string;
  } | null;
  prices: {
    chapter: number;
    title: string;
    note: string;
    header: string[];
    rows: string[][];
  } | null;
  quickWins: string[];
  /** Total reading time of all chapters, in minutes. */
  totalMinutes: number;
}

/** First "Label (XX):\nmessage" block of a message template, label cleaned of the language tag. */
function firstMessageBlock(body: string): { label: string; text: string } {
  const [first = ""] = body.split(/\n\s*\n/);
  const [label = "", ...rest] = first.split("\n");
  return {
    label: label.replace(/\s*\([A-Z]{2}\)\s*:?\s*$/, "").replace(/\s*:\s*$/, "").trim(),
    text: rest.join("\n").trim(),
  };
}

/** Pipe table to header + rows (separator line dropped). */
function parsePipeTable(body: string): string[][] {
  return body
    .split("\n")
    .filter((l) => l.trim().startsWith("|") && !/^\|[\s|:-]+\|$/.test(l.trim()))
    .map((l) =>
      l
        .trim()
        .replace(/^\||\|$/g, "")
        .split("|")
        .map((c) => c.trim()),
    );
}

export function playbookExcerpts(playbook: Playbook): PlaybookExcerpts {
  const chapterNo = (id: QuestionId) => playbook.chapters.findIndex((c) => c.id === id) + 1;
  const wa = chapterById(playbook, "whatsapp");
  const prefilled = wa?.templates.find((t) => t.id === "wa-prefilled");
  const firstReply = wa?.templates.find((t) => t.id === "wa-first-reply");
  const treatments = chapterById(playbook, "treatments");
  const priceTable = treatments?.templates.find((t) => t.id === "price-table");

  let prices: PlaybookExcerpts["prices"] = null;
  if (priceTable) {
    const [header, ...rows] = parsePipeTable(priceTable.body);
    if (header && rows.length) {
      // Treatment, from-price, days in Istanbul, included. Arabic orders the columns differently.
      const find = (re: RegExp, fallback: number) => {
        const i = header.findIndex((h) => re.test(h));
        return i === -1 ? fallback : i;
      };
      const cols = [
        0,
        1,
        find(/days|jours|gün|الأيام/i, 3),
        find(/^included$|^inclus$|^dahil$|ما يشمله/i, 5),
      ].filter((c, i, a) => c < header.length && a.indexOf(c) === i);
      prices = {
        chapter: chapterNo("treatments"),
        title: priceTable.title,
        note: priceTable.note ?? "",
        header: cols.map((c) => header[c]),
        rows: rows.slice(0, 3).map((r) => cols.map((c) => r[c] ?? "")),
      };
    }
  }

  let whatsapp: PlaybookExcerpts["whatsapp"] = null;
  if (prefilled && firstReply) {
    const p = firstMessageBlock(prefilled.body);
    const r = firstMessageBlock(firstReply.body);
    whatsapp = {
      chapter: chapterNo("whatsapp"),
      prefilledTitle: prefilled.title,
      treatment: p.label,
      patientMessage: p.text,
      replyTitle: firstReply.title,
      reply: r.text,
      replyNote: firstReply.note ?? "",
    };
  }

  return {
    whatsapp,
    prices,
    quickWins: playbook.quickWins,
    totalMinutes: playbook.chapters.reduce((n, c) => n + c.minutes, 0),
  };
}
