import Link from "next/link";
import React from "react";
import { Project } from "../types";
import { SectionContainer, GridLayout, ProjectCard } from "@/components/ui";

interface ProjectsProps {
  number?: number;
  projects: Project[];
  featured?: boolean;
}

const Projects: React.FC<ProjectsProps> = ({
  projects,
  number,
  featured = false,
}) => {
  // Filter projects if needed
  const projectsToDisplay = featured
    ? projects
        .filter((project) => project.featured)
        .slice(0, number || projects.length)
    : projects.slice(0, number || projects.length);

  return (
    <SectionContainer
      title={featured ? "Featured Projects" : "All Projects"}
      subtitle={
        featured
          ? "A selection of my best work"
          : "Browse through my complete portfolio"
      }
      centered
      decorative
      className="relative overflow-hidden"
    >
      {/* Project Cards */}
      <GridLayout columns={3} gap="gap-6">
        {projectsToDisplay.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </GridLayout>

      {/* See More Link */}
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
