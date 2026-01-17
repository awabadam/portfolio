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
} from "@/lib/gtm";
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
          "relative overflow-hidden rounded-2xl border transition-all duration-500 hover:shadow-lg",
          inverse 
            ? "border-background/10 bg-background/5 hover:border-background/20" 
            : "border-border/40 bg-card hover:border-primary/30"
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
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <motion.div
                className="absolute bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-background/90 backdrop-blur-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                whileHover={{ scale: 1.1 }}
              >
                <ArrowRight className="h-5 w-5 text-foreground" />
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
                  inverse ? "border-background/20 text-background/80" : "border-primary/20"
                )}
              >
                {project.category}
              </Badge>
            </div>

            <h3 className={cn(
              "mb-2 font-display text-2xl font-bold tracking-tight transition-colors group-hover:text-primary",
              inverse ? "text-background" : "text-foreground"
            )}>
              {project.title}
            </h3>

            <p className={cn(
              "line-clamp-2 text-sm leading-relaxed",
              inverse ? "text-background/60" : "text-muted-foreground"
            )}>
              {project.description}
            </p>

            <div className="mt-4 flex items-center gap-2 text-sm font-medium text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              View Case Study
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProjectCard;
