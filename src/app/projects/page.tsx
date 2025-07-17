import React from "react";
import { Metadata } from "next";
import { getAllProjects } from "../../data/projects";
import {
  BackgroundHero,
  SectionContainer,
  ProjectCard,
  GridLayout,
  VisualElement,
} from "@/components/ui";

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
    <main className="flex min-h-screen w-full flex-col items-center">
      <BackgroundHero
        title="My Projects"
        subtitle="Portfolio Showcase"
        description="Browse through my complete portfolio of web design and development projects. Each project represents a unique challenge and creative solution."
        backgroundSrc="https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=2064&auto=format&fit=crop"
        className="relative overflow-hidden"
      />

      <SectionContainer
        title="All Projects"
        subtitle="Browse through my complete portfolio"
        centered
        decorative
        className="relative overflow-hidden"
      >
        <VisualElement
          type="blob"
          position="bottom-right"
          size="medium"
          opacity={0.05}
        />

        {/* Project Cards */}
        <GridLayout columns={3} gap="gap-8">
          {allProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </GridLayout>
      </SectionContainer>
    </main>
  );
};

export default ProjectsPage;
