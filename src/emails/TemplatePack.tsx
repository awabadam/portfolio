/**
 * Template Pack delivery (GET /api/cron/template-pack), about 2 days after
 * the playbook: one download button, where to start, the next step and the
 * "reply stop" opt-out.
 */
import type { Locale } from "@/i18n/config";
import { localeUrl } from "@/lib/seo";
import { CAL_BOOKING_URL } from "@/lib/contactLinks";
import { A, Card, Divider, H1, Layout, P, Pill, Section, Signature, Spacer, displayUrl, fillNodes } from "./ui";
import { loadMessages, renderEmail, type EmailMessages, type RenderedEmail } from "./render";

export interface TemplatePackInput {
  locale: Locale;
  packUrl: string;
  /** 'playbook' leads also get the check link; audit leads already took it. */
  source: string;
}

export function TemplatePackEmail({ m, locale, packUrl, source }: { m: EmailMessages["audit"]; locale: Locale; packUrl: string; source: string }) {
  const e = m.email;
  const t = m.templatePack;
  const auditUrl = localeUrl("/audit", locale);
  return (
    <Layout
      variant="sections"
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      preheader={t.preheader}
      kicker={t.kicker}
      title={t.subject}
      footer={
        <>
          {t.stop}
          <br />
          {t.footer}
        </>
      }
    >
      <Section image={{ file: "hero-templates.jpg", width: 1200, height: 500 }}>
        <P>{e.greeting}</P>
        <H1>{t.subject}</H1>
        <P>{t.reminder}</P>
        <P style={{ margin: "0 0 14px 0" }}>{t.linkIntro}</P>
        <Pill href={packUrl}>{t.button}</Pill>
        <Spacer h={18} />
        <Card tone="soft">
          <P style={{ margin: 0 }}>{t.startWith}</P>
        </Card>
      </Section>

      <Section gap={0}>
        {source === "playbook" ? <P>{fillNodes(t.auditCta, { url: <A href={auditUrl}>{displayUrl(auditUrl)}</A> })}</P> : null}
        <P style={{ margin: 0 }}>{fillNodes(t.callCta, { url: <A href={CAL_BOOKING_URL}>{displayUrl(CAL_BOOKING_URL)}</A> })}</P>
        <Divider space={24} />
        <Signature signoff={e.signoff} role={e.signatureRole} />
      </Section>
    </Layout>
  );
}

export async function buildTemplatePackEmail(input: TemplatePackInput): Promise<RenderedEmail> {
  const m = (await loadMessages(input.locale)).audit;
  return renderEmail(m.templatePack.subject, <TemplatePackEmail m={m} locale={input.locale} packUrl={input.packUrl} source={input.source} />);
}
