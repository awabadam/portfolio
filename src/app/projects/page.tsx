import React from "react";
import { Metadata } from "next";
import { getAllProjects } from "../../data/projects";
import ProjectList from "@/components/projects/ProjectList";
import ProjectsHero from "@/components/projects/ProjectsHero";

export const metadata: Metadata = {
  title: "Portfolio Projects | Awab Elkhalil - Web Designer & Developer",
  description:
    "Browse my complete portfolio of web design and development projects. See examples of modern websites, UI/UX designs, and digital solutions created for clients.",
  keywords: [
    "portfolio projects",
    "web design portfolio",
    "UI/UX projects",
    "website examples",
    "design case studies",
    "web development projects",
  ],
  openGraph: {
    title: "Portfolio Projects | Awab Elkhalil - Web Designer & Developer",
    description:
      "Browse my complete portfolio of web design and development projects. See examples of modern websites, UI/UX designs, and digital solutions created for clients.",
    url: "https://awab.design/projects",
  },
  alternates: {
    canonical: "/projects",
  },
};

const ProjectsPage = async () => {
  const allProjects = await getAllProjects();

  return (
    <main className="flex min-h-screen w-full flex-col bg-background pt-32">
      <ProjectsHero projectCount={allProjects.length} />
      <ProjectList projects={allProjects} />

      <div className="flex h-[40vh] items-center justify-center">
        <p className="text-center text-muted-foreground">
          More projects coming soon...
        </p>
      </div>
    </main>
  );
};

export default ProjectsPage;
