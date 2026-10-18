/**
 * Shared pieces of the owner's alert emails (audit lead, playbook download,
 * contact form). English only. Verdict first: badge + one "why" line +
 * actions, then WHO, the details, and a small mono block with the ids.
 */
import type { ReactNode } from "react";
import { SITE_URL } from "@/lib/seo";
import { A, COLORS, FONTS, H1, Kicker, KickerText, Pill, Spacer, Table, whatsappLinkFor } from "./ui";

export const ADMIN_LEADS_URL = `${SITE_URL}/admin/leads`;

export type BadgeTone = "hot" | "warm" | "cold" | "neutral";

const BADGE: Record<BadgeTone, { bg: string; fg: string }> = {
  hot: { bg: COLORS.no, fg: "#ffffff" },
  warm: { bg: "#b45309", fg: "#ffffff" },
  cold: { bg: "#3f3f46", fg: "#ffffff" },
  neutral: { bg: COLORS.text, fg: "#ffffff" },
};

export function Badge({ tone, children, outline = false }: { tone: BadgeTone; children: ReactNode; outline?: boolean }) {
  const c = BADGE[tone];
  return (
    <span
      style={{
        display: "inline-block",
        padding: "5px 10px",
        borderRadius: "999px",
        backgroundColor: outline ? COLORS.card : c.bg,
        border: `1px solid ${outline ? COLORS.muted : c.bg}`,
        color: outline ? COLORS.text : c.fg,
        fontFamily: FONTS.mono,
        fontSize: "11px",
        lineHeight: "12px",
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        marginRight: "6px",
      }}
    >
      {children}
    </span>
  );
}

export interface AlertTopProps {
  badges: ReactNode;
  /** Shown big on the right of the badge row (e.g. "58/100"). */
  metric?: string;
  title: ReactNode;
  subline?: ReactNode;
  why: string;
  replyTo: string;
  replySubject: string;
  phone?: string | null;
  whatsappText?: string;
}

/** Badge row, title, the "why" line and the actions. */
export function AlertTop(p: AlertTopProps) {
  const wa = whatsappLinkFor(p.phone, p.whatsappText);
  return (
    <>
      <Table>
        <tr>
          <td align="left" style={{ verticalAlign: "middle" }}>
            {p.badges}
          </td>
          {p.metric ? (
            <td align="right" style={{ verticalAlign: "middle", textAlign: "right", fontFamily: FONTS.heading, fontSize: "22px", lineHeight: "24px", fontWeight: 700, letterSpacing: "-0.02em", color: COLORS.text, whiteSpace: "nowrap" }}>
              {p.metric}
            </td>
          ) : null}
        </tr>
      </Table>
      <Spacer h={16} />
      <H1 style={{ margin: "0 0 6px 0", fontSize: "28px" }}>{p.title}</H1>
      {p.subline ? (
        <p style={{ margin: "0 0 18px 0", fontFamily: FONTS.sans, fontSize: "15px", lineHeight: "1.5", color: COLORS.muted }}>{p.subline}</p>
      ) : null}
      <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} border={0} bgcolor={COLORS.soft} style={{ backgroundColor: COLORS.soft, borderRadius: "10px", borderCollapse: "separate" }}>
        <tbody>
          <tr>
            <td style={{ padding: "16px 18px", fontFamily: FONTS.sans, fontSize: "17px", lineHeight: "1.45", fontWeight: 600, color: COLORS.text }}>{p.why}</td>
          </tr>
        </tbody>
      </table>
      <Spacer h={18} />
      <div>
        <Pill href={`mailto:${p.replyTo}?subject=${encodeURIComponent(p.replySubject)}`}>Reply</Pill>
        <Pill href={ADMIN_LEADS_URL} outline>
          Open in admin
        </Pill>
        {wa ? (
          <Pill href={wa} outline>
            WhatsApp
          </Pill>
        ) : null}
      </div>
    </>
  );
}

export function Section({ label, children }: { label: string; children: ReactNode }) {
  return (
    <>
      <Spacer h={30} />
      <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} border={0}>
        <tbody>
          <tr>
            <td style={{ borderTop: `1px solid ${COLORS.text}`, paddingTop: "12px" }}>
              <Kicker color={COLORS.text} style={{ margin: "0 0 12px 0" }}>
                {label}
              </Kicker>
            </td>
          </tr>
        </tbody>
      </table>
      {children}
    </>
  );
}

/** Label/value rows; rows with an empty value are dropped. */
export function KeyValues({ rows }: { rows: [string, ReactNode | null | undefined | false][] }) {
  const shown = rows.filter(([, v]) => v !== null && v !== undefined && v !== false && v !== "");
  return (
    <Table>
      {shown.map(([label, value]) => (
        <tr key={label}>
          <td
            width={120}
            className="em-kv-label"
            valign="top"
            style={{ width: "120px", verticalAlign: "top", padding: "5px 12px 5px 0", borderBottom: `1px solid ${COLORS.hairline}` }}
          >
            <KickerText>{label}</KickerText>
          </td>
          <td valign="top" style={{ verticalAlign: "top", padding: "4px 0 5px 0", borderBottom: `1px solid ${COLORS.hairline}`, fontFamily: FONTS.sans, fontSize: "15px", lineHeight: "1.45", color: COLORS.text }}>
            {value}
          </td>
        </tr>
      ))}
    </Table>
  );
}

/** Small mono block at the bottom: scan facts, versions, ids. */
export function MonoBlock({ lines }: { lines: ReactNode[] }) {
  return (
    <table role="presentation" width="100%" cellPadding={0} cellSpacing={0} border={0} bgcolor={COLORS.soft} style={{ backgroundColor: COLORS.soft, borderRadius: "8px", borderCollapse: "separate" }}>
      <tbody>
        <tr>
          <td style={{ padding: "14px 16px", fontFamily: FONTS.mono, fontSize: "12px", lineHeight: "1.6", color: COLORS.text }}>
            {lines.map((l, i) => (
              <div key={i}>{l === "" ? "\u00a0" : l}</div>
            ))}
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export function LeadIdLine({ leadId }: { leadId: string | null }) {
  return (
    <>
      Lead id: {leadId ? <A href={ADMIN_LEADS_URL}>{leadId}</A> : "not saved (check the logs)"}
    </>
  );
}

export function MailLink({ email }: { email: string }) {
  return <A href={`mailto:${email}`}>{email}</A>;
}

export function PhoneValue({ phone }: { phone: string | null | undefined }) {
  if (!phone) return null;
  const wa = whatsappLinkFor(phone);
  return wa ? <A href={wa}>{phone}</A> : <>{phone}</>;
}

export const ADMIN_FOOTER = "Sent by awab.design. Reply goes straight to the lead.";
