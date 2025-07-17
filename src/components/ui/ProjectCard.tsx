import Link from "next/link";
import Image from "next/image";
import { Project } from "@/types";
import { ContentCard } from "@/components/ui";
import { Badge } from "@/components/ui/badge";
import {
  trackProjectView,
  trackButtonClick,
  trackProjectClick,
} from "@/lib/gtm";

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const handleProjectClick = () => {
    trackProjectView(project.id, project.title);
    trackProjectClick(project.title, "project_card");
    trackButtonClick("view_project", project.title, "project_cta");
  };

  return (
    <Link
      href={`/projects/${project.id}`}
      className="group block w-full transition-all duration-300"
      onClick={handleProjectClick}
    >
      <ContentCard
        title={project.title}
        hover
        className="h-full overflow-hidden border-border/40 transition-all duration-300 group-hover:border-primary/30"
      >
        {/* Project Thumbnail */}
        {project.thumbnail_url && (
          <div className="relative -mx-4 -mt-4 mb-6 h-52 overflow-hidden">
            <Image
              src={project.thumbnail_url}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Badge variant="outline" className="w-fit border-primary/20">
            {project.category}
          </Badge>

          <p className="text-sm text-muted-foreground">{project.description}</p>

          <div className="mt-2 text-sm font-medium text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            View Case Study →
          </div>
        </div>
      </ContentCard>
    </Link>
  );
};

export default ProjectCard;
