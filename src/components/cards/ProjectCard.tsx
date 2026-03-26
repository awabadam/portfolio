"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Project } from "@/types";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  trackProjectView,
  trackButtonClick,
  trackProjectClick,
} from "@/lib/analytics/gtm";
import { fadeInUp } from "@/lib/animations";

interface ProjectCardProps {
  project: Project;
  index?: number;
  inverse?: boolean;
  className?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  index = 0, 
  inverse = false,
  className 
}) => {
  const handleProjectClick = () => {
    trackProjectView(project.id, project.title);
    trackProjectClick(project.title, "project_card");
    trackButtonClick("view_project", project.title, "project_cta");
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={fadeInUp}
      transition={{ delay: index * 0.1 }}
      className={className}
    >
      <Link
        href={`/projects/${project.id}`}
        className="group block w-full"
        onClick={handleProjectClick}
      >
        <div className={cn(
          "relative overflow-hidden rounded-2xl border transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-1",
          inverse 
            ? "border-border/40 bg-card/50 group-hover:border-primary/50" 
            : "border-border/40 bg-card group-hover:border-primary/50"
        )}>
          {/* Project Thumbnail - Larger */}
          {project.thumbnail_url && (
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <Image
                src={project.thumbnail_url}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className={cn(
                "absolute inset-0 bg-gradient-to-t to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100",
                inverse 
                  ? "from-black/90 via-black/40 dark:from-zinc-900/90 dark:via-zinc-900/40" 
                  : "from-background/90 via-background/40"
              )} />
              <motion.div
                className={cn(
                  "absolute bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-full backdrop-blur-md opacity-0 transition-all duration-300 group-hover:opacity-100 shadow-lg",
                  "bg-background text-foreground"
                )}
                whileHover={{ scale: 1.15 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <ArrowRight className="h-5 w-5" />
              </motion.div>
            </div>
          )}

          {/* Content */}
          <div className="p-6">
            <div className="mb-3 flex items-center justify-between">
              <Badge
                variant="outline"
                className={cn(
                  "text-xs font-medium",
                  "border-primary/20"
                )}
              >
                {project.category}
              </Badge>
            </div>

            <h3 className={cn(
              "mb-2 font-display text-2xl font-bold tracking-tight transition-colors duration-300",
              "text-foreground group-hover:text-primary"
            )}>
              {project.title}
            </h3>

            <p className={cn(
              "line-clamp-2 text-sm leading-relaxed transition-opacity duration-300",
              "text-muted-foreground group-hover:text-foreground/80"
            )}>
              {project.description}
            </p>

            <div className={cn(
              "mt-4 flex items-center gap-2 text-sm font-medium opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2",
              "text-primary"
            )}>
              View Case Study
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-2" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProjectCard;
