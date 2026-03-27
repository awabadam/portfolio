"use client";

import Image from "next/image";
import { Link } from '@/i18n/routing';
import { notFound } from "next/navigation";
import { Project } from "@/types";
import { getProjectById } from "@/data/projects";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink, Github, Calendar, User } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useTranslations } from 'next-intl';

interface ProjectPageProps {
  params: Promise<{
    project: string;
  }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { project: projectSlug } = await params;
  const project = await getProjectById(projectSlug);

  if (!project) {
    notFound();
  }

  return <ProjectContent project={project} />;
}

function ProjectContent({ project }: { project: Project }) {
  const t = useTranslations('projects');
  const containerRef = useRef<HTMLDivElement>(null!);
  const { scrollYProgress } = useScroll({
    target: containerRef as any,
    offset: ["start start", "end end"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div ref={containerRef} className="relative bg-background">
      {/* Hero Section */}
      <motion.section
        className="relative h-screen w-full overflow-hidden"
        style={{ scale, opacity }}
      >
        <Image
          src={project.thumbnail_url || ""}
          alt={project.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-0 left-0 rtl:left-auto rtl:right-0 w-full p-8 md:p-16">
          <div className="container mx-auto">
            <motion.h1
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-6xl font-bold text-white md:text-8xl lg:text-9xl"
            >
              {project.title}
            </motion.h1>
          </div>
        </div>
      </motion.section>

      {/* Content Section */}
      <section className="relative z-10 bg-background pt-24 md:pt-32">
        <div className="container mx-auto px-4">
          <div className="grid gap-16 lg:grid-cols-12">
            {/* Sticky Sidebar */}
            <div className="lg:col-span-4">
              <div className="sticky top-32 space-y-8">
                <div>
                  <h3 className="mb-2 font-mono text-sm uppercase text-muted-foreground">{t('category')}</h3>
                  <p className="text-xl font-medium">{project.category}</p>
                </div>

                <div>
                  <h3 className="mb-2 font-mono text-sm uppercase text-muted-foreground">{t('technologies')}</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary" className="rounded-full px-4 py-1">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 pt-8">
                  {project.live_url && (
                    <Button asChild className="w-full" size="lg">
                      <Link href={project.live_url} target="_blank">
                        {t('visitLive')} <ExternalLink className="ml-2 rtl:ml-0 rtl:mr-2 h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                  {project.github_url && (
                    <Button asChild variant="outline" className="w-full" size="lg">
                      <Link href={project.github_url} target="_blank">
                        {t('viewCode')} <Github className="ml-2 rtl:ml-0 rtl:mr-2 h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-8">
              <div className="prose prose-lg max-w-none dark:prose-invert">
                <p className="lead text-2xl leading-relaxed md:text-3xl">
                  {project.description}
                </p>

                {/* Add more content structure here if available in project object */}
                {/* This is a placeholder for the long-form content */}
                <div className="my-16 space-y-8">
                  <h2 className="font-display text-4xl font-bold">{t('challenge')}</h2>
                  <p>
                    {t('challengePlaceholder', { title: project.title })}
                  </p>

                  <div className="relative my-12 aspect-video w-full overflow-hidden rounded-lg">
                    <Image
                      src={project.thumbnail_url || ""}
                      alt={t('projectDetail')}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <h2 className="font-display text-4xl font-bold">{t('solution')}</h2>
                  <p>
                    {t('solutionPlaceholder')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next Project Footer */}
        <div className="mt-32 border-t border-border py-32 text-center">
          <p className="mb-4 font-mono text-sm uppercase text-muted-foreground">{t('nextCaseStudy')}</p>
          <Link
            href="/projects"
            className="font-display text-6xl font-bold transition-colors hover:text-primary md:text-8xl"
          >
            {t('viewAllWork')}
          </Link>
        </div>
      </section>
    </div>
  );
}
