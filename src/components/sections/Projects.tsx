"use client";

import { Project } from "@/types";
import { ProjectCard } from "@/components/ui";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/animations";

interface ProjectsProps {
  projects: Project[];
  featured?: boolean;
}

const Projects: React.FC<ProjectsProps> = ({ projects, featured = false }) => {
  const displayProjects = featured
    ? projects.filter((project) => project.featured)
    : projects;

  return (
    <section className="relative w-full overflow-hidden py-24 md:py-32">
      {/* Background decorative elements */}
      <div className="absolute -left-40 top-40 h-96 w-96 rounded-full bg-primary/5 blur-3xl"></div>
      <div className="absolute -right-40 bottom-40 h-96 w-96 rounded-full bg-primary/5 blur-3xl"></div>

      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mb-16 text-center md:mb-20"
        >
          <motion.p
            className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground"
            variants={fadeInUp}
          >
            {featured ? "Featured Work" : "Portfolio"}
          </motion.p>
          <motion.h2
            className="font-display text-display-3 leading-none tracking-tight"
            variants={fadeInUp}
          >
            {featured ? "Selected Projects" : "All Projects"}
          </motion.h2>
          {featured && (
            <motion.p
              className="mt-6 text-lg text-muted-foreground"
              variants={fadeInUp}
            >
              A selection of my best work
            </motion.p>
          )}
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {displayProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </motion.div>

        {featured && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-16 text-center"
          >
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 text-lg font-medium text-primary transition-colors hover:text-foreground"
            >
              View All Projects
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Projects;
