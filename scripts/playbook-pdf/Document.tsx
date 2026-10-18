/**
 * The playbook as one HTML document for Paged.js. Every reader-facing sentence
 * comes from src/data/playbook/{locale}.ts, the reader labels in
 * src/messages/{locale}.json, or the PDF labels in ./labels.ts.
 */
import type React from "react";
import type { Chapter, Playbook } from "@/data/playbook/types";
import { EXAMPLES, PHOTOS, shotKey, type Example, type Photo } from "./assets";
import { InquiryPath, parsePlan, type Week } from "./diagrams";
import type { PdfLabels } from "./labels";
import { Inline, TemplateBody } from "./TemplateBody";

export interface ReaderLabels {
  contents: string;
  promiseLabel: string;
  whyLabel: string;
  stepsLabel: string;
  checklistLabel: string;
  templatesLabel: string;
  mistakesLabel: string;
  doneLabel: string;
  quickWinsEyebrow: string;
  quickWinsHeading: string;
  summaryEyebrow: string;
  summaryHeading: string;
  minutesTotal: string;
}

export interface Contact {
  email: string;
  whatsappDigits: string;
  whatsappDisplay: string;
  web: string;
  calUrl: string;
}

export interface DocProps {
  playbook: Playbook;
  labels: PdfLabels;
  reader: ReaderLabels;
  chapterLabel: string; // "Chapter {n}"
  minutesLabel: string; // "{n} min"
  urls: Record<string, string>;
  contact: Contact;
  rtl: boolean;
  /** Page of each template in the Template Pack PDF, by template id (from its print pass). */
  packPages?: Record<string, number>;
  /** Per-chapter layout tuning chosen by build.tsx from earlier print passes. */
  tuning?: Record<string, ChapterTuning>;
}

/**
 * sp scales a chapter's vertical spacing; defer moves its examples below the checklist;
 * wide gives each screenshot of a side-by-side pair its own, larger row.
 */
export interface ChapterTuning {
  sp: number;
  defer: boolean;
  wide: boolean;
}

const pad2 = (n: number) => String(n).padStart(2, "0");
const fill = (s: string, n: number | string) => s.replace(/\{n\}/g, String(n));

function Img({
  photo,
  urls,
  className,
}: {
  photo: Photo;
  urls: Record<string, string>;
  className?: string;
}) {
  return (
    <img
      className={className}
      src={urls[photo.file]}
      alt=""
      style={{ objectPosition: photo.focus ?? "50% 50%" }}
    />
  );
}

/** Sets the running-header label for the pages that follow. */
const Run = ({ text }: { text: string }) => <span className="run">{text}</span>;

function Brand({ light }: { light?: boolean }) {
  return <span className={`brand${light ? " brand-light" : ""}`}>AWAB.</span>;
}

function Cover({ playbook, labels, urls, minutesLabel, contact }: DocProps) {
  return (
    <section className="cover">
      <Img photo={PHOTOS.cover} urls={urls} className="cover-bg" />
      <div className="cover-scrim" />
      <div className="cover-top">
        <Brand light />
        <span className="mono">{contact.web}</span>
      </div>
      <div className="cover-body">
        <p className="eyebrow eyebrow-light">{labels.coverEyebrow}</p>
        <h1 className="display cover-title">{playbook.title}</h1>
        <p className="cover-sub">{playbook.subtitle}</p>
        <div className="tiles">
          {playbook.chapters.map((c, i) => (
            <div key={c.id} className={`tile${i === 0 ? " tile-solid" : ""}`}>
              <span className="mono">{pad2(i + 1)}</span>
              <span className="mono tile-min">
                {fill(minutesLabel, c.minutes)}
              </span>
            </div>
          ))}
        </div>
        <div className="cover-meta">
          {(
            [
              [labels.preparedFor, labels.preparedForValue],
              [labels.by, labels.byValue],
              [labels.edition, labels.editionValue],
              [labels.web, contact.web],
            ] as const
          ).map(([k, v]) => (
            <div key={k}>
              <p className="eyebrow eyebrow-light">{k}</p>
              <p>{v}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * How to use and contents, on one page. The week-by-week timeline
 * is left out here: the printable 30-day checklist at the back carries the same weeks.
 */
function Front(props: DocProps & { tplCount: number }) {
  const { playbook, labels, minutesLabel, tplCount } = props;
  const minutes = playbook.chapters.reduce((s, c) => s + c.minutes, 0);
  const days = (playbook.title.match(/\d+/) ?? ["30"])[0];
  const stats: [string | number, string][] = [
    [playbook.chapters.length, labels.statChapters],
    [tplCount, labels.statTemplates],
    [days, labels.statDays],
    [minutes, labels.statMinutes],
  ];
  const extra = [
    { id: "start-here", title: labels.startHeading },
    { id: "checklist-30", title: labels.printableHeading },
  ];
  return (
    <section className="page-section front">
      <Run text={labels.howEyebrow} />
      <p className="eyebrow">{labels.howEyebrow}</p>
      <h1 className="display h-front">{labels.howHeading}</h1>
      <div className="front-top">
        <p className="front-lede">{playbook.intro}</p>
        <div className="stats stats-4">
          {stats.map(([n, cap], i) => (
            <div key={i} className="stat">
              <p className="stat-n">{n}</p>
              <p className="stat-cap">{cap}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="front-block" id="contents">
        <SecHead title={labels.contentsHeading} />
        <table className="ruled toc toc-compact">
          <tbody>
            {playbook.chapters.map((c, i) => (
              <tr key={c.id}>
                <td className="c-num mono">{pad2(i + 1)}</td>
                <td>
                  <a href={`#ch-${c.id}`} className="toc-title">
                    {c.title}
                  </a>
                </td>
                <td className="c-end mono muted">{fill(minutesLabel, c.minutes)}</td>
                <td className="c-end mono">
                  <a className="toc-page" href={`#ch-${c.id}`} />
                </td>
              </tr>
            ))}
            {extra.map((e) => (
              <tr key={e.id} className="toc-extra">
                <td className="c-num mono">·</td>
                <td>
                  <a href={`#${e.id}`} className="toc-title">
                    {e.title}
                  </a>
                </td>
                <td />
                <td className="c-end mono">
                  <a className="toc-page" href={`#${e.id}`} />
                </td>
              </tr>
            ))}
            <tr className="toc-extra">
              <td className="c-num mono">·</td>
              <td>
                <span className="toc-title">{labels.packRow}</span>
              </td>
              <td colSpan={2} className="c-end mono muted">
                {`T01–T${pad2(tplCount)} · ${labels.packRowNote}`}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}

/** Chapter start: a photo band with the title over it, then "In short" and the why, with the body flowing below. */
function ChapterHead({ chapter, index, props }: { chapter: Chapter; index: number; props: DocProps }) {
  const { labels, reader, urls, chapterLabel, minutesLabel } = props;
  const photo = PHOTOS.chapters[chapter.id];
  const label = fill(chapterLabel, pad2(index + 1));
  const rows: [string, string][] = [
    [reader.promiseLabel, chapter.promise],
    [labels.readingTime, fill(minutesLabel, chapter.minutes)],
  ];
  return (
    <div className="ch-head">
      <Run text={label} />
      <div className="ch-band">
        {photo && <Img photo={photo} urls={urls} />}
        <div className="ch-band-text">
          <p className="eyebrow eyebrow-light">{label}</p>
          <h1 className="display ch-title">{chapter.title}</h1>
        </div>
        <p className="ch-band-num">{pad2(index + 1)}</p>
      </div>
      <div className="ch-intro">
        <div className="in-short">
          <p className="eyebrow">{labels.inShort}</p>
          <dl>
            {rows.map(([k, v]) => (
              <div key={k} className="is-row">
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="op-why">
          <p className="eyebrow">{reader.whyLabel}</p>
          <p className="why-lede">{chapter.why[0]}</p>
          {chapter.why.slice(1).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

function ChapterDone({ chapter, index, reader }: { chapter: Chapter; index: number; reader: ReaderLabels }) {
  return (
    <div className="blackbox ch-done">
      <div>
        <p className="eyebrow eyebrow-light">{reader.doneLabel}</p>
        <p className="blackbox-text">{chapter.done}</p>
      </div>
      <p className="op-big">{pad2(index + 1)}</p>
    </div>
  );
}

function SecHead({ title, count }: { title: string; count?: number }) {
  return (
    <div className="sec-head">
      <h2>{title}</h2>
      {count !== undefined && <span className="mono muted">{pad2(count)}</span>}
    </div>
  );
}

function ExampleFigure({
  ex,
  labels,
  urls,
  n0,
  inRow,
  wide,
}: {
  ex: Example;
  labels: PdfLabels;
  urls: Record<string, string>;
  n0: number;
  inRow?: boolean;
  wide?: boolean;
}) {
  const text = labels.examples[ex.id];
  let n = n0;
  const crop = ex.shots.length === 1 && ex.shots[0].crop;
  const cls = ["example", ex.shots.length > 1 && "example-pair", crop && "example-strip", inRow && "example-in-row", wide && "example-wide"];
  return (
    <figure className={cls.filter(Boolean).join(" ")}>
      <p className="eyebrow">{labels.example}</p>
      <div className="ex-shots">
        {ex.shots.map((s, i) => (
          <div key={i} className="ex-shot" dir="ltr">
            <img src={urls[shotKey(s)]} alt="" />
            {s.callouts.map((c, k) => (
              <span
                key={k}
                className="callout"
                style={{ left: `${c.x}%`, top: `${c.y}%` }}
              >
                {++n}
              </span>
            ))}
          </div>
        ))}
      </div>
      <figcaption>
        <p>{text?.caption}</p>
        {text && text.callouts.length > 0 && (
          <ol className="ex-legend">
            {text.callouts.map((c, k) => (
              <li key={k}>
                <span className="callout callout-static">{k + 1}</span>
                <span>{c}</span>
              </li>
            ))}
          </ol>
        )}
      </figcaption>
    </figure>
  );
}

/** Two single-screenshot examples sit side by side to save a page. */
const pairable = (examples: Example[]) =>
  examples.length === 2 &&
  examples.every((e) => e.shots.length === 1 && !e.shots[0].crop);

/**
 * A section heading kept on the same page as its first `keep` items; the rest
 * of the list may break across pages.
 */
function KeepHead<T>({
  head,
  items,
  keep,
  className,
  ordered,
  render,
}: {
  head: React.ReactNode;
  items: T[];
  keep: number;
  className: string;
  ordered?: boolean;
  render: (item: T, i: number) => React.ReactNode;
}) {
  const List = ordered ? "ol" : "ul";
  const rest = items.slice(keep);
  return (
    <>
      <div className="keep">
        {head}
        <List className={`${className} first`}>
          {items.slice(0, keep).map((it, i) => render(it, i))}
        </List>
      </div>
      {rest.length > 0 && (
        <List className={className}>
          {rest.map((it, i) => render(it, i + keep))}
        </List>
      )}
    </>
  );
}

function ChapterBody({
  chapter,
  props,
  tno,
}: {
  chapter: Chapter;
  props: DocProps;
  tno: Map<string, string>;
}) {
  const { reader, labels, urls } = props;
  const examples = EXAMPLES[chapter.id] ?? [];
  const defer = props.tuning?.[chapter.id]?.defer ?? false;
  const wide = props.tuning?.[chapter.id]?.wide ?? false;
  const exampleNode = examples.length > 0 && (
    <>
      {pairable(examples) && !wide ? (
        <div className="ex-row">
          {examples.map((ex) => (
            <ExampleFigure key={ex.id} ex={ex} labels={labels} urls={urls} n0={0} inRow />
          ))}
        </div>
      ) : (
        examples.map((ex) => (
          <ExampleFigure
            key={ex.id}
            ex={ex}
            labels={labels}
            urls={urls}
            n0={0}
            wide={wide && pairable(examples)}
          />
        ))
      )}
    </>
  );
  return (
    <>
      <div className="sec" data-sec={`${chapter.id}-steps`}>
        <KeepHead
          head={
            <SecHead title={reader.stepsLabel} count={chapter.steps.length} />
          }
          items={chapter.steps}
          keep={1}
          className="ruled-list steps"
          ordered
          render={(s, i) => (
            <li key={i}>
              <span className="num">{i + 1}</span>
              <div>
                <p className="step-title">{s.title}</p>
                <p className="step-body">{s.body}</p>
              </div>
            </li>
          )}
        />
      </div>

      {!defer && exampleNode}

      <div className="sec" data-sec={`${chapter.id}-checklist`}>
        <KeepHead
          head={
            <SecHead
              title={reader.checklistLabel}
              count={chapter.checklist.length}
            />
          }
          items={chapter.checklist}
          keep={chapter.checklist.length}
          className="ruled-list checklist checklist-2"
          render={(c, i) => (
            <li key={i}>
              <span className="box" />
              <span>{c}</span>
            </li>
          )}
        />
      </div>

      {chapter.templates.length > 0 && (
        <div className="tpl-ref">
          <p className="eyebrow">{labels.templatesForChapter}</p>
          <ul>
            {chapter.templates.map((t) => (
              <li key={t.id}>
                <span className="tpl-no mono">{tno.get(t.id)}</span>
                <span className="tpl-name">{t.title}</span>
                <span className="tpl-see mono">
                  {props.packPages?.[t.id] ? fill(labels.packPage, pad2(props.packPages[t.id])) : labels.packDocLabel}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {defer && exampleNode}

      <div className="sec mistakes" data-sec={`${chapter.id}-mistakes`}>
        <SecHead title={reader.mistakesLabel} count={chapter.mistakes.length} />
        <ul className="infobox">
          {chapter.mistakes.map((m, i) => (
            <li key={i}>
              <span className="x" aria-hidden="true" />
              <span>{m}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

/** Every template, grouped by chapter, for the Template Pack. */
function PackTemplates({ props, tno }: { props: DocProps; tno: Map<string, string> }) {
  const { playbook, labels, chapterLabel } = props;
  const groups = playbook.chapters
    .map((c, i) => ({ c, label: fill(chapterLabel, pad2(i + 1)) }))
    .filter((g) => g.c.templates.length);
  return (
    <section className="page-section appendix">
      <Run text={labels.templatesRun} />
      {groups.map(({ c, label }) => (
        <div key={c.id} className="tpl-group" data-sec={`grp-${c.id}`}>
          {c.templates.map((t, k) => (
            <div key={t.id} className={`card card-${t.kind}`} data-sec={k === 0 ? undefined : `tpl-${t.id}`}>
              <TemplateBody
                t={t}
                labels={labels}
                head={
                  <div className="card-head" id={`tpl-${t.id}`}>
                    {k === 0 && (
                      <p className="tpl-group-head">
                        <span className="mono">{label}</span>
                        <span>{c.title}</span>
                      </p>
                    )}
                    <div className="card-title-row">
                      <span className="card-no">{tno.get(t.id)}</span>
                      <div>
                        <p className="eyebrow">{labels.templateKinds[t.kind]}</p>
                        <p className="card-title">{t.title}</p>
                      </div>
                    </div>
                    {t.note && <p className="card-note">{t.note}</p>}
                  </div>
                }
              />
            </div>
          ))}
        </div>
      ))}
    </section>
  );
}

/**
 * The two pages after the cover: quick wins under a full-bleed photo band, then
 * "if you read nothing else" with the inquiry path.
 */
function StartHere(props: DocProps) {
  const { playbook, labels, reader, urls, rtl } = props;
  return (
    <>
      <section className="page-section start" id="start-here">
        <Run text={labels.startEyebrow} />
        <div className="ch-band start-band">
          <Img photo={PHOTOS.quickWins} urls={urls} />
        </div>
        <p className="eyebrow start-eyebrow">{labels.startEyebrow}</p>
        <h1 className="display h-start">{labels.startHeading}</h1>
        <p className="muted start-lede">{labels.startText}</p>
        <div className="start-block" id="quick-wins">
          <SecHead title={reader.quickWinsHeading} count={playbook.quickWins.length} />
          <ol className="ruled-list numbered quick-list">
            {playbook.quickWins.map((q, i) => (
              <li key={i}>
                <span className="mono num">{pad2(i + 1)}</span>
                <span>{q}</span>
                <span className="box" />
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="page-section start start-2" id="summary">
        <p className="eyebrow">{reader.summaryEyebrow}</p>
        <h1 className="display h-start">{reader.summaryHeading}</h1>
        <ol className="ruled-list numbered summary-list">
          {playbook.summary.map((s, i) => (
            <li key={i} className={i === playbook.summary.length - 1 ? "summary-last" : ""}>
              <span className="mono num">{pad2(i + 1)}</span>
              <span>{s}</span>
            </li>
          ))}
        </ol>
        <div className="front-block path-block">
          <SecHead title={labels.pathHeading} />
          <p className="muted front-note">{labels.pathText}</p>
          <InquiryPath playbook={playbook} labels={labels} rtl={rtl} />
        </div>
      </section>
    </>
  );
}

function Printable({ labels, weeks }: DocProps & { weeks: Week[] }) {
  if (!weeks.length) return null;
  return (
    <section className="page-section printable" id="checklist-30">
      <Run text={labels.printableEyebrow} />
      <p className="eyebrow">{labels.printableEyebrow}</p>
      <h1 className="display h-page">{labels.printableHeading}</h1>
      <p className="muted small-lede">{labels.printableText}</p>
      <div className="pr-grid">
        {weeks.map((w, i) => (
          <div key={i} className="pr-week">
            <div className="pr-head">
              <span className="eyebrow">{w.label}</span>
              <span className="pr-name">{w.name}</span>
              <span className="mono muted pr-chs">{w.chapters.map(pad2).join(" · ")}</span>
            </div>
            <ul className="checklist pr-list">
              {w.items.map((it, k) => (
                <li key={k}>
                  <span className="box" />
                  <span>
                    <Inline text={it} />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function Contacts({ contact, labels, className }: { contact: Contact; labels: PdfLabels; className: string }) {
  return (
    <div className={className}>
      <div>
        <p className="eyebrow eyebrow-light">{labels.email}</p>
        <a href={`mailto:${contact.email}`}>{contact.email}</a>
      </div>
      <div>
        <p className="eyebrow eyebrow-light">{labels.whatsapp}</p>
        <a href={`https://wa.me/${contact.whatsappDigits}`}>{contact.whatsappDisplay}</a>
      </div>
      <div>
        <p className="eyebrow eyebrow-light">{labels.web}</p>
        <a href={`https://${contact.web}`}>{contact.web}</a>
      </div>
    </div>
  );
}

function Cta({ contact, labels, light }: { contact: Contact; labels: PdfLabels; light?: boolean }) {
  return (
    <a className={`cta${light ? " cta-light" : ""}`} href={contact.calUrl}>
      <span>{labels.closingCta}</span>
      <span className="mono cta-url">{contact.calUrl.replace(/^https:\/\//, "")}</span>
    </a>
  );
}

/** Last page. The playbook's version says when the Template Pack arrives; the pack's own leaves that out. */
function Closing({ labels, contact, urls, tplCount }: DocProps & { tplCount?: number }) {
  return (
    <section className="closing">
      <div className="closing-top">
        <Brand />
        <span className="mono muted">
          {labels.docLabel} <span className="pnum" />
        </span>
      </div>
      <div className="closing-body">
        {tplCount !== undefined && (
          <p className="closing-pack">
            <span className="eyebrow">{labels.packDocLabel}</span>
            <span>{fill(labels.closingPackNote, tplCount)}</span>
          </p>
        )}
        <h1 className="display closing-title">{labels.closingHeading}</h1>
        <p className="closing-text">{labels.closingText}</p>
        <Cta contact={contact} labels={labels} />
      </div>
      <div className="closing-photo">
        <Img photo={PHOTOS.closing} urls={urls} />
      </div>
      <Contacts contact={contact} labels={labels} className="closing-strip" />
    </section>
  );
}

const templateNumbers = (playbook: Playbook) =>
  new Map(
    playbook.chapters.flatMap((c) => c.templates).map((t, i) => [t.id, `T${pad2(i + 1)}`]),
  );

export function PlaybookDocument(props: DocProps) {
  const { playbook } = props;
  const { weeks } = parsePlan(playbook);
  const tno = templateNumbers(playbook);
  return (
    <>
      <Cover {...props} />
      <StartHere {...props} />
      <Front {...props} tplCount={tno.size} />
      {playbook.chapters.map((c, i) => (
        <section
          key={c.id}
          className="chapter ch-body"
          id={`ch-${c.id}`}
          data-ch={c.id}
          style={{ "--sp": props.tuning?.[c.id]?.sp ?? 1 } as React.CSSProperties}
        >
          <ChapterHead chapter={c} index={i} props={props} />
          <ChapterBody chapter={c} props={props} tno={tno} />
          <ChapterDone chapter={c} index={i} reader={props.reader} />
        </section>
      ))}
      <Printable {...props} weeks={weeks} />
      <Closing {...props} tplCount={tno.size} />
    </>
  );
}

/** Template Pack cover: a full-bleed photo band, title and intro; the list of templates follows on its own page. */
function PackCover({ props, tno }: { props: DocProps; tno: Map<string, string> }) {
  const { playbook, labels, urls, contact, chapterLabel } = props;
  const groups = playbook.chapters
    .map((c, i) => ({ c, label: fill(chapterLabel, pad2(i + 1)) }))
    .filter((g) => g.c.templates.length);
  return (
    <>
      <section className="cover pack-cover">
        <div className="pack-band">
          <Img photo={PHOTOS.how} urls={urls} className="cover-bg" />
          <div className="pack-band-scrim" />
          <div className="cover-top">
            <Brand light />
            <span className="mono">{contact.web}</span>
          </div>
        </div>
        <div className="pack-body">
          <p className="eyebrow">{labels.packEyebrow}</p>
          <h1 className="display pack-title">{labels.packTitle}</h1>
          <p className="pack-sub">{labels.packSub.replace("{n}", String(tno.size)).replace("{title}", playbook.title)}</p>
          <p className="pack-intro">{fill(labels.appendixText, tno.size)}</p>
        </div>
      </section>
      <section className="page-section pack-contents">
        <Run text={labels.contentsHeading} />
        <p className="eyebrow">{labels.packEyebrow}</p>
        <h1 className="display h-start">{labels.contentsHeading}</h1>
        <div className="pack-toc">
          {groups.map(({ c, label }) => (
            <div key={c.id} className="pt-group">
              <p className="pt-ch">
                <span className="mono">{label}</span>
                <span>{c.title}</span>
              </p>
              {c.templates.map((t) => (
                <div key={t.id} className="pt-row">
                  <span className="mono pt-no">{tno.get(t.id)}</span>
                  <a className="pt-title" href={`#tpl-${t.id}`}>
                    {t.title}
                  </a>
                  <a className="mono toc-page" href={`#tpl-${t.id}`} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export function TemplatePackDocument(props: DocProps) {
  const tno = templateNumbers(props.playbook);
  return (
    <>
      <PackCover props={props} tno={tno} />
      <PackTemplates props={props} tno={tno} />
      <Closing {...props} />
    </>
  );
}
