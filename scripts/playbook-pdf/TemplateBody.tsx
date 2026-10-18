/**
 * Renders Template.body (plain text with light markdown) for print. Every
 * character of the source is kept; only "- " bullet markers and table pipes
 * become layout.
 */
import type { ReactNode } from "react";
import type { Template } from "@/data/playbook/types";
import type { PdfLabels } from "./labels";

/** Highlights [placeholders] and ___ blanks so they read as "fill this in". */
export function Inline({ text }: { text: string }) {
  const parts = text.split(/(\[[^\]]+\]|_{3,})/g);
  return (
    <>
      {parts.map((p, i) =>
        /^\[[^\]]+\]$|^_{3,}$/.test(p) ? (
          <span key={i} className="ph">
            {p}
          </span>
        ) : (
          p
        ),
      )}
    </>
  );
}

const isUrl = (l: string) => /^https?:\/\/\S+$/.test(l.trim());
const blocksOf = (body: string) =>
  body
    .split(/\n\s*\n/)
    .map((b) =>
      b
        .split("\n")
        .map((l) => l.trimEnd())
        .filter((l) => l.trim() !== ""),
    )
    .filter((b) => b.length);

function isHeading(block: string[]) {
  const l = block[0].trim();
  if (/^-\s/.test(l) || /^["[]/.test(l) || isUrl(l)) return false;
  if (/:$/.test(l) && l.length < 70) return true;
  if (block.length < 2) return false;
  // "Week 1: Capture (chapters 3 and 8)" followed only by bullets.
  if (l.length < 80 && block.slice(1).every((x) => /^\s*-\s/.test(x)))
    return true;
  if (l.length > 64 || /[.!?;"]$/.test(l)) return false;
  if (/^[^"]{1,40}:\s/.test(l) || /\s=\s/.test(l)) return false;
  return true;
}

function Line({ line }: { line: string }) {
  const l = line.trim();
  let m: RegExpMatchArray | null;
  if ((m = l.match(/^-\s+(.*)$/))) {
    return (
      <li className="tb-bullet">
        <Inline text={m[1]} />
      </li>
    );
  }
  if ((m = l.match(/^(\d+)\.\s+(.*)$/))) {
    return (
      <li className="tb-num">
        <span className="tb-n">{m[1]}.</span>
        <span>
          <Inline text={m[2]} />
        </span>
      </li>
    );
  }
  if (isUrl(l)) return <p className="tb-url">{l}</p>;
  if ((m = l.match(/^(\w+)\s+=\s+(.*)$/))) {
    return (
      <p className="tb-kv tb-kv-code">
        <code>{m[1]}</code>
        <span>
          = <Inline text={m[2]} />
        </span>
      </p>
    );
  }
  if (/^\S.*\s\|\s.*\S$/.test(l)) return <p className="tb-code">{l}</p>;
  if (/^"/.test(l)) {
    return (
      <p className="tb-quote">
        <Inline text={l} />
      </p>
    );
  }
  if (/^\[.*\]$/.test(l)) {
    return (
      <p className="tb-instr">
        <Inline text={l} />
      </p>
    );
  }
  if ((m = l.match(/^([^"[]{1,40}?):\s+(.*)$/))) {
    return (
      <p className="tb-kv">
        <strong>{m[1]}:</strong> <Inline text={m[2]} />
      </p>
    );
  }
  return (
    <p>
      <Inline text={l} />
    </p>
  );
}

/** Groups consecutive list lines into <ul>/<ol> so markup stays valid. */
function Lines({ lines }: { lines: string[] }) {
  const out: ReactNode[] = [];
  let i = 0;
  while (i < lines.length) {
    const kind = /^\s*-\s/.test(lines[i])
      ? "ul"
      : /^\s*\d+\.\s/.test(lines[i])
        ? "ol"
        : null;
    if (!kind) {
      out.push(<Line key={i} line={lines[i]} />);
      i++;
      continue;
    }
    const group: string[] = [];
    const re = kind === "ul" ? /^\s*-\s/ : /^\s*\d+\.\s/;
    while (i < lines.length && re.test(lines[i])) group.push(lines[i++]);
    const items = group.map((g, k) => <Line key={k} line={g} />);
    out.push(
      kind === "ul" ? (
        <ul key={`g${i}`} className="tb-list">
          {items}
        </ul>
      ) : (
        <ol key={`g${i}`} className="tb-list tb-ol">
          {items}
        </ol>
      ),
    );
  }
  return <>{out}</>;
}

/** Wraps the card head and the first piece of the body so they never part across a page break. */
function First({ head, children }: { head?: ReactNode; children: ReactNode }) {
  if (!head) return <>{children}</>;
  return (
    <div className="tb-first">
      {head}
      {children}
    </div>
  );
}

function TextBody({ body, head }: { body: string; head?: ReactNode }) {
  const blocks = blocksOf(body).map((block, i) => {
    const h = isHeading(block);
    return (
      <div key={i} className={`tb-block${block.length <= 6 ? " tb-keep" : ""}`}>
        {h && <p className="tb-h">{block[0].trim()}</p>}
        <Lines lines={h ? block.slice(1) : block} />
      </div>
    );
  });
  return (
    <div className="tb">
      <First head={head}>{blocks.slice(0, 1)}</First>
      {blocks.slice(1)}
    </div>
  );
}

function MessageBody({ body, head }: { body: string; head?: ReactNode }) {
  const msgs = blocksOf(body).map((block, i) => {
    let label: string | null = null;
    let lines = block;
    const m = block[0].match(/^(.{1,60}?):\s*(.*)$/);
    if (m && !/^https?$/.test(m[1])) {
      label = m[1] + ":";
      lines = m[2] ? [m[2], ...block.slice(1)] : block.slice(1);
    }
    return (
      <div key={i} className="msg">
        {label && <p className="msg-label">{label}</p>}
        <div className="msg-bubble">
          {lines.map((l, k) =>
            isUrl(l) ? (
              <p key={k} className="tb-url">
                {l}
              </p>
            ) : (
              <p key={k}>
                <Inline text={l} />
              </p>
            ),
          )}
        </div>
      </div>
    );
  });
  return (
    <div className="msgs">
      <First head={head}>{msgs.slice(0, 1)}</First>
      {msgs.slice(1)}
    </div>
  );
}

function parsePipeTable(body: string) {
  const rows = body
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.startsWith("|") && !/^\|[\s|:-]+\|$/.test(l))
    .map((l) =>
      l
        .replace(/^\|/, "")
        .replace(/\|$/, "")
        .split("|")
        .map((c) => c.trim()),
    );
  return { head: rows[0], rows: rows.slice(1) };
}

function TableBody({ body, cardHead }: { body: string; cardHead?: ReactNode }) {
  const { head, rows } = parsePipeTable(body);
  return (
    <First head={cardHead}>
      <table className={`tb-table cols-${head.length}`}>
        <thead>
          <tr>
            {head.map((h, i) => (
              <th key={i}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, k) => (
                <td key={k}>
                  <Inline text={c} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </First>
  );
}

/** CSV is wide (13 columns), so it reads as column -> example rows, then the raw lines to paste. */
function CsvBody({
  body,
  labels,
  head: cardHead,
}: {
  body: string;
  labels: PdfLabels;
  head?: ReactNode;
}) {
  const lines = body.split("\n").filter((l) => l.trim());
  const head = lines[0].split(",");
  const rows = lines.slice(1).map((l) => l.split(","));
  // Paged.js will not split this table, so it is printed as stacked row chunks that read as one
  // table. The first chunk stays with the card head; later chunks may move to the next page.
  const chunks: number[][] = [];
  for (let k = 0; k < head.length; k += k === 0 ? 6 : 4) {
    chunks.push(head.map((_, j) => j).slice(k, k + (k === 0 ? 6 : 4)));
  }
  const table = (keys: number[], n: number) => (
    <table
      key={n}
      className={["tb-table tb-csv", n > 0 && "tb-cont", n < chunks.length - 1 && "tb-open"]
        .filter(Boolean)
        .join(" ")}
    >
      <colgroup>
        <col className="tb-csv-key" />
        {rows.map((_, i) => (
          <col key={i} />
        ))}
      </colgroup>
      {n === 0 && (
        <thead>
          <tr>
            <th>{labels.csvColumn}</th>
            {rows.map((_, i) => (
              <th key={i}>
                {labels.csvExample} {i + 1}
              </th>
            ))}
          </tr>
        </thead>
      )}
      <tbody>
        {keys.map((k) => (
          <tr key={k}>
            <td>
              <code>{head[k]}</code>
            </td>
            {rows.map((r, i) => (
              <td key={i}>{r[k] ?? ""}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
  return (
    <>
      <First head={cardHead}>{table(chunks[0], 0)}</First>
      {chunks.slice(1).map((keys, n) => table(keys, n + 1))}
      <div className="tb-raw">
        <p className="tb-raw-label">{labels.csvRaw}</p>
        {lines.map((l, i) => (
          <p key={i}>{l}</p>
        ))}
      </div>
    </>
  );
}

/** `head` (the card header) is rendered glued to the first block of the body. */
export function TemplateBody({
  t,
  labels,
  head,
}: {
  t: Template;
  labels: PdfLabels;
  head?: ReactNode;
}) {
  switch (t.kind) {
    case "table":
      return <TableBody body={t.body} cardHead={head} />;
    case "csv":
      return <CsvBody body={t.body} labels={labels} head={head} />;
    case "message":
      return <MessageBody body={t.body} head={head} />;
    default:
      return <TextBody body={t.body} head={head} />;
  }
}
