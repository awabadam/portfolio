"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowRight,
  Code,
  Layout,
  Palette,
  PenTool,
  Clock,
  DollarSign,
  Target,
} from "lucide-react";
import {
  trackServiceInterest,
  trackButtonClick,
  trackLeadGeneration,
} from "@/lib/gtm";

interface Service {
  icon: React.ReactNode;
  title: string;
  description: string;
  benefits: string[];
  timeframe: string;
  priceRange: string;
  link: string;
}

const services: Service[] = [
  {
    icon: <Layout className="h-10 w-10 text-primary" />,
    title: "Website Design & Development",
    description:
      "Complete website solutions from concept to launch. Modern, responsive designs that convert visitors into customers.",
    benefits: [
      "Mobile-first responsive design",
      "SEO-optimized structure",
      "Fast loading times",
      "Contact forms & lead capture",
    ],
    timeframe: "2-4 weeks",
    priceRange: "Starting from $1,500",
    link: "#contact",
  },
  {
    icon: <Palette className="h-10 w-10 text-primary" />,
    title: "UI/UX Design",
    description:
      "User-centered design that creates intuitive experiences and drives engagement. From wireframes to final designs.",
    benefits: [
      "User research & personas",
      "Wireframes & prototypes",
      "Interactive mockups",
      "Design system creation",
    ],
    timeframe: "1-3 weeks",
    priceRange: "Starting from $800",
    link: "#contact",
  },
  {
    icon: <PenTool className="h-10 w-10 text-primary" />,
    title: "Brand Identity Design",
    description:
      "Complete brand identity packages including logos, color palettes, typography, and brand guidelines.",
    benefits: [
      "Logo design & variations",
      "Color palette & typography",
      "Brand guidelines",
      "Business card & stationery",
    ],
    timeframe: "1-2 weeks",
    priceRange: "Starting from $600",
    link: "#contact",
  },
  {
    icon: <Code className="h-10 w-10 text-primary" />,
    title: "Website Maintenance",
    description:
      "Ongoing website maintenance, updates, and optimization to keep your site secure, fast, and up-to-date.",
    benefits: [
      "Regular security updates",
      "Performance optimization",
      "Content updates",
      "24/7 support",
    ],
    timeframe: "Ongoing",
    priceRange: "From $200/month",
    link: "#contact",
  },
];

const Services = () => {
  return (
    <section id="services" className="w-full bg-muted/30 py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-primary">
            Services
          </h2>
          <h3 className="mt-2 text-3xl font-bold">
            Solutions That Drive Business Growth
          </h3>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            I offer comprehensive design and development services tailored to
            help your business stand out in Istanbul's competitive market and
            achieve measurable results.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <Card
              key={index}
              className="border-border/40 bg-card/50 backdrop-blur transition-all duration-300 hover:border-primary/50 hover:shadow-md"
            >
              <CardHeader>
                <div className="mb-4">{service.icon}</div>
                <CardTitle className="text-lg">{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{service.description}</p>

                {/* Benefits */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-primary">
                    What's included:
                  </h4>
                  <ul className="space-y-1">
                    {service.benefits.map((benefit, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <Target className="h-3 w-3 text-primary" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Timeframe & Price */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{service.timeframe}</span>
                  </div>
                  <div className="flex items-center gap-1 font-medium text-primary">
                    <DollarSign className="h-3 w-3" />
                    <span>{service.priceRange}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  asChild
                  variant="ghost"
                  className="group p-0 text-primary"
                  onClick={() => {
                    trackServiceInterest(service.title);
                    trackButtonClick("get_started", service.title);
                  }}
                >
                  <Link href={service.link} className="flex items-center gap-2">
                    Get started
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button
            asChild
            size="lg"
            onClick={() => {
              trackButtonClick("free_consultation", "services_section");
              trackLeadGeneration("services_section", "consultation");
            }}
          >
            <Link href="#contact">Get a Free Consultation</Link>
          </Button>
          <p className="mt-4 text-sm text-muted-foreground">
            All projects include free revisions and ongoing support
          </p>
        </div>
      </div>
    </section>
  );
};

export default Services;
