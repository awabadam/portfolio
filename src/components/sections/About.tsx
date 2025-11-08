"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const About = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section id="about" className="relative w-full overflow-hidden py-20">
      {/* Background decorative elements */}
      <div className="absolute -left-20 bottom-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl"></div>

      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-primary">
            About Me
          </h2>
          <h3 className="mt-2 text-3xl font-bold">
            The Designer Behind The Work
          </h3>
        </div>

        <div className="grid items-center gap-12 md:grid-cols-5">
          {/* Image Column */}
          <div className="relative md:col-span-2">
            <div className="relative mx-auto aspect-square max-w-sm overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 to-primary/20">
              <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_0,rgba(0,0,0,0.4)_100%)]"></div>
              <Image
                src="/img/hero-image.jpg"
                alt="Awab Elkhalil"
                fill
                sizes="(max-width: 768px) 100vh, 100vw"
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Content Column */}
          <div className="md:col-span-3">
            <p className="mb-6 text-xl leading-relaxed text-muted-foreground">
              Istanbul-based graphic and web designer specializing in creating
              digital experiences that not only look stunning but drive real
              business results.
            </p>

            <div className="mb-8 grid gap-6 sm:grid-cols-2">
              {/* Key Highlights */}
              <Card className="border-border/40 bg-card/50 backdrop-blur transition-all duration-300 hover:border-primary/30 hover:shadow-md">
                <CardContent className="p-4">
                  <div className="mb-2 flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-lg text-primary">
                      ✏️
                    </span>
                    <h3 className="font-semibold">5+ Years Experience</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Specialized in healthcare and brand identity projects with
                    proven results.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border/40 bg-card/50 backdrop-blur transition-all duration-300 hover:border-primary/30 hover:shadow-md">
                <CardContent className="p-4">
                  <div className="mb-2 flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-lg text-primary">
                      💎
                    </span>
                    <h3 className="font-semibold">Design Philosophy</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Balancing aesthetics with usability to create designs that
                    convert.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Button asChild className="group">
              <Link href="/about" className="flex items-center gap-2">
                Learn More About Me
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
