import Link from "next/link";
import React from "react";
import ProjectCard from "./ui/ProjectCard";
import { getAllProjects, getFeaturedProjects } from "../data/projects";
import { Project } from "../types";

interface ProjectsProps {
  number?: number;
}

const Projects: React.FC<ProjectsProps> = ({ number }) => {
  // Get projects based on whether we need featured ones or all
  const projectsToDisplay: Project[] = number
    ? getFeaturedProjects(number)
    : getAllProjects();

  return (
    <main className="flex h-fit w-full flex-col items-center justify-center gap-8 py-32">
      <div className="p-4 text-center">
        <h1 className="text-4xl uppercase">Projects</h1>
        <div className="mt-3 hover:underline md:mt-6">
          {number ? <Link href="/projects">see more →</Link> : <></>}
        </div>
      </div>

      {/* Project Cards */}
      <div className="grid w-full grid-cols-1 gap-6 px-4 md:grid-cols-3 md:px-8">
        {projectsToDisplay.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </main>
  );
};

export default Projects;
