/**
 * Automated website scan for the /audit lead magnet.
 *
 * Pure functions only (no fetch, no Next.js): the route handler in
 * src/app/api/audit/scan/route.ts downloads the HTML and calls `analyzeHtml`;
 * the client renders the review rows with `questionEvidence`.
 * The API returns codes and numbers, never visible copy: the UI formats
 * everything through the `audit.scan.*` messages.
 *
 * Everything here is a best-effort read of the HOME PAGE HTML as a phone
 * would receive it. It is evidence for the quiz, not a verdict, which is why
 * every suggested answer can be overridden by the clinic.
 */

import { z } from "zod";
import type { Answer, Answers, QuestionId } from "./audit";

export const SCAN_VERSION = 1;
export const SCAN_USER_AGENT = "AwabClinicCheck/1.0 (+https://www.awab.design/audit)";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export interface PagespeedSummary {
  /** Lighthouse performance score 0-100 (mobile). */
  score: number;
  lcpMs: number | null;
  cls: number | null;
  tbtMs: number | null;
}

export interface ScanChecks {
  https: boolean;
  /** Hops before the final URL, including the final one. Max 4 entries. */
  redirectChain: string[];
  /** Base language from <html lang>, lowercase 2-3 letters, or null. */
  lang: string | null;
  hreflangCount: number;
  hreflangLangs: string[];
  /** Language codes guessed from /ar, /fr, ar.example.com links. */
  switcherLangs: string[];
  /** Distinct language codes from all sources (lang attr, hreflang, switcher). */
  languages: string[];
  arabic: {
    found: boolean;
    url: string | null;
    /** true/false when the Arabic page was fetched, null when not fetched. */
    rtl: boolean | null;
  };
  whatsapp: number;
  /** A chat/WhatsApp widget script or class is present without a direct link. */
  whatsappWidgetHint: boolean;
  tel: number;
  mailto: number;
  bookingCta: number;
  priceSignals: number;
  treatmentLinks: number;
  trust: {
    jci: boolean;
    iso: boolean;
    accredit: number;
    certificate: number;
    doctors: number;
    beforeAfter: number;
  };
  schemaTypes: string[];
  tracking: string[];
  meta: {
    titleLength: number;
    description: boolean;
    viewport: boolean;
    ogImage: boolean;
  };
  weight: {
    htmlBytes: number;
    images: number;
    scripts: number;
    imagesWithoutSize: number;
    heavyImages: number;
    lazyImages: number;
    videos: number;
  };
  speed: {
    /** Measured by the scan server (Istanbul region), not a Lighthouse score. */
    ttfbMs: number;
    totalMs: number;
    pagespeed: PagespeedSummary | null;
  };
}

export type ScanErrorCode =
  | "invalid_url"
  | "blocked_host"
  | "dns_failed"
  | "timeout"
  | "unreachable"
  | "http_error"
  | "not_html"
  | "too_many_redirects";

export type EvidenceCode = string;

export interface ScanSuccess {
  ok: true;
  version: number;
  finalUrl: string;
  checks: ScanChecks;
  suggestedAnswers: Partial<Record<QuestionId, Answer>>;
  evidence: Partial<Record<QuestionId, EvidenceCode>>;
}

export interface ScanFailure {
  ok: false;
  error: ScanErrorCode;
  status?: number;
}

export type ScanResult = ScanSuccess | ScanFailure;

/* ------------------------------------------------------------------ */
/* Zod schema (used by /api/audit to accept a size-capped `scan` field) */
/* ------------------------------------------------------------------ */

const shortStrings = z.array(z.string().max(80)).max(30);

export const scanChecksSchema = z.object({
  https: z.boolean(),
  redirectChain: z.array(z.string().max(400)).max(4),
  lang: z.string().max(10).nullable(),
  hreflangCount: z.number().int().min(0).max(500),
  hreflangLangs: shortStrings,
  switcherLangs: shortStrings,
  languages: shortStrings,
  arabic: z.object({
    found: z.boolean(),
    url: z.string().max(400).nullable(),
    rtl: z.boolean().nullable(),
  }),
  whatsapp: z.number().int().min(0).max(1000),
  whatsappWidgetHint: z.boolean(),
  tel: z.number().int().min(0).max(1000),
  mailto: z.number().int().min(0).max(1000),
  bookingCta: z.number().int().min(0).max(1000),
  priceSignals: z.number().int().min(0).max(10000),
  treatmentLinks: z.number().int().min(0).max(10000),
  trust: z.object({
    jci: z.boolean(),
    iso: z.boolean(),
    accredit: z.number().int().min(0).max(10000),
    certificate: z.number().int().min(0).max(10000),
    doctors: z.number().int().min(0).max(10000),
    beforeAfter: z.number().int().min(0).max(10000),
  }),
  schemaTypes: shortStrings,
  tracking: shortStrings,
  meta: z.object({
    titleLength: z.number().int().min(0).max(10000),
    description: z.boolean(),
    viewport: z.boolean(),
    ogImage: z.boolean(),
  }),
  weight: z.object({
    htmlBytes: z.number().int().min(0),
    images: z.number().int().min(0),
    scripts: z.number().int().min(0),
    imagesWithoutSize: z.number().int().min(0),
    heavyImages: z.number().int().min(0),
    lazyImages: z.number().int().min(0),
    videos: z.number().int().min(0),
  }),
  speed: z.object({
    ttfbMs: z.number().int().min(0),
    totalMs: z.number().int().min(0),
    pagespeed: z
      .object({
        score: z.number().min(0).max(100),
        lcpMs: z.number().nullable(),
        cls: z.number().nullable(),
        tbtMs: z.number().nullable(),
      })
      .nullable(),
  }),
});

/* ------------------------------------------------------------------ */
/* HTML helpers (regex, deliberately tolerant)                          */
/* ------------------------------------------------------------------ */

const LANG_CODES = new Set([
  "ar", "en", "fr", "tr", "de", "ru", "es", "it", "nl", "pt", "fa", "ur", "he", "zh",
  "ja", "ko", "pl", "ro", "bg", "el", "sq", "az", "kk", "uz", "sv", "no", "da", "fi",
  "cs", "hu", "uk", "ku", "hi", "id", "ms",
]);

function attr(tag: string, name: string): string | null {
  const re = new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s"'>]+))`, "i");
  const m = tag.match(re);
  if (!m) return null;
  return (m[1] ?? m[2] ?? m[3] ?? "").trim();
}

function hasAttr(tag: string, name: string): boolean {
  return new RegExp(`\\b${name}(\\s*=|\\s|>|$)`, "i").test(tag);
}

function decodeEntities(s: string): string {
  return s
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function stripTags(s: string): string {
  return decodeEntities(s.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
}

/** Visible text: no scripts, styles, comments or tags. */
function visibleText(html: string): string {
  return stripTags(
    html
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
      .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
      .replace(/<noscript\b[\s\S]*?<\/noscript>/gi, " "),
  );
}

function baseLang(code: string): string | null {
  const m = code.trim().toLowerCase().match(/^([a-z]{2,3})(?:[-_][a-z0-9]{2,8})*$/);
  return m ? m[1] : null;
}

interface Anchor {
  href: string;
  text: string;
  tag: string;
}

function anchors(html: string): Anchor[] {
  const out: Anchor[] = [];
  const re = /<a\b([^>]*)>([\s\S]*?)<\/a>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) && out.length < 3000) {
    const tag = m[1];
    const href = attr(tag, "href") ?? "";
    out.push({ href, text: stripTags(m[2]).slice(0, 200), tag });
  }
  return out;
}

function buttons(html: string): string[] {
  const out: string[] = [];
  const re = /<button\b[^>]*>([\s\S]*?)<\/button>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) && out.length < 1000) out.push(stripTags(m[1]).slice(0, 200));
  return out;
}

function tags(html: string, name: string): string[] {
  const re = new RegExp(`<${name}\\b[^>]*>`, "gi");
  return html.match(re) ?? [];
}

function countMatches(s: string, re: RegExp): number {
  return (s.match(re) ?? []).length;
}

const WHATSAPP_HREF = /(?:^|\/\/)(?:wa\.me|api\.whatsapp\.com|web\.whatsapp\.com|chat\.whatsapp\.com)|^whatsapp:/i;
/** Short visible label that is clearly a WhatsApp button (not a paragraph mentioning WhatsApp). */
const WHATSAPP_LABEL = /^(?=.{0,40}$).*(whatsapp|whats app|واتساب|واتس اب).*$/i;
const BOOKING_TEXT =
  /consult|book|appointment|free quote|get a quote|quote|randevu|rendez|devis|konsült|teklif|موعد|استشارة|احجز|حجز|عرض سعر/i;
const TREATMENT_HREF =
  /\/(treatments?|services?|procedures?|dental|dentist|implants?|veneers?|crowns?|smile|hair|hair-transplant|fue|dhi|aesthetic|aesthetics|plastic|cosmetic|rhinoplasty|liposuction|bbl|facelift|breast|surgery|botox|filler|tedavi|hizmet|sac-ekimi|estetik|soins|traitements?|greffe|chirurgie|behandlung|leistungen|lechenie|uslugi)(?:[/?#-]|$)/i;
const TREATMENT_WORD =
  /\b(treatment|implant|veneer|crown|hair transplant|hair|rhinoplasty|liposuction|facelift|breast|botox|filler|smile|surgery|tedavi|saç ekimi|implant|greffe|traitement|chirurgie|علاج|زراعة|تجميل)\b/gi;
const CURRENCY = /(€|\$|£|₺|\bUSD\b|\bEUR\b|\bGBP\b|\bTRY\b|\bTL\b|\bfrom\s+\d|\bab\s+\d|à partir de|\bbaşlayan|starting at|ابتداء من|يبدأ من)/i;

function extractJsonLdTypes(html: string): string[] {
  const types = new Set<string>();
  const re = /<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m: RegExpExecArray | null;
  const walk = (node: unknown, depth: number) => {
    if (depth > 6 || types.size > 20) return;
    if (Array.isArray(node)) {
      node.forEach((n) => walk(n, depth + 1));
      return;
    }
    if (node && typeof node === "object") {
      const o = node as Record<string, unknown>;
      const t = o["@type"];
      if (typeof t === "string") types.add(t.slice(0, 60));
      else if (Array.isArray(t)) t.forEach((x) => typeof x === "string" && types.add(x.slice(0, 60)));
      for (const k of ["@graph", "mainEntity", "itemListElement", "about", "provider", "publisher"]) {
        if (k in o) walk(o[k], depth + 1);
      }
    }
  };
  while ((m = re.exec(html))) {
    try {
      walk(JSON.parse(m[1].trim()), 0);
    } catch {
      // Malformed JSON-LD: ignore, it is a signal in itself but not one we score.
    }
  }
  return [...types];
}

function detectTracking(html: string): string[] {
  const found: string[] = [];
  const pairs: [string, RegExp][] = [
    ["gtm", /googletagmanager\.com\/gtm\.js|GTM-[A-Z0-9]{4,}/],
    ["ga4", /googletagmanager\.com\/gtag\/js|\bgtag\(|G-[A-Z0-9]{6,}/],
    ["meta_pixel", /connect\.facebook\.net|\bfbq\(/],
    ["google_ads", /AW-\d{6,}|googleads\.g\.doubleclick/],
    ["hotjar", /static\.hotjar\.com|\bhj\(/],
    ["clarity", /clarity\.ms/],
    ["tiktok", /analytics\.tiktok\.com/],
  ];
  for (const [id, re] of pairs) if (re.test(html)) found.push(id);
  return found;
}

/* ------------------------------------------------------------------ */
/* Analysis                                                            */
/* ------------------------------------------------------------------ */

export interface AnalyzeInput {
  html: string;
  finalUrl: string;
  redirectChain: string[];
  htmlBytes: number;
  ttfbMs: number;
  totalMs: number;
}

/** Everything that can be known from the home page HTML alone (no Arabic fetch, no PSI). */
export function analyzeHtml(input: AnalyzeInput): ScanChecks {
  const { html, finalUrl } = input;
  let origin = "";
  let hostname = "";
  try {
    const u = new URL(finalUrl);
    origin = u.origin;
    hostname = u.hostname.toLowerCase();
  } catch {
    // finalUrl always comes from the fetcher; keep going with empty origin.
  }

  const htmlTag = html.match(/<html\b[^>]*>/i)?.[0] ?? "";
  const lang = baseLang(attr(htmlTag, "lang") ?? "");

  // hreflang alternates
  const hreflangLangs = new Set<string>();
  let hreflangCount = 0;
  let arabicUrl: string | null = null;
  for (const link of tags(html, "link")) {
    const hl = attr(link, "hreflang");
    if (!hl) continue;
    hreflangCount++;
    const code = baseLang(hl);
    if (code) hreflangLangs.add(code);
    if (code === "ar" && !arabicUrl) {
      const href = attr(link, "href");
      if (href) arabicUrl = resolveHref(href, finalUrl);
    }
  }

  const links = anchors(html);
  const btnTexts = buttons(html);

  // Language switcher hints: /ar, /fr/..., ar.example.com, ?lang=ar
  const switcherLangs = new Set<string>();
  for (const a of links) {
    const code = langFromHref(a.href, hostname);
    if (code && code !== lang) switcherLangs.add(code);
    if (code === "ar" && !arabicUrl) arabicUrl = resolveHref(a.href, finalUrl);
  }

  const languages = new Set<string>();
  if (lang) languages.add(lang);
  hreflangLangs.forEach((c) => languages.add(c));
  switcherLangs.forEach((c) => languages.add(c));

  // Contact paths
  let whatsapp = 0;
  let tel = 0;
  let mailto = 0;
  let bookingCta = 0;
  const treatmentHrefs = new Set<string>();
  for (const a of links) {
    const href = a.href.trim();
    // A link to wa.me, or a link/button labelled "WhatsApp" that opens a modal, both count: the patient sees a WhatsApp button.
    if (WHATSAPP_HREF.test(href) || WHATSAPP_LABEL.test(a.text) || WHATSAPP_LABEL.test(attr(a.tag, "aria-label") ?? "")) whatsapp++;
    else if (/^tel:/i.test(href)) tel++;
    else if (/^mailto:/i.test(href)) mailto++;
    if (BOOKING_TEXT.test(a.text) || BOOKING_TEXT.test(attr(a.tag, "aria-label") ?? "")) bookingCta++;
    const path = pathOf(href, origin);
    if (path && TREATMENT_HREF.test(path)) treatmentHrefs.add(path.toLowerCase());
  }
  for (const b of btnTexts) {
    if (WHATSAPP_LABEL.test(b)) whatsapp++;
    if (BOOKING_TEXT.test(b)) bookingCta++;
  }
  const whatsappWidgetHint =
    whatsapp === 0 &&
    /whatsapp|wati\.io|elfsight.*whatsapp|joinchat|wa-widget|whatsapp-widget|tawk\.to|tidio|crisp\.chat/i.test(html);

  // Treatment and price signals in visible text
  const text = visibleText(html);
  let priceSignals = 0;
  TREATMENT_WORD.lastIndex = 0;
  let tm: RegExpExecArray | null;
  let guard = 0;
  while ((tm = TREATMENT_WORD.exec(text)) && guard++ < 400) {
    const start = Math.max(0, tm.index - 90);
    const end = Math.min(text.length, tm.index + tm[0].length + 90);
    if (CURRENCY.test(text.slice(start, end))) priceSignals++;
  }

  // Trust
  const trust = {
    jci: /\bJCI\b|Joint Commission/i.test(text),
    iso: /\bISO\s?-?\d{4,5}\b|\bISO\s+cert/i.test(text),
    accredit: countMatches(text, /accredit|akredit|accrédit|اعتماد/gi),
    certificate: countMatches(text, /certif|sertifika|شهاد/gi),
    doctors: countMatches(text, /\b(?:Dr|Doç|Prof|Op|Uzm|Dt)\.\s*(?:Dr\.\s*)?[A-ZÀ-ÜÇĞİÖŞÜ][\p{L}'-]+/gu) + countMatches(text, /(?:^|\s)(?:د\.|الدكتور|الدكتورة)\s+\p{L}+/gu),
    beforeAfter: countMatches(
      text,
      /before\s*(?:and|&|\/|-|–)?\s*after|önce\s*(?:ve|\/|-)?\s*sonra|avant\s*(?:et|\/|-)?\s*apr[eè]s|قبل\s*(?:و|\/)?\s*بعد|vorher\s*(?:\/|-|und)?\s*nachher|до\s*(?:и|\/)?\s*после/gi,
    ) + countMatches(html, /before[-_]?after|beforeafter/gi),
  };

  // Meta
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "";
  const metas = tags(html, "meta");
  const metaContent = (name: string, key: "name" | "property") =>
    metas.find((m) => (attr(m, key) ?? "").toLowerCase() === name);
  const descTag = metaContent("description", "name");
  const meta = {
    titleLength: stripTags(title).length,
    description: Boolean(descTag && (attr(descTag, "content") ?? "").trim().length > 0),
    viewport: Boolean(metaContent("viewport", "name")),
    ogImage: Boolean(metaContent("og:image", "property") || metaContent("og:image", "name")),
  };

  // Weight
  const imgs = tags(html, "img");
  let imagesWithoutSize = 0;
  let heavyImages = 0;
  let lazyImages = 0;
  imgs.forEach((img, i) => {
    if (!(hasAttr(img, "width") && hasAttr(img, "height"))) imagesWithoutSize++;
    if ((attr(img, "loading") ?? "").toLowerCase() === "lazy") lazyImages++;
    const src = (attr(img, "src") ?? attr(img, "data-src") ?? "").toLowerCase();
    const heroish = i < 5 || /hero|banner|slide|cover|header|main/i.test(img);
    if (/\.gif(\?|$)/.test(src) || (/\.png(\?|$)/.test(src) && heroish)) heavyImages++;
  });
  const weight = {
    htmlBytes: input.htmlBytes,
    images: imgs.length,
    scripts: countMatches(html, /<script\b/gi),
    imagesWithoutSize,
    heavyImages,
    lazyImages,
    videos: countMatches(html, /<video\b/gi) + countMatches(html, /<iframe\b[^>]*(youtube|vimeo)/gi),
  };

  return {
    https: finalUrl.startsWith("https://"),
    redirectChain: input.redirectChain.slice(0, 4),
    lang,
    hreflangCount,
    hreflangLangs: [...hreflangLangs],
    switcherLangs: [...switcherLangs],
    languages: [...languages],
    arabic: { found: Boolean(arabicUrl) || languages.has("ar"), url: arabicUrl, rtl: null },
    whatsapp,
    whatsappWidgetHint,
    tel,
    mailto,
    bookingCta,
    priceSignals,
    treatmentLinks: treatmentHrefs.size,
    trust,
    schemaTypes: extractJsonLdTypes(html),
    tracking: detectTracking(html),
    meta,
    weight,
    speed: { ttfbMs: Math.round(input.ttfbMs), totalMs: Math.round(input.totalMs), pagespeed: null },
  };
}

/** True when the Arabic page HTML declares a right-to-left layout. */
export function detectRtl(html: string): boolean {
  const htmlTag = html.match(/<html\b[^>]*>/i)?.[0] ?? "";
  const bodyTag = html.match(/<body\b[^>]*>/i)?.[0] ?? "";
  const dir = (attr(htmlTag, "dir") ?? attr(bodyTag, "dir") ?? "").toLowerCase();
  if (dir === "rtl") return true;
  if (dir) return false;
  // Some sites set direction only in CSS on the root element.
  return /<(?:html|body)\b[^>]*style\s*=\s*["'][^"']*direction\s*:\s*rtl/i.test(html);
}

function resolveHref(href: string, base: string): string | null {
  try {
    const u = new URL(href, base);
    if (!/^https?:$/.test(u.protocol)) return null;
    u.hash = "";
    return u.toString();
  } catch {
    return null;
  }
}

function pathOf(href: string, origin: string): string | null {
  if (!href || /^(tel|mailto|javascript|whatsapp|sms):/i.test(href)) return null;
  try {
    const u = new URL(href, origin || "https://example.invalid");
    if (origin && u.origin !== origin) return null;
    return u.pathname;
  } catch {
    return null;
  }
}

function langFromHref(href: string, hostname: string): string | null {
  if (!href) return null;
  try {
    const u = new URL(href, `https://${hostname || "example.invalid"}`);
    const host = u.hostname.toLowerCase();
    // ar.example.com
    const sub = host.match(/^([a-z]{2})\.(.+)$/);
    if (sub && LANG_CODES.has(sub[1]) && hostname && (sub[2] === hostname || hostname.endsWith(sub[2]))) return sub[1];
    if (hostname && host !== hostname && !host.endsWith(`.${hostname}`)) return null;
    const seg = u.pathname.match(/^\/([a-z]{2})(?:[-_][a-zA-Z]{2})?(?:\/|$)/);
    if (seg && LANG_CODES.has(seg[1])) return seg[1];
    const q = (u.searchParams.get("lang") ?? u.searchParams.get("language") ?? u.searchParams.get("hl") ?? "").toLowerCase();
    const qc = baseLang(q);
    if (qc && LANG_CODES.has(qc)) return qc;
    return null;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */
/* Mapping onto the 10 questions                                       */
/* ------------------------------------------------------------------ */

/** Heuristic speed grade without PageSpeed; 0-8. */
export function speedPoints(c: ScanChecks): number {
  let p = 0;
  const { ttfbMs } = c.speed;
  const { scripts, htmlBytes, images, videos } = c.weight;
  p += ttfbMs < 500 ? 2 : ttfbMs < 1200 ? 1 : 0;
  p += scripts <= 12 ? 2 : scripts <= 30 ? 1 : 0;
  p += htmlBytes < 150_000 ? 2 : htmlBytes < 500_000 ? 1 : 0;
  p += images <= 25 ? 1 : 0;
  p += videos === 0 ? 1 : 0;
  return p;
}

export function suggestAnswers(c: ScanChecks): Partial<Record<QuestionId, Answer>> {
  const s: Partial<Record<QuestionId, Answer>> = {};

  const langCount = c.languages.length;
  s.languages = langCount >= 3 ? "yes" : langCount === 2 ? "partly" : "no";

  s.whatsapp = c.whatsapp > 0 ? "yes" : c.whatsappWidgetHint ? "partly" : "no";

  if (c.speed.pagespeed) {
    const sc = c.speed.pagespeed.score;
    s.speed = sc >= 80 ? "yes" : sc >= 50 ? "partly" : "no";
  } else {
    const p = speedPoints(c);
    s.speed = p >= 6 ? "yes" : p >= 3 ? "partly" : "no";
  }

  s.treatments =
    c.treatmentLinks >= 3 && c.priceSignals > 0 ? "yes" : c.treatmentLinks >= 1 ? "partly" : "no";

  const trustSignals =
    (c.trust.jci ? 1 : 0) + (c.trust.iso ? 1 : 0) + (c.trust.accredit > 0 ? 1 : 0) + (c.trust.certificate > 0 ? 1 : 0);
  s.credentials = trustSignals > 0 && c.trust.doctors > 0 ? "yes" : trustSignals > 0 || c.trust.doctors > 0 ? "partly" : "no";

  s.gallery = c.trust.beforeAfter > 0 ? "yes" : "no";

  s.booking = c.bookingCta > 0 ? "yes" : c.tel + c.mailto + c.whatsapp > 0 ? "partly" : "no";

  // journey, tracking, feedback: the home page cannot answer these honestly.
  return s;
}

export interface EvidenceItem {
  code: EvidenceCode;
  params: Record<string, string | number>;
}

function fmtList(codes: string[]): string {
  return codes.map((c) => c.toUpperCase()).join(", ");
}

/** Per-question evidence codes + params, consumed by audit.scan.evidence.<code>. */
export function questionEvidence(c: ScanChecks): Partial<Record<QuestionId, EvidenceItem>> {
  const e: Partial<Record<QuestionId, EvidenceItem>> = {};
  const n = c.languages.length;
  e.languages =
    n === 0
      ? { code: "languages_none", params: {} }
      : n === 1
        ? { code: "languages_one", params: { list: fmtList(c.languages) } }
        : { code: "languages_many", params: { count: n, list: fmtList(c.languages) } };

  e.whatsapp =
    c.whatsapp > 0
      ? { code: "whatsapp_links", params: { count: c.whatsapp } }
      : c.whatsappWidgetHint
        ? { code: "whatsapp_widget", params: {} }
        : { code: "whatsapp_none", params: {} };

  e.booking =
    c.bookingCta > 0
      ? { code: "booking_cta", params: { count: c.bookingCta } }
      : c.tel + c.mailto + c.whatsapp > 0
        ? { code: "booking_contact_only", params: {} }
        : { code: "booking_none", params: {} };

  e.treatments =
    c.treatmentLinks === 0
      ? { code: "treatments_none", params: {} }
      : c.priceSignals > 0
        ? { code: "treatments_priced", params: { count: c.treatmentLinks, prices: c.priceSignals } }
        : { code: "treatments_unpriced", params: { count: c.treatmentLinks } };

  const trustParts: string[] = [];
  if (c.trust.jci) trustParts.push("JCI");
  if (c.trust.iso) trustParts.push("ISO");
  const trustSignals = trustParts.length + (c.trust.accredit > 0 ? 1 : 0) + (c.trust.certificate > 0 ? 1 : 0);
  e.credentials =
    trustSignals > 0 && c.trust.doctors > 0
      ? { code: "credentials_full", params: { doctors: c.trust.doctors, list: trustParts.join(", ") || "-" } }
      : c.trust.doctors > 0
        ? { code: "credentials_doctors_only", params: { doctors: c.trust.doctors } }
        : trustSignals > 0
          ? { code: "credentials_badges_only", params: { list: trustParts.join(", ") || "-" } }
          : { code: "credentials_none", params: {} };

  e.gallery =
    c.trust.beforeAfter > 0
      ? { code: "gallery_found", params: { count: c.trust.beforeAfter } }
      : { code: "gallery_none", params: {} };

  const kb = Math.round(c.weight.htmlBytes / 1024);
  e.speed = c.speed.pagespeed
    ? {
        code: "speed_pagespeed",
        params: { score: Math.round(c.speed.pagespeed.score), ttfb: c.speed.ttfbMs, scripts: c.weight.scripts },
      }
    : { code: "speed_server", params: { ttfb: c.speed.ttfbMs, scripts: c.weight.scripts, images: c.weight.images, kb } };

  return e;
}

/** Evidence codes only (for the API payload). */
export function evidenceCodes(c: ScanChecks): Partial<Record<QuestionId, EvidenceCode>> {
  const e = questionEvidence(c);
  const out: Partial<Record<QuestionId, EvidenceCode>> = {};
  for (const [k, v] of Object.entries(e)) if (v) out[k as QuestionId] = v.code;
  return out;
}

export function buildScanSuccess(finalUrl: string, checks: ScanChecks): ScanSuccess {
  return {
    ok: true,
    version: SCAN_VERSION,
    finalUrl,
    checks,
    suggestedAnswers: suggestAnswers(checks),
    evidence: evidenceCodes(checks),
  };
}

/** Plain-English facts for the admin notification (Awab reads this, not the clinic). */
export function scanFactsForEmail(c: ScanChecks): string[] {
  const ps = c.speed.pagespeed;
  const trust = [
    c.trust.jci ? "JCI" : null,
    c.trust.iso ? "ISO" : null,
    c.trust.accredit ? `accredit x${c.trust.accredit}` : null,
    c.trust.certificate ? `certif x${c.trust.certificate}` : null,
    `Dr. names x${c.trust.doctors}`,
    `before/after x${c.trust.beforeAfter}`,
  ]
    .filter(Boolean)
    .join(", ");
  return [
    `Languages: ${c.languages.length ? fmtList(c.languages) : "none detected"} (hreflang ${c.hreflangCount}, lang=${c.lang ?? "-"}); Arabic ${
      c.arabic.found ? `yes, RTL ${c.arabic.rtl === null ? "unknown" : c.arabic.rtl ? "yes" : "NO"}` : "no"
    }`,
    `Contact: WhatsApp links ${c.whatsapp}${c.whatsappWidgetHint ? " (widget hint)" : ""}, tel ${c.tel}, mailto ${c.mailto}, booking CTAs ${c.bookingCta}`,
    `Treatments: ${c.treatmentLinks} treatment links, ${c.priceSignals} price signals near treatment words`,
    `Trust: ${trust}; schema.org: ${c.schemaTypes.join(", ") || "none"}`,
    `Speed: TTFB ${c.speed.ttfbMs} ms, HTML ${Math.round(c.weight.htmlBytes / 1024)} KB in ${c.speed.totalMs} ms, ${c.weight.scripts} scripts, ${c.weight.images} imgs (${c.weight.imagesWithoutSize} unsized, ${c.weight.heavyImages} gif/png hero-ish, ${c.weight.lazyImages} lazy), ${c.weight.videos} videos${
      ps ? `; PSI mobile ${Math.round(ps.score)}/100, LCP ${ps.lcpMs ?? "-"} ms, CLS ${ps.cls ?? "-"}, TBT ${ps.tbtMs ?? "-"} ms` : "; PSI not run"
    }`,
    `Meta: title ${c.meta.titleLength} chars, description ${c.meta.description ? "yes" : "NO"}, viewport ${c.meta.viewport ? "yes" : "NO"}, og:image ${c.meta.ogImage ? "yes" : "NO"}; https ${c.https ? "yes" : "NO"}, redirects ${Math.max(0, c.redirectChain.length - 1)}; tracking: ${c.tracking.join(", ") || "none seen"}`,
  ];
}

/** Keep only the answers the scan suggested, as a typed Answers object. */
export function suggestedToAnswers(s: Partial<Record<QuestionId, Answer>>): Answers {
  return { ...s };
}
