import { Project } from "@/types";
import ProjectCard from "@/components/ui/ProjectCard";

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
    <section className="w-full py-12">
      <div className="container mx-auto px-4">
        <h2 className="mb-8 text-3xl font-bold tracking-tight">
          {featured ? "Featured Projects" : "All Projects"}
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {displayProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
