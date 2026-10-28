import { NextResponse } from "next/server";
import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { leads } from "@/db/schema";
import { checkRateLimit, getIdentifier, getRateLimitHeaders } from "@/lib/rateLimit";
import {
  ANSWER_VALUES,
  BUDGET_FIT_IDS,
  CHANNEL_IDS,
  CLOSING_STEPS,
  MARKET_IDS,
  OPENING_STEPS,
  QUESTION_IDS,
  ROLE_IDS,
  TIMELINE_IDS,
  TREATMENT_IDS,
  VOLUME_IDS,
  computeResult,
  computeTier,
  isComplete,
  normalizeWebsite,
  qualificationOf,
  type QuestionId,
} from "@/lib/audit";
import { SCAN_VERSION, scanChecksSchema, type ScanChecks } from "@/lib/auditScan";
import { verifyAuditLeadToken } from "@/lib/auditLeadToken";

/**
 * POST /api/audit/progress — how far a visitor with a partial lead got.
 * { token, stage, total, currentStep?, answered, answers, role?, treatments?, markets?,
 *   volume?, channel?, timeline?, budgetFit?, website?, scan? } → { ok: true }.
 *
 * Sent (debounced, and with navigator.sendBeacon on pagehide) by /audit while
 * the visitor advances. Only touches a row whose token verifies, that is still
 * partial and from the audit; merges metadata.progress, the answers so far,
 * the qualification given so far and a provisional tier into the existing
 * metadata (jsonb ||), so every other key stays. The lead is saved on the
 * email step, before the website, so the website and the scan arrive here
 * (only when sent: older clients leave them as they are). 401 for a bad token,
 * 404 once the row is complete or gone (the client then stops sending).
 */

export const runtime = "nodejs";

const RATE_LIMIT = { limit: 120, windowMs: 60 * 60 * 1000, prefix: "audit-progress" };
const MAX_SCAN_JSON = 8000;

/** Longest sequence: 5 opening + 10 site + 2 closing questions (no scan). */
const MAX_STEPS = OPENING_STEPS.length + QUESTION_IDS.length + CLOSING_STEPS.length;
const STEP_IDS = [...OPENING_STEPS, ...QUESTION_IDS, ...CLOSING_STEPS] as [string, ...string[]];

const answersSchema = z
  .object(
    Object.fromEntries(QUESTION_IDS.map((id) => [id, z.enum(ANSWER_VALUES).optional()])) as Record<
      QuestionId,
      z.ZodOptional<z.ZodEnum<{ yes: "yes"; partly: "partly"; no: "no" }>>
    >,
  )
  .optional()
  .default({});

const bodySchema = z.object({
  token: z.string().max(120),
  stage: z.enum(["website", "review", "questions", "result"]),
  /** Length of the question sequence: 10 after a scan, 17 without. */
  total: z.number().int().min(1).max(MAX_STEPS),
  /** Only while in the questions: the question on screen (1-based) and its id. */
  currentStep: z
    .object({
      n: z.number().int().min(1).max(MAX_STEPS),
      id: z.enum(STEP_IDS),
    })
    .nullable()
    .optional(),
  answered: z.number().int().min(0).max(MAX_STEPS).optional().default(0),
  answers: answersSchema,
  role: z.enum(ROLE_IDS).optional(),
  treatments: z.enum(TREATMENT_IDS).optional(),
  markets: z.array(z.enum(MARKET_IDS)).max(MARKET_IDS.length).optional().default([]),
  volume: z.enum(VOLUME_IDS).optional(),
  channel: z.array(z.enum(CHANNEL_IDS)).max(CHANNEL_IDS.length).optional().default([]),
  timeline: z.enum(TIMELINE_IDS).optional(),
  budgetFit: z.enum(BUDGET_FIT_IDS).optional(),
  /** "" until the visitor enters one. */
  website: z.string().trim().max(300).optional(),
  /** The scan checks, or null without a scan. */
  scan: z.unknown().optional(),
});

/** Same limits as /api/audit/start: anything too large or malformed is dropped. */
function readScan(v: unknown): ScanChecks | null {
  if (!v || typeof v !== "object") return null;
  try {
    if (JSON.stringify(v).length > MAX_SCAN_JSON) return null;
    const parsed = scanChecksSchema.safeParse(v);
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const rate = checkRateLimit(getIdentifier(request), RATE_LIMIT);
  if (!rate.success) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429, headers: getRateLimitHeaders(rate) });
  }

  let json: unknown;
  try {
    // sendBeacon posts a Blob; request.json() reads it whatever the content type.
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

  const id = verifyAuditLeadToken(data.token);
  if (!id) return NextResponse.json({ error: "invalid_token" }, { status: 401 });

  const answers = Object.fromEntries(
    QUESTION_IDS.filter((q) => data.answers[q] !== undefined).map((q) => [q, data.answers[q]]),
  ) as Partial<Record<QuestionId, (typeof ANSWER_VALUES)[number]>>;
  const markets = [...new Set(data.markets)];
  const channel = [...new Set(data.channel)];
  const profile = {
    role: data.role,
    treatments: data.treatments,
    markets,
    volume: data.volume,
    channel,
    timeline: data.timeline,
    budgetFit: data.budgetFit,
  };

  // The qualification answers given so far; the full set (qualificationOf) makes the tier final.
  const given = {
    ...(data.role ? { role: data.role } : {}),
    ...(channel.length ? { channel } : {}),
    ...(data.timeline ? { timeline: data.timeline } : {}),
    ...(data.budgetFit ? { budgetFit: data.budgetFit } : {}),
  };
  const qualification = qualificationOf(profile);
  // Without volume or the full qualification there is nothing to judge yet.
  const tier =
    qualification || data.volume
      ? computeTier({ treatments: data.treatments, markets, volume: data.volume }, qualification)
      : null;
  const total = data.total;
  const answered = Math.min(data.answered, total);
  const result = isComplete(answers) ? computeResult(answers) : null;
  const website = data.website === undefined ? undefined : data.website ? normalizeWebsite(data.website) : null;
  const scan = data.scan === undefined ? undefined : readScan(data.scan);

  const patch = {
    progress: {
      stage: data.stage,
      answered,
      total,
      lastStep: data.currentStep ? { n: Math.min(data.currentStep.n, total), id: data.currentStep.id } : null,
      at: new Date().toISOString(),
    },
    answers,
    treatments: data.treatments ?? null,
    markets,
    volume: data.volume ?? null,
    qualification: Object.keys(given).length ? given : null,
    tier,
    tierProvisional: !qualification,
    ...(result ? { score: result.score, band: result.band, fixes: result.fixes } : {}),
    ...(website !== undefined ? { website } : {}),
    ...(scan !== undefined ? { scan: scan ? { version: SCAN_VERSION, ...scan } : null } : {}),
  };

  try {
    const rows = await db
      .update(leads)
      .set({
        ...(website ? { message: `Partial audit (not finished): ${website}` } : {}),
        metadata: sql`coalesce(${leads.metadata}, '{}'::jsonb) || ${JSON.stringify(patch)}::jsonb`,
      })
      .where(
        and(
          eq(leads.id, id),
          eq(leads.source, "clinic_audit"),
          sql`${leads.metadata}->>'partial' = 'true'`,
        ),
      )
      .returning({ id: leads.id });
    if (rows.length === 0) return NextResponse.json({ error: "not_found" }, { status: 404 });
    return NextResponse.json({ ok: true }, { headers: getRateLimitHeaders(rate) });
  } catch (error) {
    console.error("[audit/progress] failed to update partial lead:", error);
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }
}
