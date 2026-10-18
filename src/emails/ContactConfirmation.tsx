/** Confirmation to someone who used the contact form (POST /api/contact). */
import type { Locale } from "@/i18n/config";
import { localeUrl } from "@/lib/seo";
import { A, COLORS, Divider, FONTS, H1, Layout, P, Pill, Section, Signature, WHATSAPP_DISPLAY, WHATSAPP_NUMBER, fill, fillNodes, MultiLine, useAlign } from "./ui";
import { loadMessages, renderEmail, type EmailMessages, type RenderedEmail } from "./render";

export interface ContactConfirmationInput {
  locale: Locale;
  name?: string | null;
  /** Their message; omitted for one-field forms that send a canned text. */
  message?: string | null;
}

const MAX_QUOTE = 600;

function Quote({ text }: { text: string }) {
  const align = useAlign();
  return (
    <p dir="auto" style={{ margin: 0, fontFamily: FONTS.sans, fontSize: "15px", lineHeight: "1.55", color: COLORS.text, textAlign: align }}><MultiLine text={text} /></p>
  );
}

export function ContactConfirmationEmail({ m, locale, name, message, subject }: { m: EmailMessages; locale: Locale; name?: string | null; message?: string | null; subject: string }) {
  const e = m.audit.email;
  const c = m.contact.email;
  const quote = message ? (message.length > MAX_QUOTE ? `${message.slice(0, MAX_QUOTE).trimEnd()}…` : message) : null;
  return (
    <Layout variant="sections" lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} preheader={c.preheader} kicker={c.kicker} title={subject} footer={<>{c.footer}</>}>
      <Section image={{ file: "hero-galata.jpg", width: 1200, height: 500 }}>
        <P>{name ? fill(e.greetingNamed, { name }) : e.greeting}</P>
        <H1>{c.heading}</H1>
        <P style={{ margin: 0 }}>{c.text}</P>
      </Section>
      {quote ? (
        <Section label={c.yourMessage}>
          <Quote text={quote} />
        </Section>
      ) : null}
      <Section gap={0}>
        <P>
          {fillNodes(e.whatsapp, {
            number: (
              <A href={`https://wa.me/${WHATSAPP_NUMBER}`}>
                <span dir="ltr">{WHATSAPP_DISPLAY}</span>
              </A>
            ),
          })}
        </P>
        <Pill href={localeUrl("/projects", locale)}>{c.button}</Pill>
        <Divider space={24} />
        <Signature signoff={e.signoff} role={e.signatureRole} />
      </Section>
    </Layout>
  );
}

export async function buildContactConfirmationEmail(input: ContactConfirmationInput): Promise<RenderedEmail> {
  const m = await loadMessages(input.locale);
  const c = m.contact.email;
  const subject = input.name ? fill(c.subject, { name: input.name }) : c.subjectNoName;
  return renderEmail(subject, <ContactConfirmationEmail m={m} locale={input.locale} name={input.name} message={input.message} subject={subject} />);
}
