"use client";

import React from "react";
import { motion } from "framer-motion";
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
  Layout,
  Palette,
  Clock,
  DollarSign,
  Target,
  Bot,
} from "lucide-react";
import {
  trackServiceInterest,
  trackButtonClick,
  trackLeadGeneration,
  trackServiceClick,
  trackCTAClick,
} from "@/lib/gtm";
import { fadeInUp, staggerContainer } from "@/lib/animations";

interface Service {
  icon: React.ReactNode;
  title: string;
  description: string;
  benefits: string[];
  timeframe: string;
  priceRange: string;
  link: string;
  slug: string;
}

const services: Service[] = [
  {
    icon: <Layout className="h-10 w-10 text-primary" />,
    title: "Web Design & Development",
    description:
      "Professional webdesign Istanbul services. Complete website solutions from concept to launch. Modern, responsive designs that convert visitors into customers.",
    benefits: [
      "Mobile-first responsive webdesign",
      "SEO-optimized structure for Istanbul market",
      "Fast loading times",
      "Contact forms & lead capture",
      "Local Istanbul business optimization",
    ],
    timeframe: "2-4 weeks",
    priceRange: "Starting from $500",
    link: "#contact",
    slug: "webdesign-istanbul",
  },
  {
    icon: <Palette className="h-10 w-10 text-primary" />,
    title: "Graphic Design",
    description:
      "Expert graphic design Istanbul services. User-centered design that creates intuitive experiences and drives engagement. From wireframes to final designs.",
    benefits: [
      "Professional graphic design Istanbul",
      "User research & personas",
      "Wireframes & prototypes",
      "Interactive mockups",
      "Design system creation",
    ],
    timeframe: "1-3 weeks",
    priceRange: "Starting from $700",
    link: "#contact",
    slug: "graphic-design-istanbul",
  },
  {
    icon: <Bot className="h-10 w-10 text-primary" />,
    title: "AI Chatbot Integration",
    description:
      "Integrate intelligent AI chatbots to automate customer support, qualify leads, and provide 24/7 assistance on your website.",
    benefits: [
      "AI-powered conversation flows",
      "Lead qualification & capture",
      "24/7 automated support",
      "Multi-language support",
      "Analytics & insights",
    ],
    timeframe: "1-2 weeks",
    priceRange: "Starting from $600",
    link: "#contact",
    slug: "ai-chatbot-integration",
  },
];

const Services = () => {
  return (
    <section id="services" className="relative w-full overflow-hidden bg-muted/30 py-24 md:py-32">
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
            Services
          </motion.p>
          <motion.h2
            className="font-display text-display-3 leading-none tracking-tight"
            variants={fadeInUp}
          >
            Web Design, Graphic Design & AI Chatbot Services
          </motion.h2>
          <motion.p
            className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground"
            variants={fadeInUp}
          >
            Professional web design, graphic design, and AI chatbot integration services
            tailored to help your business stand out in Istanbul's competitive
            market and achieve measurable results.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto"
        >
          {services.map((service, index) => (
            <motion.div key={index} variants={fadeInUp}>
              <Card className="group h-full border-border/40 bg-card/50 backdrop-blur transition-all duration-500 hover:border-primary/50 hover:shadow-xl">
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
                    trackServiceClick(service.title, "services_card");
                    trackButtonClick(
                      "get_started",
                      service.title,
                      "service_cta",
                    );
                  }}
                >
                  <Link href={`/services/${service.slug}`} className="flex items-center gap-2">
                    Learn More
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="h-14 px-8 text-lg font-medium"
              onClick={() => {
                trackCTAClick("free_consultation", "services_section");
                trackButtonClick(
                  "free_consultation",
                  "services_section",
                  "primary_cta",
                );
                trackLeadGeneration("services_section", "consultation");
              }}
            >
              <Link href="#contact">Get a Free Consultation</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-14 px-8 text-lg font-medium"
              onClick={() => {
                trackCTAClick("rate_calculator", "services_section");
                trackButtonClick(
                  "rate_calculator",
                  "services_section",
                  "secondary_cta",
                );
              }}
            >
              <Link href="/rate-calculator">Get Instant Quote</Link>
            </Button>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            All projects include free revisions and ongoing support
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
