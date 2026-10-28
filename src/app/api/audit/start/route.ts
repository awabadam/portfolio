import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { leads } from "@/db/schema";
import { checkRateLimit, getIdentifier, getRateLimitHeaders } from "@/lib/rateLimit";
import { AUDIT_VERSION, normalizeWebsite } from "@/lib/audit";
import { locales, defaultLocale, type Locale } from "@/i18n/config";
import { SCAN_VERSION, scanChecksSchema, type ScanChecks } from "@/lib/auditScan";
import { createAuditLeadToken } from "@/lib/auditLeadToken";

/**
 * POST /api/audit/start — { email, website?, locale?, scan? } → { token }.
 *
 * Called from the /audit email step, the first step of the check, so the
 * website and the scan usually come later through /api/audit/progress. Saves a
 * partial lead (source 'clinic_audit', metadata.partial = true) so the owner
 * sees how far people got even when they never reach the result. The token
 * (src/lib/auditLeadToken.ts) lets /api/audit/progress and the final
 * POST /api/audit update this row. No email is sent here, and the address is
 * used only for the report (no newsletter, no marketing consent).
 */

export const runtime = "nodejs";

const RATE_LIMIT = { limit: 10, windowMs: 60 * 60 * 1000, prefix: "audit-start" };
const MAX_SCAN_JSON = 8000;

const bodySchema = z.object({
  email: z.string().trim().toLowerCase().email("email_invalid").max(200),
  // Usually empty: the email step comes before the website (a resumed draft may have one).
  website: z.string().trim().max(300).optional().default(""),
  locale: z.string().max(5).optional(),
  // Honeypot, same as /api/audit.
  company_website: z.string().max(300).optional().default(""),
  scan: z.unknown().optional(),
});

export async function POST(request: Request) {
  const rate = checkRateLimit(getIdentifier(request), RATE_LIMIT);
  if (!rate.success) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429, headers: getRateLimitHeaders(rate) });
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
  if (data.company_website) return NextResponse.json({ token: null });

  const website = data.website ? normalizeWebsite(data.website) : null;
  if (data.website && !website) {
    return NextResponse.json({ error: "validation", field: "website", message: "website_invalid" }, { status: 400 });
  }

  const locale: Locale = (locales as readonly string[]).includes(data.locale ?? "")
    ? (data.locale as Locale)
    : defaultLocale;

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

  const headers = request.headers;
  const ipAddress = headers.get("x-forwarded-for")?.split(",")[0].trim() || headers.get("x-real-ip") || "unknown";
  const userAgent = headers.get("user-agent") || "unknown";

  try {
    const [row] = await db
      .insert(leads)
      .values({
        source: "clinic_audit",
        status: "new",
        email: data.email,
        message: `Partial audit (not finished)${website ? `: ${website}` : ""}`,
        project_type: "audit",
        ip_address: ipAddress,
        user_agent: userAgent,
        metadata: {
          version: AUDIT_VERSION,
          partial: true,
          progress: { stage: "website", answered: 0, total: null, lastStep: null, at: new Date().toISOString() },
          locale,
          website,
          scan: scan ? { version: SCAN_VERSION, ...scan } : null,
        },
      })
      .returning({ id: leads.id });
    if (!row?.id) throw new Error("no id returned");
    return NextResponse.json({ token: createAuditLeadToken(row.id) }, { headers: getRateLimitHeaders(rate) });
  } catch (error) {
    // The check works without it: the client simply keeps going untracked.
    console.error("[audit/start] failed to save partial lead:", error);
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }
}
