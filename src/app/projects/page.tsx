import React from "react";
import { Projects } from "../../components";
import { Metadata } from "next";
import { getAllProjects } from "../../data/projects";

export const metadata: Metadata = {
  title: "Projects | Awab Elkhalil",
  description:
    "Portfolio of design and web development projects by Awab Elkhalil",
};

const ProjectsPage = () => {
  const allProjects = getAllProjects();

  return (
    <div className="container mx-auto pt-20">
      <Projects projects={allProjects} />
    </div>
  );
};

export default ProjectsPage;
