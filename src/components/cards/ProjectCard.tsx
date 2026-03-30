"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Project } from "@/types";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
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
  const t = useTranslations('projects');
  const [isHovered, setIsHovered] = useState(false);

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
      <a
        href={project.live_url}
        target="_blank"
        rel="noopener noreferrer"
        className="group block w-full"
        onClick={handleProjectClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={cn(
          "relative overflow-hidden rounded-2xl border transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-1",
          inverse
            ? "border-border/40 bg-card/50 group-hover:border-primary/50"
            : "border-border/40 bg-card group-hover:border-primary/50"
        )}>
          {/* Project Preview */}
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
            {/* Screenshot fallback (always rendered behind iframe) */}
            {project.live_url && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={`https://image.thum.io/get/width/1200/crop/900/${project.live_url}`}
                alt={project.title}
                className="absolute inset-0 h-full w-full object-cover object-top"
              />
            )}

            {/* Iframe overlay on hover — covers screenshot if it loads */}
            <AnimatePresence>
              {isHovered && project.live_url && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 z-[1]"
                >
                  <iframe
                    src={project.live_url}
                    title={project.title}
                    className="h-[900px] w-[1200px] origin-top-left border-0"
                    style={{ transform: "scale(0.333)" }}
                    sandbox="allow-scripts allow-same-origin"
                    loading="eager"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div className={cn(
              "absolute inset-0 bg-gradient-to-t to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 z-10",
              inverse
                ? "from-black/90 via-black/40 dark:from-zinc-900/90 dark:via-zinc-900/40"
                : "from-background/90 via-background/40"
            )} />
            <motion.div
              className={cn(
                "absolute bottom-4 right-4 z-20 flex h-12 w-12 items-center justify-center rounded-full backdrop-blur-md opacity-0 transition-all duration-300 group-hover:opacity-100 shadow-lg",
                "bg-background text-foreground"
              )}
              whileHover={{ scale: 1.15 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <ExternalLink className="h-5 w-5" />
            </motion.div>
          </div>

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
              {t('visitLive')}
              <ExternalLink className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </a>
    </motion.div>
  );
};

export default ProjectCard;
