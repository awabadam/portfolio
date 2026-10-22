import type { ReactElement } from "react";
import { render } from "@react-email/render";
import { dirStore } from "./ui";
import type { Locale } from "@/i18n/config";

export interface RenderedEmail {
  subject: string;
  html: string;
  text: string;
}

/**
 * Renders one email to HTML plus a plain-text part from the same tree.
 * Nodes marked data-skip-in-text="true" (preheader, colour cells, spacers)
 * are left out of the text; headings keep their case.
 */
export async function renderEmail(subject: string, element: ReactElement): Promise<RenderedEmail> {
  // Lead emails carry a locale prop; Arabic renders right to left.
  const dir = (element.props as { locale?: string }).locale === "ar" ? "rtl" : "ltr";
  return dirStore.run(dir, () => renderBoth(subject, element));
}

async function renderBoth(subject: string, element: ReactElement): Promise<RenderedEmail> {
  const [html, text] = await Promise.all([
    render(element),
    render(element, {
      plainText: true,
      htmlToTextOptions: {
        wordwrap: false,
        selectors: [
          { selector: "h1", options: { uppercase: false, leadingLineBreaks: 1, trailingLineBreaks: 1 } },
          { selector: "h2", options: { uppercase: false, leadingLineBreaks: 2, trailingLineBreaks: 1 } },
          { selector: "h3", options: { uppercase: false, leadingLineBreaks: 1, trailingLineBreaks: 1 } },
          { selector: "table", format: "block" },
          { selector: "tr", format: "block" },
          { selector: "td", format: "cell" },
          { selector: "a.em-btn", format: "button" },
          // Photos are decoration; the text part carries everything without them.
          { selector: "img", format: "skip" },
        ],
        // Table cells read as inline text, separated by a space ("Email you@x.com").
        // Buttons get a line of their own: "Label: url" (mailto shows the address).
        formatters: {
          cell: ((elem, walk, builder) => {
            walk(elem.children, builder);
            builder.addInline(" ");
          }) as Formatter,
          button: ((elem, walk, builder) => {
            const href = String(elem.attribs?.href ?? "");
            const target = href.startsWith("mailto:") ? href.slice(7).split("?")[0] : href;
            builder.openBlock({ leadingLineBreaks: 1 });
            walk(elem.children, builder);
            builder.addInline(`: ${target}`);
            builder.closeBlock({ trailingLineBreaks: 1 });
          }) as Formatter,
        },
      },
    }),
  ]);
  return { subject, html, text: tidyText(text) };
}

/** Minimal shape of an html-to-text formatter (the package ships no types here). */
type Formatter = (
  elem: { attribs?: Record<string, string>; children: unknown[] },
  walk: (nodes: unknown[], builder: unknown) => void,
  builder: {
    addInline: (s: string) => void;
    openBlock: (o: { leadingLineBreaks: number }) => void;
    closeBlock: (o: { trailingLineBreaks: number }) => void;
  },
) => void;

function tidyText(text: string): string {
  return text
    .replace(/[ ‌]+/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** The whole messages file for a locale (emails read audit.* and contact.*). */
export async function loadMessages(locale: Locale): Promise<EmailMessages> {
  const mod = (await import(`@/messages/${locale}.json`)) as { default: EmailMessages };
  return mod.default;
}

type QuestionCopy = { q: string; why: string; fix: string; impact: string };

export interface EmailMessages {
  audit: {
    fixesHeading: string;
    fixLabel: string;
    impactLabel: string;
    questions: Record<string, QuestionCopy>;
    bands: Record<string, { name: string }>;
    summaryLine: string;
    summaryAllDone: string;
    gaps: Record<string, string>;
    email: {
      subject: string;
      ack: string;
      complimentTwo: string;
      complimentOne: string;
      complimentNone: string;
      compliments: Record<string, string>;
      askIntro: string;
      askReply: string;
      asks: Record<string, string>;
      preheader: string;
      kicker: string;
      introLabel: string;
      askLabel: string;
      greeting: string;
      greetingNamed: string;
      scoreLine: string;
      scoreKicker: string;
      checksHeading: string;
      legendYes: string;
      legendPartly: string;
      legendNo: string;
      fixesIntro: string;
      readChapter: string;
      whatsappLink: string;
      whatsappPrefill: string;
      bookLink: string;
      nextHeading: string;
      nextToday: string;
      nextTodayText: string;
      next48: string;
      next48Text: string;
      next2days: string;
      next2daysText: string;
      promise: string;
      diy: string;
      whatsapp: string;
      signoff: string;
      signatureRole: string;
      footer: string;
    };
    playbook: {
      open: string;
      email: {
        subject: string;
        preheader: string;
        heading: string;
        text: string;
        stepsIntro: string;
        chapterLine: string;
        summaryIntro: string;
        checkLine: string;
        packLine: string;
        nextTodayText: string;
        footer: string;
      };
    };
    templatePack: {
      subject: string;
      preheader: string;
      kicker: string;
      button: string;
      reminder: string;
      linkIntro: string;
      startWith: string;
      auditCta: string;
      callCta: string;
      stop: string;
      footer: string;
    };
  };
  contact: {
    email: {
      subject: string;
      subjectNoName: string;
      preheader: string;
      kicker: string;
      heading: string;
      text: string;
      yourMessage: string;
      button: string;
      footer: string;
    };
  };
}
