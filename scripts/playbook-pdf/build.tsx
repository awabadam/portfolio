/**
 * Builds the playbook PDF.
 *
 *   npx tsx scripts/playbook-pdf/build.tsx --locale en --out <dir> [--only playbook|pack] [--no-pdf] [--no-preview]
 *
 * Builds two documents: the playbook (playbook-<locale>.pdf) and the Template Pack
 * (template-pack-<locale>.pdf, every copy-paste template the chapters point to).
 * Each is written as HTML (+ shared assets/), printed with headless Firefox, and
 * rendered as page previews plus a contact sheet (needs `nix-shell -p poppler-utils`,
 * skipped with --no-preview). The pack is printed first so the playbook can cite
 * its page numbers.
 */
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import sharp from "sharp";
import type { Playbook } from "@/data/playbook/types";
import { EXAMPLES, prepareAssets } from "./assets";
import { PlaybookDocument, TemplatePackDocument, type ChapterTuning, type Contact, type ReaderLabels } from "./Document";
import { pdfLabels, RTL_LOCALES, type Locale } from "./labels";
import { printToPdf } from "./print";

const ROOT = path.resolve(__dirname, "../..");
const PAGED_URL = "https://cdn.jsdelivr.net/npm/pagedjs/dist/paged.polyfill.js";
const GOOGLE_FONTS: Record<Locale, string> = {
  en: "family=Inter:wght@400;500;600;700&family=Azeret+Mono:wght@400;500",
  fr: "family=Inter:wght@400;500;600;700&family=Azeret+Mono:wght@400;500",
  tr: "family=Inter:wght@400;500;600;700&family=Azeret+Mono:wght@400;500",
  ar: "family=Inter:wght@400;500;600;700&family=Azeret+Mono:wght@400;500&family=Cairo:wght@400;500;600;700",
};

const LOADERS: Record<Locale, () => Promise<{ PLAYBOOK: Playbook }>> = {
  en: () => import("@/data/playbook/en"),
  ar: () => import("@/data/playbook/ar"),
  fr: () => import("@/data/playbook/fr"),
  tr: () => import("@/data/playbook/tr"),
};

function args() {
  const a = process.argv.slice(2);
  const get = (k: string) => {
    const i = a.indexOf(k);
    return i >= 0 ? a[i + 1] : undefined;
  };
  const locale = (get("--locale") ?? "en") as Locale;
  if (!(locale in LOADERS)) throw new Error(`Unknown locale ${locale}`);
  return {
    locale,
    out: path.resolve(get("--out") ?? path.join(ROOT, ".playbook-pdf")),
    only: get("--only") as "playbook" | "pack" | undefined,
    pdf: !a.includes("--no-pdf"),
    preview: !a.includes("--no-preview"),
  };
}

/** Contact details come from the site's own sources, not from this script. */
function siteContact(): Contact {
  const messages = JSON.parse(readFileSync(path.join(ROOT, "src/messages/en.json"), "utf8"));
  const modal = readFileSync(path.join(ROOT, "src/components/chat/WhatsAppModal.tsx"), "utf8");
  const digits = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || modal.match(/NEXT_PUBLIC_WHATSAPP_NUMBER \|\| "(\d+)"/)?.[1];
  if (!digits) throw new Error("WhatsApp number not found in WhatsAppModal.tsx");
  const d = digits;
  // Turkish mobile grouping: +90 5xx xxx xx xx
  const display = d.startsWith("90") && d.length === 12 ? `+90 ${d.slice(2, 5)} ${d.slice(5, 8)} ${d.slice(8, 10)} ${d.slice(10)}` : `+${d}`;
  return {
    email: messages.nav.email,
    whatsappDigits: d,
    whatsappDisplay: display,
    web: "awab.design",
    calUrl: "https://cal.com/awab-adam-ljhood/15min",
  };
}

async function cached(url: string, dest: string, headers: Record<string, string> = {}) {
  if (existsSync(dest)) return readFileSync(dest);
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`${url}: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(dest, buf);
  return buf;
}

/**
 * Firefox draws variable-font instances as outlines in the PDF, so their text can't be
 * selected or searched. Only static fonts are used: Google Fonts serves static TTFs to
 * an old user agent, and Switzer's variable font is cut into static weights with fonttools.
 */
const SWITZER_WEIGHTS = { 400: "Regular", 500: "Medium", 600: "Semibold", 700: "Bold" } as const;
const INSTANCE_PY = `
import sys
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
src, out, w, n = sys.argv[1], sys.argv[2], int(sys.argv[3]), sys.argv[4]
f = TTFont(src)
instantiateVariableFont(f, {"wght": w}, inplace=True, static=True)
f["OS/2"].usWeightClass = w
for rec in f["name"].names:
    if rec.nameID in (1, 16): rec.string = "Switzer"
    elif rec.nameID in (2, 17): rec.string = n
    elif rec.nameID == 4: rec.string = "Switzer " + n
    elif rec.nameID == 6: rec.string = "Switzer-" + n
f.flavor = "woff2"
f.save(out)
`;

function switzerCss(dir: string) {
  const src = path.join(ROOT, "public/fonts/switzer/Switzer-Variable.woff2");
  return Object.entries(SWITZER_WEIGHTS)
    .map(([w, n]) => {
      const file = `Switzer-${n}.woff2`;
      const dest = path.join(dir, file);
      if (!existsSync(dest)) {
        const py = path.join(dir, "instance.py");
        writeFileSync(py, INSTANCE_PY);
        execFileSync("nix-shell", ["-p", "python3.withPackages(p: [p.fonttools p.brotli])", "--run", `python3 '${py}' '${src}' '${dest}' ${w} ${n}`], {
          stdio: ["ignore", "ignore", "inherit"],
        });
      }
      return `@font-face { font-family: "Switzer"; src: url("assets/fonts/${file}") format("woff2"); font-weight: ${w}; font-display: block; }`;
    })
    .join("\n");
}

/** Downloads static Google Fonts (TTF) into assets/fonts and returns @font-face CSS pointing at them. */
async function fontCss(locale: Locale, assets: string) {
  const dir = path.join(assets, "fonts");
  mkdirSync(dir, { recursive: true });
  const ua = "Mozilla/4.0";
  const cssPath = path.join(dir, `google-static-${locale}.css`);
  let css = (await cached(`https://fonts.googleapis.com/css2?${GOOGLE_FONTS[locale]}&display=block`, cssPath, { "User-Agent": ua })).toString();
  const urls = [...new Set(css.match(/https:\/\/fonts\.gstatic\.com\/[^)]+/g) ?? [])];
  await Promise.all(
    urls.map(async (u) => {
      const name = u.split("/").slice(-2).join("-");
      await cached(u, path.join(dir, name));
      css = css.split(u).join(`assets/fonts/${name}`);
    }),
  );
  if (/\.woff2\)/.test(css)) throw new Error("Google Fonts returned variable woff2 files; static TTFs are needed for selectable PDF text");
  return `${switzerCss(dir)}\n${css}`;
}

/** Running header. Margin boxes are physical, so they swap sides for RTL. */
function pageCss(rtl: boolean, docLabel: string, locale: Locale) {
  const [brandSide, metaSide] = rtl ? ["right", "left"] : ["left", "right"];
  const esc = (s: string) => s.replace(/"/g, '\\"');
  return `
@page {
  size: A4;
  margin: 24mm 16mm 17mm;
  @top-${brandSide} {
    content: "AWAB.";
    font-family: "Switzer", sans-serif; font-weight: 600; font-size: 13pt; letter-spacing: -0.03em; color: #0a0a0a;
    vertical-align: middle;
  }
  @top-${metaSide} {
    content: "${esc(docLabel)}  ·  " string(run) "    " counter(page, decimal-leading-zero) " / " counter(pages, decimal-leading-zero);
    font-family: "Azeret Mono", monospace; font-size: 7.5pt; letter-spacing: 0.1em; text-transform: uppercase; color: #5e5e5e;
    vertical-align: middle; text-align: ${metaSide}; white-space: pre;
  }
}
@page :first { margin: 0; @top-left { content: none; } @top-right { content: none; } }
@page opener { margin: 0; @top-left { content: none; } @top-right { content: none; } }
@page closing { margin: 0; @top-left { content: none; } @top-right { content: none; } }
/* Chapter openers: the photo band bleeds into the top margin, so the running header sits on it in white. */
.pagedjs_page:has(.ch-band) .pagedjs_margin-top { position: relative; z-index: 5; }
.pagedjs_page:has(.ch-band) .pagedjs_margin-top > div,
.pagedjs_page:has(.ch-band) .pagedjs_margin-top .pagedjs_margin-content,
.pagedjs_page:has(.ch-band) .pagedjs_margin-top .pagedjs_margin-content::after { color: #fff !important; }
${locale === "ar" ? `:root { --font-body: "Cairo", "Inter", sans-serif; --font-display: "Cairo", "Switzer", sans-serif; }` : ""}
`;
}

/** Runs in the page after Paged.js: flags content that leaves its page area, and empty pages. */
const PAGED_HOOKS = `
window.PagedConfig = {
  auto: true,
  after: (flow) => {
    const issues = [];
    const fills = [];
    document.querySelectorAll(".pagedjs_page").forEach((page, i) => {
      const area = page.querySelector(".pagedjs_page_content");
      if (!area) return;
      const a = area.getBoundingClientRect();
      const named = /pagedjs_(cover|opener|closing)_page/.test(page.className);
      area.querySelectorAll("p, li, img, svg, table, .card, figure, .blackbox, h1, h2").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.height === 0) return;
        // Content Paged.js pushed to the next page sits in an overflow column beside the area; ignore it.
        if (r.left >= a.right - 1 || r.right <= a.left + 1) return;
        if (r.bottom > a.bottom + 1.5)
          issues.push({ page: i + 1, el: el.tagName + "." + (el.className.baseVal ?? el.className), over: Math.round(r.bottom - a.bottom) });
      });
      if (!named) {
        // How full the page is: the lowest visible content edge against the page area.
        let bottom = a.top;
        area.querySelectorAll("p, li, img, svg, table, figure, .card, .infobox, .tpl-ref, .blackbox").forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.height > 0 && r.left < a.right - 1 && r.right > a.left + 1) bottom = Math.max(bottom, r.bottom);
        });
        const body = area.querySelector(".ch-body");
        // Does the page open with a real-example figure (pushed over from the previous page)?
        const first = [...area.querySelectorAll(".ch-body > *")].find((el) => {
          const r = el.getBoundingClientRect();
          return r.height > 0 && r.left < a.right - 1;
        });
        fills.push({
          page: i + 1,
          fill: Math.round(((bottom - a.top) / a.height) * 100),
          ch: body ? body.getAttribute("data-ch") : null,
          startsEx: !!first && (first.matches("figure.example") || first.matches(".ex-row")),
        });
      }
      const text = area.textContent.trim().length;
      if (!text && !area.querySelector("img, svg")) issues.push({ page: i + 1, el: "EMPTY PAGE" });
      if (!named) {
        // A heading is stranded when nothing but headings follows it on its page.
        const leaves = [...area.querySelectorAll("p, li, td, img, svg, code, h2")].filter((el) => {
          const r = el.getBoundingClientRect();
          return r.height > 0 && r.left < a.right - 1 && !el.closest(".run");
        });
        const last = leaves.pop();
        const head = last && last.closest(".sec-head, .card-head, .tb-h, .msg-label, .example > .eyebrow, .tpl-group-head");
        if (head) {
          const sec = head.closest("[data-sec]");
          issues.push({ page: i + 1, el: "STRANDED " + head.className, sec: sec ? sec.getAttribute("data-sec") : null });
        }
      }
    });
    // First page of each template (Template Pack), so the playbook can cite it.
    const tplPages = {};
    document.querySelectorAll(".pagedjs_page").forEach((page, i) => {
      page.querySelectorAll('[id^="tpl-"]').forEach((el) => {
        const id = el.id.slice(4);
        if (!(id in tplPages)) tplPages[id] = i + 1;
      });
    });
    window.__pagedReport = { pages: flow.total, issues, fills, tplPages };
    window.__pagedDone = flow.total;
  },
};
`;

const hasPair = (id: string) => {
  const ex = EXAMPLES[id] ?? [];
  return ex.length === 2 && ex.every((e) => e.shots.length === 1 && !e.shots[0].crop);
};
type Fill = { page: number; fill: number; ch: string | null; startsEx: boolean };
type Tune = ChapterTuning & { prevSp: number; phase: "start" | "shrink" | "grow" | "done"; pages0: number };

/**
 * Evens out chapter pages from the last print pass. Each chapter starts on a fresh
 * page (photo band, then the body), so chapters can be tuned independently:
 * - a page left short because a real-example figure didn't fit: the figure moves below the checklist;
 * - a short last page in a chapter with a side-by-side screenshot pair: the pair gets larger rows;
 * - a last page holding only a stub (< 35% full): spacing tightens to pull it back;
 * - otherwise spacing opens up until the last page is nearly full, without adding a page.
 * Returns what changed; an empty list means the layout is settled.
 */
function tune(state: Map<string, Tune>, fills: Fill[]) {
  const changed: string[] = [];
  for (const [id, t] of state) {
    const pages = fills.filter((f) => f.ch === id);
    if (!pages.length || t.phase === "done") continue;
    const last = pages[pages.length - 1].fill;
    const before = `${t.sp}/${t.defer}/${t.wide}`;
    if (t.phase === "start") {
      const gap = pages.some((p, i) => i < pages.length - 1 && p.fill < 75 && pages[i + 1].startsEx);
      if (gap && !t.defer) t.defer = true;
      else if (hasPair(id) && !t.wide && pages.length > 1 && last < 70) t.wide = true;
      else if (pages.length > 1 && last < 35) Object.assign(t, { phase: "shrink", pages0: pages.length, prevSp: 1, sp: 0.85 });
      else if (last < 90) Object.assign(t, { phase: "grow", pages0: pages.length, prevSp: t.sp, sp: t.sp + 0.2 });
      else t.phase = "done";
    } else if (t.phase === "shrink") {
      if (pages.length < t.pages0) t.phase = "done";
      else if (t.sp > 0.6) t.sp = Math.round((t.sp - 0.12) * 100) / 100;
      else Object.assign(t, { phase: "grow", prevSp: 1, sp: 1 });
    } else if (t.phase === "grow") {
      if (pages.length > t.pages0) Object.assign(t, { phase: "done", sp: t.prevSp });
      else if (last >= 90 || t.sp >= 1.6) t.phase = "done";
      else Object.assign(t, { prevSp: t.sp, sp: Math.round((t.sp + 0.2) * 100) / 100 });
    }
    if (`${t.sp}/${t.defer}/${t.wide}` !== before) changed.push(`${id} sp=${t.sp}${t.defer ? " defer" : ""}${t.wide ? " wide" : ""}`);
  }
  return changed;
}

type Kind = "playbook" | "pack";
const FILE: Record<Kind, string> = { playbook: "playbook", pack: "template-pack" };

async function main() {
  const { locale, out, only, pdf, preview } = args();
  const rtl = RTL_LOCALES.includes(locale);
  mkdirSync(out, { recursive: true });
  const assets = path.join(out, "assets");
  mkdirSync(assets, { recursive: true });

  const { PLAYBOOK } = await LOADERS[locale]();
  const messages = JSON.parse(readFileSync(path.join(ROOT, `src/messages/${locale}.json`), "utf8"));
  const pb = messages.audit.playbook;
  const reader = pb.reader as ReaderLabels;
  const labels = pdfLabels(locale);

  console.log("assets…");
  const urls = await prepareAssets(out);
  const fonts = await fontCss(locale, assets);
  await cached(PAGED_URL, path.join(assets, "paged.polyfill.js"));
  const css = readFileSync(path.join(__dirname, "styles.css"), "utf8");
  const contact = siteContact();

  /** Writes the HTML for one document, prints it until the layout settles, and returns the last report. */
  async function build(kind: Kind, packPages?: Record<string, number>) {
    const tuning = new Map<string, Tune>(
      kind === "playbook" ? PLAYBOOK.chapters.map((c) => [c.id, { sp: 1, prevSp: 1, defer: false, wide: false, phase: "start", pages0: 0 }]) : [],
    );
    const Doc = kind === "playbook" ? PlaybookDocument : TemplatePackDocument;
    const docLabel = kind === "playbook" ? labels.docLabel : labels.packDocLabel;
    const title = kind === "playbook" ? PLAYBOOK.title : `${labels.packTitle}: ${PLAYBOOK.title}`;
    const bodyFor = () =>
      renderToStaticMarkup(
        <Doc
          playbook={PLAYBOOK}
          labels={{ ...labels, docLabel }}
          reader={reader}
          chapterLabel={pb.chapterLabel}
          minutesLabel={pb.minutes}
          urls={urls}
          contact={contact}
          rtl={rtl}
          packPages={packPages}
          tuning={Object.fromEntries([...tuning].map(([id, t]) => [id, { sp: t.sp, defer: t.defer, wide: t.wide }]))}
        />,
      );
    // Template Pack: one spacing scale for all templates, tightened when the last page holds only a stub.
    const pack = { sp: 1, pages0: 0, done: kind !== "pack" };
    // Sections whose heading Paged.js left stranded at a page bottom start on a new page (found by a previous pass).
    const forced = new Set<string>();
    const htmlFor = () => `<!doctype html>
<html lang="${locale}" dir="${rtl ? "rtl" : "ltr"}">
<head>
<meta charset="utf-8">
<title>${title.replace(/</g, "&lt;")}</title>
<style>${fonts}</style>
<style>${css}\n${pageCss(rtl, docLabel, locale)}</style>
<style>${[...forced].map((id) => `[data-sec="${id}"] { break-before: page; }`).join("\n")}${kind === "pack" ? `\n.appendix { --sp: ${pack.sp}; }` : ""}</style>
<script>${PAGED_HOOKS}</script>
<script src="assets/paged.polyfill.js"></script>
</head>
<body>${bodyFor()}</body>
</html>`;
    const name = `${FILE[kind]}-${locale}`;
    const htmlPath = path.join(out, `${name}.html`);
    writeFileSync(htmlPath, htmlFor());
    console.log("html", htmlPath);
    if (!pdf) return undefined;

    const pdfPath = path.join(out, `${name}.pdf`);
    const rawPath = path.join(out, `.${name}.raw.pdf`);
    type Issue = { page: number; el: string; sec?: string | null };
    let pages = 0;
    let issues: Issue[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let lastReport: any = {};
    for (let pass = 1; pass <= 12; pass++) {
      console.log(`[${kind}] printing with Firefox (pass ${pass})…`);
      const res = await printToPdf({ html: htmlPath, pdf: rawPath, profileDir: path.join(out, ".ffprofile") });
      pages = res.pages;
      issues = (res.report.issues as Issue[]) ?? [];
      lastReport = res.report;
      const fresh = issues.filter((i) => i.el.startsWith("STRANDED") && i.sec && !forced.has(i.sec)).map((i) => i.sec!);
      fresh.forEach((id) => forced.add(id));
      if (fresh.length) console.log("  page break before:", fresh.join(", "));
      const tuned = tune(tuning, (res.report.fills as Fill[]) ?? []);
      if (!pack.done) {
        const fills = (res.report.fills as Fill[]) ?? [];
        const last = fills[fills.length - 1]?.fill ?? 100;
        if (!pack.pages0) pack.pages0 = pages;
        if (pages < pack.pages0) pack.done = true;
        else if (last >= 40 && pack.sp === 1) pack.done = true;
        else if (pack.sp > 0.55) {
          pack.sp = Math.round((pack.sp - 0.15) * 100) / 100;
          tuned.push(`pack sp=${pack.sp}`);
        } else {
          pack.sp = 1;
          pack.done = true;
          tuned.push("pack sp=1 (stub stays)");
        }
      }
      if (tuned.length) console.log("  tuning:", tuned.join(", "));
      if (!fresh.length && !tuned.length) break;
      writeFileSync(htmlPath, htmlFor());
    }
    compress(rawPath, pdfPath);
    const mb = (statSync(pdfPath).size / 1024 / 1024).toFixed(2);
    console.log(`pdf ${pdfPath}: ${pages} pages, ${mb} MB`);
    const fills = (lastReport.fills as { page: number; fill: number }[]) ?? [];
    const low = fills.filter((f) => f.fill < 72);
    console.log("page fill %:", low.length ? low.map((f) => `p${f.page}=${f.fill}`).join(" ") : "all pages at least 72% full");
    if (issues.length) console.log("layout issues:", JSON.stringify(issues, null, 1));
    else console.log("layout check: no overflow, empty pages or stranded headings");
    if (preview) await previews(pdfPath, out, name);
    return lastReport;
  }

  let packPages: Record<string, number> | undefined;
  if (only !== "playbook") packPages = (await build("pack"))?.tplPages;
  if (only !== "pack") await build("playbook", packPages);
}

/**
 * Firefox embeds images as lossless Flate streams (~30 MB). Ghostscript re-encodes
 * them as JPEG at 200 ppi; text, fonts and links are kept. Falls back to the raw PDF.
 */
function compress(raw: string, pdf: string) {
  const gs = [
    "gs -q -dNOPAUSE -dBATCH -dSAFER -sDEVICE=pdfwrite -dCompatibilityLevel=1.6",
    "-dAutoFilterColorImages=false -dColorImageFilter=/DCTEncode -dJPEGQ=84",
    "-dDownsampleColorImages=true -dColorImageResolution=200 -dColorImageDownsampleThreshold=1.2 -dColorImageDownsampleType=/Bicubic",
    `-sOutputFile='${pdf}' '${raw}'`,
  ].join(" ");
  try {
    execFileSync("nix-shell", ["-p", "ghostscript", "--run", gs], { stdio: ["ignore", "ignore", "inherit"] });
    if (!process.env.KEEP_RAW) rmSync(raw);
  } catch (e) {
    console.warn("ghostscript compression failed, keeping the uncompressed PDF:", (e as Error).message);
    copyFileSync(raw, pdf);
  }
}

async function previews(pdfPath: string, out: string, name: string) {
  const dir = path.join(out, `pages-${name}`);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  execFileSync("nix-shell", ["-p", "poppler-utils", "--run", `pdftoppm -r 60 -png '${pdfPath}' '${dir}/p'`], { stdio: "inherit" });
  const files = readdirSync(dir).filter((f) => f.endsWith(".png")).sort();
  const meta = await sharp(path.join(dir, files[0])).metadata();
  const w = meta.width!;
  const h = meta.height!;
  const perRow = 6;
  const gap = 16;
  const rows = Math.ceil(files.length / perRow);
  const sheet = sharp({
    create: { width: perRow * w + (perRow + 1) * gap, height: rows * h + (rows + 1) * gap, channels: 3, background: "#8a8a8a" },
  }).composite(
    files.map((f, i) => ({ input: path.join(dir, f), left: gap + (i % perRow) * (w + gap), top: gap + Math.floor(i / perRow) * (h + gap) })),
  );
  const sheetPath = path.join(out, `sheet-${name}.png`);
  await sheet.png().toFile(sheetPath);
  console.log(`previews ${dir} (${files.length}), contact sheet ${sheetPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
