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
} from "@/components/ui";

interface ProjectPageProps {
  params: {
    project: string;
  };
}

const ProjectPage = ({ params }: ProjectPageProps) => {
  const project = getProjectById(params.project);

  if (!project) {
    notFound();
  }

  return (
    <main className="flex min-h-screen w-full flex-col items-center">
      {/* Project Hero */}
      <BackgroundHero
        title={project.title}
        subtitle={project.category}
        description={project.description}
        backgroundSrc="https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=2000&auto=format&fit=crop"
        overlayOpacity={0.7}
        className="min-h-[70vh]"
      />

      {/* Project Details */}
      <SectionContainer
        title={project.title}
        subtitle={`Category: ${project.category}`}
        className="relative overflow-hidden"
      >
        <VisualElement
          type="blob"
          position="bottom-right"
          size="medium"
          opacity={0.05}
        />

        <ContentCard className="mb-8">
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground">
              {project.description}
            </p>

            <h3 className="text-xl font-semibold">Project Overview</h3>
            <p>
              This project showcases my expertise in{" "}
              {project.category.toLowerCase()}
              and demonstrates my approach to creating effective digital
              solutions. Each project is carefully crafted to meet specific
              objectives and deliver exceptional results.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button asChild>
                <Link
                  href={project.behanceUrl.replace("?ilo0=1", "")}
                  target="_blank"
                >
                  View on Behance
                </Link>
              </Button>

              <Button asChild variant="outline">
                <Link href="/projects">← Back to Projects</Link>
              </Button>
            </div>
          </div>
        </ContentCard>

        {/* Related Projects Section could be added here */}
      </SectionContainer>
    </main>
  );
};

export default ProjectPage;
