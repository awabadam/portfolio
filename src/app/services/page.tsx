import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Web Design & Development Services | Istanbul | Awab Elkhalil",
  description:
    "Professional webdesign Istanbul and graphic design Istanbul services. Website design, UI/UX design, brand identity, website maintenance, and AI chatbot integration. Starting from $550.",
  keywords: [
    "webdesign Istanbul",
    "graphic design Istanbul",
    "website design Istanbul",
    "UI/UX design Istanbul",
    "brand identity Istanbul",
    "website maintenance Istanbul",
    "AI chatbot integration",
    "web development Istanbul",
    "responsive web design Istanbul",
  ],
  openGraph: {
    title: "Web Design & Development Services | Istanbul | Awab Elkhalil",
    description:
      "Professional webdesign Istanbul and graphic design Istanbul services. Website design, UI/UX design, brand identity, website maintenance, and AI chatbot integration.",
    url: "https://awab.design/services",
  },
  alternates: {
    canonical: "/services",
  },
};

const servicesList = [
  {
    id: "webdesign-istanbul",
    title: "Webdesign Istanbul - Website Design & Development",
    slug: "webdesign-istanbul",
    description:
      "Professional webdesign Istanbul services. Complete website solutions from concept to launch. Modern, responsive designs that convert visitors into customers.",
    priceRange: "Starting from $1,200",
    timeframe: "2-4 weeks",
  },
  {
    id: "ui-ux-design",
    title: "Graphic Design Istanbul - UI/UX Design",
    slug: "graphic-design-istanbul",
    description:
      "Expert graphic design Istanbul services. User-centered design that creates intuitive experiences and drives engagement. From wireframes to final designs.",
    priceRange: "Starting from $700",
    timeframe: "1-3 weeks",
  },
  {
    id: "brand-identity",
    title: "Graphic Design Istanbul - Brand Identity",
    slug: "brand-identity",
    description:
      "Complete graphic design Istanbul packages including logos, color palettes, typography, and brand guidelines for Istanbul businesses.",
    priceRange: "Starting from $550",
    timeframe: "1-2 weeks",
  },
  {
    id: "website-maintenance",
    title: "Webdesign Istanbul - Website Maintenance",
    slug: "website-maintenance",
    description:
      "Ongoing webdesign Istanbul maintenance, updates, and optimization to keep your site secure, fast, and up-to-date.",
    priceRange: "From $150/month",
    timeframe: "Ongoing",
  },
  {
    id: "ai-chatbot",
    title: "AI Chatbot Integration",
    slug: "ai-chatbot-integration",
    description:
      "Integrate intelligent AI chatbots to automate customer support, qualify leads, and provide 24/7 assistance on your website.",
    priceRange: "Starting from $350",
    timeframe: "1-2 weeks",
  },
];

const ServicesPage = () => {
  return (
    <main className="flex min-h-screen w-full flex-col bg-background pt-32">
      {/* Hero Section */}
      <section className="container mx-auto mb-24 px-4">
        <h1 className="font-display text-display-1 font-bold leading-none tracking-tighter">
          SERVICES
        </h1>
        <p className="mt-8 max-w-2xl text-xl leading-relaxed text-muted-foreground">
          Professional webdesign Istanbul and graphic design Istanbul services
          tailored to help your business stand out in Istanbul's competitive
          market and achieve measurable results.
        </p>
      </section>

      {/* Services Grid */}
      <section className="container mx-auto mb-24 px-4">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {servicesList.map((service) => (
            <Link
              key={service.id}
              href={`/services/${service.slug}`}
              className="group relative overflow-hidden rounded-2xl border border-border/40 bg-card p-8 transition-all duration-500 hover:border-primary/50 hover:shadow-xl"
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
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 font-display text-4xl font-bold md:text-5xl">
            Ready to Get Started?
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Let's discuss your project and create something amazing together.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="h-14 px-8 text-lg">
              <Link href="/rate-calculator">Get Instant Quote</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-14 px-8 text-lg">
              <Link href="/contact">Contact Me</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ServicesPage;
