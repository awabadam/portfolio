import React from "react";
import Image from "next/image";
import { Metadata } from "next";
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

// Generate metadata for project pages
export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const project = await getProjectById(params.project);

  if (!project) {
    return {
      title: "Project Not Found",
      description: "The requested project could not be found.",
    };
  }

  return {
    title: `${project.title} | Project Portfolio`,
    description:
      project.description ||
      `View the ${project.title} project by Awab Elkhalil. ${project.category} project showcasing modern web design and development.`,
    keywords: [
      project.title.toLowerCase(),
      project.category.toLowerCase(),
      "web design project",
      "portfolio case study",
      "UI/UX design",
      "web development",
    ],
    openGraph: {
      title: `${project.title} | Project Portfolio`,
      description:
        project.description ||
        `View the ${project.title} project by Awab Elkhalil. ${project.category} project showcasing modern web design and development.`,
      url: `https://awab.design/projects/${params.project}`,
      images: project.thumbnail_url ? [project.thumbnail_url] : undefined,
    },
    alternates: {
      canonical: `/projects/${params.project}`,
    },
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

      {/* Consolidated Case Study Section */}
      <SectionContainer
        title="Case Study"
        subtitle="Project Details & Process"
        className="relative overflow-hidden"
        decorative
      >
        <VisualElement
          type="blob"
          position="bottom-right"
          size="medium"
          opacity={0.05}
        />
        <VisualElement
          type="blob"
          position="top-left"
          size="small"
          opacity={0.05}
        />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Main Content Column */}
          <div className="lg:col-span-7">
            {/* Overview */}
            <ContentCard className="mb-8 border-l-4 border-l-primary/50">
              <div className="mb-4">
                <h3 className="mb-2 text-xl font-semibold">Overview</h3>
                {project.role && (
                  <Badge variant="outline" className="mb-4 border-primary/30">
                    Role: {project.role}
                  </Badge>
                )}
              </div>
              <div className="space-y-6">
                <p className="text-lg leading-relaxed">
                  {project.overview || project.description}
                </p>
              </div>
            </ContentCard>

            {/* Objectives & Approach */}
            <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* Objectives */}
              {project.objectives && project.objectives.length > 0 && (
                <ContentCard className="border-t-4 border-t-primary/30 bg-card/70">
                  <h3 className="mb-4 text-xl font-semibold">Objectives</h3>
                  <ul className="space-y-3 pl-5">
                    {project.objectives.map((objective, index) => (
                      <li key={index} className="relative text-base">
                        <span className="absolute -left-5 text-primary">•</span>
                        {objective}
                      </li>
                    ))}
                  </ul>
                </ContentCard>
              )}

              {/* Approach */}
              {project.approach && project.approach.length > 0 && (
                <ContentCard className="border-t-4 border-t-primary/30 bg-card/70">
                  <h3 className="mb-4 text-xl font-semibold">Approach</h3>
                  <ul className="space-y-3 pl-5">
                    {project.approach.map((item, index) => (
                      <li key={index} className="relative text-base">
                        <span className="absolute -left-5 text-primary">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </ContentCard>
              )}
            </div>

            {/* Design Concept */}
            {project.designConcept && (
              <ContentCard className="mb-8 border-l-4 border-l-primary/50">
                <h3 className="mb-4 text-xl font-semibold">Design Concept</h3>
                <p className="text-base leading-relaxed">
                  {project.designConcept}
                </p>
              </ContentCard>
            )}

            {/* Final Thoughts */}
            {project.finalThoughts && (
              <ContentCard className="mb-8 border-l-4 border-l-primary/50">
                <h3 className="mb-4 text-xl font-semibold">Final Thoughts</h3>
                <p className="text-base leading-relaxed">
                  {project.finalThoughts}
                </p>
              </ContentCard>
            )}
          </div>

          {/* Sidebar/Visual Column */}
          <div className="lg:col-span-5">
            {/* Image Gallery */}
            {project.images && project.images.length > 0 && (
              <ContentCard className="mb-8 overflow-hidden border-none p-0">
                <h3 className="mb-4 p-4 text-xl font-semibold">
                  Project Gallery
                </h3>
                <div className="overflow-hidden rounded-lg">
                  <ImageGallery images={project.images} />
                </div>
              </ContentCard>
            )}

            {/* Project Info Card */}
            <ContentCard className="mb-8 bg-primary/5">
              <h3 className="mb-4 text-xl font-semibold">Project Info</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">
                    Category:
                  </span>
                  <p className="text-base">{project.category}</p>
                </div>
                {project.role && (
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">
                      Role:
                    </span>
                    <p className="text-base">{project.role}</p>
                  </div>
                )}
              </div>
            </ContentCard>
          </div>
        </div>
      </SectionContainer>

      {/* Links Section */}
      <SectionContainer title="Links" className="relative overflow-hidden">
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
