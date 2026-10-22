/**
 * Lead-facing audit report, sent by POST /api/audit right after the check:
 * score card with the 10 checks, the 3 fixes with the first playbook steps
 * and a deep link to each chapter, the personal playbook link, what happens
 * next and the personal signature.
 */
import { QUESTION_IDS, type Answer, type Answers, type BandId, type QuestionId } from "@/lib/audit";
import type { Locale } from "@/i18n/config";
import type { Playbook } from "@/data/playbook/types";
import { CAL_BOOKING_URL } from "@/lib/contactLinks";
import {
  A,
  CanvasHeading,
  Card,
  COLORS,
  Divider,
  FONTS,
  H1,
  H2,
  Kicker,
  Layout,
  P,
  Pill,
  SKIP_TEXT,
  Section,
  Signature,
  Spacer,
  Table,
  Timeline,
  WHATSAPP_NUMBER,
  bgAttr,
  domainOf,
  fill,
  useAlign,
  useArrow,
  useDir,
} from "./ui";
import { loadMessages, renderEmail, type EmailMessages, type RenderedEmail } from "./render";

export interface AuditReportInput {
  locale: Locale;
  name?: string | null;
  website: string;
  score: number;
  band: BandId;
  answers: Answers;
  fixes: QuestionId[];
  playbookUrl: string;
  playbook: Playbook;
  /** Hot leads also get the booking link. */
  hot: boolean;
}

const CELL: Record<Answer, { bg: string; glyph: string }> = {
  yes: { bg: COLORS.yes, glyph: "✓" },
  partly: { bg: COLORS.partly, glyph: "~" },
  no: { bg: COLORS.no, glyph: "✗" },
};

type FixView = {
  id: QuestionId;
  n: number;
  q: string;
  fix: string;
  impact: string;
  chapter: { n: number; title: string; minutes: number; url: string; steps: { title: string; body: string }[] } | null;
};

interface ViewProps {
  m: EmailMessages["audit"];
  locale: Locale;
  greeting: string;
  ack: string;
  compliment: string;
  summary: string;
  ask: string;
  domain: string;
  score: number;
  band: BandId;
  answers: Answers;
  fixes: FixView[];
  playbookTitle: string;
  playbookUrl: string;
  whatsappUrl: string;
  bookUrl: string | null;
  subject: string;
}

function ChecksRow({ answers }: { answers: Answers }) {
  return (
    <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} border={0} {...SKIP_TEXT} style={{ borderCollapse: "separate", borderSpacing: "4px 0", tableLayout: "fixed" }}>
      <tbody>
        <tr>
          {QUESTION_IDS.map((id) => {
            const c = CELL[answers[id] ?? "no"];
            return (
              <td
                key={id}
                align="center"
                {...bgAttr(c.bg)}
                style={{
                  backgroundColor: c.bg,
                  height: "30px",
                  borderRadius: "4px",
                  textAlign: "center",
                  verticalAlign: "middle",
                  fontFamily: FONTS.sans,
                  fontSize: "14px",
                  lineHeight: "30px",
                  fontWeight: 700,
                  color: "#ffffff",
                }}
              >
                {c.glyph}
              </td>
            );
          })}
        </tr>
      </tbody>
    </table>
  );
}

function Legend({ answers, m }: { answers: Answers; m: EmailMessages["audit"]["email"] }) {
  const align = useAlign();
  const count = (a: Answer) => QUESTION_IDS.filter((id) => (answers[id] ?? "no") === a).length;
  const item = (a: Answer, label: string) => (
    <span style={{ whiteSpace: "nowrap" }}>
      <span {...SKIP_TEXT} style={{ display: "inline-block", width: "10px", height: "10px", borderRadius: "2px", backgroundColor: CELL[a].bg, verticalAlign: "middle" }}>
        {"\u00a0"}
      </span>
      {" "}
      <span style={{ verticalAlign: "middle" }}>
        {label} {count(a)}
      </span>
    </span>
  );
  return (
    <p style={{ margin: "10px 0 0 0", fontFamily: FONTS.sans, fontSize: "13px", lineHeight: "20px", color: COLORS.text, textAlign: align }}>
      {item("yes", m.legendYes)}
      {"\u00a0\u00a0\u00a0 "}
      {item("partly", m.legendPartly)}
      {"\u00a0\u00a0\u00a0 "}
      {item("no", m.legendNo)}
    </p>
  );
}

/** Banner photo per fix topic (files in public/email/, 1200x400). */
const FIX_IMAGE: Record<QuestionId, string> = {
  languages: "fix-languages.jpg",
  journey: "fix-journey.jpg",
  whatsapp: "fix-whatsapp.jpg",
  speed: "fix-speed.jpg",
  treatments: "fix-treatments.jpg",
  credentials: "fix-credentials.jpg",
  gallery: "fix-gallery.jpg",
  booking: "fix-booking.jpg",
  tracking: "fix-tracking.jpg",
  feedback: "fix-feedback.jpg",
};

function FixSection({ fix, m }: { fix: FixView; m: EmailMessages["audit"] }) {
  const arrow = useArrow();
  const align = useAlign();
  const rtl = useDir() === "rtl";
  return (
    <Section label={fill(m.fixLabel, { n: fix.n })} image={{ file: FIX_IMAGE[fix.id], width: 1200, height: 400 }}>
      <h3 style={{ margin: "0 0 10px 0", fontFamily: FONTS.heading, fontSize: "21px", lineHeight: "1.3", fontWeight: 700, letterSpacing: rtl ? "0" : "-0.015em", color: COLORS.text, textAlign: align }}>
        {fix.q}
      </h3>
      <P style={{ margin: "0 0 12px 0" }}>{fix.fix}</P>
      <P small style={{ margin: 0 }}>
        <strong>{m.impactLabel}:</strong> {fix.impact}
      </P>
      {fix.chapter ? (
        <>
          <Spacer h={18} />
          <Card tone="soft" padding="18px 20px 10px 20px">
            <Kicker>{m.playbook.email.stepsIntro}</Kicker>
            <Table>
              {fix.chapter.steps.map((step, j) => (
                <tr key={j}>
                  <td
                    width={22}
                    valign="top"
                    style={{ width: "22px", verticalAlign: "top", padding: "0 0 10px 0", fontFamily: FONTS.mono, fontSize: "13px", lineHeight: "22px", color: COLORS.muted }}
                  >
                    {`${j + 1}.`}{" "}
                  </td>
                  <td valign="top" align={align} style={{ verticalAlign: "top", padding: "0 0 10px 0", fontFamily: FONTS.sans, fontSize: "15px", lineHeight: "1.5", color: COLORS.text, textAlign: align }}>
                    <strong>{step.title}.</strong> {step.body}
                  </td>
                </tr>
              ))}
            </Table>
          </Card>
          <P small style={{ margin: "14px 0 0 0" }}>
            <A href={fix.chapter.url} style={{ fontWeight: 600 }}>
              {fill(m.email.readChapter, { n: fix.chapter.n, minutes: fix.chapter.minutes })} {arrow}
            </A>
          </P>
        </>
      ) : null}
    </Section>
  );
}

export function AuditReportEmail(p: ViewProps) {
  const e = p.m.email;
  const bandCopy = p.m.bands[p.band];
  const rtl = p.locale === "ar";
  return (
    <Layout
      variant="sections"
      lang={p.locale}
      dir={rtl ? "rtl" : "ltr"}
      preheader={e.preheader}
      kicker={e.kicker}
      title={p.subject}
      footer={<>{e.footer}</>}
    >
      {/* Letter: greeting, acknowledgement, compliment. */}
      <Section label={e.introLabel} image={{ file: "hero-clinic.jpg", width: 1200, height: 500 }}>
        <P>{p.greeting}</P>
        <P>{p.ack}</P>
        <P style={{ margin: 0 }}>{p.compliment}</P>
      </Section>

      {/* Score */}
      <Section
        label={
          <>
            {e.scoreKicker} · <span dir="ltr">{p.domain}</span>
          </>
        }
      >
        <p style={{ margin: "0 0 6px 0", fontFamily: FONTS.heading, color: COLORS.text, textAlign: rtl ? "right" : "left" }}>
          <span dir="ltr">
            <span className="em-score" style={{ fontSize: "64px", lineHeight: "64px", fontWeight: 700, letterSpacing: "-0.04em" }}>
              {p.score}
            </span>
            <span style={{ fontSize: "20px", lineHeight: "20px", fontWeight: 700, color: COLORS.muted }}>/100</span>
          </span>
        </p>
        <H2 style={{ margin: "8px 0 6px 0" }}>{bandCopy.name}</H2>
        <P style={{ margin: "0 0 22px 0" }}>{p.summary}</P>
        <Kicker>{e.checksHeading}</Kicker>
        <ChecksRow answers={p.answers} />
        <Legend answers={p.answers} m={e} />
      </Section>

      {/* Fixes: a heading on the canvas, then one block per fix. */}
      <CanvasHeading title={p.m.fixesHeading} intro={e.fixesIntro} />
      {p.fixes.map((fix) => (
        <FixSection key={fix.id} fix={fix} m={p.m} />
      ))}

      {/* Playbook */}
      <Section label={p.m.playbook.email.heading}>
        <H2>{p.playbookTitle}</H2>
        <P>{p.m.playbook.email.text}</P>
        <Pill href={p.playbookUrl}>{p.m.playbook.open}</Pill>
        <P small style={{ margin: "8px 0 0 0" }}>
          <A href={p.whatsappUrl}>{fill(e.whatsappLink, { domain: p.domain })}</A>
          {p.bookUrl ? (
            <>
              {"  ·  "}
              <A href={p.bookUrl}>{e.bookLink}</A>
            </>
          ) : null}
        </P>
      </Section>

      {/* What happens next */}
      <Section label={e.nextHeading}>
        <Timeline
          steps={[
            { when: e.nextToday, text: e.nextTodayText },
            { when: e.next48, text: e.next48Text },
            { when: e.next2days, text: e.next2daysText },
          ]}
        />
      </Section>

      {/* One question, then the signature. */}
      <Section label={e.askLabel} gap={0}>
        <P style={{ margin: "0 0 8px 0" }}>{e.askIntro}</P>
        <H2 style={{ margin: "0 0 10px 0" }}>{p.ask}</H2>
        <P>{e.askReply}</P>
        <Divider space={24} />
        <Signature signoff={e.signoff} role={e.signatureRole} />
        <Spacer h={22} />
        <P small muted style={{ margin: 0 }}>
          {e.diy}
        </P>
      </Section>
    </Layout>
  );
}

export async function buildAuditReportEmail(input: AuditReportInput): Promise<RenderedEmail> {
  const messages = await loadMessages(input.locale);
  const m = messages.audit;
  const domain = domainOf(input.website);
  const subject = fill(m.email.subject, { domain, score: input.score });
  const greeting = input.name ? fill(m.email.greetingNamed, { name: input.name }) : m.email.greeting;

  // Hormozi ACA: acknowledge what they did, compliment what already works,
  // then ask one question tied to their biggest gap (fixes[0]).
  const ack = fill(m.email.ack, { domain, score: input.score });
  const done = QUESTION_IDS.filter((id) => input.answers[id] === "yes");
  const [a, b] = done.map((id) => m.email.compliments[id]);
  const compliment = b
    ? fill(m.email.complimentTwo, { a, b })
    : a
      ? fill(m.email.complimentOne, { a })
      : m.email.complimentNone;
  const gap = input.fixes[0];
  const summary =
    done.length === QUESTION_IDS.length || !gap
      ? m.summaryAllDone
      : fill(m.summaryLine, { yes: done.length, gap: m.gaps[gap] });
  const ask = m.email.asks[gap ?? "languages"];

  const fixes: FixView[] = input.fixes.map((id, i) => {
    const q = m.questions[id];
    const index = input.playbook.chapters.findIndex((c) => c.id === id);
    const chapter = index >= 0 ? input.playbook.chapters[index] : null;
    return {
      id,
      n: i + 1,
      q: q.q,
      fix: q.fix,
      impact: q.impact,
      chapter: chapter
        ? {
            n: index + 1,
            title: chapter.title,
            minutes: chapter.minutes,
            url: `${input.playbookUrl}#chapter-${id}`,
            steps: chapter.steps.slice(0, 2),
          }
        : null,
    };
  });

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(fill(m.email.whatsappPrefill, { website: domain }))}`;

  return renderEmail(
    subject,
    <AuditReportEmail
      m={m}
      locale={input.locale}
      greeting={greeting}
      ack={ack}
      compliment={compliment}
      summary={summary}
      ask={ask}
      domain={domain}
      score={input.score}
      band={input.band}
      answers={input.answers}
      fixes={fixes}
      playbookTitle={input.playbook.title}
      playbookUrl={input.playbookUrl}
      whatsappUrl={whatsappUrl}
      bookUrl={input.hot ? CAL_BOOKING_URL : null}
      subject={subject}
    />,
  );
}
