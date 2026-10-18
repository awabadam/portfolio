/** The owner's alert for the contact forms (POST /api/contact). */
import { COLORS, FONTS, Layout, MultiLine } from "./ui";
import { ADMIN_FOOTER, AlertTop, Badge, KeyValues, LeadIdLine, MailLink, MonoBlock, PhoneValue, Section } from "./admin";
import { renderEmail, type RenderedEmail } from "./render";

export interface AdminContactAlertInput {
  /** 'header' is the one-field audit request; anything else is a full contact form. */
  formType?: string | null;
  name?: string | null;
  email: string;
  phone?: string | null;
  company?: string | null;
  projectType?: string | null;
  message?: string | null;
  locale: string;
  leadId: string | null;
}

export function adminContactSubject(p: AdminContactAlertInput): string {
  // Kept backward compatible with existing inbox filters.
  return p.formType === "header" ? "Website Audit Request" : `New Contact Form Submission: ${p.projectType || "General"} Project`;
}

export function AdminContactAlertEmail({ p, subject }: { p: AdminContactAlertInput; subject: string }) {
  // "header" and "hero" are the one-field audit requests (email only, canned name and message).
  const header = p.formType === "header" || p.formType === "hero";
  const title = header ? p.email : p.name || p.email;
  const why = header
    ? "Asked for a free website audit and consultation from the one-field form. Only an email to go on."
    : [p.projectType ? `${p.projectType} project` : "New project", p.company ? `for ${p.company}` : null].filter(Boolean).join(" ") +
      (p.phone ? ". Left a phone number." : ". Email only.");
  return (
    <Layout lang="en" preheader={why} kicker={header ? "Audit request" : "Contact form"} title={subject} footer={ADMIN_FOOTER}>
      <AlertTop
        badges={<Badge tone="neutral">{header ? "Audit request" : "Contact"}</Badge>}
        title={title}
        subline={!header && p.name ? <>{p.email}</> : undefined}
        why={why}
        replyTo={p.email}
        replySubject={header ? "Your website audit" : `Re: your ${p.projectType || ""} project`.replace("  ", " ")}
        phone={p.phone}
        whatsappText={`Hi${p.name ? ` ${p.name}` : ""}, this is Awab from awab.design. Thanks for your message.`}
      />
      {!header && p.message ? (
        <Section label="Message">
          <p dir="auto" style={{ margin: 0, fontFamily: FONTS.sans, fontSize: "16px", lineHeight: "1.55", color: COLORS.text }}><MultiLine text={p.message} /></p>
        </Section>
      ) : null}
      <Section label="Who">
        <KeyValues
          rows={[
            ["Name", header ? null : p.name],
            ["Email", <MailLink key="e" email={p.email} />],
            ["Phone", p.phone ? <PhoneValue key="p" phone={p.phone} /> : null],
            ["Company", p.company],
            ["Project", p.projectType],
          ]}
        />
      </Section>
      <Section label="Details">
        <MonoBlock lines={[`Form: ${p.formType || "contact"}`, `Locale: ${p.locale}`, <LeadIdLine key="id" leadId={p.leadId} />]} />
      </Section>
    </Layout>
  );
}

export async function buildAdminContactAlert(input: AdminContactAlertInput): Promise<RenderedEmail> {
  const subject = adminContactSubject(input);
  return renderEmail(subject, <AdminContactAlertEmail p={input} subject={subject} />);
}
