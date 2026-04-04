import React from "react";
import { Metadata } from "next";
import { getAllProjects } from "@/data/projects";
import ProjectList from "@/components/projects/ProjectList";
import ProjectsHero from "@/components/projects/ProjectsHero";
import { getTranslations, getLocale } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata.projects');
  const locale = await getLocale();
  const ogLocale = locale === 'ar' ? 'ar_SA' : locale === 'tr' ? 'tr_TR' : 'en_US';

  return {
    title: t('title'),
    description: t('description'),
    keywords: [
      "portfolio projects",
      "web design portfolio",
      "UI/UX projects",
      "website examples",
      "design case studies",
      "web development projects",
    ],
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: "https://awab.design/projects",
      locale: ogLocale,
    },
    alternates: {
      canonical: "/projects",
      languages: { en: '/projects', ar: '/ar/projects', tr: '/tr/projects' },
    },
  };
}

const ProjectsPage = async () => {
  const allProjects = await getAllProjects();
  const t = await getTranslations('projects');

  return (
    <main className="flex min-h-screen w-full flex-col bg-background pt-32">
      <ProjectsHero projectCount={allProjects.length} />
      <ProjectList projects={allProjects} />

      <div className="flex h-[20vh] items-center justify-center">
        <p className="text-center text-sm text-muted-foreground">
          {t('moreComingSoon')}
        </p>
      </div>
    </main>
  );
};

export default ProjectsPage;
