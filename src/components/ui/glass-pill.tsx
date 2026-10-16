import type { ComponentProps, MouseEventHandler, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export type GlassPillTone = "glass" | "dark" | "light";

export interface GlassPillProps {
  /** Internal route. Renders a next-intl <Link>. With `external`, renders a plain <a>. */
  href?: string;
  /** Opens href in a new tab via a plain <a> (no locale prefixing). */
  external?: boolean;
  /**
   * Render as a non-interactive <span>. Use inside a larger link (e.g. a card)
   * where the whole card is the click target; pair with `group-hover:` classes.
   */
  as?: "span";
  onClick?: MouseEventHandler<HTMLElement>;
  children: ReactNode;
  /**
   * glass = frosted white on black (default).
   * dark  = solid foreground-on-background for light (theme) sections — black on
   *         white in light mode, inverted in dark mode so it stays visible.
   * light = solid white on black sections.
   */
  tone?: GlassPillTone;
  /** Appends a trailing ArrowUpRight icon. */
  arrow?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
  "aria-label"?: string;
}

const toneClasses: Record<GlassPillTone, string> = {
  glass:
    "bg-white/15 text-white backdrop-blur-2xl hover:bg-white/25 focus-visible:ring-white/60 focus-visible:ring-offset-black",
  dark:
    "bg-foreground text-background hover:bg-foreground/85 focus-visible:ring-foreground/60 focus-visible:ring-offset-background",
  light:
    "bg-white text-black hover:bg-white/90 focus-visible:ring-white/60 focus-visible:ring-offset-black",
};

const baseClasses =
  "inline-flex h-11 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-5 text-sm font-medium transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

export function GlassPill({
  href,
  external = false,
  as,
  onClick,
  children,
  tone = "glass",
  arrow = false,
  className,
  type = "button",
  "aria-label": ariaLabel,
}: GlassPillProps) {
  const classes = cn(baseClasses, toneClasses[tone], className);

  const content = (
    <>
      <span>{children}</span>
      {arrow && <ArrowUpRight aria-hidden="true" className="h-4 w-4 rtl:-scale-x-100" />}
    </>
  );

  if (as === "span") {
    return (
      <span className={classes} aria-label={ariaLabel}>
        {content}
      </span>
    );
  }

  if (href && external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick as MouseEventHandler<HTMLAnchorElement>}
        className={classes}
        aria-label={ariaLabel}
      >
        {content}
      </a>
    );
  }

  if (href) {
    return (
      <Link
        href={href as ComponentProps<typeof Link>["href"]}
        onClick={onClick as MouseEventHandler<HTMLAnchorElement>}
        className={classes}
        aria-label={ariaLabel}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick as MouseEventHandler<HTMLButtonElement>}
      className={classes}
      aria-label={ariaLabel}
    >
      {content}
    </button>
  );
}

export default GlassPill;
