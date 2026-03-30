"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Project } from "@/types";
import { ExternalLink, Globe } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/effects";

interface ProjectListProps {
  projects: Project[];
}

export default function ProjectList({ projects }: ProjectListProps) {
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [screenshotErrors, setScreenshotErrors] = useState<Set<string>>(new Set());

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleScreenshotError = (id: string) => {
    setScreenshotErrors(prev => new Set(prev).add(id));
  };

  return (
    <div className="relative w-full" onMouseMove={handleMouseMove}>
      <StaggerContainer className="divide-y divide-border border-y border-border" staggerDelay={0.1}>
        {projects.map((project, index) => (
          <StaggerItem key={project.id} animation="fadeUp">
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex w-full items-center justify-between py-12 transition-colors hover:bg-muted/30 md:py-16"
              onMouseEnter={() => setHoveredProject(project)}
              onMouseLeave={() => setHoveredProject(null)}
            >
              <div className="container mx-auto flex items-center justify-between px-4">
                <div className="flex items-baseline gap-8 md:gap-16">
                  <span className="font-mono text-sm text-muted-foreground md:text-base">
                    {(index + 1).toString().padStart(2, "0")}
                  </span>
                  <h2 className="font-display text-4xl font-bold uppercase tracking-tight transition-transform duration-500 group-hover:translate-x-4 md:text-6xl lg:text-7xl">
                    {project.title}
                  </h2>
                </div>

                <div className="hidden items-center gap-8 md:flex">
                  <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                    {project.category}
                  </span>
                  <ExternalLink className="h-6 w-6 transition-transform duration-500 group-hover:scale-110" />
                </div>
              </div>
            </a>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* Floating Preview */}
      <AnimatePresence>
        {hoveredProject && hoveredProject.live_url && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 1,
              scale: 1,
              x: mousePosition.x - 200,
              y: mousePosition.y - 150,
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
            className="pointer-events-none fixed left-0 top-0 z-50 hidden h-[300px] w-[400px] overflow-hidden rounded-lg border border-border/50 shadow-2xl md:block"
          >
            {/* Layer 1: Gradient placeholder */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-muted via-muted/80 to-muted/60">
              <Globe className="h-8 w-8 text-muted-foreground/40" />
              <span className="text-sm font-medium text-muted-foreground/60">
                {hoveredProject.title}
              </span>
            </div>

            {/* Layer 2: Screenshot */}
            {!screenshotErrors.has(hoveredProject.id) && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={`/api/screenshot?url=${encodeURIComponent(hoveredProject.live_url!)}`}
                alt={hoveredProject.title}
                className="absolute inset-0 z-[1] h-full w-full object-cover object-top"
                onError={() => handleScreenshotError(hoveredProject.id)}
              />
            )}

            {/* Layer 3: Iframe (only for non-blocked sites) */}
            {!hoveredProject.iframe_blocked && (
              <iframe
                src={hoveredProject.live_url}
                title={hoveredProject.title}
                className="relative z-[2] h-[900px] w-[1200px] origin-top-left scale-[0.333] border-0"
                sandbox="allow-scripts allow-same-origin"
                loading="eager"
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
