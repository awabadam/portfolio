// Generates one HyperFrames composition per project from template.html, renders
// it, and encodes web-sized WebM + MP4 into the portfolio's public/video/projects.
//
//   node build.mjs              # all projects
//   node build.mjs jouvence     # just one
//
// Chrome: set HYPERFRAMES_BROWSER_PATH (e.g. a Nix chromium) or pass --docker.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const PROJECTS = [
  { id: "jouvence", name: "Jouvence", url: "jouvencetr.com", accent: "#c9a96e" },
  { id: "saphiredent", name: "SaphireDent", url: "saphiredent.com", accent: "#2f7de1" },
  { id: "esteexpert", name: "EsteExpert Clinic", url: "esteexpert.clinic", accent: "#b8946a" },
  { id: "omar-marketing", name: "Omar Marketing", url: "omar.marketing", accent: "#ff6a3d" },
  { id: "gymtrack", name: "GymTrack", url: "gym.awab.design", accent: "#7cdc5a" },
  { id: "quran-app", name: "Quran App", url: "quran.awab.design", accent: "#3fb39a" },
];

// Must match template.html geometry.
const WIN = { w: 1040, h: 616 };
const PHONE = { w: 230, h: 500 };

const here = path.dirname(new URL(import.meta.url).pathname);
const outDir = path.resolve(here, "../public/video/projects");
const docker = process.argv.includes("--docker");
const only = process.argv.slice(2).filter((a) => !a.startsWith("--"));

// Aspect ratio (height / width) of an image, via ffprobe.
const height = (file) => {
  const [w, h] = execFileSync("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=p=0", file])
    .toString().trim().split(",").map(Number);
  return h / w;
};

const template = fs.readFileSync(path.join(here, "template.html"), "utf8");
fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(path.join(here, "renders"), { recursive: true });

for (const p of PROJECTS.filter((p) => !only.length || only.includes(p.id))) {
  const desk = path.join(here, `shots/${p.id}-desktop.webp`);
  const phone = path.join(here, `shots/${p.id}-phone.webp`);
  const hasPhones = fs.existsSync(phone);

  // Max scroll = rendered image height minus the visible screen height.
  const dMax = Math.max(0, height(desk) * WIN.w - WIN.h);
  const pMax = hasPhones ? Math.max(0, height(phone) * PHONE.w - PHONE.h) : 0;
  const r = (n) => Math.round(n);
  const scroll = {
    a: r(dMax * 0.35),
    b: r(dMax * 0.62),
    c: r(dMax * 0.85),
    p1: r(pMax * 0.45),
    p2a: r(pMax * 0.25),
    p2b: r(pMax * 0.7),
  };

  const source = hasPhones ? template : template.replace(/\s*<!--phones-->[\s\S]*?<!--\/phones-->/, "");
  const html = source
    .replaceAll("{{NAME}}", p.name)
    .replaceAll("{{ID}}", p.id)
    .replaceAll("{{PHONE}}", p.id)
    .replaceAll("{{URL}}", p.url)
    .replaceAll("{{ACCENT}}", p.accent)
    .replaceAll("{{HAS_PHONES}}", String(hasPhones))
    .replaceAll("{{SCROLL}}", JSON.stringify(scroll));
  const comp = `${p.id}.html`;
  fs.writeFileSync(path.join(here, comp), html);

  const master = path.join(here, `renders/${p.id}.mp4`);
  console.log(`\n▶ ${p.id} (phones: ${hasPhones})`);
  execFileSync("npx", ["hyperframes", "render", here, "-c", comp, "-o", master, "--quality", "looks", "--fps", "30", ...(docker ? ["--docker"] : [])], { stdio: "inherit" });

  // Web encodes: VP9 WebM for modern browsers, H.264 MP4 fallback for Safari.
  const vf = "scale=1280:800:flags=lanczos,format=yuv420p";
  execFileSync("ffmpeg", ["-y", "-hide_banner", "-loglevel", "error", "-i", master, "-an", "-vf", vf, "-c:v", "libvpx-vp9", "-b:v", "0", "-crf", "40", "-row-mt", "1", "-deadline", "good", "-cpu-used", "2", path.join(outDir, `${p.id}.webm`)], { stdio: "inherit" });
  execFileSync("ffmpeg", ["-y", "-hide_banner", "-loglevel", "error", "-i", master, "-an", "-vf", vf, "-c:v", "libx264", "-preset", "slow", "-crf", "30", "-profile:v", "high", "-movflags", "+faststart", path.join(outDir, `${p.id}.mp4`)], { stdio: "inherit" });
  // Poster = first fully visible frame of the scroll.
  execFileSync("ffmpeg", ["-y", "-hide_banner", "-loglevel", "error", "-ss", "1.4", "-i", master, "-frames:v", "1", "-vf", "scale=1280:800", "-quality", "80", path.join(outDir, `${p.id}-poster.webp`)], { stdio: "inherit" });
}
