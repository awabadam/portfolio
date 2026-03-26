"use client";

import { ScrollReveal } from "@/components/effects";

interface BlogHeroProps {
  postCount: number;
}

export default function BlogHero({ postCount }: BlogHeroProps) {
  return (
    <div className="container mx-auto mb-24 px-4">
      <ScrollReveal animation="fadeUp">
        <h1 className="font-display text-display-1 font-bold leading-none tracking-tighter">
          JOURNAL
          <span className="ml-4 text-lg font-normal tracking-normal text-muted-foreground md:text-xl">
            ({postCount})
          </span>
        </h1>
      </ScrollReveal>
      <ScrollReveal animation="fadeUp" delay={0.1}>
        <p className="mt-8 max-w-2xl text-xl leading-relaxed text-muted-foreground">
          Thoughts on design, development, and the future of digital experiences.
        </p>
      </ScrollReveal>
    </div>
  );
}
