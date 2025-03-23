import { Project } from "@/types";
import {
  SectionContainer,
  GridLayout,
  ProjectCard,
  VisualElement,
} from "@/components/ui";
import Link from "next/link";

interface ProjectsProps {
  projects: Project[];
  featured?: boolean;
}

const Projects: React.FC<ProjectsProps> = ({ projects, featured = false }) => {
  // Filter projects based on featured flag if needed
  const displayProjects = featured
    ? projects.filter((project) => project.featured)
    : projects;

  return (
    <SectionContainer
      title={featured ? "Featured Projects" : "All Projects"}
      subtitle={
        featured
          ? "A selection of my best work"
          : "Browse through my complete portfolio"
      }
      decorative
      className="relative overflow-hidden"
    >
      <VisualElement
        type="blob"
        position="bottom-right"
        size="medium"
        opacity={0.05}
      />

      <GridLayout columns={3} gap="gap-6">
        {displayProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </GridLayout>

      {featured && (
        <div className="mt-12 text-center">
          <Link
            href="/projects"
            className="inline-flex items-center text-primary hover:underline"
          >
            View All Projects →
          </Link>
        </div>
      )}
    </SectionContainer>
  );
};

export default Projects;
