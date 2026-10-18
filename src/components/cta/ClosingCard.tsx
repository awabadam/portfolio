import type { ReactNode } from "react";
import { ScrollReveal } from "@/components/effects";
import { cn } from "@/lib/utils";

interface ClosingCardProps {
  eyebrow?: ReactNode;
  heading: ReactNode;
  text?: ReactNode;
  /** Buttons/links, laid out on the right on desktop. */
  actions: ReactNode;
  /** Wrap in a section + container (default). Pass false when already inside a container. */
  contained?: boolean;
  className?: string;
}

/**
 * The closing call-to-action used at the end of every page: a light bordered
 * card on the page background, so it never merges with the black footer below.
 */
export default function ClosingCard({
  eyebrow,
  heading,
  text,
  actions,
  contained = true,
  className,
}: ClosingCardProps) {
  const card = (
    <ScrollReveal
      animation="fadeUp"
      className="grid items-end gap-8 rounded-[10px] border border-border bg-card p-8 text-card-foreground shadow-[0_1px_2px_rgba(0,0,0,0.04)] md:p-12 lg:grid-cols-12 lg:p-14"
    >
      <div className="lg:col-span-7">
        {eyebrow && (
          <p className="mb-4 font-mono text-label text-muted-foreground">
            {eyebrow}
          </p>
        )}
        <h2 className="max-w-2xl text-balance font-display text-heading">
          {heading}
        </h2>
        {text && (
          <p className="mt-4 max-w-xl text-base text-muted-foreground md:text-lg">
            {text}
          </p>
        )}
      </div>
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center lg:col-span-5 lg:justify-end">
        {actions}
      </div>
    </ScrollReveal>
  );

  if (!contained) return <div className={className}>{card}</div>;
  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="container mx-auto px-5 md:px-8">{card}</div>
    </section>
  );
}
