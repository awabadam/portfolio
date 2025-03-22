import React from "react";
import Image from "next/image";
import { getProjectById } from "@/data/projects";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
    <main className="flex h-fit w-full flex-col items-center justify-center gap-8 pt-24">
      <div className="relative flex h-[70vh] w-full items-center justify-center overflow-hidden bg-muted/30">
        <div className="absolute bottom-6 left-12 z-10 max-w-md rounded-lg bg-background/80 p-6 backdrop-blur-md">
          <h1 className="text-2xl font-bold md:text-3xl">{project.title}</h1>
          <p className="mt-2 text-muted-foreground">{project.description}</p>
        </div>

        {/* Placeholder image - in a real app, you'd use the project's actual image */}
        <div className="flex h-full w-full items-center justify-center bg-muted/50">
          <p className="text-xl text-muted-foreground">Project Preview</p>
        </div>
      </div>

      <Card className="w-full max-w-4xl border-none shadow-none">
        <CardContent className="px-6 py-12">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold md:text-4xl">{project.title}</h1>
            <Badge variant="outline">{project.category}</Badge>
          </div>

          <p className="mb-8 text-lg text-muted-foreground">
            {project.description}
          </p>

          <Button asChild>
            <Link
              href={project.behanceUrl.replace("?ilo0=1", "")}
              target="_blank"
            >
              View on Behance
            </Link>
          </Button>

          <div className="mt-12 flex justify-between">
            <Button asChild variant="ghost">
              <Link href="/projects">← Back to Projects</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default ProjectPage;
