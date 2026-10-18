/** The owner's note for a direct playbook download (POST /api/playbook). */
import { A, Layout, domainOf } from "./ui";
import { ADMIN_FOOTER, AlertTop, Badge, KeyValues, LeadIdLine, MailLink, MonoBlock, Section } from "./admin";
import { renderEmail, type RenderedEmail } from "./render";

export interface AdminPlaybookAlertInput {
  email: string;
  website: string | null;
  locale: string;
  leadId: string | null;
}

export function AdminPlaybookAlertEmail({ p, subject }: { p: AdminPlaybookAlertInput; subject: string }) {
  const domain = p.website ? domainOf(p.website) : null;
  const why = p.website
    ? "Downloaded the playbook directly, no check taken. Template Pack goes out in 2 days."
    : "Downloaded the playbook directly, no check and no website given. Template Pack goes out in 2 days.";
  return (
    <Layout lang="en" preheader={`${domain ?? p.email}: ${why}`} kicker="Playbook download" title={subject} footer={ADMIN_FOOTER}>
      <AlertTop
        badges={<Badge tone="neutral">Playbook</Badge>}
        title={domain ?? p.email}
        subline={domain ? <>{p.email}</> : undefined}
        why={why}
        replyTo={p.email}
        replySubject="Your playbook"
      />
      <Section label="Who">
        <KeyValues
          rows={[
            ["Email", <MailLink key="e" email={p.email} />],
            ["Website", p.website ? <A key="w" href={p.website}>{domain}</A> : null],
            ["Locale", p.locale],
          ]}
        />
      </Section>
      <Section label="Details">
        <MonoBlock lines={["Source: playbook (direct, no check)", `Locale: ${p.locale}`, <LeadIdLine key="id" leadId={p.leadId} />]} />
      </Section>
    </Layout>
  );
}

export async function buildAdminPlaybookAlert(input: AdminPlaybookAlertInput): Promise<RenderedEmail> {
  // Kept backward compatible with filters on "Playbook download:".
  const subject = `Playbook download: ${input.website ?? input.email}`;
  return renderEmail(subject, <AdminPlaybookAlertEmail p={input} subject={subject} />);
}
