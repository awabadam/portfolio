/**
 * Shared building blocks for every email the site sends (src/emails/*.tsx).
 *
 * Brand: off-white page, one white 600px column, near-black text, the live
 * "AWAB." wordmark, small uppercase monospace kickers, Helvetica/Arial bold
 * headings with tight tracking, 16px/1.5 body, one black rounded pill button
 * (like GlassPill tone="dark") and blue only for inline links.
 *
 * Two layouts: `variant="card"` (admin alerts) puts everything on one white
 * sheet; `variant="sections"` (lead emails, after Morning Brew) puts the
 * wordmark on a tinted canvas and each part in its own white rounded block
 * (<Section>) with a gap between blocks, optional full-bleed banner photo on
 * top and a small mono label.
 *
 * Email rules followed here: table layout, inline styles plus bgcolor
 * attributes, a hidden preheader, images only as decoration (JPG, absolute
 * URLs, width/height attributes, empty alt, grey placeholder when blocked;
 * the text carries the meaning alone), colours that survive the forced
 * dark-mode inversion of Gmail/Outlook apps (#111 on #fff, no greys under
 * #555 for body text). RTL (ar): <html dir="rtl"> plus right alignment via
 * the direction context; kickers drop letter-spacing so Arabic stays joined.
 */
import { AsyncLocalStorage } from "node:async_hooks";
import type { CSSProperties, ReactNode } from "react";
import { Body, Button, Head, Html, Img, Link } from "@react-email/components";
import { SITE_URL } from "@/lib/seo";

export const COLORS = {
  page: "#f7f7f7",
  /** Tinted canvas behind the section blocks. */
  canvas: "#efefed",
  card: "#ffffff",
  text: "#111111",
  muted: "#555555",
  hairline: "#e5e5e5",
  soft: "#f4f4f4",
  link: "#0099ff",
  yes: "#15803d",
  partly: "#d97706",
  no: "#dc2626",
} as const;

export const FONTS = {
  sans: "Switzer, Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
  heading: "Switzer, Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif",
  mono: "ui-monospace, Menlo, Consolas, 'Liberation Mono', monospace",
} as const;

export const WHATSAPP_NUMBER = "905541759945";
export const WHATSAPP_DISPLAY = "+90 554 175 9945";
export const SITE_DISPLAY = "awab.design";
export const SITE_HOME = "https://www.awab.design";

/**
 * Absolute URL of an email image in public/email/. EMAIL_ASSET_BASE overrides
 * the site origin (the preview points it at the local dev server). Read at
 * call time so scripts can set it after imports.
 */
export function emailAsset(file: string): string {
  const base = (process.env.EMAIL_ASSET_BASE || SITE_URL).replace(/\/$/, "");
  return `${base}/email/${file}`;
}

export type Dir = "ltr" | "rtl";
/**
 * Text direction for the email being rendered. Set by renderEmail around the
 * render; React context isn't available in route handlers (react-server).
 */
export const dirStore = new AsyncLocalStorage<Dir>();
export const useDir = (): Dir => dirStore.getStore() ?? "ltr";
export const useAlign = (): "left" | "right" => (useDir() === "rtl" ? "right" : "left");
/** Forward arrow that points the reading direction. */
export const useArrow = () => (useDir() === "rtl" ? "←" : "→");

/** Plain-text marker: html-to-text (react-email's plainText render) skips these nodes. */
export const SKIP_TEXT = { "data-skip-in-text": "true" } as const;

const tableProps = {
  role: "presentation",
  width: "100%",
  cellPadding: 0,
  cellSpacing: 0,
  border: 0,
} as const;

export function Table({ children, style, bg }: { children: ReactNode; style?: CSSProperties; bg?: string }) {
  return (
    <table {...tableProps} bgcolor={bg} style={{ borderCollapse: "separate", ...(bg ? { backgroundColor: bg } : {}), ...style }}>
      <tbody>{children}</tbody>
    </table>
  );
}

/** bgcolor attribute for <td> (missing from React's td typings, still honoured by email clients). */
export const bgAttr = (color: string) => ({ bgcolor: color }) as Record<string, string>;

const MOBILE_CSS = `
  body { margin:0 !important; padding:0 !important; -webkit-text-size-adjust:100%; }
  a { color:${COLORS.link}; }
  @media only screen and (max-width:620px) {
    .em-shell { padding:12px 0 !important; }
    .em-card { width:100% !important; border-radius:0 !important; border-left:0 !important; border-right:0 !important; }
    .em-pad { padding-left:20px !important; padding-right:20px !important; }
    .em-h1 { font-size:26px !important; }
    .em-score { font-size:56px !important; }
    .em-btn { display:block !important; text-align:center !important; margin:0 0 8px 0 !important; }
    .em-kv-label { width:96px !important; }
    .em-shell-s { padding:12px 8px 24px 8px !important; }
    .em-sec { width:100% !important; }
    .em-sec-pad { padding:22px 20px 24px 20px !important; }
    .em-top { padding:4px 6px 14px 6px !important; }
  }
`;

export interface LayoutProps {
  lang: string;
  dir?: Dir;
  /** Inbox preview line; hidden in the body, skipped in the plain-text part. */
  preheader: string;
  /** Small mono label next to the wordmark (e.g. "Clinic check", "Audit lead"). */
  kicker: string;
  title: string;
  children: ReactNode;
  /** Small print under the card. */
  footer?: ReactNode;
  /** "card": one white sheet (admin alerts). "sections": tinted canvas, children are <Section> blocks. */
  variant?: "card" | "sections";
}

export function Layout(props: LayoutProps) {
  return props.variant === "sections" ? <SectionsLayout {...props} /> : <CardLayout {...props} />;
}

function Wordmark() {
  return (
    <Link
      href={SITE_HOME}
      style={{
        fontFamily: FONTS.heading,
        fontSize: "20px",
        lineHeight: "24px",
        fontWeight: 700,
        letterSpacing: "-0.04em",
        color: COLORS.text,
        textDecoration: "none",
      }}
    >
      <span dir="ltr">AWAB.</span>
    </Link>
  );
}

function Shell({ lang, dir, preheader, title, bg, children }: { lang: string; dir: Dir; preheader: string; title: string; bg: string; children: ReactNode }) {
  return (
    <Html lang={lang} dir={dir}>
        <Head>
          <meta name="color-scheme" content="light" />
          <meta name="supported-color-schemes" content="light" />
          <meta name="format-detection" content="telephone=no, address=no, email=no, date=no" />
          <title>{title}</title>
          <style>{MOBILE_CSS}</style>
        </Head>
        <Body style={{ margin: 0, padding: 0, backgroundColor: bg, color: COLORS.text, fontFamily: FONTS.sans }}>
          {/* Preheader: hidden text the inbox shows after the subject. The trailing
              spacers stop clients pulling body text into the preview. */}
          <div
            {...SKIP_TEXT}
            style={{ display: "none", overflow: "hidden", lineHeight: "1px", opacity: 0, maxHeight: 0, maxWidth: 0, fontSize: "1px", color: bg }}
          >
            {preheader}
            {"\u00a0\u200c".repeat(60)}
          </div>
          {children}
        </Body>
    </Html>
  );
}

/** Lead emails: wordmark on the canvas, then one white block per <Section>, then the small print. */
function SectionsLayout({ lang, dir = "ltr", preheader, kicker, title, children, footer }: LayoutProps) {
  const align = dir === "rtl" ? "right" : "left";
  const opposite = dir === "rtl" ? "left" : "right";
  const column = { role: "presentation", width: 600, cellPadding: 0, cellSpacing: 0, border: 0, className: "em-sec", dir } as const;
  return (
    <Shell lang={lang} dir={dir} preheader={preheader} title={title} bg={COLORS.canvas}>
      <table {...tableProps} bgcolor={COLORS.canvas} dir={dir} style={{ backgroundColor: COLORS.canvas }}>
        <tbody>
          <tr>
            <td align="center" className="em-shell-s" style={{ padding: "28px 12px 40px 12px" }}>
              <table {...column} style={{ width: "600px", maxWidth: "600px" }}>
                <tbody>
                  <tr>
                    <td className="em-top" style={{ padding: "0 4px 18px 4px" }}>
                      <Table>
                        <tr>
                          <td align={align} style={{ textAlign: align, verticalAlign: "middle" }}>
                            <Wordmark />
                          </td>
                          <td align={opposite} {...SKIP_TEXT} style={{ textAlign: opposite, verticalAlign: "middle" }}>
                            <KickerText>{kicker}</KickerText>
                          </td>
                        </tr>
                      </Table>
                    </td>
                  </tr>
                  <tr>
                    <td>{children}</td>
                  </tr>
                  {footer ? (
                    <tr>
                      <td
                        align="center"
                        className="em-top"
                        style={{ padding: "24px 24px 0 24px", textAlign: "center", fontSize: "13px", lineHeight: "20px", color: COLORS.muted, fontFamily: FONTS.sans }}
                      >
                        <Link href={SITE_HOME} {...SKIP_TEXT} style={{ fontFamily: FONTS.heading, fontSize: "15px", lineHeight: "20px", fontWeight: 700, letterSpacing: "-0.04em", color: COLORS.text, textDecoration: "none" }}>
                          <span dir="ltr">AWAB.</span>
                        </Link>
                        <div {...SKIP_TEXT} style={{ height: "8px", lineHeight: "8px", fontSize: "1px" }}>
                          {"\u00a0"}
                        </div>
                        {footer}
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </Shell>
  );
}

/** Full-bleed photo at the top of a <Section>. Decorative: empty alt, grey box when images are blocked. */
export interface SectionImage {
  /** File in public/email/. */
  file: string;
  /** Pixel size of the file; the block shows it at 598px wide. */
  width: number;
  height: number;
}

const SECTION_INNER = 598;

/**
 * One white rounded block of a sections layout, followed by a 16px gap.
 * `label` is the small mono kicker that names the block.
 */
export function Section({
  label,
  image,
  children,
  padding = "28px 32px 30px 32px",
  gap = 16,
}: {
  label?: ReactNode;
  image?: SectionImage;
  children: ReactNode;
  padding?: string;
  gap?: number;
}) {
  const align = useAlign();
  const dir = useDir();
  const h = image ? Math.round((image.height / image.width) * SECTION_INNER) : 0;
  return (
    <>
      <table
        {...tableProps}
        bgcolor={COLORS.card}
        dir={dir}
        style={{
          backgroundColor: COLORS.card,
          border: `1px solid ${COLORS.hairline}`,
          borderRadius: "14px",
          borderCollapse: "separate",
        }}
      >
        <tbody>
          {image ? (
            <tr>
              <td {...SKIP_TEXT} {...bgAttr(COLORS.soft)} style={{ padding: 0, fontSize: 0, lineHeight: 0, backgroundColor: COLORS.soft, borderRadius: "13px 13px 0 0" }}>
                <Img
                  src={emailAsset(image.file)}
                  alt=""
                  width={SECTION_INNER}
                  height={h}
                  style={{ display: "block", width: "100%", maxWidth: `${SECTION_INNER}px`, height: "auto", border: 0, outline: "none", borderRadius: "13px 13px 0 0", backgroundColor: COLORS.soft }}
                />
              </td>
            </tr>
          ) : null}
          <tr>
            <td align={align} className="em-sec-pad" style={{ padding, textAlign: align }}>
              {label ? <Kicker style={{ margin: "0 0 14px 0" }}>{label}</Kicker> : null}
              {children}
            </td>
          </tr>
        </tbody>
      </table>
      {gap ? <Spacer h={gap} /> : null}
    </>
  );
}

/** Heading that sits on the canvas between blocks and introduces the ones below it. */
export function CanvasHeading({ title, intro }: { title: ReactNode; intro?: ReactNode }) {
  return (
    <table {...tableProps}>
      <tbody>
        <tr>
          <td className="em-top" style={{ padding: "18px 4px 14px 4px" }}>
            <H1 style={{ margin: intro ? "0 0 6px 0" : 0 }}>{title}</H1>
            {intro ? (
              <P muted style={{ margin: 0 }}>
                {intro}
              </P>
            ) : null}
          </td>
        </tr>
      </tbody>
    </table>
  );
}

function CardLayout({ lang, dir = "ltr", preheader, kicker, title, children, footer }: LayoutProps) {
  const align = dir === "rtl" ? "right" : "left";
  const opposite = dir === "rtl" ? "left" : "right";
  return (
    <Shell lang={lang} dir={dir} preheader={preheader} title={title} bg={COLORS.page}>
      <table {...tableProps} bgcolor={COLORS.page} dir={dir} style={{ backgroundColor: COLORS.page }}>
        <tbody>
          <tr>
            <td align="center" className="em-shell" style={{ padding: "32px 12px" }}>
              <table
                role="presentation"
                width={600}
                cellPadding={0}
                cellSpacing={0}
                border={0}
                bgcolor={COLORS.card}
                className="em-card"
                dir={dir}
                style={{
                  width: "600px",
                  maxWidth: "600px",
                  backgroundColor: COLORS.card,
                  border: `1px solid ${COLORS.hairline}`,
                  borderRadius: "12px",
                  borderCollapse: "separate",
                }}
              >
                <tbody>
                  {/* Wordmark row */}
                  <tr>
                    <td className="em-pad" style={{ padding: "28px 40px 0 40px" }}>
                      <Table>
                        <tr>
                          <td align={align} style={{ textAlign: align, verticalAlign: "middle" }}>
                            <Link
                              href={SITE_HOME}
                              style={{
                                fontFamily: FONTS.heading,
                                fontSize: "20px",
                                lineHeight: "24px",
                                fontWeight: 700,
                                letterSpacing: "-0.04em",
                                color: COLORS.text,
                                textDecoration: "none",
                              }}
                            >
                              <span dir="ltr">AWAB.</span>
                            </Link>
                          </td>
                          <td align={opposite} {...SKIP_TEXT} style={{ textAlign: opposite, verticalAlign: "middle" }}>
                            <KickerText>{kicker}</KickerText>
                          </td>
                        </tr>
                      </Table>
                    </td>
                  </tr>
                  <tr>
                    <td className="em-pad" style={{ padding: "28px 40px 40px 40px" }}>
                      {children}
                    </td>
                  </tr>
                </tbody>
              </table>
              {footer ? (
                <table role="presentation" width={600} cellPadding={0} cellSpacing={0} border={0} className="em-card" style={{ width: "600px", maxWidth: "600px" }}>
                  <tbody>
                    <tr>
                      <td
                        className="em-pad"
                        align={align}
                        style={{ padding: "20px 40px 8px 40px", textAlign: align, fontSize: "13px", lineHeight: "20px", color: COLORS.muted, fontFamily: FONTS.sans }}
                      >
                        {footer}
                      </td>
                    </tr>
                  </tbody>
                </table>
              ) : null}
            </td>
          </tr>
        </tbody>
      </table>
    </Shell>
  );
}

/** Inline kicker text (mono uppercase; plain sans in RTL so Arabic stays joined). */
export function KickerText({ children, color = COLORS.muted }: { children: ReactNode; color?: string }) {
  const rtl = useDir() === "rtl";
  return (
    <span
      style={{
        fontFamily: rtl ? FONTS.sans : FONTS.mono,
        fontSize: rtl ? "13px" : "11px",
        lineHeight: "16px",
        letterSpacing: rtl ? "0" : "0.08em",
        textTransform: rtl ? "none" : "uppercase",
        fontWeight: rtl ? 600 : 500,
        color,
      }}
    >
      {children}
    </span>
  );
}

export function Kicker({ children, color, style }: { children: ReactNode; color?: string; style?: CSSProperties }) {
  const align = useAlign();
  return (
    <p style={{ margin: "0 0 10px 0", textAlign: align, ...style }}>
      <KickerText color={color}>{children}</KickerText>
    </p>
  );
}

export function H1({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  const align = useAlign();
  return (
    <h1
      className="em-h1"
      style={{
        margin: "0 0 12px 0",
        fontFamily: FONTS.heading,
        fontSize: "30px",
        lineHeight: "1.15",
        fontWeight: 700,
        letterSpacing: useDir() === "rtl" ? "0" : "-0.025em",
        color: COLORS.text,
        textAlign: align,
        ...style,
      }}
    >
      {children}
    </h1>
  );
}

export function H2({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  const align = useAlign();
  return (
    <h2
      style={{
        margin: "0 0 8px 0",
        fontFamily: FONTS.heading,
        fontSize: "20px",
        lineHeight: "1.25",
        fontWeight: 700,
        letterSpacing: useDir() === "rtl" ? "0" : "-0.015em",
        color: COLORS.text,
        textAlign: align,
        ...style,
      }}
    >
      {children}
    </h2>
  );
}

export function P({ children, style, muted, small }: { children: ReactNode; style?: CSSProperties; muted?: boolean; small?: boolean }) {
  const align = useAlign();
  return (
    <p
      style={{
        margin: "0 0 16px 0",
        fontFamily: FONTS.sans,
        fontSize: small ? "14px" : "16px",
        lineHeight: small ? "1.5" : "1.55",
        color: muted ? COLORS.muted : COLORS.text,
        textAlign: align,
        ...style,
      }}
    >
      {children}
    </p>
  );
}

export function A({ href, children, style }: { href: string; children: ReactNode; style?: CSSProperties }) {
  return (
    <Link href={href} style={{ color: COLORS.link, textDecoration: "underline", ...style }}>
      {children}
    </Link>
  );
}

/** Black rounded pill (GlassPill tone="dark"). `outline` is for the secondary admin actions only. */
export function Pill({ href, children, outline = false }: { href: string; children: ReactNode; outline?: boolean }) {
  const dir = useDir();
  return (
    <Button
      href={href}
      className="em-btn"
      style={{
        display: "inline-block",
        backgroundColor: outline ? COLORS.card : COLORS.text,
        color: outline ? COLORS.text : "#ffffff",
        border: `1px solid ${COLORS.text}`,
        borderRadius: "8px",
        padding: "13px 22px",
        fontFamily: FONTS.sans,
        fontSize: "15px",
        lineHeight: "18px",
        fontWeight: 600,
        textDecoration: "none",
        margin: dir === "rtl" ? "0 0 8px 8px" : "0 8px 8px 0",
      }}
    >
      {children}
    </Button>
  );
}

export function Spacer({ h }: { h: number }) {
  return (
    <div {...SKIP_TEXT} style={{ height: `${h}px`, lineHeight: `${h}px`, fontSize: "1px" }}>
      {"\u00a0"}
    </div>
  );
}

export function Divider({ space = 28 }: { space?: number }) {
  return (
    <table {...tableProps} {...SKIP_TEXT} style={{ margin: `${space}px 0` }}>
      <tbody>
        <tr>
          <td style={{ borderTop: `1px solid ${COLORS.hairline}`, fontSize: "1px", lineHeight: "1px" }}>{"\u00a0"}</td>
        </tr>
      </tbody>
    </table>
  );
}

/** Bordered rounded box. `tone="soft"` gives the light grey panel. */
export function Card({ children, tone = "line", padding = "22px 24px", style }: { children: ReactNode; tone?: "line" | "soft"; padding?: string; style?: CSSProperties }) {
  const align = useAlign();
  const bg = tone === "soft" ? COLORS.soft : COLORS.card;
  return (
    <table
      {...tableProps}
      bgcolor={bg}
      style={{
        backgroundColor: bg,
        border: tone === "soft" ? `1px solid ${COLORS.soft}` : `1px solid ${COLORS.hairline}`,
        borderRadius: "10px",
        borderCollapse: "separate",
        ...style,
      }}
    >
      <tbody>
        <tr>
          <td align={align} style={{ padding, textAlign: align }}>
            {children}
          </td>
        </tr>
      </tbody>
    </table>
  );
}

/** Numbered list as a table so the number column flips in RTL. */
export function NumberedList({ items, size = 16 }: { items: ReactNode[]; size?: number }) {
  const align = useAlign();
  const pad = useDir() === "rtl" ? { paddingLeft: "10px" } : { paddingRight: "10px" };
  return (
    <Table>
      {items.map((item, i) => (
        <tr key={i}>
          <td
            width={26}
            valign="top"
            style={{ width: "26px", verticalAlign: "top", padding: "0 0 12px 0", fontFamily: FONTS.mono, fontSize: "13px", lineHeight: `${Math.round(size * 1.5)}px`, color: COLORS.muted, ...pad }}
          >
            {`${i + 1}.`}{" "}
          </td>
          <td valign="top" align={align} style={{ verticalAlign: "top", padding: "0 0 12px 0", fontFamily: FONTS.sans, fontSize: `${size}px`, lineHeight: "1.5", color: COLORS.text, textAlign: align }}>
            {item}
          </td>
        </tr>
      ))}
    </Table>
  );
}

/** "What happens next": a dot per step, the first one filled. */
export function Timeline({ steps }: { steps: { when: string; text: string }[] }) {
  const align = useAlign();
  const pad = useDir() === "rtl" ? { paddingLeft: "14px" } : { paddingRight: "14px" };
  return (
    <Table>
      {steps.map((s, i) => (
        <tr key={i}>
          <td width={14} valign="top" {...SKIP_TEXT} style={{ width: "14px", verticalAlign: "top", paddingTop: "4px", ...pad }}>
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "10px",
                backgroundColor: i === 0 ? COLORS.text : COLORS.card,
                border: `2px solid ${COLORS.text}`,
                fontSize: "1px",
                lineHeight: "1px",
              }}
            >
              {"\u00a0"}
            </div>
          </td>
          <td valign="top" align={align} style={{ verticalAlign: "top", padding: i === steps.length - 1 ? "0" : "0 0 16px 0", textAlign: align }}>
            <p style={{ margin: "0 0 2px 0", textAlign: align }}>
              <KickerText color={COLORS.text}>{s.when}</KickerText>
            </p>
            <p style={{ margin: 0, fontFamily: FONTS.sans, fontSize: "15px", lineHeight: "1.5", color: COLORS.text, textAlign: align }}>{s.text}</p>
          </td>
        </tr>
      ))}
    </Table>
  );
}

/** Personal sign-off used by every lead-facing email: portrait, name, role, contact line. */
export function Signature({ signoff, role }: { signoff: string; role: string }) {
  const align = useAlign();
  const dir = useDir();
  const gap = dir === "rtl" ? { paddingLeft: "14px" } : { paddingRight: "14px" };
  return (
    <div style={{ textAlign: align }}>
      <P style={{ margin: "0 0 16px 0" }}>{signoff}</P>
      <table role="presentation" cellPadding={0} cellSpacing={0} border={0} dir={dir} style={{ borderCollapse: "separate" }}>
        <tbody>
          <tr>
            <td width={60} valign="top" {...SKIP_TEXT} style={{ width: "60px", verticalAlign: "top", ...gap }}>
              <Img
                src={emailAsset("awab.jpg")}
                alt=""
                width={60}
                height={60}
                style={{ display: "block", width: "60px", height: "60px", borderRadius: "60px", border: 0, backgroundColor: COLORS.soft }}
              />
            </td>
            <td valign="middle" align={align} style={{ verticalAlign: "middle", textAlign: align }}>
              <p style={{ margin: "0 0 2px 0", fontFamily: FONTS.heading, fontSize: "17px", lineHeight: "1.3", fontWeight: 700, letterSpacing: "-0.01em", color: COLORS.text, textAlign: align }}>
                Awab Elkhalil
              </p>
              <p style={{ margin: "0 0 4px 0", fontFamily: FONTS.sans, fontSize: "14px", lineHeight: "1.45", color: COLORS.muted, textAlign: align }}>{role}</p>
              <p style={{ margin: 0, fontFamily: FONTS.sans, fontSize: "14px", lineHeight: "1.45", color: COLORS.text, textAlign: align }}>
                WhatsApp{" "}
                <A href={`https://wa.me/${WHATSAPP_NUMBER}`}>
                  <span dir="ltr">{WHATSAPP_DISPLAY}</span>
                </A>
                {"  ·  "}
                <A href={SITE_HOME}>{SITE_DISPLAY}</A>
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

/**
 * Fills "{key}" placeholders with strings or React nodes (e.g. a link for
 * "{url}"), so localized sentences can carry inline links without new keys.
 */
export function fillNodes(template: string, values: Record<string, ReactNode>): ReactNode[] {
  return template.split(/(\{\w+\})/g).map((part, i) => {
    const m = /^\{(\w+)\}$/.exec(part);
    if (m && m[1] in values) return <span key={i}>{values[m[1]]}</span>;
    return part;
  });
}

export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => (k in values ? String(values[k]) : `{${k}}`));
}

/** "https://www.clinic.com/en" -> "clinic.com". */
export function domainOf(website: string): string {
  try {
    return new URL(website).hostname.replace(/^www\./i, "");
  } catch {
    return website.replace(/^https?:\/\//i, "").replace(/^www\./i, "").replace(/\/.*$/, "");
  }
}

/** URL without scheme or trailing slash, for link text. */
export function displayUrl(url: string): string {
  return url.replace(/^https?:\/\//i, "").replace(/^www\./i, "").replace(/\/$/, "");
}

/** wa.me link for a phone number as typed by a lead, or null when it has too few digits. */
export function whatsappLinkFor(phone: string | null | undefined, text?: string): string | null {
  if (!phone) return null;
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.length < 8) return null;
  return `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

/** User-typed text with its line breaks kept (as <br>, which every client and the text part honour). */
export function MultiLine({ text }: { text: string }) {
  const lines = text.replace(/\r\n?/g, "\n").split("\n");
  return (
    <>
      {lines.map((line, i) => (
        <span key={i}>
          {i > 0 ? <br /> : null}
          {line}
        </span>
      ))}
    </>
  );
}
