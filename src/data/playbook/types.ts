/**
 * The "give": a free playbook delivered with the /audit result.
 *
 * One chapter per audit question (same ids as QUESTION_IDS in src/lib/audit.ts),
 * so the result page can open the chapters that match the reader's top fixes.
 * Content lives in ./{en,ar,fr,tr}.ts; every locale keeps identical ids and the
 * same number of steps, checklist items, templates and mistakes per chapter
 * (checked by scripts/check-playbook.mjs).
 *
 * Template.body is plain text with light markdown: pipe tables for `table`,
 * header + rows for `csv`, "Heading:" lines and "- " bullets elsewhere. Render
 * it in a <pre>-like block with a copy button; do not parse it as full markdown.
 */

import type { QuestionId } from "@/lib/audit";

export type TemplateKind = "text" | "table" | "csv" | "message" | "outline";

export interface Template {
  id: string;
  title: string;
  kind: TemplateKind;
  /** One line shown above the body: when to use it, what to replace. */
  note?: string;
  body: string;
}

export interface Step {
  title: string;
  body: string;
}

export interface Chapter {
  id: QuestionId;
  title: string;
  /** One line: what the reader has after this chapter. */
  promise: string;
  /** Reading time in minutes. */
  minutes: number;
  /** 2-3 short paragraphs: the cost of the gap, in patients and money, no invented numbers. */
  why: string[];
  steps: Step[];
  checklist: string[];
  templates: Template[];
  mistakes: string[];
  /** One line: how they know it is done. */
  done: string;
}

export interface Playbook {
  /** Result + timeframe + container, never a format word. */
  title: string;
  subtitle: string;
  intro: string;
  chapters: Chapter[];
  /** 10 fixes that take under an hour each. */
  quickWins: string[];
  /** 10 lines: "if you read nothing else". The last line is the only place that names Awab's packages. */
  summary: string[];
}
