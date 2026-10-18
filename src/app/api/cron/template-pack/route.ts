import { NextRequest, NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { createEmailTransport, isEmailConfigured, sendEmail, NOTIFICATION_RECIPIENT } from "@/lib/email";
import { locales, defaultLocale, type Locale } from "@/i18n/config";
import { SITE_URL } from "@/lib/seo";
import { buildTemplatePackEmail } from "@/emails/TemplatePack";

/**
 * GET /api/cron/template-pack: daily Vercel cron (see vercel.json).
 *
 * Emails every playbook signup the Template Pack PDF about 2 days after they
 * got the playbook. Covers source 'playbook' (direct signup) and
 * 'clinic_audit' (the free check, which also emails the playbook link).
 *
 * Picks leads created 48h to 14 days ago (the lower bound stops a first
 * deploy from mailing old leads), one per email address, with no
 * metadata.templatePack yet and no metadata.emailOptOut. After each
 * successful send it merges metadata.templatePack = { sentAt, locale, url }
 * into every matching row for that address (other metadata keys kept).
 * A failed send is logged and left unmarked, so the next run retries it.
 * An invalid address is marked { skippedAt, reason } and never retried.
 *
 * Opt-out: there is no unsubscribe flow; the email says "reply stop". To
 * honour a reply, set metadata.emailOptOut = true on that lead.
 *
 * Auth: Authorization: Bearer CRON_SECRET (Vercel sends it automatically).
 */

// Hobby plan caps functions at 60s.
export const maxDuration = 60;

const SOURCES = ["playbook", "clinic_audit"] as const;
// About 1-2s per email; 20 keeps a run well under 60s. The rest go next day.
const BATCH_LIMIT = 20;

/**
 * Locales with a published PDF at public/downloads/playbook/template-pack-<locale>.pdf.
 * Add a locale here once its PDF is in public/; others fall back to English.
 */
const PACK_LOCALES: readonly Locale[] = ["en"];

function packUrl(locale: Locale): string {
  const file = PACK_LOCALES.includes(locale) ? locale : "en";
  return `${SITE_URL}/downloads/playbook/template-pack-${file}.pdf`;
}

const emailSchema = z.string().trim().email().max(200);

type Row = { id: string; email: string; source: string; locale: string | null };

async function markLead(email: string, value: Record<string, string>) {
  const sources = sql.join(SOURCES.map((s) => sql`${s}`), sql`, `);
  await db.execute(sql`
    update leads
    set metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object('templatePack', ${JSON.stringify(value)}::jsonb),
        updated_at = now()
    where lower(email) = lower(${email})
      and source in (${sources})
      and (metadata -> 'templatePack') is null
  `);
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isEmailConfigured()) {
    console.warn("[template-pack] email not configured; nothing sent");
    return NextResponse.json({ error: "email_not_configured" }, { status: 503 });
  }

  const sources = sql.join(SOURCES.map((s) => sql`${s}`), sql`, `);
  let rows: Row[];
  try {
    const result = await db.execute(sql`
      select distinct on (lower(l.email))
        l.id, l.email, l.source, l.metadata ->> 'locale' as locale
      from leads l
      where l.source in (${sources})
        and l.email is not null and l.email <> ''
        and l.created_at <= now() - interval '48 hours'
        and l.created_at >= now() - interval '14 days'
        and (l.metadata -> 'templatePack') is null
        -- Unfinished audits never received the playbook, so no pack either.
        and coalesce(l.metadata ->> 'partial', 'false') <> 'true'
        and not exists (
          select 1 from leads o
          where lower(o.email) = lower(l.email)
            and (
              (o.metadata -> 'templatePack' ->> 'sentAt') is not null
              or (o.metadata ->> 'emailOptOut') = 'true'
            )
        )
      order by lower(l.email), l.created_at asc
      limit ${BATCH_LIMIT}
    `);
    rows = result.rows as Row[];
  } catch (error) {
    console.error("[template-pack] query failed:", error);
    return NextResponse.json({ error: "query_failed" }, { status: 500 });
  }

  if (rows.length === 0) {
    return NextResponse.json({ sent: 0, failed: 0, skipped: 0 });
  }

  // Never mail a dead link: check each PDF this batch needs is live.
  const urls = [...new Set(rows.map((r) => packUrl(toLocale(r.locale))))];
  for (const url of urls) {
    const ok = await fetch(url, { method: "HEAD" }).then((r) => r.ok).catch(() => false);
    if (!ok) {
      console.error("[template-pack] PDF not reachable, aborting run:", url);
      return NextResponse.json({ error: "pdf_unavailable", url }, { status: 500 });
    }
  }

  const transporter = createEmailTransport();
  let sent = 0;
  let failed = 0;
  let skipped = 0;

  for (const row of rows) {
    const parsed = emailSchema.safeParse(row.email);
    if (!parsed.success) {
      skipped++;
      try {
        await markLead(row.email, { skippedAt: new Date().toISOString(), reason: "invalid_email" });
      } catch (error) {
        console.error("[template-pack] failed to mark invalid lead:", row.id, error);
      }
      continue;
    }

    const locale = toLocale(row.locale);
    const url = packUrl(locale);

    let email;
    try {
      email = await buildTemplatePackEmail({ locale, packUrl: url, source: row.source });
    } catch (error) {
      failed++;
      console.error("[template-pack] failed to render, will retry next run:", row.id, error);
      continue;
    }

    const result = await sendEmail(
      { to: parsed.data, replyTo: NOTIFICATION_RECIPIENT(), subject: email.subject, text: email.text, html: email.html },
      transporter,
    );
    if (!result.sent) {
      failed++;
      console.error("[template-pack] send failed, will retry next run:", row.id, result.error);
      continue;
    }

    sent++;
    try {
      await markLead(row.email, { sentAt: new Date().toISOString(), locale, url });
    } catch (error) {
      // Sent but not marked: the next run would send again. Log loudly.
      console.error("[template-pack] SENT BUT NOT MARKED, fix manually:", row.id, row.email, error);
    }
  }

  console.log("[template-pack] run done", { sent, failed, skipped });
  return NextResponse.json({ sent, failed, skipped });
}

function toLocale(value: string | null): Locale {
  return (locales as readonly string[]).includes(value ?? "") ? (value as Locale) : defaultLocale;
}
