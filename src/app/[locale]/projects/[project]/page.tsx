import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getProjectById, getAllProjects, pickWithFallback } from "@/data/projects";
import { getTranslations, getLocale } from "next-intl/server";
import ProjectDetail from "@/components/projects/ProjectDetail";
import BrandDetail from "@/components/projects/BrandDetail";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import CreativeWorkSchema from "@/components/seo/CreativeWorkSchema";
import { CLIENT_WORK, isClientWork, pickInOrder, getCaseStudy } from "@/data/case-studies";
import { BRAND_WORK, getBrandStudy } from "@/data/brand-studies";
import { ogLocale, pageAlternates, localeUrl, SITE_URL } from "@/lib/seo";

export const revalidate = 60;

interface ProjectPageProps {
  params: Promise<{
    project: string;
  }>;
}

export async function generateStaticParams() {
  const projects = await getAllProjects();
  // Brand work may have no database rows; it renders from the static fallback.
  const ids = new Set([...projects.map((p) => p.id), ...BRAND_WORK]);
  return [...ids].map((id) => ({ project: id }));
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
  const brand = getBrandStudy(project.id);
  const t = await getTranslations({ locale, namespace: "projects" });
  const title = brand
    ? t("brandCaseStudyTitle", { title: project.title })
    : study
      ? `${project.title}: Clinic Website Case Study`
      : project.title;
  const description = (brand?.headline ?? study?.headline ?? project.description).slice(0, 155);
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

  const brand = getBrandStudy(project.id);

  // "Next case study" cycles through client work only; Lab projects hand off
  // to the first client project so the path always leads back to proof.
  // Brand case studies cycle among themselves.
  const clientProjects = pickInOrder(allProjects, CLIENT_WORK);
  const brandProjects = pickWithFallback(allProjects, BRAND_WORK);
  const clientIndex = clientProjects.findIndex((p) => p.id === project.id);
  const brandIndex = brandProjects.findIndex((p) => p.id === project.id);
  const nextProject =
    brandIndex >= 0
      ? brandProjects[(brandIndex + 1) % brandProjects.length]
      : clientIndex >= 0
        ? clientProjects[(clientIndex + 1) % clientProjects.length]
        : (clientProjects[0] ??
          allProjects.filter((p) => !isClientWork(p.id) && p.id !== project.id)[0] ??
          project);

  // JSON-LD needs an absolute image URL.
  const image =
    brand?.boards[0]?.src ??
    project.thumbnail_url ??
    project.images?.[0] ??
    `/img/projects/${project.id}-thumbnail.webp`;
  const imageUrl = image.startsWith("/") ? `${SITE_URL}${image}` : image;

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
        imageUrl={imageUrl}
        technologies={project.technologies}
        category={project.category}
      />
      {brand ? (
        <BrandDetail project={project} study={brand} nextProject={nextProject} />
      ) : (
        <ProjectDetail project={project} nextProject={nextProject} />
      )}
    </>
  );
}
