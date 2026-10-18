/**
 * PDF-only UI copy. Chapter labels shared with the web reader come from
 * src/messages/{locale}.json (audit.playbook.reader) so they stay translated;
 * the strings below exist only in the PDF. Add ar/fr/tr blocks before building
 * those editions (missing keys fall back to English, and the build warns).
 */

export type Locale = "en" | "ar" | "fr" | "tr";

export interface PdfLabels {
  docLabel: string;
  coverEyebrow: string;
  preparedFor: string;
  preparedForValue: string;
  by: string;
  byValue: string;
  edition: string;
  editionValue: string;
  web: string;
  startEyebrow: string;
  startHeading: string;
  startText: string;
  howEyebrow: string;
  howHeading: string;
  statChapters: string;
  statTemplates: string;
  statDays: string;
  statMinutes: string;
  promiseBoxLabel: string;
  contentsEyebrow: string;
  contentsHeading: string;
  pageCol: string;
  readCol: string;
  glanceEyebrow: string;
  glanceHeading: string;
  pathHeading: string;
  pathText: string;
  pathNodes: [string, string, string, string, string];
  timelineHeading: string;
  timelineText: string;
  chaptersShort: string;
  example: string;
  templateKinds: Record<"text" | "table" | "csv" | "message" | "outline", string>;
  csvColumn: string;
  csvExample: string;
  csvRaw: string;
  printableEyebrow: string;
  printableHeading: string;
  printableText: string;
  closingHeading: string;
  /** Short closing paragraph under the heading. No claims beyond what the site states. */
  closingText: string;
  closingCta: string;
  inShort: string;
  readingTime: string;
  /** Pointer box in a chapter: its templates live in the separate Template Pack PDF. */
  templatesForChapter: string;
  /** "{n}" = page number in the Template Pack. */
  packPage: string;
  /** Contents row pointing at the Template Pack. */
  packRow: string;
  packRowNote: string;
  /** Closing page: when the Template Pack arrives. */
  closingPackNote: string;
  appendixEyebrow: string;
  appendixHeading: string;
  /** {n} = number of templates. */
  appendixText: string;
  templatesRun: string;
  packDocLabel: string;
  packEyebrow: string;
  packTitle: string;
  /** {title} = the playbook title, {n} = number of templates. */
  packSub: string;
  packContents: string;
  email: string;
  whatsapp: string;
  /** Screenshot captions and callouts, keyed by example id in assets.ts. */
  examples: Record<string, { caption: string; callouts: string[] }>;
}

const en: PdfLabels = {
  docLabel: "Playbook",
  coverEyebrow: "Playbook for clinics",
  preparedFor: "Prepared for",
  preparedForValue: "Clinic owners and managers",
  by: "By",
  byValue: "Awab Elkhalil",
  edition: "Edition",
  editionValue: "October 2026",
  web: "Web",
  startEyebrow: "Start here",
  startHeading: "Start here: fixes for this week",
  startText:
    "Ten fixes you can make this week, each in under an hour. Below them, the whole playbook in ten lines. The chapters explain each fix in full.",
  howEyebrow: "How to use this",
  howHeading: "Start with your three lowest answers.",
  statChapters: "chapters, each one stands on its own",
  statTemplates: "copy-paste templates",
  statDays: "days, one plan week by week",
  statMinutes: "minutes of reading in total",
  promiseBoxLabel: "What you get",
  contentsEyebrow: "Contents",
  contentsHeading: "Contents",
  pageCol: "Page",
  readCol: "Read",
  glanceEyebrow: "At a glance",
  glanceHeading: "Where the patient goes, and where you fix it.",
  pathHeading: "The inquiry path",
  pathText: "The path from the first click to your first reply. Each chapter closes a gap somewhere on it.",
  pathNodes: [
    "Ad or search",
    "Page in the patient's language",
    "WhatsApp or form",
    "Tracked lead",
    "Reply",
  ],
  timelineHeading: "The 30 days",
  timelineText: "The order that moves inquiries soonest, taken from the 30-day plan in chapter {n}.",
  chaptersShort: "Ch.",
  example: "Real example",
  templateKinds: {
    text: "Template",
    table: "Table",
    csv: "Spreadsheet",
    message: "Messages",
    outline: "Outline",
  },
  csvColumn: "Column",
  csvExample: "Example",
  csvRaw: "Paste into a sheet",
  printableEyebrow: "Printable",
  printableHeading: "The 30-day checklist",
  printableText: "Pin it to the wall. Tick a box when it is live, not when it is planned.",
  closingHeading: "Want this done for you?",
  closingText:
    "I build these websites for clinics in Istanbul. Book a free 15-minute call. You'll get an honest answer on what to fix first.",
  closingCta: "Book a free 15-minute call",
  inShort: "In short",
  readingTime: "Reading time",
  templatesForChapter: "Templates for this chapter, in your Template Pack",
  packPage: "Template Pack, p. {n}",
  packRow: "Template Pack: all copy-paste templates",
  packRowNote: "Separate PDF",
  closingPackNote:
    "Your Template Pack, a separate PDF with all {n} copy-paste templates from these chapters, arrives by email in 2 days.",
  appendixEyebrow: "Appendix",
  appendixHeading: "Copy-paste templates",
  appendixText:
    "All {n} templates from the chapters, in one place and grouped by chapter. Copy one, replace the parts in [brackets], and use it.",
  templatesRun: "Templates",
  packDocLabel: "Template Pack",
  packEyebrow: "Template Pack",
  packTitle: "Template Pack",
  packSub: "{n} copy-paste templates from {title}.",
  packContents: "Templates",
  email: "Email",
  whatsapp: "WhatsApp",
  examples: {
    "lang-pair": {
      caption: "EsteExpert, home page in English and in Arabic. The Arabic version is mirrored right-to-left, not only translated.",
      callouts: [
        "Logo and menu move to the right",
        "Headline and text aligned right",
        "Buttons start from the right",
        "WhatsApp button moves to the bottom-left",
      ],
    },
    "lang-switch": {
      caption: "Jouvence, header. The language switch sits in the header, visible without opening a menu.",
      callouts: ["Language switch: EN, AR, FR"],
    },
    "wa-home": {
      caption: "Jouvence, home page. A consultation button in the first screen and a WhatsApp button in the corner.",
      callouts: ["Consultation button in the first screen", "WhatsApp button in the corner"],
    },
    "treat-saph": {
      caption: "SaphireDent, dental implants page. One treatment per page, with the trip one click away.",
      callouts: ["Plan Your Visit in the main menu", "Treatment name as the page title", "Consultation button in the first screen"],
    },
    "treat-este": {
      caption: "EsteExpert, hair transplant page. The patient sees where they are and how to ask.",
      callouts: ["Breadcrumb back to the treatment group", "Treatment and methods in the title", "Book a consultation", "WhatsApp button on the treatment page"],
    },
  },
};

const ALL: Partial<Record<Locale, Partial<PdfLabels>>> = { en };

export function pdfLabels(locale: Locale): PdfLabels {
  const own = ALL[locale] ?? {};
  const missing = (Object.keys(en) as (keyof PdfLabels)[]).filter((k) => !(k in own));
  if (locale !== "en" && missing.length) {
    console.warn(`[playbook-pdf] ${locale}: ${missing.length} PDF labels missing, using English (scripts/playbook-pdf/labels.ts)`);
  }
  return { ...en, ...own } as PdfLabels;
}

export const RTL_LOCALES: Locale[] = ["ar"];
