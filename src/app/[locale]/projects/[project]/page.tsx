import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getProjectById, getAllProjects } from "@/data/projects";
import { getTranslations, getLocale } from "next-intl/server";
import ProjectDetail from "@/components/projects/ProjectDetail";

interface ProjectPageProps {
  params: Promise<{
    project: string;
  }>;
}

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((p) => ({ project: p.id }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { project: projectSlug } = await params;
  const project = await getProjectById(projectSlug);
  const locale = await getLocale();

  if (!project) return {};

  const ogLocale =
    locale === "ar" ? "ar_SA" : locale === "tr" ? "tr_TR" : "en_US";

  return {
    title: `${project.title} | Awab Elkhalil`,
    description: project.description,
    openGraph: {
      title: `${project.title} | Awab Elkhalil`,
      description: project.description,
      url: `https://awab.design/projects/${project.id}`,
      locale: ogLocale,
    },
    alternates: {
      canonical: `/projects/${project.id}`,
      languages: {
        en: `/projects/${project.id}`,
        ar: `/ar/projects/${project.id}`,
        tr: `/tr/projects/${project.id}`,
      },
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { project: projectSlug } = await params;
  const project = await getProjectById(projectSlug);
  const allProjects = await getAllProjects();

  if (!project) {
    notFound();
  }

  const currentIndex = allProjects.findIndex((p) => p.id === project.id);
  const nextProject = allProjects[(currentIndex + 1) % allProjects.length];

  return <ProjectDetail project={project} nextProject={nextProject} />;
}
