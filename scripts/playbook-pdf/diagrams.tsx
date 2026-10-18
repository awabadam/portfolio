/**
 * Inline SVG diagrams in the document's line style. Both flip for RTL.
 */
import type { Chapter, Playbook } from "@/data/playbook/types";
import type { PdfLabels } from "./labels";

const pad2 = (n: number) => String(n).padStart(2, "0");

/** Chapter ids that close a gap at each node of the inquiry path. */
const PATH_CHAPTERS: string[][] = [
  ["speed", "tracking"],
  ["languages", "treatments", "journey", "credentials", "gallery"],
  ["whatsapp", "booking"],
  ["tracking"],
  ["whatsapp", "booking", "feedback"],
];

function wrap(text: string, max: number) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > max && cur) {
      lines.push(cur);
      cur = w;
    } else cur = (cur + " " + w).trim();
  }
  if (cur) lines.push(cur);
  return lines;
}

export function InquiryPath({ playbook, labels, rtl }: { playbook: Playbook; labels: PdfLabels; rtl: boolean }) {
  const W = 660;
  const H = 214;
  const n = 5;
  const gap = 22;
  const w = (W - gap * (n - 1)) / n;
  const boxH = 112;
  const num = (id: string) => playbook.chapters.findIndex((c) => c.id === id) + 1;
  const xOf = (i: number) => {
    const x = i * (w + gap);
    return rtl ? W - x - w : x;
  };
  return (
    <svg className="diagram" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={labels.pathHeading}>
      <defs>
        <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,1 L9,5 L0,9" fill="none" stroke="#0a0a0a" strokeWidth="1.4" />
        </marker>
      </defs>
      {labels.pathNodes.map((label, i) => {
        const x = xOf(i);
        const dark = i === 2;
        const lines = wrap(label, 13);
        const chs = PATH_CHAPTERS[i].map(num).filter((k) => k > 0).sort((a, b) => a - b);
        return (
          <g key={i}>
            <rect x={x + 0.5} y={0.5} width={w - 1} height={boxH} rx={10} fill={dark ? "#0a0a0a" : "#fff"} stroke="#0a0a0a" strokeWidth={dark ? 0 : 1} />
            <text x={rtl ? x + w - 12 : x + 12} y={22} className="d-mono" fill={dark ? "#9a9a9a" : "#8a8a8a"} textAnchor={rtl ? "end" : "start"}>
              {pad2(i + 1)}
            </text>
            {lines.map((l, k) => (
              <text key={k} x={rtl ? x + w - 12 : x + 12} y={boxH - 14 - (lines.length - 1 - k) * 17} className="d-label" fill={dark ? "#fff" : "#0a0a0a"} textAnchor={rtl ? "end" : "start"}>
                {l}
              </text>
            ))}
            {i < n - 1 && (
              <line
                x1={rtl ? x - 3 : x + w + 3}
                x2={rtl ? x - gap + 4 : x + w + gap - 4}
                y1={boxH / 2}
                y2={boxH / 2}
                stroke="#0a0a0a"
                strokeWidth="1.2"
                markerEnd="url(#arr)"
              />
            )}
            <line x1={x + w / 2} x2={x + w / 2} y1={boxH + 1} y2={boxH + 22} stroke="#c8c8c8" strokeWidth="1" strokeDasharray="2 3" />
            {chs.map((c, k) => {
              const cols = 3;
              const cw = 32;
              const row = Math.floor(k / cols);
              const col = k % cols;
              const rowCount = Math.min(cols, chs.length - row * cols);
              const startX = x + w / 2 - (rowCount * cw - 4) / 2;
              const cx = rtl ? startX + (rowCount - 1 - col) * cw : startX + col * cw;
              return (
                <g key={c}>
                  <rect x={cx} y={boxH + 26 + row * 26} width={cw - 4} height={20} rx={10} fill="#f2f2f1" />
                  <text x={cx + (cw - 4) / 2} y={boxH + 40 + row * 26} className="d-chip" textAnchor="middle" fill="#0a0a0a">
                    {pad2(c)}
                  </text>
                </g>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}

export interface Week {
  label: string;
  name: string;
  chapters: number[];
  items: string[];
}

/**
 * Reads the weeks from the "plan-30-days" template: a heading line like
 * "Week 1: Capture (chapters 3 and 8)" followed by "- " bullets.
 */
export function parsePlan(playbook: Playbook): { weeks: Week[]; plan?: Chapter["templates"][number] } {
  const plan = playbook.chapters.flatMap((c) => c.templates).find((t) => t.id === "plan-30-days");
  if (!plan) return { weeks: [] };
  const weeks: Week[] = [];
  for (const block of plan.body.split(/\n\s*\n/)) {
    const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
    const m = lines[0]?.match(/^(.*?\d+)\s*[:：]\s*(.+?)\s*[(（]([^)）]*)[)）]\s*$/);
    if (!m) continue;
    const chapters = (m[3].match(/\d+/g) ?? []).map(Number).filter((k) => k >= 1 && k <= playbook.chapters.length);
    weeks.push({ label: m[1], name: m[2], chapters, items: lines.slice(1).filter((l) => /^-\s/.test(l)).map((l) => l.replace(/^-\s+/, "")) });
  }
  return { weeks, plan };
}

export function Timeline({ weeks, playbook, labels, rtl }: { weeks: Week[]; playbook: Playbook; labels: PdfLabels; rtl: boolean }) {
  if (!weeks.length) return null;
  const W = 660;
  const seg = W / weeks.length;
  return (
    <div className="timeline">
      <svg className="diagram" viewBox={`0 0 ${W} 34`} aria-hidden="true">
        {weeks.map((_, i) => {
          const x = rtl ? W - (i + 1) * seg : i * seg;
          return (
            <g key={i}>
              <rect x={x + 1} y={12} width={seg - 6} height={10} rx={5} fill={i === 0 ? "#0a0a0a" : "#fff"} stroke="#0a0a0a" strokeWidth={i === 0 ? 0 : 1} />
              <circle cx={rtl ? x + seg - 6 : x + 6} cy={17} r={2} fill={i === 0 ? "#fff" : "#0a0a0a"} />
            </g>
          );
        })}
      </svg>
      <div className="tl-cols" style={{ gridTemplateColumns: `repeat(${weeks.length}, 1fr)` }}>
        {weeks.map((wk, i) => (
          <div key={i} className="tl-col">
            <p className="eyebrow">{wk.label}</p>
            <p className="tl-name">{wk.name}</p>
            <ul className="tl-chs">
              {wk.chapters.map((c) => (
                <li key={c}>
                  <span className="mono">{pad2(c)}</span>
                  <span>{playbook.chapters[c - 1].title}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="tl-note">{labels.timelineText}</p>
    </div>
  );
}
