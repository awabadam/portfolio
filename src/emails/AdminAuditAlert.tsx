/**
 * The owner's alert for a completed clinic audit (POST /api/audit).
 * Verdict first: tier, score, domain and one plain-English line on why,
 * then who they are, what their site is missing and the raw scan details.
 */
import en from "@/messages/en.json";
import {
  QUESTION_IDS,
  type Answers,
  type BandId,
  type ChannelId,
  type LeadTier,
  type MarketId,
  type QuestionId,
  type Qualification,
  type TreatmentId,
  type VolumeId,
} from "@/lib/audit";
import { A, COLORS, FONTS, Layout, P, Table, domainOf } from "./ui";
import { ADMIN_FOOTER, AlertTop, Badge, KeyValues, LeadIdLine, MailLink, MonoBlock, PhoneValue, Section } from "./admin";
import { renderEmail, type RenderedEmail } from "./render";

const profile = en.audit.profile;
const questions = en.audit.questions as Record<QuestionId, { q: string }>;
const bands = en.audit.bands as Record<BandId, { name: string }>;

export const VOLUME_LABEL: Record<VolumeId, string> = {
  under10: "Under 10 patients/month",
  "10to30": "10–30 patients/month",
  "30to100": "30–100 patients/month",
  "100plus": "100+ patients/month",
};

export const TIMELINE_LABEL: Record<Qualification["timeline"], string> = {
  thisMonth: "This month",
  threeMonths: "Within 3 months",
  researching: "Just researching",
};

export const BUDGET_LABEL: Record<Qualification["budgetFit"], string> = {
  yes: "Fits",
  discuss: "Wants to talk",
  notNow: "Not now",
};

/** Short names for the 10 site questions, for the compact lists. */
export const QUESTION_SHORT: Record<QuestionId, string> = {
  languages: "Language pages",
  journey: "Trip explained",
  whatsapp: "WhatsApp on treatment pages",
  speed: "Mobile speed",
  treatments: "Prices and recovery",
  credentials: "Credentials",
  gallery: "Before/after",
  booking: "2-tap booking",
  tracking: "Inquiry tracking",
  feedback: "Conversions fed back",
};

const ROLE_SHORT: Record<Qualification["role"], string> = {
  owner: "Owner or doctor",
  marketing: "Marketing",
  coordinator: "Coordinator (not the decision-maker)",
  agency: "Agency or freelancer, not a clinic",
};

export interface AdminAuditAlertInput {
  tier: LeadTier;
  /** True when the tier was computed without the qualification answers. */
  provisional: boolean;
  score: number;
  band: BandId;
  website: string;
  clinic?: string | null;
  name?: string | null;
  email: string;
  phone?: string | null;
  markets: MarketId[];
  treatments?: TreatmentId | null;
  volume?: VolumeId | null;
  qualification: Qualification | null;
  answers: Answers;
  fixes: QuestionId[];
  /** Readable scan facts (scanFactsForEmail), or null when no scan ran. */
  scanFacts: string[] | null;
  locale: string;
  leadId: string | null;
  auditVersion: number;
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** One plain-English line on why the lead got its tier. */
export function whyLine(p: Pick<AdminAuditAlertInput, "tier" | "provisional" | "volume" | "qualification">): string {
  const v = p.volume ? VOLUME_LABEL[p.volume].replace("patients/month", "patients a month") : null;
  const q = p.qualification;
  if (!q) {
    return `No qualification answers (older form), so the tier comes from volume only${v ? `: ${v.charAt(0).toLowerCase() + v.slice(1)}` : ""}.`;
  }
  const role = ROLE_SHORT[q.role];
  const when = { thisMonth: "wants it this month", threeMonths: "wants it within 3 months", researching: "just researching" }[q.timeline];
  const budget = { yes: "budget fits", discuss: "budget to discuss", notNow: "budget not now" }[q.budgetFit];
  const volLower = v ? v.charAt(0).toLowerCase() + v.slice(1) : "volume unknown";

  if (p.tier === "hot") return `${role}, ${volLower}, ${when}, ${budget}.`;
  if (p.tier === "cold") {
    if (q.role === "agency") return `${role}.`;
    if (q.timeline === "researching" && q.budgetFit === "notNow") return "Researching, budget not now.";
    if (q.timeline === "researching") return `Researching, ${volLower}.`;
    return `${capitalize(when)}, ${budget}.`;
  }
  // Warm: say what keeps it from hot.
  const blockers: string[] = [];
  if (q.role === "coordinator") blockers.push("not the decision-maker");
  if (p.volume === "under10") blockers.push("under 10 patients a month");
  else if (p.volume === "10to30" && q.budgetFit !== "yes") blockers.push("10–30 patients a month without a clear budget yes");
  if (q.timeline === "researching") blockers.push("just researching");
  if (q.budgetFit === "notNow") blockers.push("budget not now");
  const lead = `${role}, ${when}, ${budget}.`;
  return blockers.length ? `${lead} Not hot: ${blockers.join(", ")}.` : lead;
}

export function adminAuditSubject(p: Pick<AdminAuditAlertInput, "tier" | "clinic" | "website" | "score" | "volume" | "qualification">): string {
  const who = p.clinic || domainOf(p.website);
  if (p.tier === "hot") {
    const parts = [`Hot: ${who}`];
    if (p.volume) parts.push(VOLUME_LABEL[p.volume]);
    if (p.qualification) parts.push(TIMELINE_LABEL[p.qualification.timeline]);
    return parts.join(" · ");
  }
  return `${p.tier === "warm" ? "Warm" : "Cold"} audit: ${who} (${p.score}/100)`;
}

const GLYPH = { no: { g: "✗", c: COLORS.no }, partly: { g: "~", c: COLORS.partly } } as const;

export function AdminAuditAlertEmail({ p, subject }: { p: AdminAuditAlertInput; subject: string }) {
  const domain = domainOf(p.website);
  const q = p.qualification;
  const tierLabel = p.tier.toUpperCase();
  const notYes = QUESTION_IDS.filter((id) => (p.answers[id] ?? "no") !== "yes").sort(
    (a, b) => ((p.answers[a] ?? "no") === "no" ? 0 : 1) - ((p.answers[b] ?? "no") === "no" ? 0 : 1),
  );
  const yes = QUESTION_IDS.filter((id) => p.answers[id] === "yes");

  return (
    <Layout lang="en" preheader={`${tierLabel} · ${p.score}/100 · ${whyLine(p)}`} kicker="Audit lead" title={subject} footer={ADMIN_FOOTER}>
      <AlertTop
        badges={
          <>
            <Badge tone={p.tier}>{tierLabel}</Badge>
            {p.provisional ? (
              <Badge tone="neutral" outline>
                Provisional
              </Badge>
            ) : null}
          </>
        }
        metric={`${p.score}/100`}
        title={p.clinic ? p.clinic : <A href={p.website} style={{ color: COLORS.text, textDecoration: "none" }}>{domain}</A>}
        subline={
          <>
            {p.clinic ? <><A href={p.website}>{domain}</A> · </> : null}{bands[p.band]?.name ?? p.band}
            {p.name ? <> · {p.name}</> : null}
          </>
        }
        why={whyLine(p)}
        replyTo={p.email}
        replySubject={`Your clinic check: ${domain}`}
        phone={p.phone}
        whatsappText={`Hi${p.name ? ` ${p.name}` : ""}, this is Awab from awab.design. Thanks for taking the clinic check for ${domain}.`}
      />

      <Section label="Who">
        <KeyValues
          rows={[
            ["Name", p.name],
            ["Email", <MailLink key="e" email={p.email} />],
            ["Phone", p.phone ? <PhoneValue key="p" phone={p.phone} /> : null],
            ["Role", q ? profile.role.options[q.role] : null],
            ["Treatments", p.treatments ? profile.treatments.options[p.treatments] : null],
            ["Markets", p.markets.length ? p.markets.map((m) => profile.markets.options[m]).join(", ") : null],
            ["Volume", p.volume ? VOLUME_LABEL[p.volume] : null],
            ["Channels", q?.channel.length ? q.channel.map((c: ChannelId) => profile.channel.options[c]).join(", ") : null],
            ["Timeline", q ? TIMELINE_LABEL[q.timeline] : null],
            ["Budget", q ? BUDGET_LABEL[q.budgetFit] : null],
          ]}
        />
      </Section>

      <Section label="Their site">
        <P style={{ margin: "0 0 14px 0" }}>
          <strong>
            {p.score}/100 · {bands[p.band]?.name ?? p.band}
          </strong>
          {" · "}
          {notYes.length} of 10 need work
        </P>
        <P small style={{ margin: "0 0 6px 0" }}>
          <strong>Top fixes</strong>
        </P>
        <P small style={{ margin: "0 0 16px 0" }}>
          {p.fixes.map((id, i) => (
            <span key={id}>
              {i > 0 ? <br /> : null}
              {i + 1}. {QUESTION_SHORT[id]}
            </span>
          ))}
        </P>
        <Table>
          {notYes.map((id) => {
            const a = (p.answers[id] ?? "no") as "no" | "partly";
            return (
              <tr key={id}>
                <td width={22} valign="top" style={{ width: "22px", verticalAlign: "top", padding: "3px 0", fontFamily: FONTS.sans, fontSize: "15px", lineHeight: "1.45", fontWeight: 700, color: GLYPH[a].c }}>
                  {GLYPH[a].g}
                </td>
                <td valign="top" style={{ verticalAlign: "top", padding: "3px 0", fontFamily: FONTS.sans, fontSize: "15px", lineHeight: "1.45", color: COLORS.text }}>
                  <strong>{QUESTION_SHORT[id]}</strong>
                  {a === "partly" ? " (partly)" : ""}: {questions[id].q}
                </td>
              </tr>
            );
          })}
        </Table>
        {yes.length ? (
          <P small style={{ margin: "12px 0 0 0" }}>
            <span style={{ color: COLORS.yes, fontWeight: 700 }}>✓</span> {yes.length} in place: {yes.map((id) => QUESTION_SHORT[id]).join(", ")}
          </P>
        ) : null}
      </Section>

      <Section label="Scan details">
        <MonoBlock
          lines={[
            ...(p.scanFacts ? ["Automated scan of the home page:", ...p.scanFacts.map((f) => `- ${f}`)] : ["Automated scan: not run (skipped or failed)."]),
            "",
            `Tier ${p.tier}${p.provisional ? " (provisional, no qualification answers)" : ""} · audit v${p.auditVersion} · locale ${p.locale}`,
            p.tier === "hot" ? "They were shown the booking calendar." : "No booking calendar shown.",
            "Promise made: a personal written audit within 48 hours.",
            <LeadIdLine key="id" leadId={p.leadId} />,
          ]}
        />
      </Section>
    </Layout>
  );
}

export async function buildAdminAuditAlert(input: AdminAuditAlertInput): Promise<RenderedEmail> {
  const subject = adminAuditSubject(input);
  return renderEmail(subject, <AdminAuditAlertEmail p={input} subject={subject} />);
}
