/**
 * Photos and client screenshots used in the PDF, and the sharp step that turns
 * them into print-sized JPEG copies in the build dir (public/ is never touched).
 */
import { existsSync, mkdirSync, statSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(__dirname, "../..");
const STOCK = path.join(ROOT, "public/img/stock");
const PROJECTS = path.join(ROOT, "public/img/projects");

export interface Photo {
  file: string;
  /** CSS object-position for the crop. */
  focus?: string;
  /** Long edge of the print copy in px (default 1800). */
  longEdge?: number;
}

/** One photo per page that needs one; no repeats. Keyed by chapter id. */
export const PHOTOS = {
  cover: { file: "dental-cover.webp", focus: "50% 45%", longEdge: 2600 },
  how: { file: "clinic-interior-alt.webp", focus: "50% 55%" },
  closing: { file: "istanbul-bosphorus.webp", focus: "50% 70%" },
  quickWins: { file: "workspace.webp", focus: "50% 72%" },
  chapters: {
    languages: { file: "istanbul-galata.webp", focus: "50% 40%" },
    journey: { file: "traveler.webp", focus: "50% 55%" },
    whatsapp: { file: "phone-message.webp", focus: "50% 50%" },
    speed: { file: "phone-message-alt.webp", focus: "50% 45%" },
    treatments: { file: "dentist-scan.webp", focus: "50% 40%" },
    credentials: { file: "consultation-alt.webp", focus: "30% 35%" },
    gallery: { file: "smile-aesthetic-alt.webp", focus: "60% 45%" },
    booking: { file: "consultation.webp", focus: "50% 45%" },
    tracking: { file: "analytics.webp", focus: "50% 40%" },
    feedback: { file: "smile-aesthetic.webp", focus: "50% 55%" },
  } as Record<string, Photo>,
} satisfies Record<string, unknown>;

export interface Callout {
  /** Position in percent of the image box, from its physical left and top edge (screenshots never mirror). */
  x: number;
  y: number;
}

export interface Shot {
  src: string; // relative to public/img/projects
  crop?: { left: number; top: number; width: number; height: number };
  callouts: Callout[];
}

export interface Example {
  id: string; // key into labels.examples
  shots: Shot[];
}

/**
 * Client screenshots (2400x1500 desktop captures). Callout coordinates were
 * read off the images; numbers match labels.examples[id].callouts in order,
 * counted across the shots of one example.
 */
export const EXAMPLES: Record<string, Example[]> = {
  languages: [
    {
      id: "lang-pair",
      shots: [
        { src: "esteexpert/home.webp", callouts: [] },
        {
          src: "esteexpert/rtl.webp",
          callouts: [
            { x: 96.6, y: 5.4 },
            { x: 97.4, y: 33 },
            { x: 97.4, y: 62.5 },
            { x: 10.6, y: 93.8 },
          ],
        },
      ],
    },
    {
      id: "lang-switch",
      shots: [
        {
          src: "jouvence/home.webp",
          crop: { left: 1250, top: 0, width: 1150, height: 160 },
          callouts: [{ x: 73.4, y: 50 }],
        },
      ],
    },
  ],
  whatsapp: [
    {
      id: "wa-home",
      shots: [
        {
          src: "jouvence/home.webp",
          callouts: [
            { x: 38.6, y: 70.1 },
            { x: 94.8, y: 85.6 },
          ],
        },
      ],
    },
  ],
  treatments: [
    {
      id: "treat-saph",
      shots: [
        {
          src: "saphiredent/treatment.webp",
          callouts: [
            { x: 43, y: 12.6 },
            { x: 4, y: 65 },
            { x: 4, y: 86 },
          ],
        },
      ],
    },
    {
      id: "treat-este",
      shots: [
        {
          src: "esteexpert/treatment.webp",
          callouts: [
            { x: 3.3, y: 15.3 },
            { x: 3.3, y: 36.3 },
            { x: 3.3, y: 60.8 },
            { x: 90.6, y: 93.8 },
          ],
        },
      ],
    },
  ],
};

export const shotKey = (s: Shot) =>
  s.src.replace(/\.webp$/, "").replace(/\//g, "-") + (s.crop ? `-crop${s.crop.left}x${s.crop.top}` : "");

async function toJpeg(src: string, dest: string, longEdge: number, quality: number, crop?: Shot["crop"]) {
  if (existsSync(dest) && statSync(dest).mtimeMs > statSync(src).mtimeMs) return;
  let img = sharp(src);
  if (crop) img = img.extract(crop);
  await img
    .resize({ width: longEdge, height: longEdge, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality, mozjpeg: true })
    .toFile(dest);
}

/** Writes print copies into <out>/assets and returns a map name -> relative URL. */
export async function prepareAssets(out: string) {
  const dir = path.join(out, "assets");
  mkdirSync(dir, { recursive: true });
  const urls: Record<string, string> = {};
  const photos: Photo[] = [PHOTOS.cover, PHOTOS.how, PHOTOS.closing, PHOTOS.quickWins, ...Object.values(PHOTOS.chapters)];
  await Promise.all(
    photos.map(async (p) => {
      const name = p.file.replace(/\.webp$/, ".jpg");
      await toJpeg(path.join(STOCK, p.file), path.join(dir, name), p.longEdge ?? 1800, 82);
      urls[p.file] = `assets/${name}`;
    }),
  );
  const shots = Object.values(EXAMPLES).flat().flatMap((e) => e.shots);
  await Promise.all(
    shots.map(async (s) => {
      const name = shotKey(s) + ".jpg";
      await toJpeg(path.join(PROJECTS, s.src), path.join(dir, name), s.crop ? 1400 : 1800, 86, s.crop);
      urls[shotKey(s)] = `assets/${name}`;
    }),
  );
  return urls;
}
