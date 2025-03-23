import React from "react";
import { Projects } from "../../components";
import { Metadata } from "next";
import { getAllProjects } from "../../data/projects";
import { BackgroundHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "Projects | Awab Elkhalil",
  description:
    "Portfolio of design and web development projects by Awab Elkhalil",
};

const ProjectsPage = () => {
  const allProjects = getAllProjects();

  return (
    <main className="flex min-h-screen w-full flex-col items-center">
      <BackgroundHero
        title="My Projects"
        subtitle="Portfolio Showcase"
        description="Browse through my complete portfolio of web design and development projects. Each project represents a unique challenge and creative solution."
        backgroundSrc="https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=2064&auto=format&fit=crop"
        className="relative overflow-hidden"
      />

      <div className="w-full">
        <Projects projects={allProjects} />
      </div>
    </main>
  );
};

export default ProjectsPage;
