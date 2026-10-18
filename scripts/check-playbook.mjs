// Structural check for src/data/playbook/{en,ar,fr,tr}.ts.
// Run: node scripts/check-playbook.mjs
// Transpiles each locale with esbuild (type import of @/lib/audit is erased),
// then verifies that every locale has the same chapter ids, template ids and
// item counts as EN, and prints word counts.
import { build } from "esbuild";
import { readFileSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const LOCALES = process.argv.length > 2 ? ["en", ...process.argv.slice(2).filter((l) => l !== "en")] : ["en", "ar", "fr", "tr"];
const QUESTION_IDS = ["languages", "journey", "whatsapp", "speed", "treatments", "credentials", "gallery", "booking", "tracking", "feedback"];
const root = new URL("..", import.meta.url).pathname;
const out = mkdtempSync(join(tmpdir(), "playbook-"));

async function load(locale) {
  const r = await build({
    entryPoints: [join(root, `src/data/playbook/${locale}.ts`)],
    bundle: false,
    format: "esm",
    write: false,
    platform: "node",
  });
  const file = join(out, `${locale}.mjs`);
  writeFileSync(file, r.outputFiles[0].text.replace(/from\s+["']\.\/types["'];?/g, ""));
  return (await import(pathToFileURL(file).href)).PLAYBOOK;
}

function words(v) {
  if (typeof v === "string") return v.split(/\s+/).filter(Boolean).length;
  if (Array.isArray(v)) return v.reduce((n, x) => n + words(x), 0);
  if (v && typeof v === "object") return Object.values(v).reduce((n, x) => n + words(x), 0);
  return 0;
}

function shape(p) {
  return {
    chapters: p.chapters.map((c) => ({
      id: c.id,
      steps: c.steps.length,
      checklist: c.checklist.length,
      templates: c.templates.map((t) => `${t.id}:${t.kind}`),
      mistakes: c.mistakes.length,
      why: c.why.length,
    })),
    quickWins: p.quickWins.length,
    summary: p.summary.length,
  };
}

const books = {};
for (const l of LOCALES) books[l] = await load(l);

const ref = JSON.stringify(shape(books.en));
let ok = true;
const refShape = shape(books.en);
if (refShape.chapters.map((c) => c.id).join() !== QUESTION_IDS.join()) {
  ok = false;
  console.error("EN chapter ids do not match QUESTION_IDS");
}
for (const l of LOCALES) {
  const p = books[l];
  const s = JSON.stringify(shape(p));
  if (s !== ref) {
    ok = false;
    console.error(`${l}: structure differs from en`);
    console.error(JSON.stringify(shape(p), null, 1));
  }
  for (const c of p.chapters) {
    if (c.steps.length < 5 || c.steps.length > 8) { ok = false; console.error(`${l}/${c.id}: steps ${c.steps.length} not in 5..8`); }
    if (c.checklist.length < 6 || c.checklist.length > 10) { ok = false; console.error(`${l}/${c.id}: checklist ${c.checklist.length} not in 6..10`); }
    if (c.mistakes.length < 3 || c.mistakes.length > 5) { ok = false; console.error(`${l}/${c.id}: mistakes ${c.mistakes.length} not in 3..5`); }
    if (c.why.length < 2 || c.why.length > 3) { ok = false; console.error(`${l}/${c.id}: why ${c.why.length} not in 2..3`); }
    for (const t of c.templates) if (!t.body.trim()) { ok = false; console.error(`${l}/${c.id}/${t.id}: empty body`); }
    for (const k of ["title", "promise", "done"]) if (!c[k]) { ok = false; console.error(`${l}/${c.id}: missing ${k}`); }
  }
  if (p.quickWins.length !== 10 || p.summary.length !== 10) { ok = false; console.error(`${l}: quickWins/summary must be 10 lines`); }
  if (/—/.test(JSON.stringify(p))) { ok = false; console.error(`${l}: contains an em dash`); }
  console.log(`${l}: ${words(p)} words, ${p.chapters.length} chapters, ${p.chapters.reduce((n, c) => n + c.templates.length, 0)} templates`);
}
console.log(ok ? "OK: all locales share the same structure" : "FAILED");
process.exit(ok ? 0 : 1);
