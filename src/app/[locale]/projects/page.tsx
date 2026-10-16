import React from "react";
import { Metadata } from "next";
import { getAllProjects } from "@/data/projects";
import ProjectList from "@/components/projects/ProjectList";
import ProjectsHero from "@/components/projects/ProjectsHero";
import { getTranslations, getLocale } from 'next-intl/server';
import { Link } from "@/i18n/routing";
import ScrollReveal from "@/components/effects/ScrollReveal";

export const revalidate = 60;

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
      url: "https://www.awab.design/projects",
      locale: ogLocale,
    },
    alternates: {
      canonical: "/projects",
      languages: { en: '/projects', ar: '/ar/projects', tr: '/tr/projects', fr: '/fr/projects' },
    },
  };
}

const ProjectsPage = async () => {
  const allProjects = await getAllProjects();
  const t = await getTranslations('projects');

  return (
    <main className="flex min-h-screen w-full flex-col bg-background">
      <ProjectsHero projectCount={allProjects.length} />
      <ProjectList projects={allProjects} />

      <section className="py-20 md:py-28">
        <div className="container mx-auto px-5 text-center md:px-8">
          <ScrollReveal animation="fadeUp">
            <p className="font-mono text-label text-muted-foreground">
              {t('moreComingSoon')}
            </p>
          </ScrollReveal>
          <ScrollReveal animation="fadeUp" delay={0.1}>
            <h2 className="mx-auto mt-5 max-w-2xl font-display text-heading">
              {t('ctaHeading')}
            </h2>
          </ScrollReveal>
          <ScrollReveal animation="fadeUp" delay={0.2}>
            <Link
              href="/contact"
              className="mt-8 inline-flex h-11 items-center rounded-lg bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              {t('ctaButton')}
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
};

export default ProjectsPage;
