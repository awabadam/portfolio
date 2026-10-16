"use client";

import { Project } from "@/types";
import WorkCard from "@/components/cards/WorkCard";

interface ProjectListProps {
  projects: Project[];
}

export default function ProjectList({ projects }: ProjectListProps) {
  return (
    <div className="container mx-auto px-5 md:px-8">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {projects.map((project, index) => (
          <WorkCard
            key={project.id}
            project={project}
            index={index}
            aspect="wide"
            priority={index < 2}
          />
        ))}
      </div>
    </div>
  );
}
