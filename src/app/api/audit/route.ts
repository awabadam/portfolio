import { NextResponse } from "next/server";
import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { leads } from "@/db/schema";
import { checkRateLimit, getIdentifier, getRateLimitHeaders } from "@/lib/rateLimit";
import { isEmailConfigured, sendEmail, NOTIFICATION_RECIPIENT, SENDERS } from "@/lib/email";
import {
  ANSWER_VALUES,
  AUDIT_VERSION,
  BUDGET_FIT_IDS,
  CHANNEL_IDS,
  MARKET_IDS,
  QUESTION_IDS,
  ROLE_IDS,
  TIMELINE_IDS,
  TREATMENT_IDS,
  VOLUME_IDS,
  computeResult,
  computeTier,
  normalizeWebsite,
  qualificationOf,
  type Answers,
  type QuestionId,
} from "@/lib/audit";
import { locales, defaultLocale, type Locale } from "@/i18n/config";
import { SCAN_VERSION, scanChecksSchema, scanFactsForEmail, type ScanChecks } from "@/lib/auditScan";
import { getPlaybook } from "@/lib/playbook";
import { createPlaybookKey } from "@/lib/playbookKey";
import { verifyAuditLeadToken } from "@/lib/auditLeadToken";
import { playbookHref } from "@/lib/playbookMeta";
import { localeUrl } from "@/lib/seo";
import { buildAdminAuditAlert } from "@/emails/AdminAuditAlert";
import { buildAuditReportEmail } from "@/emails/AuditReport";

/**
 * POST /api/audit — "International Patient Readiness Score" lead capture.
 * Saves a lead (source 'clinic_audit'), notifies Awab, and sends the
 * submitter the delivery email: score, 3 fixes with the first steps from the
 * matching playbook chapters and the personal playbook link. The response carries `playbookKey` (see src/lib/playbookKey.ts)
 * so the success state can open /audit/playbook right away, and `book`: true
 * when the lead is hot and the success state should offer the booking calendar
 * (the tier itself never leaves the server).
 * Required: email, website, answers. clinic, name, phone and the lead questions
 * (role, treatments, markets, volume, channel, timeline, budgetFit) are optional
 * so older clients that send less still work; without role, channel, timeline
 * and budgetFit the tier is provisional (see computeTier).
 * Email failures never fail the request: the lead is already saved. A hot lead
 * turns Awab's notification into the hot-lead alert (subject "Hot: {clinic} · ...",
 * see src/emails/AdminAuditAlert.tsx).
 * `partialToken` (from POST /api/audit/start) turns the partial lead saved on
 * the email step into this complete one (same row, created_at kept,
 * metadata.partial = false); a missing, forged or already completed token
 * falls back to inserting a new row.
 */

const RATE_LIMIT = { limit: 5, windowMs: 60 * 60 * 1000, prefix: "audit" };

const answersSchema = z.object(
  Object.fromEntries(QUESTION_IDS.map((id) => [id, z.enum(ANSWER_VALUES)])) as Record<
    QuestionId,
    z.ZodEnum<{ yes: "yes"; partly: "partly"; no: "no" }>
  >,
);

const bodySchema = z.object({
  clinic: z.string().trim().max(120).optional().default(""),
  website: z.string().trim().min(1, "website_required").max(300),
  name: z.string().trim().max(100).optional().default(""),
  email: z.string().trim().toLowerCase().email("email_invalid").max(200),
  phone: z.string().trim().max(40).optional().default(""),
  markets: z.array(z.enum(MARKET_IDS)).max(MARKET_IDS.length).optional().default([]),
  treatments: z.enum(TREATMENT_IDS).optional(),
  volume: z.enum(VOLUME_IDS).optional(),
  role: z.enum(ROLE_IDS).optional(),
  channel: z.array(z.enum(CHANNEL_IDS)).max(CHANNEL_IDS.length).optional().default([]),
  timeline: z.enum(TIMELINE_IDS).optional(),
  budgetFit: z.enum(BUDGET_FIT_IDS).optional(),
  answers: answersSchema,
  locale: z.string().max(5).optional(),
  // Honeypot: real users never fill this.
  company_website: z.string().max(300).optional().default(""),
  // Optional result of /api/audit/scan (the `checks` object). Validated separately below and
  // dropped (never rejected) when malformed or oversized, so existing submissions are unaffected.
  scan: z.unknown().optional(),
  // Token of the partial lead from /api/audit/start; never rejected, only verified.
  partialToken: z.string().max(120).optional(),
});

const MAX_SCAN_JSON = 8000;

export async function POST(request: Request) {
  const identifier = getIdentifier(request);
  const rate = checkRateLimit(identifier, RATE_LIMIT);
  if (!rate.success) {
    return NextResponse.json(
      { error: "rate_limited" },
      { status: 429, headers: getRateLimitHeaders(rate) },
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      { error: "validation", field: first?.path?.[0] ?? null, message: first?.message ?? "invalid" },
      { status: 400 },
    );
  }
  const data = parsed.data;

  // Honeypot filled: pretend success, store nothing.
  if (data.company_website) {
    return NextResponse.json({ success: true, score: null });
  }

  const website = normalizeWebsite(data.website);
  if (!website) {
    return NextResponse.json(
      { error: "validation", field: "website", message: "website_invalid" },
      { status: 400 },
    );
  }

  const locale: Locale = (locales as readonly string[]).includes(data.locale ?? "")
    ? (data.locale as Locale)
    : defaultLocale;

  const answers: Answers = data.answers;
  const { score, band, fixes } = computeResult(answers);

  let scan: ScanChecks | null = null;
  if (data.scan && typeof data.scan === "object") {
    try {
      if (JSON.stringify(data.scan).length <= MAX_SCAN_JSON) {
        const parsedScan = scanChecksSchema.safeParse(data.scan);
        if (parsedScan.success) scan = parsedScan.data;
      }
    } catch {
      scan = null;
    }
  }
  const scanFacts = scan ? scanFactsForEmail(scan) : [];

  const headers = request.headers;
  const ipAddress = headers.get("x-forwarded-for")?.split(",")[0].trim() || headers.get("x-real-ip") || "unknown";
  const userAgent = headers.get("user-agent") || "unknown";

  const markets = [...new Set(data.markets)];
  const marketsLabel = markets.length ? markets.join(", ") : "not specified";
  const qualification = qualificationOf(data);
  // Provisional (profile only) when an older client sent no qualification.
  const tier = computeTier({ treatments: data.treatments, markets, volume: data.volume }, qualification);
  const hot = tier === "hot";
  const summary = [
    `Readiness score ${score}/100 (${band})`,
    `Website: ${website}`,
    data.clinic ? `Clinic: ${data.clinic}` : null,
    `Markets: ${marketsLabel}`,
    `Treatments: ${data.treatments ?? "not specified"} · Volume: ${data.volume ?? "not specified"}/month · Tier: ${tier}`,
    qualification
      ? `Role: ${qualification.role} · Channels: ${qualification.channel.join(", ")} · Timeline: ${qualification.timeline} · Budget: ${qualification.budgetFit}`
      : null,
    `Top fixes: ${fixes.join(", ")}`,
  ]
    .filter(Boolean)
    .join("\n");

  const metadata = {
    version: AUDIT_VERSION,
    clinic: data.clinic || null,
    website,
    markets,
    treatments: data.treatments ?? null,
    volume: data.volume ?? null,
    tier,
    qualification: qualification ? { ...qualification, at: new Date().toISOString() } : null,
    answers,
    score,
    band,
    fixes,
    locale,
    scan: scan ? { version: SCAN_VERSION, ...scan } : null,
  };

  let leadId: string | null = null;
  const partialId = verifyAuditLeadToken(data.partialToken);
  if (partialId) {
    // Complete the partial lead from the email step. Its status (the owner may have
    // changed it) and created_at stay; metadata keeps progress for the record.
    try {
      const complete = { ...metadata, partial: false, tierProvisional: !qualification, completedAt: new Date().toISOString() };
      const [row] = await db
        .update(leads)
        .set({
          name: data.name || null,
          email: data.email,
          phone: data.phone || null,
          message: summary,
          project_type: "audit",
          ip_address: ipAddress,
          user_agent: userAgent,
          metadata: sql`coalesce(${leads.metadata}, '{}'::jsonb) || ${JSON.stringify(complete)}::jsonb`,
        })
        .where(
          and(
            eq(leads.id, partialId),
            eq(leads.source, "clinic_audit"),
            sql`${leads.metadata}->>'partial' = 'true'`,
          ),
        )
        .returning({ id: leads.id });
      leadId = row?.id ?? null;
    } catch (error) {
      console.error("[audit] failed to complete partial lead, inserting instead:", error);
    }
  }

  if (!leadId) {
    try {
      const [row] = await db
        .insert(leads)
        .values({
          source: "clinic_audit",
          name: data.name || null,
          email: data.email,
          phone: data.phone || null,
          message: summary,
          project_type: "audit",
          ip_address: ipAddress,
          user_agent: userAgent,
          metadata,
        })
        .returning({ id: leads.id });
      leadId = row?.id ?? null;
    } catch (error) {
      // Still notify by email so the lead is not lost.
      console.error("[audit] failed to save lead:", error);
    }
  }

  const playbookKey = createPlaybookKey(data.email);
  const playbookUrl = localeUrl(playbookHref(playbookKey), locale);

  // Emails (best effort).
  let notified = false;
  let confirmed = false;
  if (isEmailConfigured()) {
    const playbook = await getPlaybook(locale);

    // Rendering is best effort like sending: a template error never fails the request.
    try {
      const admin = await buildAdminAuditAlert({
        tier,
        provisional: !qualification,
        score,
        band,
        website,
        clinic: data.clinic,
        name: data.name,
        email: data.email,
        phone: data.phone,
        markets,
        treatments: data.treatments ?? null,
        volume: data.volume ?? null,
        qualification,
        answers,
        fixes,
        scanFacts: scan ? scanFacts : null,
        locale,
        leadId,
        auditVersion: AUDIT_VERSION,
      });
      const adminResult = await sendEmail({ from: "audit", to: NOTIFICATION_RECIPIENT(), replyTo: data.email, subject: admin.subject, text: admin.text, html: admin.html });
      notified = adminResult.sent;
    } catch (error) {
      console.error("[audit] failed to render the admin alert:", error);
    }

    try {
      const report = await buildAuditReportEmail({
        locale,
        name: data.name,
        website,
        score,
        band,
        answers,
        fixes,
        playbookUrl,
        playbook,
        hot,
      });
      const userResult = await sendEmail({
        from: "audit",
        to: data.email,
        replyTo: SENDERS.audit,
        subject: report.subject,
        text: report.text,
        html: report.html,
      });
      confirmed = userResult.sent;
    } catch (error) {
      console.error("[audit] failed to render the audit report email:", error);
    }
  } else {
    console.warn("[audit] email not configured; lead saved without notification", { leadId, score });
  }

  return NextResponse.json(
    {
      success: true,
      score,
      band,
      fixes,
      notified,
      confirmed,
      playbookKey,
      book: hot,
    },
    { headers: getRateLimitHeaders(rate) },
  );
}
