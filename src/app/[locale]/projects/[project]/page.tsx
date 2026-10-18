import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getProjectById, getAllProjects } from "@/data/projects";
import { getTranslations, getLocale } from "next-intl/server";
import ProjectDetail from "@/components/projects/ProjectDetail";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import CreativeWorkSchema from "@/components/seo/CreativeWorkSchema";
import { CLIENT_WORK, isClientWork, pickInOrder, getCaseStudy } from "@/data/case-studies";
import { ogLocale, pageAlternates, localeUrl } from "@/lib/seo";

export const revalidate = 60;

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

  // Case studies lead with the clinic outcome; Lab projects fall back to the
  // project description. The OG image is ./opengraph-image.tsx.
  const study = getCaseStudy(project.id);
  const title = study ? `${project.title}: Clinic Website Case Study` : project.title;
  const description = (study?.headline ?? project.description).slice(0, 155);
  const path = `/projects/${project.id}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: localeUrl(path, locale),
      locale: ogLocale(locale),
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: pageAlternates(path, locale),
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { project: projectSlug } = await params;
  const project = await getProjectById(projectSlug);
  const allProjects = await getAllProjects();

  if (!project) {
    notFound();
  }

  // "Next case study" cycles through client work only; Lab projects hand off
  // to the first client project so the path always leads back to proof.
  const clientProjects = pickInOrder(allProjects, CLIENT_WORK);
  const clientIndex = clientProjects.findIndex((p) => p.id === project.id);
  const nextProject =
    clientIndex >= 0
      ? clientProjects[(clientIndex + 1) % clientProjects.length]
      : (clientProjects[0] ??
        allProjects.filter((p) => !isClientWork(p.id) && p.id !== project.id)[0] ??
        project);

  return (
    <>
      <Breadcrumbs items={[
        { name: "Home", url: "/" },
        { name: "Projects", url: "/projects" },
        { name: project.title, url: `/projects/${project.id}` },
      ]} />
      <CreativeWorkSchema
        name={project.title}
        description={project.description}
        url={`/projects/${project.id}`}
        imageUrl={project.thumbnail_url ?? project.images?.[0]}
        technologies={project.technologies}
        category={project.category}
      />
      <ProjectDetail project={project} nextProject={nextProject} />
    </>
  );
}
