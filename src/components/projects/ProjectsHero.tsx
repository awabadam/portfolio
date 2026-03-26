"use client";

import { ScrollReveal, Parallax } from "@/components/effects";

interface ProjectsHeroProps {
  projectCount: number;
}

export default function ProjectsHero({ projectCount }: ProjectsHeroProps) {
  return (
    <div className="container mx-auto mb-24 px-4">
      <ScrollReveal animation="fadeUp">
        <Parallax speed={0.2}>
          <h1 className="font-display text-display-1 font-bold leading-none tracking-tighter">
            SELECTED
            <br />
            <span className="text-muted-foreground">WORKS</span>
            <span className="ml-4 text-lg font-normal tracking-normal text-muted-foreground md:text-xl">
              ({projectCount})
            </span>
          </h1>
        </Parallax>
      </ScrollReveal>
    </div>
  );
}
