"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { ArrowDown, ArrowUpRight, Check, FileText } from "lucide-react";
import { GlassPill } from "@/components/ui/glass-pill";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import { formatPrice, formatPriceRange, patientValueRanges, projectTiers } from "@/lib/pricing";
import {
  ANSWER_VALUES,
  AUDIT_VERSION,
  BUDGET_FIT_IDS,
  CHANNEL_IDS,
  CLOSING_STEPS,
  MARKET_IDS,
  QUESTION_IDS,
  ROLE_IDS,
  TIMELINE_IDS,
  TREATMENT_IDS,
  VOLUME_IDS,
  buildSteps,
  computeResult,
  isAnswer,
  isBudgetFitId,
  isChannelId,
  isComplete,
  isMarketId,
  isMultiStep,
  isProfileComplete,
  isQuestionId,
  isRoleId,
  isTimelineId,
  isTreatmentId,
  isVolumeId,
  type Answer,
  type Answers,
  type AuditStep,
  type ClinicProfile,
  type ProfileStep,
  type QuestionId,
} from "@/lib/audit";
import { SCAN_VERSION, type ScanChecks, type ScanSuccess } from "@/lib/auditScan";
import type { ChapterPreview, PlaybookExcerpts } from "@/lib/playbook";
import { PLAYBOOK_META } from "@/lib/playbookMeta";
import AuditQuestion from "./AuditQuestion";
import AuditResult from "./AuditResult";
import AuditReview from "./AuditReview";
import AuditScanStep, { hostOf, isEmailLike, type ScanOutcome } from "./AuditScanStep";
import { AuditFaq, ClosingCta, MakerBlock, PeekInside, SampleResult } from "./AuditLandingSections";
import PlaybookForm from "./PlaybookForm";

/**
 * intro → website (scan) → review (scan answers, skipped without a scan) →
 * questions (lead questions around the site questions the scan did not
 * answer, see buildSteps) → result.
 */
type Stage = "intro" | "website" | "review" | "questions" | "result";

const STORAGE_KEY = `clinic-audit-v${AUDIT_VERSION}`;

interface Draft {
  answers: Answers;
  /** Position in the question sequence (buildSteps). */
  index: number;
  /** Last stage worked on, used to resume. */
  stage: Stage;
  website: string;
  scan: ScanSuccess | null;
  scanFailed: boolean;
  scanMs: number;
  profile: Partial<ClinicProfile>;
  /** Optional email from the scan review, prefilled in the result form. */
  email: string;
  /** The partial lead saved for that email (POST /api/audit/start), or null. */
  lead: PartialLead | null;
}

/**
 * A partial lead: saved on the scan review when an email was given, updated
 * as the visitor advances (/api/audit/progress) and completed by the result
 * form. Reused only for the same email and website.
 */
interface PartialLead {
  token: string;
  email: string;
  website: string;
}

function readLead(v: unknown): PartialLead | null {
  if (!v || typeof v !== "object") return null;
  const l = v as Record<string, unknown>;
  return typeof l.token === "string" && l.token.length <= 120 && typeof l.email === "string" && typeof l.website === "string"
    ? { token: l.token, email: l.email, website: l.website }
    : null;
}

/** Debounce for progress updates; pagehide and hiding the tab flush at once. */
const PROGRESS_DEBOUNCE_MS = 1500;
const PROGRESS_URL = "/api/audit/progress";

const PROFILE_OPTIONS: Record<ProfileStep, readonly string[]> = {
  role: ROLE_IDS,
  treatments: TREATMENT_IDS,
  markets: MARKET_IDS,
  volume: VOLUME_IDS,
  channel: CHANNEL_IDS,
  timeline: TIMELINE_IDS,
  budgetFit: BUDGET_FIT_IDS,
};

/** Entry price for the budget question: the cheapest website package. */
const ENTRY_PRICE = formatPrice(Math.min(...projectTiers.map((tier) => tier.price)));

function isStepAnswered(step: AuditStep, answers: Answers, profile: Partial<ClinicProfile>): boolean {
  if (step.kind === "site") return answers[step.id] !== undefined;
  return isMultiStep(step.id) ? (profile[step.id]?.length ?? 0) > 0 : profile[step.id] !== undefined;
}

/** Drafts saved before the lead questions moved into the sequence simply lack the new fields. */
function readProfile(v: unknown): Partial<ClinicProfile> {
  if (!v || typeof v !== "object") return {};
  const p = v as Record<string, unknown>;
  const markets = Array.isArray(p.markets) ? [...new Set(p.markets.filter(isMarketId))] : [];
  const channel = Array.isArray(p.channel) ? [...new Set(p.channel.filter(isChannelId))] : [];
  return {
    ...(isRoleId(p.role) ? { role: p.role } : {}),
    ...(isTreatmentId(p.treatments) ? { treatments: p.treatments } : {}),
    ...(markets.length ? { markets } : {}),
    ...(isVolumeId(p.volume) ? { volume: p.volume } : {}),
    ...(channel.length ? { channel } : {}),
    ...(isTimelineId(p.timeline) ? { timeline: p.timeline } : {}),
    ...(isBudgetFitId(p.budgetFit) ? { budgetFit: p.budgetFit } : {}),
  };
}

function isScanSuccess(v: unknown): v is ScanSuccess {
  if (!v || typeof v !== "object") return false;
  const s = v as Partial<ScanSuccess>;
  return (
    s.ok === true &&
    s.version === SCAN_VERSION &&
    typeof s.finalUrl === "string" &&
    !!s.checks &&
    typeof s.checks === "object" &&
    !!s.suggestedAnswers &&
    typeof s.suggestedAnswers === "object"
  );
}

function readDraft(): Draft | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Draft>;
    const answers: Answers = {};
    if (parsed.answers && typeof parsed.answers === "object") {
      for (const [k, v] of Object.entries(parsed.answers)) {
        if (isQuestionId(k) && isAnswer(v)) answers[k] = v;
      }
    }
    const scan = isScanSuccess(parsed.scan) ? parsed.scan : null;
    const profile = readProfile(parsed.profile);
    const steps = buildSteps(scan?.suggestedAnswers ?? null);
    const index = Math.min(Math.max(typeof parsed.index === "number" ? parsed.index : 0, 0), steps.length - 1);
    // Drafts saved before the unified sequence used "profile" and "quiz"; both resume in "questions".
    // A finished draft from before the lead questions moved in also resumes there, at the first gap.
    const saved = parsed.stage as string | undefined;
    const stage: Stage =
      saved === "result" && isComplete(answers) && isProfileComplete(profile)
        ? "result"
        : saved === "result"
          ? "questions"
          : saved === "review"
          ? scan
            ? "review"
            : "website"
          : saved === "questions" || saved === "quiz" || saved === "profile"
            ? "questions"
            : saved === "website"
              ? "website"
              : "intro";
    return {
      answers,
      index: saved === "questions" ? index : 0,
      stage,
      website: typeof parsed.website === "string" ? parsed.website.slice(0, 300) : "",
      scan,
      scanFailed: parsed.scanFailed === true,
      scanMs: typeof parsed.scanMs === "number" ? parsed.scanMs : 0,
      profile,
      email: typeof parsed.email === "string" ? parsed.email.slice(0, 200) : "",
      lead: readLead(parsed.lead),
    };
  } catch {
    return null;
  }
}

function writeDraft(draft: Draft | null) {
  try {
    if (!draft) window.sessionStorage.removeItem(STORAGE_KEY);
    else window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  } catch {
    // Private mode or blocked storage: the quiz still works in memory.
  }
}

const ease = [0.22, 1, 0.36, 1] as const;

function isPlaybookHash(): boolean {
  return typeof window !== "undefined" && window.location.hash === "#playbook";
}

/** CSS-only stand-in for the playbook: a dark cover on two offset sheets. */
function PlaybookMock({
  title,
  label,
  chapters,
  more,
  footer,
}: {
  title: string;
  label: string;
  chapters: string[];
  more: string | null;
  footer: string[];
}) {
  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-[440px] p-5">
      <div className="absolute inset-5 rotate-[5deg] rounded-[12px] border border-border bg-muted" />
      <div className="absolute inset-5 rotate-[2.5deg] rounded-[12px] border border-border bg-card" />
      <div className="relative rounded-[12px] bg-black p-6 text-white shadow-[0_24px_60px_-20px_rgba(0,0,0,0.45)] md:p-8">
        <p className="font-mono text-[11px] uppercase tracking-widest text-white/55">{label}</p>
        <p className="mt-4 font-display text-[26px] leading-[1.1] tracking-[-0.02em] text-balance md:text-[30px]">
          {title}
        </p>
        <ol className="mt-6 space-y-2.5 border-t border-white/15 pt-5">
          {chapters.map((c, i) => (
            <li key={i} className="flex items-baseline gap-3 text-sm text-white/80">
              <span className="shrink-0 font-mono text-xs text-white/40">{String(i + 1).padStart(2, "0")}</span>
              <span className="min-w-0 truncate">{c}</span>
            </li>
          ))}
          {more && <li className="ps-8 text-sm text-white/45">{more}</li>}
        </ol>
        <div className="mt-6 flex flex-wrap gap-2">
          {footer.map((f) => (
            <span key={f} className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/75">
              {f}
            </span>
          ))}
          <span className="rounded-full border border-white/20 px-3 py-1 font-mono text-xs text-white/75">.csv</span>
        </div>
      </div>
    </div>
  );
}

interface AuditExperienceProps {
  /** Playbook chapter previews for the current locale: the landing contents and the result page. */
  chapters?: ChapterPreview[];
  /** Real playbook excerpts for the "peek inside" block on the landing. */
  excerpts?: PlaybookExcerpts | null;
}

export default function AuditExperience({ chapters = [], excerpts = null }: AuditExperienceProps) {
  const t = useTranslations("audit");
  const locale = useLocale();
  const reduceMotion = useReducedMotion();

  const [stage, setStage] = useState<Stage>("intro");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [website, setWebsite] = useState("");
  const [scan, setScan] = useState<ScanSuccess | null>(null);
  const [scanFailed, setScanFailed] = useState(false);
  const [scanMs, setScanMs] = useState(0);
  const [profile, setProfile] = useState<Partial<ClinicProfile>>({});
  const [email, setEmail] = useState("");
  const [lead, setLead] = useState<PartialLead | null>(null);
  /** Last working stage, saved in the draft while the intro (with its resume button) shows. */
  const [resumeStage, setResumeStage] = useState<Stage>("intro");
  const [hydrated, setHydrated] = useState(false);
  const [playbookOpen, setPlaybookOpen] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const focusPending = useRef(false);

  // Restore a draft after mount (server and first client render stay identical).
  useEffect(() => {
    const draft = readDraft();
    if (draft) {
      setAnswers(draft.answers);
      setIndex(draft.index);
      setWebsite(draft.website);
      setScan(draft.scan);
      setScanFailed(draft.scanFailed);
      setScanMs(draft.scanMs);
      setProfile(draft.profile);
      setEmail(draft.email);
      setLead(draft.lead);
      setResumeStage(draft.stage);
      // Never auto-jump into the questions: show the intro with a resume button.
      // /audit#playbook (from AuditCta) always lands on the intro.
      setStage(draft.stage === "result" && !isPlaybookHash() ? "result" : "intro");
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    writeDraft({ answers, index, stage: resumeStage, website, scan, scanFailed, scanMs, profile, email, lead });
  }, [answers, index, resumeStage, website, scan, scanFailed, scanMs, profile, email, lead, hydrated]);

  // The floating chat bubble covers answers on phones: hide it from the website step to the result
  // (see ChatWidget). The attribute goes when the visitor returns to the intro or leaves the page.
  useEffect(() => {
    if (stage === "intro") return;
    const root = document.documentElement;
    root.setAttribute("data-hide-chat", "");
    return () => root.removeAttribute("data-hide-chat");
  }, [stage]);

  /** Moves to a stage and remembers it for resuming (the intro keeps the last working stage). */
  const go = useCallback((next: Stage) => {
    setStage(next);
    if (next !== "intro") setResumeStage(next);
  }, []);

  const focusEmail = useCallback(() => {
    if (!focusPending.current) return;
    focusPending.current = false;
    emailRef.current?.focus();
  }, []);

  /** Opens the inline playbook form and moves focus to its email field. */
  const openPlaybook = useCallback(
    (scroll = false) => {
      focusPending.current = true;
      go("intro");
      setPlaybookOpen(true);
      trackEvent("playbook_form_open", { scrolled: scroll });
      if (scroll) {
        requestAnimationFrame(() =>
          document.getElementById("playbook")?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" }),
        );
      }
      // Already open: the reveal animation will not run again, so focus now.
      if (playbookOpen) requestAnimationFrame(focusEmail);
    },
    [reduceMotion, focusEmail, playbookOpen, go],
  );

  // /audit#playbook opens the form (on load and when the hash changes later).
  const openPlaybookRef = useRef(openPlaybook);
  useEffect(() => {
    openPlaybookRef.current = openPlaybook;
  }, [openPlaybook]);
  useEffect(() => {
    const onHash = () => {
      if (isPlaybookHash()) openPlaybookRef.current(true);
    };
    onHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const answeredCount = QUESTION_IDS.filter((id) => answers[id]).length;
  const hasDraft =
    hydrated && (answeredCount > 0 || scan !== null || Object.keys(profile).length > 0) && stage === "intro";

  /** Fixed for the whole sequence: it only changes with a new scan, which happens before it starts. */
  const steps = buildSteps(scan?.suggestedAnswers ?? null);
  const step = steps[Math.min(index, steps.length - 1)];
  /*
   * Head start for the progress bar: the website step and every check the scan
   * answered count as done, so the first question never shows an empty bar.
   */
  const scannedCount = scan ? Object.keys(scan.suggestedAnswers).length : 0;
  const headStart = 1 + scannedCount;
  const progressTotal = headStart + steps.length;
  const budgetAnchor =
    step.kind === "profile" && step.id === "budgetFit"
      ? t(`profile.budgetFit.anchor.${profile.treatments ?? "several"}`, {
          range: formatPriceRange(patientValueRanges[profile.treatments ?? "several"]),
        })
      : undefined;

  /*
   * Partial lead progress: only with a token (the visitor left an email). The
   * latest payload is sent after a pause, and at once when the page hides, so
   * the owner sees where someone stopped. Never blocks the check.
   */
  const leadRef = useRef(lead);
  useEffect(() => {
    leadRef.current = lead;
  }, [lead]);

  const progressBody = useMemo(() => {
    if (!lead || resumeStage === "intro") return null;
    const sequence = buildSteps(scan?.suggestedAnswers ?? null);
    const at = Math.min(index, sequence.length - 1);
    return JSON.stringify({
      token: lead.token,
      stage: resumeStage,
      total: sequence.length,
      currentStep: resumeStage === "questions" ? { n: at + 1, id: sequence[at].id } : null,
      answered: sequence.filter((s) => isStepAnswered(s, answers, profile)).length,
      answers,
      ...profile,
    });
  }, [lead, resumeStage, index, answers, profile, scan]);

  const pendingProgress = useRef<string | null>(null);
  const sentProgress = useRef<string | null>(null);

  const sendProgress = useCallback((onHide: boolean) => {
    const body = pendingProgress.current;
    if (!body || body === sentProgress.current) return;
    sentProgress.current = body;
    if (onHide && typeof navigator.sendBeacon === "function") {
      navigator.sendBeacon(PROGRESS_URL, new Blob([body], { type: "application/json" }));
      return;
    }
    fetch(PROGRESS_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true })
      .then((res) => {
        // Forged, expired or already completed: stop tracking this lead.
        if (res.status === 401 || res.status === 404) setLead(null);
        else if (!res.ok && sentProgress.current === body) sentProgress.current = null;
      })
      .catch(() => {
        if (sentProgress.current === body) sentProgress.current = null;
      });
  }, []);

  useEffect(() => {
    pendingProgress.current = progressBody;
    if (!progressBody || progressBody === sentProgress.current) return;
    const id = window.setTimeout(() => sendProgress(false), PROGRESS_DEBOUNCE_MS);
    return () => window.clearTimeout(id);
  }, [progressBody, sendProgress]);

  useEffect(() => {
    const flush = () => sendProgress(true);
    const onVisibility = () => {
      if (document.visibilityState === "hidden") flush();
    };
    window.addEventListener("pagehide", flush);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("pagehide", flush);
      document.removeEventListener("visibilitychange", onVisibility);
      // Leaving /audit by an in-app link: no pagehide, so flush here.
      flush();
    };
  }, [sendProgress]);

  /**
   * Saves a partial lead for the email given on the scan review (no email: none).
   * The same email and website keep their lead; a change starts a new one.
   */
  const ensureLead = async (mail: string, site: string, checks: ScanChecks | null) => {
    const normalized = mail.trim().toLowerCase();
    if (!normalized || !isEmailLike(normalized)) {
      setLead(null);
      return;
    }
    const current = leadRef.current;
    if (current && current.email === normalized && current.website === site) return;
    setLead(null);
    try {
      const res = await fetch("/api/audit/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalized, website: site, locale, scan: checks ?? undefined }),
      });
      const data = (await res.json().catch(() => null)) as { token?: unknown } | null;
      if (res.ok && typeof data?.token === "string" && data.token) {
        setLead({ token: data.token, email: normalized, website: site });
      }
    } catch {
      // No partial lead: the check works the same, the result form still saves the lead.
    }
  };

  const scrollToTop = useCallback(() => {
    topRef.current?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }, [reduceMotion]);

  const goTo = (next: Stage) => {
    go(next);
    requestAnimationFrame(scrollToTop);
  };

  const startQuestions = (at = 0) => {
    setIndex(at);
    goTo("questions");
  };

  const start = (resume: boolean) => {
    if (!resume) {
      setAnswers({});
      setIndex(0);
      setScan(null);
      setScanFailed(false);
      setProfile({});
      goTo("website");
    } else if (resumeStage === "result" && isComplete(answers) && isProfileComplete(profile)) {
      goTo("result");
    } else if (resumeStage === "review" && scan) {
      goTo("review");
    } else if (resumeStage === "questions") {
      // Resume at the first unanswered question.
      const firstOpen = steps.findIndex((s) => !isStepAnswered(s, answers, profile));
      startQuestions(firstOpen === -1 ? steps.length - 1 : firstOpen);
    } else {
      goTo("website");
    }
    trackEvent("audit_start", { resumed: resume });
  };

  const onScanOutcome = ({ website: site, result, elapsedMs }: ScanOutcome) => {
    setWebsite(site);
    setScanMs(elapsedMs);
    if (result.ok) {
      setScan(result);
      setScanFailed(false);
      // A new scan replaces every site answer: its own, and the rest are asked again.
      setAnswers({ ...result.suggestedAnswers });
      setIndex(0);
      goTo("review");
    } else {
      setScan(null);
      setScanFailed(true);
    }
  };

  const skipScan = ({ website: site }: { website: string }) => {
    if (site) setWebsite(site);
    setScan(null);
    trackEvent("audit_scan_skip");
    startQuestions();
  };

  const correct = (id: QuestionId, value: Answer) => {
    setAnswers({ ...answers, [id]: value });
  };

  /** The email is asked here, after the scan has shown them something, not on the website step. */
  const finishReview = (mail: string) => {
    setEmail(mail);
    if (scan) void ensureLead(mail, website, scan.checks);
    const changed = scan
      ? QUESTION_IDS.filter((id) => scan.suggestedAnswers[id] !== undefined && answers[id] !== scan.suggestedAnswers[id])
      : [];
    trackEvent("audit_review_complete", { changed: changed.length, email: mail !== "" });
    startQuestions();
  };

  const rescan = () => {
    setScan(null);
    setScanFailed(false);
    setAnswers({});
    goTo("website");
  };

  /**
   * Moves to the next unanswered question (skipping ones a resumed draft or a
   * Back-and-change already answered), or to the result once all are answered.
   */
  const advance = (nextAnswers: Answers, nextProfile: Partial<ClinicProfile>) => {
    const nextOpen = steps.findIndex((s, i) => i > index && !isStepAnswered(s, nextAnswers, nextProfile));
    if (nextOpen !== -1) {
      setIndex(nextOpen);
      return;
    }
    if (isComplete(nextAnswers) && isProfileComplete(nextProfile)) {
      const result = computeResult(nextAnswers);
      trackEvent("audit_complete", {
        score: result.score,
        band: result.band,
        scanned: scan !== null,
        asked: steps.length,
        treatments: nextProfile.treatments,
        volume: nextProfile.volume,
        role: nextProfile.role,
        timeline: nextProfile.timeline,
        budgetFit: nextProfile.budgetFit,
      });
      goTo("result");
    } else {
      // Should not happen, but jump to the first gap just in case.
      setIndex(Math.max(steps.findIndex((s) => !isStepAnswered(s, nextAnswers, nextProfile)), 0));
    }
  };

  const choose = (value: string) => {
    if (step.kind === "site") {
      if (!isAnswer(value)) return;
      const next = { ...answers, [step.id]: value };
      setAnswers(next);
      advance(next, profile);
    } else if (step.id === "markets") {
      if (!isMarketId(value)) return;
      const current = profile.markets ?? [];
      setProfile({ ...profile, markets: current.includes(value) ? current.filter((m) => m !== value) : [...current, value] });
    } else if (step.id === "channel") {
      if (!isChannelId(value)) return;
      const current = profile.channel ?? [];
      setProfile({ ...profile, channel: current.includes(value) ? current.filter((c) => c !== value) : [...current, value] });
    } else {
      if (!PROFILE_OPTIONS[step.id].includes(value)) return;
      const next = { ...profile, [step.id]: value };
      setProfile(next);
      advance(answers, next);
    }
  };

  const back = () => {
    if (index > 0) {
      setIndex(index - 1);
      return;
    }
    goTo(scan ? "review" : "website");
  };

  const retake = () => {
    setAnswers({});
    setIndex(0);
    setScan(null);
    setScanFailed(false);
    goTo("website");
    trackEvent("audit_retake");
  };

  const isSelected = (value: string) =>
    step.kind === "site"
      ? answers[step.id] === value
      : isMultiStep(step.id)
        ? ((profile[step.id] ?? []) as readonly string[]).includes(value)
        : profile[step.id] === value;

  const benefits = t.raw("benefits") as string[];
  const templateNames = t.raw("playbook.templateNames") as string[];
  const insideItems = [
    t("inside.chapters", { n: PLAYBOOK_META.chapters }),
    t("inside.templates", { n: PLAYBOOK_META.templates }),
    t("inside.tracker"),
  ];
  /** One rhythm for every landing section after the hero. */
  const sectionClass = "mt-16 border-t border-border pt-10 md:mt-20 md:pt-14";
  const choiceClass =
    "flex min-h-[112px] flex-col items-start justify-start rounded-[10px] p-4 text-start transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background md:min-h-[128px] md:p-5";

  return (
    <div ref={topRef} className="scroll-mt-24">
      <AnimatePresence mode="wait" initial={false}>
        {stage === "intro" && (
          <motion.section
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            transition={{ duration: 0.4, ease }}
            className="container mx-auto px-5 pb-20 md:px-8 md:pb-28"
          >
            {/* Hero: the playbook first, then the two ways to get it. */}
            <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="min-w-0 lg:col-span-7">
                <motion.p
                  initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease }}
                  className="mb-4 font-mono text-label text-muted-foreground md:mb-5"
                >
                  {t("eyebrow")}
                </motion.p>
                <motion.h1
                  initial={{ opacity: 0, y: reduceMotion ? 0 : 20, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.6, ease, delay: 0.05 }}
                  className="max-w-3xl font-display text-[34px] leading-[1.05] tracking-[-0.03em] text-balance sm:text-hero"
                >
                  {t("heading")}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease, delay: 0.15 }}
                  className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground md:mt-6 md:text-xl"
                >
                  {t("intro")}
                </motion.p>

                <motion.ul
                  initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease, delay: 0.2 }}
                  className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm md:text-base"
                >
                  {insideItems.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <Check className="h-4 w-4 shrink-0" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </motion.ul>

                <motion.div
                  id="playbook"
                  initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease, delay: 0.25 }}
                  className="mt-7 max-w-2xl scroll-mt-28 md:mt-9"
                >
                  <div className="grid grid-cols-2 gap-3 md:gap-4">
                    <button
                      type="button"
                      onClick={() => openPlaybook()}
                      aria-expanded={playbookOpen}
                      aria-controls="playbook-form"
                      className={cn(choiceClass, "bg-foreground text-background hover:bg-foreground/85")}
                    >
                      <span className="flex w-full items-start justify-between gap-2 text-base font-medium leading-snug md:text-lg">
                        {t("choice.playbook")}
                        <ArrowDown
                          className={cn("mt-1 h-4 w-4 shrink-0 transition-transform", playbookOpen && "rotate-180")}
                          aria-hidden="true"
                        />
                      </span>
                      <span className="mt-1.5 text-sm leading-snug text-background/70">{t("choice.playbookText")}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => start(hasDraft)}
                      className={cn(choiceClass, "border border-foreground/25 bg-background hover:border-foreground")}
                    >
                      <span className="flex w-full items-start justify-between gap-2 text-base font-medium leading-snug md:text-lg">
                        {hasDraft ? t("choice.resume") : t("choice.check")}
                        <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 rtl:-scale-x-100" aria-hidden="true" />
                      </span>
                      <span className="mt-1.5 text-sm leading-snug text-muted-foreground">
                        {hasDraft ? t("choice.resumeText") : t("choice.checkText")}
                      </span>
                    </button>
                  </div>

                  {hasDraft && (
                    <button
                      type="button"
                      onClick={() => start(false)}
                      className="mt-2 inline-flex min-h-11 items-center text-sm font-medium underline-offset-4 hover:underline"
                    >
                      {t("startOver")}
                    </button>
                  )}

                  <AnimatePresence initial={false}>
                    {playbookOpen && (
                      <motion.div
                        id="playbook-form"
                        key="playbook-form"
                        initial={{ opacity: 0, height: reduceMotion ? "auto" : 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: reduceMotion ? "auto" : 0 }}
                        transition={{ duration: 0.3, ease }}
                        onAnimationComplete={focusEmail}
                        className="overflow-hidden"
                      >
                        <PlaybookForm ref={emailRef} location="audit_hero" className="mt-4" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, ease, delay: 0.2 }}
                className="min-w-0 lg:col-span-5"
              >
                <PlaybookMock
                  title={t("heading")}
                  label={t("inside.label")}
                  chapters={chapters.slice(0, 5).map((c) => c.title)}
                  more={chapters.length > 5 ? t("inside.more", { n: chapters.length - 5 }) : null}
                  footer={[
                    t("inside.chapters", { n: PLAYBOOK_META.chapters }),
                    t("inside.templates", { n: PLAYBOOK_META.templates }),
                  ]}
                />
              </motion.div>
            </div>

            {/* Peek inside: real pages from the playbook. */}
            {excerpts && (
              <div className={sectionClass}>
                <PeekInside excerpts={excerpts} />
              </div>
            )}

            {/* Inside the playbook: what each chapter changes, and the templates. */}
            <div className={sectionClass}>
              <p className="mb-4 font-mono text-label text-muted-foreground">{t("inside.chaptersEyebrow")}</p>
              <h2 className="max-w-3xl font-display text-heading text-balance">{t("inside.outcomesHeading")}</h2>
              <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-16">
                {chapters.length > 0 && (
                  <ol className="divide-y divide-border border-y border-border lg:col-span-7">
                    {chapters.map((c, i) => (
                      <li key={c.id} className="flex items-baseline gap-4 py-4">
                        <span className="w-6 shrink-0 font-mono text-sm text-muted-foreground">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="min-w-0">
                          <span className="block text-base font-medium leading-snug md:text-lg">{c.title}</span>
                          <span className="mt-1 block text-sm leading-relaxed text-muted-foreground md:text-base">
                            {t(`inside.outcomes.${c.id}`)}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ol>
                )}
                <div className={chapters.length > 0 ? "lg:col-span-5" : "lg:col-span-12"}>
                  <div className="rounded-[10px] border border-border bg-card p-5 md:p-8 lg:sticky lg:top-28">
                    <p className="mb-5 font-mono text-label text-muted-foreground">{t("playbook.templatesEyebrow")}</p>
                    <ul className="grid gap-y-3">
                      {templateNames.map((name, i) => (
                        <li key={i} className="flex items-start gap-3 text-base leading-relaxed">
                          <FileText className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                          <span>{name}</span>
                        </li>
                      ))}
                    </ul>
                    <GlassPill tone="dark" arrow onClick={() => openPlaybook(true)} className="mt-8 h-12 px-6 text-base">
                      {t("choice.playbook")}
                    </GlassPill>
                  </div>
                </div>
              </div>
            </div>

            {/* The check: the second way in, with an example of what it returns. */}
            <div className={sectionClass}>
              <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-16">
                <div className="min-w-0 lg:col-span-6">
                  <p className="mb-4 font-mono text-label text-muted-foreground">{t("checkSection.eyebrow")}</p>
                  <h2 className="max-w-2xl font-display text-heading text-balance">{t("checkSection.heading")}</h2>
                  <p className="mt-4 max-w-xl text-base text-muted-foreground md:text-lg">{t("checkSection.text")}</p>
                  <ul className="mt-8 grid gap-5">
                    {benefits.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
                          <Check className="h-3.5 w-3.5" aria-hidden="true" />
                        </span>
                        <span className="text-base leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3">
                    <GlassPill tone="dark" arrow onClick={() => start(hasDraft)} className="h-12 px-6 text-base">
                      {hasDraft ? t("resume") : t("start")}
                    </GlassPill>
                    {hasDraft && (
                      <button
                        type="button"
                        onClick={() => start(false)}
                        className="inline-flex min-h-11 items-center text-sm font-medium underline-offset-4 hover:underline"
                      >
                        {t("startOver")}
                      </button>
                    )}
                  </div>
                  <p className="mt-5 max-w-md text-sm text-muted-foreground">{t("trust")}</p>
                </div>
                <div className="min-w-0 lg:col-span-6">
                  <SampleResult chapters={chapters} />
                </div>
              </div>
            </div>

            {/* Who made this. */}
            <div className={sectionClass}>
              <MakerBlock />
            </div>

            {/* Questions, then the closing ask. */}
            <div className={sectionClass}>
              <AuditFaq />
            </div>
            <div className="mt-16 md:mt-20">
              <ClosingCta onOpen={() => openPlaybook(true)} onCheck={() => start(hasDraft)} />
            </div>
          </motion.section>
        )}

        {stage === "website" && (
          <motion.section
            key="website"
            initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            transition={{ duration: 0.4, ease }}
            className="container mx-auto px-5 pb-24 md:px-8 md:pb-32"
          >
            <AuditScanStep
              website={website}
              scan={scan}
              scanFailed={scanFailed}
              elapsedMs={scanMs}
              onOutcome={onScanOutcome}
              onContinue={() => goTo("review")}
              onSkip={skipScan}
              onBack={() => go("intro")}
            />
          </motion.section>
        )}

        {stage === "review" && scan && (
          <motion.section
            key="review"
            initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            transition={{ duration: 0.4, ease }}
            className="container mx-auto px-5 pb-24 md:px-8 md:pb-32"
          >
            <AuditReview
              scan={scan}
              answers={answers}
              host={hostOf(scan.finalUrl)}
              seconds={Math.max(1, Math.round(scanMs / 1000))}
              email={email}
              onChange={correct}
              onContinue={finishReview}
              onRescan={rescan}
              onBack={() => goTo("website")}
            />
          </motion.section>
        )}

        {stage === "questions" && (
          <motion.section
            key="questions"
            initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            transition={{ duration: 0.4, ease }}
            className="container mx-auto px-5 pb-24 md:px-8 md:pb-32"
          >
            <AuditQuestion
              stepKey={`${step.kind}-${step.id}`}
              current={headStart + index + 1}
              total={progressTotal}
              progressNote={scannedCount > 0 ? t("progressScanned", { n: scannedCount }) : undefined}
              lead={budgetAnchor}
              question={
                step.kind === "site" ? t(`questions.${step.id}.q`) : t(`profile.${step.id}.q`, { price: ENTRY_PRICE })
              }
              note={
                step.kind === "site" ? (
                  <div className="border-s-2 border-foreground/20 ps-4">
                    <p className="mb-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                      {t("whyLabel")}
                    </p>
                    <p className="text-base leading-relaxed text-muted-foreground">{t(`questions.${step.id}.why`)}</p>
                  </div>
                ) : (
                  <p className="text-base leading-relaxed text-muted-foreground">
                    {isMultiStep(step.id)
                      ? t("multiHint")
                      : (CLOSING_STEPS as readonly string[]).includes(step.id)
                        ? t("profile.almostDone")
                        : t("profile.why")}
                  </p>
                )
              }
              options={
                step.kind === "site"
                  ? ANSWER_VALUES.map((value) => ({ value, label: t(value) }))
                  : PROFILE_OPTIONS[step.id].map((value) => ({ value, label: t(`profile.${step.id}.options.${value}`) }))
              }
              isSelected={isSelected}
              onChoose={choose}
              multi={step.kind === "profile" && isMultiStep(step.id)}
              onContinue={() => advance(answers, profile)}
              onBack={back}
            />
          </motion.section>
        )}

        {stage === "result" && (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            transition={{ duration: 0.4, ease }}
          >
            <AuditResult
              answers={answers as Record<QuestionId, Answer>}
              website={website}
              scan={scan?.checks ?? null}
              profile={profile}
              chapters={chapters}
              email={email}
              partialToken={lead?.token ?? null}
              onSubmitted={() => setLead(null)}
              onRetake={retake}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Announces progress to screen readers as the question changes. */}
      <span className="sr-only" aria-live="polite">
        {stage === "questions" ? t("progress", { current: headStart + index + 1, total: progressTotal }) : ""}
      </span>
    </div>
  );
}
