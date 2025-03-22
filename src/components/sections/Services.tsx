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
import { ArrowRight, Code, Layout, Palette, PenTool } from "lucide-react";

interface Service {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
}

const services: Service[] = [
  {
    icon: <Layout className="h-10 w-10 text-primary" />,
    title: "Web Design",
    description:
      "Custom, responsive websites that look stunning on all devices and help convert visitors into customers.",
    link: "#contact",
  },
  {
    icon: <Code className="h-10 w-10 text-primary" />,
    title: "Web Development",
    description:
      "Fast, secure, and scalable websites built with modern technologies like Next.js and Tailwind CSS.",
    link: "#contact",
  },
  {
    icon: <Palette className="h-10 w-10 text-primary" />,
    title: "UI/UX Design",
    description:
      "Intuitive user interfaces and seamless experiences that keep users engaged and drive conversions.",
    link: "#contact",
  },
  {
    icon: <PenTool className="h-10 w-10 text-primary" />,
    title: "Brand Identity",
    description:
      "Cohesive visual identities that communicate your brand's values and resonate with your target audience.",
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
            How I Can Help Your Business
          </h3>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            I offer comprehensive design and development services to help your
            business stand out in the digital landscape and achieve your goals.
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
                <CardTitle>{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{service.description}</p>
              </CardContent>
              <CardFooter>
                <Button
                  asChild
                  variant="ghost"
                  className="group p-0 text-primary"
                >
                  <Link href={service.link} className="flex items-center gap-2">
                    Learn more
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button asChild size="lg">
            <Link href="#contact">Get a Free Consultation</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Services;
