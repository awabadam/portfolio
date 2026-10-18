import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { leads } from "@/db/schema";
import { checkRateLimit, getIdentifier, getRateLimitHeaders } from "@/lib/rateLimit";
import { createEmailTransport, isEmailConfigured, sendEmail, NOTIFICATION_RECIPIENT } from "@/lib/email";
import { normalizeWebsite } from "@/lib/audit";
import { locales, defaultLocale, type Locale } from "@/i18n/config";
import { getPlaybook, leadTrackerCsv } from "@/lib/playbook";
import { createPlaybookKey } from "@/lib/playbookKey";
import { playbookHref } from "@/lib/playbookMeta";
import { localeUrl } from "@/lib/seo";

/**
 * POST /api/playbook: the direct path to the playbook, without the check.
 * Body: { email, website?, locale?, company_website (honeypot) }.
 * Saves a lead (source 'playbook'), emails the submitter the personal
 * playbook link, the first lines of the summary and the lead tracker CSV,
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

type Messages = {
  email: { greeting: string; whatsapp: string; signoff: string };
  playbook: {
    email: {
      subject: string;
      heading: string;
      text: string;
      csvNote: string;
      summaryIntro: string;
      checkLine: string;
      packLine: string;
    };
  };
};

async function loadMessages(locale: Locale): Promise<Messages> {
  const mod = (await import(`@/messages/${locale}.json`)) as { default: { audit: Messages } };
  return mod.default.audit;
}

function fill(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, k) => (k in values ? String(values[k]) : `{${k}}`));
}

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
    const transporter = createEmailTransport();
    const [m, playbook] = await Promise.all([loadMessages(locale), getPlaybook(locale)]);
    const csv = leadTrackerCsv(playbook);

    const adminResult = await sendEmail(
      {
        to: NOTIFICATION_RECIPIENT(),
        replyTo: data.email,
        subject: `Playbook download: ${website ?? data.email}`,
        text: [
          "Playbook requested (direct, no check).",
          "",
          `Email:    ${data.email}`,
          `Website:  ${website ?? "-"}`,
          `Locale:   ${locale}`,
          `Lead id:  ${leadId ?? "not saved"}`,
        ].join("\n"),
      },
      transporter,
    );
    notified = adminResult.sent;

    const userText = [
      m.email.greeting,
      "",
      m.playbook.email.heading,
      m.playbook.email.text,
      playbookUrl,
      "",
      ...(csv ? [m.playbook.email.csvNote, ""] : []),
      m.playbook.email.packLine,
      "",
      m.playbook.email.summaryIntro,
      ...playbook.summary.slice(0, 3).map((line, i) => `${i + 1}. ${line}`),
      "",
      fill(m.playbook.email.checkLine, { url: localeUrl("/audit", locale) }),
      "",
      fill(m.email.whatsapp, { number: "+90 554 175 9945" }),
      "",
      m.email.signoff,
      "Awab Elkhalil",
      "https://www.awab.design",
    ].join("\n");

    const userResult = await sendEmail(
      {
        to: data.email,
        replyTo: NOTIFICATION_RECIPIENT(),
        subject: m.playbook.email.subject,
        text: userText,
        attachments: csv ? [{ filename: csv.filename, content: csv.content, contentType: "text/csv; charset=utf-8" }] : undefined,
      },
      transporter,
    );
    confirmed = userResult.sent;
  } else {
    console.warn("[playbook] email not configured; lead saved without notification", { leadId });
  }

  return NextResponse.json(
    { ok: true, id: leadId, notified, confirmed, playbookKey },
    { headers: getRateLimitHeaders(rate) },
  );
}
