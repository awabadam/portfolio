"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem, ScrollRotate } from "@/components/effects";

const servicesList = [
  {
    id: "webdesign-istanbul",
    title: "Web Design & Development",
    slug: "webdesign-istanbul",
    description:
      "Professional webdesign Istanbul services. Complete website solutions from concept to launch. Modern, responsive designs with AI-driven optimization that convert visitors into customers.",
    priceRange: "Starting from $400",
    timeframe: "2-4 weeks",
  },
  {
    id: "graphic-design-istanbul",
    title: "Graphic Design",
    slug: "graphic-design-istanbul",
    description:
      "Expert graphic design Istanbul services. User-centered design enhanced by Generative AI for unique, rapid visual concepts. From wireframes to final designs.",
    priceRange: "Starting from $400",
    timeframe: "1-3 weeks",
  },
  {
    id: "ai-chatbot-integration",
    title: "AI Chatbot Integration",
    slug: "ai-chatbot-integration",
    description:
      "Integrate intelligent AI chatbots to automate customer support, qualify leads, and provide 24/7 assistance on your website.",
    priceRange: "Starting from $1,000",
    timeframe: "1-2 weeks",
  },
];

const ServicesPage = () => {
  return (
    <main className="flex min-h-screen w-full flex-col bg-background pt-32">
      {/* Hero Section */}
      <section className="container mx-auto mb-24 px-4">
        <ScrollReveal animation="fadeUp">
          <h1 className="font-display text-display-1 font-bold leading-none tracking-tighter">
            SERVICES
          </h1>
        </ScrollReveal>
        <ScrollReveal animation="fadeUp" delay={0.1}>
          <p className="mt-8 max-w-2xl text-xl leading-relaxed text-muted-foreground">
            Professional web design, graphic design, and AI chatbot integration services
            tailored to help your business stand out in Istanbul&apos;s competitive
            market and achieve measurable results.
          </p>
        </ScrollReveal>
      </section>

      {/* Services Grid */}
      <section className="container mx-auto mb-24 px-4">
        <StaggerContainer className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto" staggerDelay={0.15}>
          {servicesList.map((service, index) => (
            <StaggerItem key={service.id} animation="fadeUp">
              <ScrollRotate degrees={3} direction={index % 2 === 0 ? "cw" : "ccw"}>
                <Link
                  href={`/services/${service.slug}`}
                  className="group relative block overflow-hidden rounded-2xl border border-border/40 bg-card p-8 transition-all duration-500 hover:border-primary/50 hover:shadow-xl"
                >
                  <div className="mb-4">
                    <h2 className="mb-2 font-display text-2xl font-bold transition-colors group-hover:text-primary">
                      {service.title}
                    </h2>
                    <p className="mb-4 text-muted-foreground">
                      {service.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-border/40 pt-4">
                    <div>
                      <p className="text-sm font-medium text-primary">
                        {service.priceRange}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {service.timeframe}
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 -rotate-45 transition-transform duration-500 group-hover:rotate-0" />
                  </div>
                </Link>
              </ScrollRotate>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border py-24">
        <div className="container mx-auto px-4 text-center">
          <ScrollReveal animation="fadeUp">
            <h2 className="mb-4 font-display text-4xl font-bold md:text-5xl">
              Ready to Get Started?
            </h2>
          </ScrollReveal>
          <ScrollReveal animation="fadeUp" delay={0.1}>
            <p className="mb-8 text-lg text-muted-foreground">
              Let&apos;s discuss your project and create something amazing together.
            </p>
          </ScrollReveal>
          <ScrollReveal animation="fadeUp" delay={0.2}>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="h-14 px-8 text-lg">
                <Link href="/rate-calculator">Get Instant Quote</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-14 px-8 text-lg">
                <Link href="/contact">Contact Me</Link>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
};

export default ServicesPage;
