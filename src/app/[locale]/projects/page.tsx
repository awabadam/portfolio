import React from "react";
import { Metadata } from "next";
import { getAllProjects } from "@/data/projects";
import ProjectList from "@/components/projects/ProjectList";
import ProjectsHero from "@/components/projects/ProjectsHero";
import { getTranslations, getLocale } from 'next-intl/server';
import Link from "next/link";
import { ScrollReveal, LineReveal } from "@/components/effects";

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
    <main className="flex min-h-screen w-full flex-col bg-background pt-32">
      <ProjectsHero projectCount={allProjects.length} />
      <ProjectList projects={allProjects} />

      <section className="py-32">
        <LineReveal className="container mx-auto px-4 mb-32" direction="center" />
        <div className="container mx-auto px-4 text-center">
          <ScrollReveal animation="blurUp">
            <p className="font-mono text-sm uppercase tracking-widest text-muted-foreground">
              {t('moreComingSoon')}
            </p>
          </ScrollReveal>
          <ScrollReveal animation="blurUp" delay={0.1}>
            <h2 className="mx-auto mt-4 max-w-lg font-display text-3xl font-bold leading-tight md:text-4xl">
              {t('ctaHeading')}
            </h2>
          </ScrollReveal>
          <ScrollReveal animation="fadeUp" delay={0.2}>
            <Link
              href="/rate-calculator"
              className="mt-8 inline-block rounded-full bg-primary px-10 py-4 text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90"
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
