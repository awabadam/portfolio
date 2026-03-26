"use client";

import React from "react";
import Image from "next/image";
import dynamic from "next/dynamic";

// Dynamic import for Three.js component (no SSR)
const InteractiveCubes = dynamic(
  () => import("@/components/three/InteractiveCubes"),
  { ssr: false }
);

interface BackgroundHeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  backgroundSrc?: string;
  className?: string;
  overlayOpacity?: number;
  useInteractiveCubes?: boolean;
  cubeCount?: number;
  isDark?: boolean;
}

const BackgroundHero: React.FC<BackgroundHeroProps> = ({
  title,
  subtitle,
  description,
  backgroundSrc,
  className = "",
  overlayOpacity = 0.6,
  useInteractiveCubes = false,
  cubeCount = 30,
  isDark = true,
}) => {
  return (
    <section className={`relative min-h-[50vh] w-full ${className}`}>
      {/* Background */}
      <div className="absolute inset-0 z-0">
        {useInteractiveCubes ? (
          <>
            <div className="absolute inset-0 bg-black" />
            <InteractiveCubes cubeCount={cubeCount} isDark={isDark} />
          </>
        ) : backgroundSrc ? (
          <Image
            src={backgroundSrc}
            alt="Background"
            fill
            className="object-cover brightness-[0.85]"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-black" />
        )}
        <div
          className="absolute inset-0 bg-gradient-to-r from-background/80 to-background/60 pointer-events-none"
          style={{ opacity: overlayOpacity }}
        />
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto flex min-h-[50vh] flex-col justify-center px-4 py-16">
        {subtitle && (
          <h2 className="text-sm font-semibold uppercase tracking-widest text-primary">
            {subtitle}
          </h2>
        )}
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-xl text-xl text-muted-foreground">
            {description}
          </p>
        )}
      </div>
    </section>
  );
};

export default BackgroundHero;
