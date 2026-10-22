/**
 * Lead-facing playbook access email (POST /api/playbook, the direct path
 * without the check): personal link, the first summary lines, the check as
 * the next step and what happens next.
 */
import type { Locale } from "@/i18n/config";
import type { Playbook } from "@/data/playbook/types";
import { localeUrl } from "@/lib/seo";
import {
  A,
  Divider,
  H1,
  Layout,
  NumberedList,
  P,
  Pill,
  Section,
  Signature,
  Timeline,
  displayUrl,
  fillNodes,
} from "./ui";
import { loadMessages, renderEmail, type EmailMessages, type RenderedEmail } from "./render";

export interface PlaybookAccessInput {
  locale: Locale;
  playbookUrl: string;
  playbook: Playbook;
}

export function PlaybookAccessEmail({
  m,
  locale,
  playbook,
  playbookUrl,
  checkUrl,
}: {
  m: EmailMessages["audit"];
  locale: Locale;
  playbook: Playbook;
  playbookUrl: string;
  checkUrl: string;
}) {
  const e = m.email;
  const pe = m.playbook.email;
  return (
    <Layout variant="sections" lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} preheader={pe.preheader} kicker={pe.heading} title={pe.subject} footer={<>{pe.footer}</>}>
      <Section image={{ file: "hero-playbook.jpg", width: 1200, height: 500 }}>
        <P>{e.greeting}</P>
        <H1>{playbook.title}</H1>
        <P>{pe.text}</P>
        <Pill href={playbookUrl}>{m.playbook.open}</Pill>
      </Section>

      <Section label={pe.summaryIntro}>
        <NumberedList items={playbook.summary.slice(0, 3)} size={15} />
        <Divider space={16} />
        <P style={{ margin: 0 }}>{fillNodes(pe.checkLine, { url: <A href={checkUrl}>{displayUrl(checkUrl)}</A> })}</P>
      </Section>

      <Section label={e.nextHeading}>
        <Timeline
          steps={[
            { when: e.nextToday, text: pe.nextTodayText },
            { when: e.next2days, text: e.next2daysText },
          ]}
        />
      </Section>

      <Section gap={0}>
        <Signature signoff={e.signoff} role={e.signatureRole} />
      </Section>
    </Layout>
  );
}

export async function buildPlaybookAccessEmail(input: PlaybookAccessInput): Promise<RenderedEmail> {
  const m = (await loadMessages(input.locale)).audit;
  return renderEmail(
    m.playbook.email.subject,
    <PlaybookAccessEmail
      m={m}
      locale={input.locale}
      playbook={input.playbook}
      playbookUrl={input.playbookUrl}
      checkUrl={localeUrl("/audit", input.locale)}
    />,
  );
}
