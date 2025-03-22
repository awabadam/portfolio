"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const AboutHero = () => {
  return (
    <section className="relative w-full overflow-hidden py-24">
      {/* Background decorative elements */}
      <div className="absolute -left-20 top-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl"></div>
      <div className="absolute -right-20 bottom-20 h-80 w-80 rounded-full bg-primary/5 blur-3xl"></div>

      <div className="container mx-auto px-4">
        <div className="grid items-center gap-12 md:grid-cols-2">
          {/* Content */}
          <div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              About Me
            </h1>
            <p className="text-xl leading-relaxed text-muted-foreground">
              I'm Awab Elkhalil, a passionate graphic and web designer based in
              Istanbul, with over 5 years of experience creating digital
              experiences that not only look stunning but drive real business
              results.
            </p>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative mx-auto aspect-square max-w-md overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 to-primary/20">
              <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_0,rgba(0,0,0,0.4)_100%)]"></div>
              <Image
                src="/img/awab_hero.webp"
                alt="Awab Elkhalil"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
