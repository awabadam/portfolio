/**
 * Renders every email the site sends with realistic fixture data to HTML
 * (and the plain-text part next to it) so they can be checked in a browser.
 * Sends nothing and touches no database.
 *
 *   npx tsx scripts/email-preview.tsx [outDir] [--shots]
 *
 * --shots also screenshots each file with headless Firefox at 600px
 * (desktop), 390px (mobile) and 600px with a simulated dark-mode inversion.
 * FIREFOX_BIN overrides the Firefox binary (same default as scripts/playbook-pdf).
 * Images load from EMAIL_ASSET_BASE, http://localhost:3000 (the dev server,
 * which serves public/email/) unless set.
 */
import { spawn } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import type { Locale } from "@/i18n/config";
import { computeResult, computeTier, type Answers, type Qualification } from "@/lib/audit";
import { getPlaybook, leadTrackerCsv } from "@/lib/playbook";
import { buildAdminAuditAlert } from "@/emails/AdminAuditAlert";
import { buildAuditReportEmail } from "@/emails/AuditReport";
import { buildAdminPlaybookAlert } from "@/emails/AdminPlaybookAlert";
import { buildPlaybookAccessEmail } from "@/emails/PlaybookAccess";
import { buildTemplatePackEmail } from "@/emails/TemplatePack";
import { buildContactConfirmationEmail } from "@/emails/ContactConfirmation";
import { buildAdminContactAlert } from "@/emails/AdminContactAlert";
import type { RenderedEmail } from "@/emails/render";

process.env.EMAIL_ASSET_BASE ||= "http://localhost:3000";

const args = process.argv.slice(2);
const shots = args.includes("--shots");
const outDir = path.resolve(args.find((a) => !a.startsWith("--")) ?? "email-preview");
const FIREFOX = process.env.FIREFOX_BIN || "/etc/profiles/per-user/awab/bin/firefox";
const PLAYBOOK_URL = (locale: Locale) =>
  `https://www.awab.design${locale === "en" ? "" : `/${locale}`}/audit/playbook?k=demo-key.signature`;

const coldAnswers: Answers = {
  languages: "partly",
  journey: "no",
  whatsapp: "no",
  speed: "partly",
  treatments: "no",
  credentials: "yes",
  gallery: "yes",
  booking: "partly",
  tracking: "no",
  feedback: "no",
};
const hotAnswers: Answers = {
  languages: "yes",
  journey: "partly",
  whatsapp: "no",
  speed: "yes",
  treatments: "partly",
  credentials: "yes",
  gallery: "yes",
  booking: "yes",
  tracking: "no",
  feedback: "partly",
};
const scanFacts = [
  "Final URL: https://www.dentaglow-istanbul.com/en/",
  "Languages linked: en, de (hreflang), no Arabic page",
  "WhatsApp link: contact page only, none on treatment pages",
  "PageSpeed mobile: 41 (LCP 5.8s)",
  "Prices: none found on treatment pages",
];

async function main() {
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });
  const files: { name: string; email: RenderedEmail }[] = [];
  const add = (name: string, email: RenderedEmail) => files.push({ name, email });

  // Admin alert: hot.
  {
    const q: Qualification = { role: "owner", channel: ["ads", "facilitators"], timeline: "thisMonth", budgetFit: "yes" };
    const r = computeResult(hotAnswers);
    const tier = computeTier({ treatments: "dental", markets: ["gulf", "uk"], volume: "100plus" }, q);
    add(
      "admin-audit-hot",
      await buildAdminAuditAlert({
        tier,
        provisional: false,
        score: r.score,
        band: r.band,
        website: "https://www.dentaglow-istanbul.com/en/",
        clinic: "DentaGlow Istanbul",
        name: "Dr. Selin Kaya",
        email: "selin@dentaglow-istanbul.com",
        phone: "+90 532 123 45 67",
        markets: ["gulf", "uk"],
        treatments: "dental",
        volume: "100plus",
        qualification: q,
        answers: hotAnswers,
        fixes: r.fixes,
        scanFacts,
        locale: "en",
        leadId: "7c1e9f52-3b4d-4e2a-9a51-0f6d2c8b1e77",
        auditVersion: 2,
      }),
    );
  }
  // Admin alert: cold.
  {
    const q: Qualification = { role: "coordinator", channel: ["social"], timeline: "researching", budgetFit: "notNow" };
    const r = computeResult(coldAnswers);
    const tier = computeTier({ treatments: "hair", markets: ["europe"], volume: "10to30" }, q);
    add(
      "admin-audit-cold",
      await buildAdminAuditAlert({
        tier,
        provisional: false,
        score: r.score,
        band: r.band,
        website: "https://hairline-clinic.com.tr",
        clinic: "",
        name: "",
        email: "info@hairline-clinic.com.tr",
        phone: "",
        markets: ["europe"],
        treatments: "hair",
        volume: "10to30",
        qualification: q,
        answers: coldAnswers,
        fixes: r.fixes,
        scanFacts: null,
        locale: "tr",
        leadId: "2a6b0d1e-77c3-4f0a-8d2e-5b9c3e1f4a20",
        auditVersion: 2,
      }),
    );
  }
  // Admin alert: warm, provisional (older client, no qualification).
  {
    const r = computeResult(coldAnswers);
    add(
      "admin-audit-warm-provisional",
      await buildAdminAuditAlert({
        tier: computeTier({ volume: "30to100" }, null),
        provisional: true,
        score: r.score,
        band: r.band,
        website: "https://aesthetica.clinic",
        clinic: "Aesthetica",
        name: "Mehmet",
        email: "mehmet@aesthetica.clinic",
        phone: "0532 987 65 43",
        markets: ["gulf"],
        treatments: "aesthetic",
        volume: "30to100",
        qualification: null,
        answers: coldAnswers,
        fixes: r.fixes,
        scanFacts: null,
        locale: "ar",
        leadId: null,
        auditVersion: 2,
      }),
    );
  }

  // Lead audit report: en (hot, named) and ar (cold), plus fr/tr for copy fit.
  for (const [locale, answers, hot, name] of [
    ["en", hotAnswers, true, "Dr. Selin"],
    ["ar", coldAnswers, false, "أحمد"],
    ["fr", coldAnswers, false, ""],
    ["tr", hotAnswers, true, "Selin"],
  ] as const) {
    const playbook = await getPlaybook(locale);
    const r = computeResult(answers);
    add(
      `lead-report-${locale}`,
      await buildAuditReportEmail({
        locale,
        name,
        website: "https://www.dentaglow-istanbul.com/en/",
        score: r.score,
        band: r.band,
        answers,
        fixes: r.fixes,
        playbookUrl: PLAYBOOK_URL(locale),
        playbook,
        hot,
        csvAttached: Boolean(leadTrackerCsv(playbook)),
      }),
    );
  }

  // Playbook.
  add("admin-playbook", await buildAdminPlaybookAlert({ email: "marketing@smileline.com", website: "https://smileline.com/", locale: "en", leadId: "9f8e7d6c-5b4a-4321-8765-0fedcba98765" }));
  for (const locale of ["en", "ar"] as const) {
    const playbook = await getPlaybook(locale);
    add(`lead-playbook-${locale}`, await buildPlaybookAccessEmail({ locale, playbookUrl: PLAYBOOK_URL(locale), playbook, csvAttached: true }));
  }

  // Template Pack.
  for (const [locale, source] of [["en", "playbook"], ["ar", "clinic_audit"]] as const) {
    add(`lead-template-pack-${locale}`, await buildTemplatePackEmail({ locale, packUrl: "https://www.awab.design/downloads/playbook/template-pack-en.pdf", source }));
  }

  // Contact.
  add(
    "admin-contact",
    await buildAdminContactAlert({
      formType: "contact",
      name: "Dr. Omar Haddad",
      email: "omar@haddad-dental.ae",
      phone: "+971 50 123 4567",
      company: "Haddad Dental",
      projectType: "Clinic website",
      message: "We are opening a branch in Istanbul for patients from the Gulf.\nWe need an Arabic and English site with WhatsApp booking, live by March.",
      locale: "ar",
      leadId: "1b2c3d4e-5f60-4718-9a0b-c1d2e3f40516",
    }),
  );
  add("admin-contact-header", await buildAdminContactAlert({ formType: "header", email: "hello@clinic.com", locale: "en", leadId: null }));
  for (const locale of ["en", "ar"] as const) {
    add(
      `lead-contact-${locale}`,
      await buildContactConfirmationEmail({
        locale,
        name: locale === "ar" ? "عمر" : "Omar",
        message: "We are opening a branch in Istanbul for patients from the Gulf.\nWe need an Arabic and English site with WhatsApp booking, live by March.",
      }),
    );
  }

  const index: string[] = [];
  for (const { name, email } of files) {
    writeFileSync(path.join(outDir, `${name}.html`), email.html);
    writeFileSync(path.join(outDir, `${name}.txt`), `Subject: ${email.subject}\n\n${email.text}\n`);
    // Dark-mode simulation: the forced inversion Gmail/Outlook apps apply
    // (photos are left as they are, so they are inverted back).
    writeFileSync(
      path.join(outDir, `${name}.dark.html`),
      email.html.replace("</head>", "<style>html{background:#080808}body{filter:invert(1) hue-rotate(180deg)}img{filter:invert(1) hue-rotate(180deg)}</style></head>"),
    );
    index.push(`<li><a href="${name}.html">${name}</a> · <a href="${name}.txt">text</a> · <a href="${name}.dark.html">dark</a> — ${escapeHtml(email.subject)}</li>`);
  }
  writeFileSync(path.join(outDir, "index.html"), `<!doctype html><meta charset="utf-8"><title>Email preview</title><ul>${index.join("")}</ul>`);
  console.log(`Rendered ${files.length} emails to ${outDir}`);

  if (shots) {
    const shotDir = path.join(outDir, "shots");
    mkdirSync(shotDir, { recursive: true });
    const browser = await openFirefox(path.join(outDir, ".ff-profile"));
    try {
      for (const { name } of files) {
        for (const [suffix, width, file] of [
          ["desktop", 680, `${name}.html`],
          ["mobile", 390, `${name}.html`],
          ["dark", 680, `${name}.dark.html`],
        ] as const) {
          const png = await browser.shot(pathToFileURL(path.join(outDir, file)).href, width);
          writeFileSync(path.join(shotDir, `${name}-${suffix}.png`), png);
        }
        console.log("shot", name);
      }
    } finally {
      browser.close();
    }
    rmSync(path.join(outDir, ".ff-profile"), { recursive: true, force: true });
  }
}

/** Headless Firefox over WebDriver BiDi (as in scripts/playbook-pdf/print.ts), full-page screenshots. */
async function openFirefox(profileDir: string, port = 9581) {
  rmSync(profileDir, { recursive: true, force: true });
  mkdirSync(profileDir, { recursive: true });
  const proc = spawn(FIREFOX, ["--headless", "--no-remote", "--profile", profileDir, `--remote-debugging-port=${port}`, "about:blank"], { stdio: "ignore" });
  let ws: WebSocket | undefined;
  for (let i = 0; i < 100 && !ws; i++) {
    try {
      const s = new WebSocket(`ws://127.0.0.1:${port}/session`);
      await new Promise((res, rej) => {
        s.onopen = res;
        s.onerror = rej;
      });
      ws = s;
    } catch {
      await new Promise((r) => setTimeout(r, 300));
    }
  }
  if (!ws) {
    proc.kill();
    throw new Error("Firefox BiDi did not open");
  }
  const sock = ws;
  let id = 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pending = new Map<number, (m: any) => void>();
  sock.onmessage = (e) => {
    const m = JSON.parse(String(e.data));
    if (m.id && pending.has(m.id)) {
      pending.get(m.id)!(m);
      pending.delete(m.id);
    }
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const send = (method: string, params: object = {}): Promise<any> =>
    new Promise((r) => {
      const i = ++id;
      pending.set(i, r);
      sock.send(JSON.stringify({ id: i, method, params }));
    });
  await send("session.new", { capabilities: {} });
  const tree = await send("browsingContext.getTree", {});
  const context = tree.result.contexts[0].context as string;
  return {
    async shot(url: string, width: number): Promise<Buffer> {
      await send("browsingContext.setViewport", { context, viewport: { width, height: 900 } });
      await send("browsingContext.navigate", { context, url, wait: "complete" });
      const r = await send("browsingContext.captureScreenshot", { context, origin: "document" });
      if (r.type === "error") throw new Error(`captureScreenshot: ${r.error} ${r.message ?? ""}`);
      return Buffer.from(r.result.data, "base64");
    },
    close() {
      try {
        sock.close();
      } catch {
        // ignore
      }
      proc.kill();
    },
  };
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
