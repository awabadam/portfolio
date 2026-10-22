import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { leads } from "@/db/schema";
import { checkRateLimit, getIdentifier, getRateLimitHeaders } from "@/lib/rateLimit";
import { isEmailConfigured, sendEmail, NOTIFICATION_RECIPIENT, SENDERS } from "@/lib/email";
import { normalizeWebsite } from "@/lib/audit";
import { locales, defaultLocale, type Locale } from "@/i18n/config";
import { getPlaybook } from "@/lib/playbook";
import { createPlaybookKey } from "@/lib/playbookKey";
import { playbookHref } from "@/lib/playbookMeta";
import { localeUrl } from "@/lib/seo";
import { buildAdminPlaybookAlert } from "@/emails/AdminPlaybookAlert";
import { buildPlaybookAccessEmail } from "@/emails/PlaybookAccess";

/**
 * POST /api/playbook: the direct path to the playbook, without the check.
 * Body: { email, website?, locale?, company_website (honeypot) }.
 * Saves a lead (source 'playbook'), emails the submitter the personal
 * playbook link and the first lines of the summary,
 * sends Awab a short note, and returns { ok, playbookKey } so the page can
 * open /audit/playbook right away. Email failures never fail the request.
 */

const RATE_LIMIT = { limit: 5, windowMs: 60 * 60 * 1000, prefix: "playbook" };

const bodySchema = z.object({
  email: z.string().trim().toLowerCase().email("email_invalid").max(200),
  website: z.string().trim().max(300).optional().default(""),
  locale: z.string().max(5).optional(),
  // Honeypot: real users never fill this.
  company_website: z.string().max(300).optional().default(""),
});

export async function POST(request: Request) {
  const rate = checkRateLimit(getIdentifier(request), RATE_LIMIT);
  if (!rate.success) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429, headers: getRateLimitHeaders(rate) });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      { ok: false, error: "validation", field: first?.path?.[0] ?? null, message: first?.message ?? "invalid" },
      { status: 400 },
    );
  }
  const data = parsed.data;

  // Honeypot filled: pretend success, store nothing, issue no key.
  if (data.company_website) {
    return NextResponse.json({ ok: true, playbookKey: null });
  }

  let website: string | null = null;
  if (data.website) {
    website = normalizeWebsite(data.website);
    if (!website) {
      return NextResponse.json(
        { ok: false, error: "validation", field: "website", message: "website_invalid" },
        { status: 400 },
      );
    }
  }

  const locale: Locale = (locales as readonly string[]).includes(data.locale ?? "")
    ? (data.locale as Locale)
    : defaultLocale;

  const headers = request.headers;
  const ipAddress = headers.get("x-forwarded-for")?.split(",")[0].trim() || headers.get("x-real-ip") || "unknown";
  const userAgent = headers.get("user-agent") || "unknown";

  let leadId: string | null = null;
  try {
    const [row] = await db
      .insert(leads)
      .values({
        source: "playbook",
        email: data.email,
        message: website ? `Playbook requested. Website: ${website}` : "Playbook requested.",
        project_type: "playbook",
        ip_address: ipAddress,
        user_agent: userAgent,
        metadata: { locale, ...(website ? { website } : {}) },
      })
      .returning({ id: leads.id });
    leadId = row?.id ?? null;
  } catch (error) {
    // Still email so the lead is not lost.
    console.error("[playbook] failed to save lead:", error);
  }

  const playbookKey = createPlaybookKey(data.email);
  const playbookUrl = localeUrl(playbookHref(playbookKey), locale);

  let notified = false;
  let confirmed = false;
  if (isEmailConfigured()) {
    const playbook = await getPlaybook(locale);

    // Rendering is best effort like sending: a template error never fails the request.
    try {
      const admin = await buildAdminPlaybookAlert({ email: data.email, website, locale, leadId });
      const adminResult = await sendEmail({ from: "audit", to: NOTIFICATION_RECIPIENT(), replyTo: data.email, subject: admin.subject, text: admin.text, html: admin.html });
      notified = adminResult.sent;
    } catch (error) {
      console.error("[playbook] failed to render the admin alert:", error);
    }

    try {
      const access = await buildPlaybookAccessEmail({ locale, playbookUrl, playbook });
      const userResult = await sendEmail({
        from: "audit",
        to: data.email,
        replyTo: SENDERS.audit,
        subject: access.subject,
        text: access.text,
        html: access.html,
      });
      confirmed = userResult.sent;
    } catch (error) {
      console.error("[playbook] failed to render the playbook email:", error);
    }
  } else {
    console.warn("[playbook] email not configured; lead saved without notification", { leadId });
  }

  return NextResponse.json(
    { ok: true, id: leadId, notified, confirmed, playbookKey },
    { headers: getRateLimitHeaders(rate) },
  );
}
