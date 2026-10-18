"use client";

import { Project } from "@/types";
import WorkCard from "@/components/cards/WorkCard";
import ScrollReveal from "@/components/effects/ScrollReveal";
import { cn } from "@/lib/utils";

interface ProjectListProps {
  projects: Project[];
  heading?: string;
  intro?: string;
  className?: string;
}

export default function ProjectList({ projects, heading, intro, className }: ProjectListProps) {
  return (
    <section className={cn("container mx-auto px-5 md:px-8", className)}>
      {heading && (
        <ScrollReveal animation="fadeUp" className="mb-8 flex flex-col gap-2 border-t border-border/60 pt-6 md:mb-10 md:flex-row md:items-baseline md:justify-between">
          <h2 className="font-display text-card-title">{heading}</h2>
          {intro && <p className="max-w-md text-sm text-muted-foreground">{intro}</p>}
        </ScrollReveal>
      )}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {projects.map((project, index) => (
          <WorkCard
            key={project.id}
            project={project}
            index={index}
            aspect="wide"
            priority={index < 2}
          />
        ))}
      </div>
    </section>
  );
}
