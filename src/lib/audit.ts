/**
 * International Patient Readiness Score — shared scoring logic.
 *
 * Used by the /audit quiz (client) and by /api/audit (server), which
 * recomputes the score from the raw answers instead of trusting the client.
 * All visible copy lives in the `audit` namespace of src/messages/*.json,
 * keyed by the ids below (audit.questions.<id>.{q,why,fix,impact}, audit.bands.<id>).
 *
 * v2: the dedicated RTL question was replaced by `journey` (does the site
 * explain the whole trip). Bumping the version also drops saved v1 drafts.
 */

export const AUDIT_VERSION = 2;

export const QUESTION_IDS = [
  "languages",
  "journey",
  "whatsapp",
  "speed",
  "treatments",
  "credentials",
  "gallery",
  "booking",
  "tracking",
  "feedback",
] as const;

export type QuestionId = (typeof QUESTION_IDS)[number];

export const ANSWER_VALUES = ["yes", "partly", "no"] as const;
export type Answer = (typeof ANSWER_VALUES)[number];

export type Answers = Partial<Record<QuestionId, Answer>>;

export const ANSWER_POINTS: Record<Answer, number> = {
  yes: 10,
  partly: 5,
  no: 0,
};

/**
 * Tie-break order when several questions share the lowest answer: the fix
 * that moves inquiries the most comes first.
 */
const FIX_PRIORITY: QuestionId[] = [
  "whatsapp",
  "languages",
  "treatments",
  "journey",
  "booking",
  "tracking",
  "feedback",
  "speed",
  "credentials",
  "gallery",
];

export const BAND_IDS = ["losing", "starting", "competitive", "ready"] as const;
export type BandId = (typeof BAND_IDS)[number];

export const BAND_THRESHOLDS: { id: BandId; min: number }[] = [
  { id: "ready", min: 85 },
  { id: "competitive", min: 65 },
  { id: "starting", min: 40 },
  { id: "losing", min: 0 },
];

export const MARKET_IDS = ["gulf", "europe", "uk", "russia", "other"] as const;
export type MarketId = (typeof MARKET_IDS)[number];

export const TOTAL_QUESTIONS = QUESTION_IDS.length;
export const MAX_SCORE = TOTAL_QUESTIONS * ANSWER_POINTS.yes;

export function isComplete(answers: Answers): answers is Record<QuestionId, Answer> {
  return QUESTION_IDS.every((id) => answers[id] !== undefined);
}

export function computeScore(answers: Answers): number {
  const points = QUESTION_IDS.reduce((sum, id) => {
    const a = answers[id];
    return sum + (a ? ANSWER_POINTS[a] : 0);
  }, 0);
  return Math.round((points / MAX_SCORE) * 100);
}

export function bandForScore(score: number): BandId {
  return (BAND_THRESHOLDS.find((b) => score >= b.min) ?? BAND_THRESHOLDS[BAND_THRESHOLDS.length - 1]).id;
}

/** The three questions with the lowest answers, in fix-priority order. */
export function topFixes(answers: Answers, count = 3): QuestionId[] {
  return [...QUESTION_IDS]
    .sort((a, b) => {
      const pa = answers[a] ? ANSWER_POINTS[answers[a]!] : 0;
      const pb = answers[b] ? ANSWER_POINTS[answers[b]!] : 0;
      if (pa !== pb) return pa - pb;
      return FIX_PRIORITY.indexOf(a) - FIX_PRIORITY.indexOf(b);
    })
    .slice(0, count);
}

export interface AuditResult {
  score: number;
  band: BandId;
  fixes: QuestionId[];
}

export function computeResult(answers: Answers): AuditResult {
  const score = computeScore(answers);
  return { score, band: bandForScore(score), fixes: topFixes(answers) };
}

export function isQuestionId(v: unknown): v is QuestionId {
  return typeof v === "string" && (QUESTION_IDS as readonly string[]).includes(v);
}

export function isAnswer(v: unknown): v is Answer {
  return typeof v === "string" && (ANSWER_VALUES as readonly string[]).includes(v);
}

export function isMarketId(v: unknown): v is MarketId {
  return typeof v === "string" && (MARKET_IDS as readonly string[]).includes(v);
}

/** Accepts "clinic.com", "www.clinic.com/en", "https://clinic.com"; returns a normalized https URL or null. */
export function normalizeWebsite(input: string): string | null {
  const raw = input.trim();
  if (!raw || raw.length > 300) return null;
  const withScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    const url = new URL(withScheme);
    if (!/^https?:$/.test(url.protocol)) return null;
    const host = url.hostname;
    // Needs a dot and a plausible TLD; no spaces, no localhost.
    if (!/^[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(host)) return null;
    url.hash = "";
    return url.toString();
  } catch {
    return null;
  }
}

/*
 * Lead questions. They wrap the site questions in one sequence: who is
 * asking and about the clinic first, then the site questions, then timeline
 * and budget just before the result. They never change the score. Copy lives
 * in audit.profile.* keyed by these ids; the answers are stored in
 * leads.metadata (treatments, markets, volume at the top level, the rest in
 * metadata.qualification).
 */

export const TREATMENT_IDS = ["dental", "hair", "aesthetic", "several"] as const;
export type TreatmentId = (typeof TREATMENT_IDS)[number];

export const VOLUME_IDS = ["under10", "10to30", "30to100", "100plus"] as const;
export type VolumeId = (typeof VOLUME_IDS)[number];

export const ROLE_IDS = ["owner", "marketing", "coordinator", "agency"] as const;
export type RoleId = (typeof ROLE_IDS)[number];

export const CHANNEL_IDS = ["facilitators", "ads", "social", "google", "referrals"] as const;
export type ChannelId = (typeof CHANNEL_IDS)[number];

export const TIMELINE_IDS = ["thisMonth", "threeMonths", "researching"] as const;
export type TimelineId = (typeof TIMELINE_IDS)[number];

export const BUDGET_FIT_IDS = ["yes", "discuss", "notNow"] as const;
export type BudgetFitId = (typeof BUDGET_FIT_IDS)[number];

/** Asked before the site questions, in this order. */
export const OPENING_STEPS = ["role", "treatments", "markets", "volume", "channel"] as const;
/** Asked after the site questions, just before the result. */
export const CLOSING_STEPS = ["timeline", "budgetFit"] as const;
export type ProfileStep = (typeof OPENING_STEPS)[number] | (typeof CLOSING_STEPS)[number];

/** The multi-select lead questions; every other question takes one answer. */
export type MultiStep = "markets" | "channel";
export function isMultiStep(id: ProfileStep): id is MultiStep {
  return id === "markets" || id === "channel";
}

/** One question in the check: a lead question or one of the 10 scored site questions. */
export type AuditStep = { kind: "profile"; id: ProfileStep } | { kind: "site"; id: QuestionId };

/**
 * The question sequence after the website step: the opening lead questions,
 * every site question the scan did not answer (all 10 without a scan), then
 * the closing lead questions. The scan's answers are confirmed on the review
 * screen instead. 10 questions after a successful scan, 17 without.
 */
export function buildSteps(scanned: Partial<Record<QuestionId, Answer>> | null): AuditStep[] {
  return [
    ...OPENING_STEPS.map((id): AuditStep => ({ kind: "profile", id })),
    ...QUESTION_IDS.filter((id) => !scanned || scanned[id] === undefined).map((id): AuditStep => ({ kind: "site", id })),
    ...CLOSING_STEPS.map((id): AuditStep => ({ kind: "profile", id })),
  ];
}

export interface ClinicProfile {
  role: RoleId;
  treatments: TreatmentId;
  markets: MarketId[];
  volume: VolumeId;
  channel: ChannelId[];
  timeline: TimelineId;
  budgetFit: BudgetFitId;
}

/** The part of the profile stored as metadata.qualification and used for the tier. */
export interface Qualification {
  role: RoleId;
  channel: ChannelId[];
  timeline: TimelineId;
  budgetFit: BudgetFitId;
}

export type LeadTier = "hot" | "warm" | "cold";

function oneOf<T extends string>(list: readonly T[]) {
  return (v: unknown): v is T => typeof v === "string" && (list as readonly string[]).includes(v);
}

export const isTreatmentId = oneOf(TREATMENT_IDS);
export const isVolumeId = oneOf(VOLUME_IDS);
export const isRoleId = oneOf(ROLE_IDS);
export const isChannelId = oneOf(CHANNEL_IDS);
export const isTimelineId = oneOf(TIMELINE_IDS);
export const isBudgetFitId = oneOf(BUDGET_FIT_IDS);

export function isProfileComplete(p: Partial<ClinicProfile>): p is ClinicProfile {
  return (
    isRoleId(p.role) &&
    isTreatmentId(p.treatments) &&
    Array.isArray(p.markets) &&
    p.markets.length > 0 &&
    isVolumeId(p.volume) &&
    Array.isArray(p.channel) &&
    p.channel.length > 0 &&
    isTimelineId(p.timeline) &&
    isBudgetFitId(p.budgetFit)
  );
}

/** The qualification answers, or null while any of them is missing (older clients). */
export function qualificationOf(p: Partial<ClinicProfile>): Qualification | null {
  const { role, channel, timeline, budgetFit } = p;
  if (!isRoleId(role) || !channel?.length || !isTimelineId(timeline) || !isBudgetFitId(budgetFit)) return null;
  return { role, channel: [...new Set(channel)], timeline, budgetFit };
}

/**
 * Lead tier, computed when the lead is saved (POST /api/audit). Never sent to the browser.
 * - Without the qualification (older clients): cold under 10 patients a month, otherwise warm.
 * - cold: an agency; or just researching with under 10 patients; or just researching and the price does not fit.
 * - hot: owner or marketing, 30+ patients (or 10-30 and the price fits), wants it within 3 months,
 *   and did not say the price does not fit.
 * - warm: everything else.
 */
export function computeTier(profile: Partial<ClinicProfile>, q?: Qualification | null): LeadTier {
  const volume = profile.volume;
  if (!q) return volume === "under10" ? "cold" : "warm";

  const researching = q.timeline === "researching";
  if (q.role === "agency") return "cold";
  if (researching && volume === "under10") return "cold";
  if (researching && q.budgetFit === "notNow") return "cold";

  const decisionMaker = q.role === "owner" || q.role === "marketing";
  const enoughVolume =
    volume === "30to100" || volume === "100plus" || (volume === "10to30" && q.budgetFit === "yes");
  const soon = q.timeline === "thisMonth" || q.timeline === "threeMonths";
  if (decisionMaker && enoughVolume && soon && q.budgetFit !== "notNow") return "hot";

  return "warm";
}
