import React from "react";
import Image from "next/image";
import { getProjectById } from "@/data/projects";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  SectionContainer,
  ContentCard,
  BackgroundHero,
  VisualElement,
  ImageGallery,
} from "@/components/ui";

interface ProjectPageProps {
  params: {
    project: string;
  };
}

const ProjectPage = async ({ params }: ProjectPageProps) => {
  const project = await getProjectById(params.project);

  if (!project) {
    notFound();
  }

  // Use thumbnail as background if no images are available
  const backgroundImage =
    project.thumbnail_url ||
    "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2000&auto=format&fit=crop";

  return (
    <main className="flex min-h-screen w-full flex-col items-center">
      {/* Project Hero */}
      <BackgroundHero
        title={project.title}
        subtitle={`${project.category}${project.role ? ` - ${project.role}` : ""}`}
        description={project.description}
        backgroundSrc={backgroundImage}
        overlayOpacity={0.7}
        className="min-h-[70vh]"
      />

      {/* Overview Section */}
      <SectionContainer title="Overview" className="relative overflow-hidden">
        <VisualElement
          type="blob"
          position="bottom-right"
          size="medium"
          opacity={0.05}
        />

        <ContentCard className="mb-8">
          <div className="space-y-6">
            <p className="text-lg">{project.overview || project.description}</p>
          </div>
        </ContentCard>
      </SectionContainer>

      {/* Objectives Section - Only show if objectives exist */}
      {project.objectives && project.objectives.length > 0 && (
        <SectionContainer
          title="Objectives"
          className="relative overflow-hidden"
        >
          <ContentCard className="mb-8">
            <ul className="list-disc space-y-2 pl-5">
              {project.objectives.map((objective, index) => (
                <li key={index} className="text-lg">
                  {objective}
                </li>
              ))}
            </ul>
          </ContentCard>
        </SectionContainer>
      )}

      {/* Approach Section - Only show if approach exists */}
      {project.approach && project.approach.length > 0 && (
        <SectionContainer title="Approach" className="relative overflow-hidden">
          <ContentCard className="mb-8">
            <ul className="list-disc space-y-2 pl-5">
              {project.approach.map((item, index) => (
                <li key={index} className="text-lg">
                  {item}
                </li>
              ))}
            </ul>
          </ContentCard>
        </SectionContainer>
      )}

      {/* Image Gallery - Only show if images exist */}
      {project.images && project.images.length > 0 && (
        <SectionContainer
          title="Project Gallery"
          className="relative overflow-hidden"
        >
          <ImageGallery images={project.images} />
        </SectionContainer>
      )}

      {/* Design Concept - Only show if designConcept exists */}
      {project.designConcept && (
        <SectionContainer
          title="Design Concept"
          className="relative overflow-hidden"
        >
          <ContentCard className="mb-8">
            <p className="text-lg">{project.designConcept}</p>
          </ContentCard>
        </SectionContainer>
      )}

      {/* Final Thoughts - Only show if finalThoughts exists */}
      {project.finalThoughts && (
        <SectionContainer
          title="Final Thoughts"
          className="relative overflow-hidden"
        >
          <ContentCard className="mb-8">
            <p className="text-lg">{project.finalThoughts}</p>
          </ContentCard>
        </SectionContainer>
      )}

      {/* Links Section */}
      <SectionContainer title="links" className="relative overflow-hidden">
        <div className="flex flex-wrap gap-4">
          <Button asChild>
            <Link href={`${project.behance_url}`} target="_blank">
              View on Behance
            </Link>
          </Button>

          <Button asChild variant="outline">
            <Link href="/projects">← Back to Projects</Link>
          </Button>
        </div>
      </SectionContainer>
    </main>
  );
};

export default ProjectPage;
