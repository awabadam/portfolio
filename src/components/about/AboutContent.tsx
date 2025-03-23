"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Download,
  GraduationCap,
  MapPin,
  Target,
  Users,
} from "lucide-react";
import {
  SectionContainer,
  ContentCard,
  GridLayout,
  VisualElement,
} from "@/components/ui";

const AboutContent = () => {
  return (
    <>
      {/* My Story Section */}
      <SectionContainer
        title="My Story"
        decorative
        className="relative overflow-hidden"
        id="about-content"
      >
        <VisualElement type="blob" position="top-left" size="medium" />
        <div className="space-y-4 text-lg">
          <p>
            My journey in design began over 5 years ago when I discovered my
            passion for creating visual experiences that communicate and
            connect. What started as a curiosity quickly evolved into a career
            as I honed my skills in both graphic design and web development.
          </p>
          <p>
            Based in Istanbul, I've had the privilege of working with clients
            across various industries, from healthcare and technology to
            education and retail. Each project has taught me valuable lessons
            about effective design and the importance of understanding both
            client objectives and user needs.
          </p>
          <p>
            My approach combines aesthetics with functionality, ensuring that
            every design not only looks beautiful but also serves its purpose
            effectively. I believe that great design solves problems and creates
            meaningful connections between brands and their audiences.
          </p>
        </div>
      </SectionContainer>

      {/* Professional Journey Timeline */}
      <SectionContainer title="Professional Journey">
        <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary before:to-primary/20 md:before:mx-auto md:before:ml-0">
          {/* Timeline Item 1 */}
          <div className="relative flex flex-col items-start md:flex-row md:justify-between">
            <div className="flex items-center md:w-1/2 md:justify-end md:pr-8">
              <div className="z-10 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-background">
                <Calendar className="h-5 w-5" />
              </div>
              <div className="hidden md:block">
                <ContentCard
                  title="Senior Designer"
                  subtitle="2023 - Present"
                  className="ml-4"
                  hover
                >
                  <p>
                    Leading design projects for major clients, focusing on
                    conversion-optimized websites and brand identities.
                  </p>
                </ContentCard>
              </div>
            </div>
            <div className="ml-12 md:ml-0 md:w-1/2 md:pl-8">
              <div className="md:hidden">
                <ContentCard
                  title="Senior Designer"
                  subtitle="2023 - Present"
                  hover
                >
                  <p>
                    Leading design projects for major clients, focusing on
                    conversion-optimized websites and brand identities.
                  </p>
                </ContentCard>
              </div>
            </div>
          </div>

          {/* Timeline Item 2 */}
          <div className="relative flex flex-col items-start md:flex-row md:justify-between">
            <div className="flex items-center md:w-1/2 md:justify-end md:pr-8">
              <div className="z-10 flex h-10 w-10 items-center justify-center rounded-full bg-primary/80 text-background">
                <Users className="h-5 w-5" />
              </div>
              <div className="hidden md:block">
                <ContentCard
                  title="UI/UX Designer"
                  subtitle="2020 - 2023"
                  className="ml-4"
                  hover
                >
                  <p>
                    Designed user interfaces and experiences for web
                    applications and mobile apps, focusing on usability and
                    conversion.
                  </p>
                </ContentCard>
              </div>
            </div>
            <div className="ml-12 md:ml-0 md:w-1/2 md:pl-8">
              <div className="md:hidden">
                <ContentCard
                  title="UI/UX Designer"
                  subtitle="2020 - 2023"
                  hover
                >
                  <p>
                    Designed user interfaces and experiences for web
                    applications and mobile apps, focusing on usability and
                    conversion.
                  </p>
                </ContentCard>
              </div>
            </div>
          </div>

          {/* Timeline Item 3 */}
          <div className="relative flex flex-col items-start md:flex-row md:justify-between">
            <div className="flex items-center md:w-1/2 md:justify-end md:pr-8">
              <div className="z-10 flex h-10 w-10 items-center justify-center rounded-full bg-primary/60 text-background">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div className="hidden md:block">
                <ContentCard
                  title="Graphic Designer"
                  subtitle="2018 - 2020"
                  className="ml-4"
                  hover
                >
                  <p>
                    Created visual assets for print and digital media, including
                    logos, branding materials, and marketing collateral.
                  </p>
                </ContentCard>
              </div>
            </div>
            <div className="ml-12 md:ml-0 md:w-1/2 md:pl-8">
              <div className="md:hidden">
                <ContentCard
                  title="Graphic Designer"
                  subtitle="2018 - 2020"
                  hover
                >
                  <p>
                    Created visual assets for print and digital media, including
                    logos, branding materials, and marketing collateral.
                  </p>
                </ContentCard>
              </div>
            </div>
          </div>
        </div>
      </SectionContainer>

      {/* Philosophy Section */}
      <SectionContainer
        title="My Design Philosophy"
        decorative
        className="relative overflow-hidden"
      >
        <VisualElement type="blob" position="bottom-right" size="medium" />
        <GridLayout columns={3}>
          <ContentCard
            title="Purpose-Driven"
            icon={<Target className="h-6 w-6 text-primary" />}
            hover
          >
            <p className="text-muted-foreground">
              Every design decision serves a specific purpose, whether it's to
              inform, persuade, or convert. I focus on creating designs that
              achieve measurable results.
            </p>
          </ContentCard>

          <ContentCard
            title="User-Centered"
            icon={<Users className="h-6 w-6 text-primary" />}
            hover
          >
            <p className="text-muted-foreground">
              I believe in designing for real people with real needs. By
              understanding user behavior and preferences, I create experiences
              that feel intuitive and engaging.
            </p>
          </ContentCard>

          <ContentCard
            title="Context-Aware"
            icon={<MapPin className="h-6 w-6 text-primary" />}
            hover
          >
            <p className="text-muted-foreground">
              Great design considers the environment in which it exists. I
              create solutions that are appropriate for their context, whether
              it's a corporate website or a creative portfolio.
            </p>
          </ContentCard>
        </GridLayout>

        {/* Resume Download */}
        <div className="mt-12 flex justify-center">
          <Button asChild className="group">
            <Link href="/resume.pdf" className="flex items-center gap-2">
              Download Resume
              <Download className="h-4 w-4 transition-transform group-hover:translate-y-1" />
            </Link>
          </Button>
        </div>
      </SectionContainer>
    </>
  );
};

export default AboutContent;
