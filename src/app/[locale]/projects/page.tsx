import React from "react";
import { Metadata } from "next";
import { getAllProjects } from "@/data/projects";
import ProjectList from "@/components/projects/ProjectList";
import ProjectsHero from "@/components/projects/ProjectsHero";
import { getTranslations, getLocale } from 'next-intl/server';
import ScrollReveal from "@/components/effects/ScrollReveal";
import { GlassPill } from "@/components/ui/glass-pill";
import { CLIENT_WORK, isClientWork, pickInOrder } from "@/data/case-studies";
import { ogLocale, pageAlternates, localeUrl } from "@/lib/seo";
import ClosingCard from "@/components/cta/ClosingCard";
import BookCallLink from "@/components/cta/BookCallLink";

export const revalidate = 60;

// OG image: ./opengraph-image.tsx
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata.projects');
  const locale = await getLocale();

  return {
    title: t('title'),
    description: t('description'),
    keywords: [
      "dental clinic website examples",
      "aesthetic clinic website design",
      "medical tourism website examples",
      "clinic website case study istanbul",
      "multilingual clinic website",
      "klinik web sitesi örnekleri",
    ],
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: localeUrl("/projects", locale),
      locale: ogLocale(locale),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t('title'),
      description: t('description'),
    },
    alternates: pageAlternates("/projects", locale),
  };
}

const ProjectsPage = async () => {
  const allProjects = await getAllProjects();
  const t = await getTranslations('projects');
  const clientWork = pickInOrder(allProjects, CLIENT_WORK);
  const lab = allProjects.filter((p) => !isClientWork(p.id));

  return (
    <main className="flex min-h-screen w-full flex-col bg-background">
      <ProjectsHero />
      <ProjectList projects={clientWork} heading={t('clientWork')} intro={t('clientWorkIntro')} />
      {lab.length > 0 && (
        <ProjectList projects={lab} heading={t('lab')} intro={t('labIntro')} className="mt-20 md:mt-28" />
      )}

      {/* Closing CTA: dark band, same voice as the home "Work with me" section */}
      <ClosingCard
        className="mt-4 md:mt-8"
        eyebrow={t('ctaKicker')}
        heading={t('ctaHeading')}
        text={t('ctaText')}
        actions={
          <>
            <GlassPill href="/contact" tone="dark" arrow>
              {t('ctaButton')}
            </GlassPill>
            <BookCallLink location="projects_cta" />
          </>
        }
      />
    </main>
  );
};

export default ProjectsPage;
