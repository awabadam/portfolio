"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Calendar,
  Download,
  GraduationCap,
  MapPin,
  Target,
  Users,
} from "lucide-react";

const AboutContent = () => {
  return (
    <section id="about-content" className="w-full py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h2 className="mb-6 text-3xl font-bold">My Story</h2>
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
              effectively. I believe that great design solves problems and
              creates meaningful connections between brands and their audiences.
            </p>
          </div>
        </div>

        {/* Professional Journey Timeline */}
        <div className="mb-16">
          <h2 className="mb-6 text-3xl font-bold">Professional Journey</h2>

          <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary before:to-primary/20 md:before:mx-auto md:before:ml-0">
            {/* Timeline Item 1 */}
            <div className="relative flex flex-col items-start md:flex-row md:justify-between">
              <div className="flex items-center md:w-1/2 md:justify-end md:pr-8">
                <div className="z-10 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-background">
                  <Calendar className="h-5 w-5" />
                </div>
                <div className="hidden md:block">
                  <Card className="ml-4 border-primary/20">
                    <CardContent className="p-4">
                      <h3 className="font-semibold">Senior Designer</h3>
                      <p className="text-sm text-muted-foreground">
                        2023 - Present
                      </p>
                      <p className="mt-2">
                        Leading design projects for major clients, focusing on
                        conversion-optimized websites and brand identities.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
              <div className="ml-12 md:ml-0 md:w-1/2 md:pl-8">
                <Card className="border-primary/20 md:hidden">
                  <CardContent className="p-4">
                    <h3 className="font-semibold">Senior Designer</h3>
                    <p className="text-sm text-muted-foreground">
                      2023 - Present
                    </p>
                    <p className="mt-2">
                      Leading design projects for major clients, focusing on
                      conversion-optimized websites and brand identities.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Timeline Item 2 */}
            <div className="relative flex flex-col items-start md:flex-row md:justify-between">
              <div className="flex items-center md:w-1/2 md:justify-end md:pr-8">
                <div className="z-10 flex h-10 w-10 items-center justify-center rounded-full bg-primary/80 text-background">
                  <Users className="h-5 w-5" />
                </div>
                <div className="hidden md:block">
                  <Card className="ml-4 border-primary/20">
                    <CardContent className="p-4">
                      <h3 className="font-semibold">UI/UX Designer</h3>
                      <p className="text-sm text-muted-foreground">
                        2020 - 2023
                      </p>
                      <p className="mt-2">
                        Designed user interfaces and experiences for web
                        applications and mobile apps, focusing on usability and
                        conversion.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
              <div className="ml-12 md:ml-0 md:w-1/2 md:pl-8">
                <Card className="border-primary/20 md:hidden">
                  <CardContent className="p-4">
                    <h3 className="font-semibold">UI/UX Designer</h3>
                    <p className="text-sm text-muted-foreground">2020 - 2023</p>
                    <p className="mt-2">
                      Designed user interfaces and experiences for web
                      applications and mobile apps, focusing on usability and
                      conversion.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Timeline Item 3 */}
            <div className="relative flex flex-col items-start md:flex-row md:justify-between">
              <div className="flex items-center md:w-1/2 md:justify-end md:pr-8">
                <div className="z-10 flex h-10 w-10 items-center justify-center rounded-full bg-primary/60 text-background">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div className="hidden md:block">
                  <Card className="ml-4 border-primary/20">
                    <CardContent className="p-4">
                      <h3 className="font-semibold">Graphic Designer</h3>
                      <p className="text-sm text-muted-foreground">
                        2018 - 2020
                      </p>
                      <p className="mt-2">
                        Created visual assets for print and digital media,
                        including logos, branding materials, and marketing
                        collateral.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
              <div className="ml-12 md:ml-0 md:w-1/2 md:pl-8">
                <Card className="border-primary/20 md:hidden">
                  <CardContent className="p-4">
                    <h3 className="font-semibold">Graphic Designer</h3>
                    <p className="text-sm text-muted-foreground">2018 - 2020</p>
                    <p className="mt-2">
                      Created visual assets for print and digital media,
                      including logos, branding materials, and marketing
                      collateral.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Philosophy Section */}
        <div className="mb-16">
          <h2 className="mb-6 text-3xl font-bold">My Design Philosophy</h2>

          <div className="grid gap-8 md:grid-cols-3">
            <Card className="border-primary/20 bg-card/50 backdrop-blur transition-all duration-300 hover:border-primary/30 hover:shadow-md">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Purpose-Driven</h3>
                <p className="text-muted-foreground">
                  Every design decision serves a specific purpose, whether it's
                  to inform, persuade, or convert. I focus on creating designs
                  that achieve measurable results.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-card/50 backdrop-blur transition-all duration-300 hover:border-primary/30 hover:shadow-md">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">User-Centered</h3>
                <p className="text-muted-foreground">
                  I believe in designing for real people with real needs. By
                  understanding user behavior and preferences, I create
                  experiences that feel intuitive and engaging.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-card/50 backdrop-blur transition-all duration-300 hover:border-primary/30 hover:shadow-md">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Context-Aware</h3>
                <p className="text-muted-foreground">
                  Great design considers the environment in which it exists. I
                  create solutions that are appropriate for their context,
                  whether it's a corporate website or a creative portfolio.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Resume Download */}
        <div className="flex justify-center">
          <Button asChild className="group">
            <Link href="/resume.pdf" className="flex items-center gap-2">
              Download Resume
              <Download className="h-4 w-4 transition-transform group-hover:translate-y-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default AboutContent;
