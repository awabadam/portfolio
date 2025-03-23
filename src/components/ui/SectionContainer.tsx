"use client";

import React from "react";

interface SectionContainerProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  decorative?: boolean;
  id?: string;
  centered?: boolean;
}

const SectionContainer: React.FC<SectionContainerProps> = ({
  title,
  subtitle,
  children,
  className = "",
  titleClassName = "",
  subtitleClassName = "",
  decorative = false,
  id,
  centered = false,
}) => {
  return (
    <section
      id={id}
      className={`w-full py-12 md:py-16 ${className} ${
        decorative ? "relative overflow-hidden" : ""
      }`}
    >
      {/* Decorative elements */}
      {decorative && (
        <>
          <div className="absolute -left-20 top-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl"></div>
          <div className="absolute -right-20 bottom-20 h-80 w-80 rounded-full bg-primary/5 blur-3xl"></div>
        </>
      )}

      <div className="container mx-auto px-4">
        <div
          className={`mb-8 md:mb-12 ${
            centered ? "mx-auto max-w-3xl text-center" : ""
          }`}
        >
          <h2
            className={`text-3xl font-bold tracking-tight md:text-4xl ${titleClassName}`}
          >
            {title}
          </h2>
          {subtitle && (
            <p
              className={`mt-4 text-lg text-muted-foreground ${subtitleClassName}`}
            >
              {subtitle}
            </p>
          )}
        </div>
        {children}
      </div>
    </section>
  );
};

export default SectionContainer;
