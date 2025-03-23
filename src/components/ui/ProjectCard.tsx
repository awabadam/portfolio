import Link from "next/link";
import Image from "next/image";
import { Project } from "@/types";
import { ContentCard } from "@/components/ui";

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="block w-full transition-all duration-300 hover:opacity-90"
    >
      <ContentCard
        title={project.title}
        badge={project.category}
        hover
        className="h-full overflow-hidden border-border/40"
      >
        {/* Project Thumbnail */}
        {project.thumbnailUrl && (
          <div className="relative -mx-4 -mt-4 mb-4 h-48 overflow-hidden">
            <Image
              src={project.thumbnailUrl}
              alt={project.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        <p className="text-sm text-muted-foreground">{project.description}</p>
      </ContentCard>
    </Link>
  );
};

export default ProjectCard;
