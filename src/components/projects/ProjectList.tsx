"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Project } from "@/types";
import { ArrowRight } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/effects";

interface ProjectListProps {
  projects: Project[];
}

export default function ProjectList({ projects }: ProjectListProps) {
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  return (
    <div className="relative w-full" onMouseMove={handleMouseMove}>
      <StaggerContainer className="divide-y divide-border border-y border-border" staggerDelay={0.1}>
        {projects.map((project, index) => (
          <StaggerItem key={project.id} animation="fadeUp">
            <Link
              href={`/projects/${project.id}`}
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
                  <ArrowRight className="h-6 w-6 -rotate-45 transition-transform duration-500 group-hover:rotate-0" />
                </div>
              </div>
            </Link>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* Floating Image Preview */}
      <AnimatePresence>
        {hoveredProject && hoveredProject.thumbnail_url && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 1,
              scale: 1,
              x: mousePosition.x - 200,
              y: mousePosition.y - 150
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
            className="pointer-events-none fixed left-0 top-0 z-50 hidden h-[300px] w-[400px] overflow-hidden rounded-lg md:block"
          >
            <Image
              src={hoveredProject.thumbnail_url}
              alt={hoveredProject.title}
              fill
              className="object-cover"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
