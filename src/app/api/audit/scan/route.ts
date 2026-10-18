import { NextResponse } from "next/server";
import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import { z } from "zod";
import { checkRateLimit, getIdentifier, getRateLimitHeaders } from "@/lib/rateLimit";
import { normalizeWebsite } from "@/lib/audit";
import {
  SCAN_USER_AGENT,
  analyzeHtml,
  buildScanSuccess,
  detectRtl,
  type PagespeedSummary,
  type ScanErrorCode,
  type ScanResult,
} from "@/lib/auditScan";

/**
 * POST /api/audit/scan — { website } → ScanResult.
 *
 * Reads the clinic's home page (and its Arabic page if one is linked) the way
 * a phone would, within an 8 second budget, and maps what it finds onto the
 * /audit questions. Never fetches private hosts, never sends credentials,
 * caps every body at 1 MB. Google PageSpeed is optional (PAGESPEED_API_KEY)
 * and runs in parallel under the same deadline so it never delays the result.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RATE_LIMIT = { limit: 20, windowMs: 60 * 60 * 1000, prefix: "audit-scan" };
const TOTAL_BUDGET_MS = 8000;
const HOME_FETCH_MS = 6500;
const PSI_TIMEOUT_MS = 6000;
const MAX_REDIRECTS = 3;
const MAX_BYTES = 1_000_000;

const bodySchema = z.object({ website: z.string().trim().min(1).max(300) });

class ScanError extends Error {
  constructor(
    public code: ScanErrorCode,
    public status?: number,
  ) {
    super(code);
  }
}

/* ------------------------------------------------------------------ */
/* Host safety                                                         */
/* ------------------------------------------------------------------ */

function ipv4Private(ip: string): boolean {
  const p = ip.split(".").map(Number);
  if (p.length !== 4 || p.some((n) => Number.isNaN(n))) return true;
  const [a, b] = p;
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 192 && b === 0) ||
    (a === 198 && (b === 18 || b === 19)) ||
    a >= 224
  );
}

function ipPrivate(ip: string): boolean {
  const v = isIP(ip);
  if (v === 4) return ipv4Private(ip);
  if (v === 6) {
    const low = ip.toLowerCase();
    if (low === "::1" || low === "::") return true;
    const mapped = low.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
    if (mapped) return ipv4Private(mapped[1]);
    return /^(fc|fd|fe[89ab])/.test(low);
  }
  return true;
}

/** Throws ScanError("blocked_host") for private, loopback or non-public hosts; "dns_failed" when unresolvable. */
async function assertPublicHost(hostname: string): Promise<void> {
  const host = hostname.toLowerCase().replace(/\.$/, "");
  if (!host.includes(".") || /(^|\.)(localhost|local|internal|lan|home|corp|localdomain)$/.test(host)) {
    throw new ScanError("blocked_host");
  }
  if (isIP(host)) {
    if (ipPrivate(host)) throw new ScanError("blocked_host");
    return;
  }
  let addrs: { address: string }[];
  try {
    addrs = await lookup(host, { all: true, verbatim: true });
  } catch {
    throw new ScanError("dns_failed");
  }
  if (!addrs.length) throw new ScanError("dns_failed");
  if (addrs.some((a) => ipPrivate(a.address))) throw new ScanError("blocked_host");
}

/* ------------------------------------------------------------------ */
/* Fetching                                                            */
/* ------------------------------------------------------------------ */

interface FetchedPage {
  html: string;
  finalUrl: string;
  chain: string[];
  bytes: number;
  ttfbMs: number;
  totalMs: number;
}

function charsetOf(contentType: string | null, head: string): string {
  const fromHeader = contentType?.match(/charset=["']?([\w-]+)/i)?.[1];
  const fromMeta =
    head.match(/<meta[^>]+charset=["']?([\w-]+)/i)?.[1] ??
    head.match(/<meta[^>]+content=["'][^"']*charset=([\w-]+)/i)?.[1];
  return (fromHeader ?? fromMeta ?? "utf-8").toLowerCase();
}

async function readCapped(res: Response, deadlineAt: number): Promise<{ bytes: Uint8Array; truncated: boolean }> {
  const reader = res.body?.getReader();
  if (!reader) return { bytes: new Uint8Array(), truncated: false };
  const chunks: Uint8Array[] = [];
  let total = 0;
  let truncated = false;
  while (true) {
    if (Date.now() > deadlineAt) {
      await reader.cancel().catch(() => undefined);
      throw new ScanError("timeout");
    }
    const { done, value } = await reader.read();
    if (done) break;
    if (value) {
      chunks.push(value);
      total += value.byteLength;
      if (total >= MAX_BYTES) {
        truncated = true;
        await reader.cancel().catch(() => undefined);
        break;
      }
    }
  }
  const out = new Uint8Array(Math.min(total, MAX_BYTES));
  let offset = 0;
  for (const c of chunks) {
    const slice = c.subarray(0, Math.max(0, Math.min(c.byteLength, out.byteLength - offset)));
    out.set(slice, offset);
    offset += slice.byteLength;
    if (offset >= out.byteLength) break;
  }
  return { bytes: out, truncated };
}

/** Fetch an HTML page following at most MAX_REDIRECTS, each hop checked for a public host. */
async function fetchHtml(startUrl: string, budgetMs: number): Promise<FetchedPage> {
  const started = Date.now();
  const deadlineAt = started + budgetMs;
  const chain: string[] = [];
  let url = startUrl;

  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const u = new URL(url);
    if (!/^https?:$/.test(u.protocol)) throw new ScanError("blocked_host");
    await assertPublicHost(u.hostname);
    chain.push(url);

    const remaining = deadlineAt - Date.now();
    if (remaining < 200) throw new ScanError("timeout");
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), remaining);
    let res: Response;
    const hopStart = Date.now();
    try {
      res = await fetch(url, {
        method: "GET",
        redirect: "manual",
        signal: controller.signal,
        credentials: "omit",
        cache: "no-store",
        headers: {
          "user-agent": SCAN_USER_AGENT,
          accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.5",
          "accept-language": "en,tr;q=0.8,ar;q=0.7",
        },
      });
    } catch (err) {
      clearTimeout(timer);
      if ((err as Error)?.name === "AbortError") throw new ScanError("timeout");
      throw new ScanError("unreachable");
    }

    if (res.status >= 300 && res.status < 400) {
      clearTimeout(timer);
      await res.body?.cancel().catch(() => undefined);
      const loc = res.headers.get("location");
      if (!loc) throw new ScanError("http_error", res.status);
      url = new URL(loc, url).toString();
      if (hop === MAX_REDIRECTS) throw new ScanError("too_many_redirects");
      continue;
    }

    const ttfbMs = Date.now() - hopStart;
    if (res.status >= 400) {
      clearTimeout(timer);
      await res.body?.cancel().catch(() => undefined);
      throw new ScanError("http_error", res.status);
    }
    const contentType = res.headers.get("content-type");
    if (contentType && !/html|xml|text\/plain/i.test(contentType)) {
      clearTimeout(timer);
      await res.body?.cancel().catch(() => undefined);
      throw new ScanError("not_html");
    }

    let bytes: Uint8Array;
    try {
      ({ bytes } = await readCapped(res, deadlineAt));
    } finally {
      clearTimeout(timer);
    }
    const totalMs = Date.now() - hopStart;
    const head = new TextDecoder("utf-8", { fatal: false }).decode(bytes.subarray(0, 4096));
    let html: string;
    try {
      html = new TextDecoder(charsetOf(contentType, head), { fatal: false }).decode(bytes);
    } catch {
      html = new TextDecoder("utf-8", { fatal: false }).decode(bytes);
    }
    if (!/<(?:!doctype\s+html|html|head|body|title|div)\b/i.test(html.slice(0, 20000))) throw new ScanError("not_html");

    return { html, finalUrl: url, chain, bytes: bytes.byteLength, ttfbMs, totalMs };
  }
  throw new ScanError("too_many_redirects");
}

async function fetchPagespeed(url: string, budgetMs: number): Promise<PagespeedSummary | null> {
  const key = process.env.PAGESPEED_API_KEY;
  if (!key) return null;
  const ms = Math.min(PSI_TIMEOUT_MS, budgetMs);
  if (ms < 1000) return null;
  try {
    const api = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
    api.searchParams.set("url", url);
    api.searchParams.set("strategy", "mobile");
    api.searchParams.set("category", "PERFORMANCE");
    api.searchParams.set("key", key);
    const res = await fetch(api, { signal: AbortSignal.timeout(ms), cache: "no-store" });
    if (!res.ok) return null;
    const json = (await res.json()) as {
      lighthouseResult?: {
        categories?: { performance?: { score?: number } };
        audits?: Record<string, { numericValue?: number }>;
      };
    };
    const lr = json.lighthouseResult;
    const score = lr?.categories?.performance?.score;
    if (typeof score !== "number") return null;
    const num = (id: string) => {
      const v = lr?.audits?.[id]?.numericValue;
      return typeof v === "number" ? Math.round(v * 1000) / 1000 : null;
    };
    return {
      score: Math.round(score * 100),
      lcpMs: num("largest-contentful-paint") === null ? null : Math.round(num("largest-contentful-paint")!),
      cls: num("cumulative-layout-shift"),
      tbtMs: num("total-blocking-time") === null ? null : Math.round(num("total-blocking-time")!),
    };
  } catch {
    return null;
  }
}

function withDeadline<T>(p: Promise<T>, ms: number, fallback: T): Promise<T> {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(fallback), Math.max(0, ms));
    p.then(
      (v) => {
        clearTimeout(timer);
        resolve(v);
      },
      () => {
        clearTimeout(timer);
        resolve(fallback);
      },
    );
  });
}

/* ------------------------------------------------------------------ */
/* Handler                                                             */
/* ------------------------------------------------------------------ */

export async function POST(request: Request) {
  const identifier = getIdentifier(request);
  const rate = checkRateLimit(identifier, RATE_LIMIT);
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
    return NextResponse.json({ ok: false, error: "invalid_url" }, { status: 400 });
  }
  const website = normalizeWebsite(parsed.data.website);
  if (!website) {
    return NextResponse.json({ ok: false, error: "invalid_url" }, { status: 400 });
  }

  const startedAt = Date.now();
  const deadlineAt = startedAt + TOTAL_BUDGET_MS;

  // Early host check so a private target is a 400, not a 200 { ok:false }.
  try {
    await assertPublicHost(new URL(website).hostname);
  } catch (err) {
    const code = err instanceof ScanError ? err.code : "unreachable";
    const status = code === "blocked_host" ? 400 : 200;
    const body: ScanResult = { ok: false, error: code };
    return NextResponse.json(body, { status, headers: getRateLimitHeaders(rate) });
  }

  // PSI runs in parallel with the HTML fetch and never blocks the response.
  const psiPromise = withDeadline(fetchPagespeed(website, TOTAL_BUDGET_MS - 300), TOTAL_BUDGET_MS - 300, null);

  let page: FetchedPage;
  try {
    page = await fetchHtml(website, Math.min(HOME_FETCH_MS, deadlineAt - Date.now()));
  } catch (err) {
    const code = err instanceof ScanError ? err.code : "unreachable";
    const status = code === "blocked_host" ? 400 : 200;
    const body: ScanResult = { ok: false, error: code, ...(err instanceof ScanError && err.status ? { status: err.status } : {}) };
    return NextResponse.json(body, { status, headers: getRateLimitHeaders(rate) });
  }

  const checks = analyzeHtml({
    html: page.html,
    finalUrl: page.finalUrl,
    redirectChain: page.chain,
    htmlBytes: page.bytes,
    ttfbMs: page.ttfbMs,
    totalMs: page.totalMs,
  });

  // Arabic page: only if linked, only inside what is left of the budget.
  if (checks.arabic.url && checks.arabic.url !== page.finalUrl) {
    const left = deadlineAt - Date.now() - 300;
    if (left >= 800) {
      try {
        const ar = await fetchHtml(checks.arabic.url, left);
        checks.arabic.rtl = detectRtl(ar.html);
      } catch {
        checks.arabic.rtl = null;
      }
    }
  }

  checks.speed.pagespeed = await withDeadline(psiPromise, Math.max(0, deadlineAt - Date.now()), null);

  const result = buildScanSuccess(page.finalUrl, checks);
  return NextResponse.json(result, { headers: getRateLimitHeaders(rate) });
}
