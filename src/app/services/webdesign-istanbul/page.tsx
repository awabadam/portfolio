import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, Clock, DollarSign } from "lucide-react";

export const metadata: Metadata = {
  title: "Webdesign Istanbul - Website Design & Development Services | Awab Elkhalil",
  description:
    "Professional webdesign Istanbul services. Complete website solutions from concept to launch. Modern, responsive designs that convert visitors into customers. Starting from $1,200. 2-4 weeks delivery.",
  keywords: [
    "webdesign Istanbul",
    "website design Istanbul",
    "web development Istanbul",
    "responsive web design Istanbul",
    "Istanbul web designer",
    "professional website Istanbul",
    "custom website Istanbul",
    "e-commerce website Istanbul",
  ],
  openGraph: {
    title: "Webdesign Istanbul - Website Design & Development Services",
    description:
      "Professional webdesign Istanbul services. Complete website solutions from concept to launch. Modern, responsive designs that convert visitors into customers.",
    url: "https://awab.design/services/webdesign-istanbul",
  },
  alternates: {
    canonical: "/services/webdesign-istanbul",
  },
};

const WebdesignIstanbulPage = () => {
  return (
    <main className="min-h-screen bg-background pt-32">
      <div className="container mx-auto px-4 py-16">
        <Link
          href="/services"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Services
        </Link>

        {/* Hero Section */}
        <div className="mb-16">
          <h1 className="mb-6 font-display text-5xl font-bold leading-tight tracking-tight md:text-6xl">
            Webdesign Istanbul
            <br />
            Website Design & Development
          </h1>
          <p className="lead mb-8 max-w-3xl text-2xl leading-relaxed text-muted-foreground md:text-3xl">
            Professional webdesign Istanbul services. Complete website solutions
            from concept to launch. Modern, responsive designs that convert
            visitors into customers.
          </p>

          <div className="flex flex-wrap items-center gap-8">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <span className="text-xl font-semibold text-primary">
                Starting from $1,200
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span className="text-lg text-muted-foreground">2-4 weeks</span>
            </div>
          </div>
        </div>

        {/* What's Included */}
        <section className="mb-16">
          <h2 className="mb-8 font-display text-3xl font-bold">
            What's Included
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {[
              "Mobile-first responsive webdesign",
              "SEO-optimized structure for Istanbul market",
              "Fast loading times",
              "Contact forms & lead capture",
              "Local Istanbul business optimization",
              "Content management system",
              "SSL certificate setup",
              "Basic SEO configuration",
              "Social media integration",
              "Analytics setup",
            ].map((benefit) => (
              <div key={benefit} className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 shrink-0 text-primary" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Process */}
        <section className="mb-16">
          <h2 className="mb-8 font-display text-3xl font-bold">
            Our Process
          </h2>
          <div className="grid gap-8 md:grid-cols-4">
            {[
              { step: "01", title: "Discovery", desc: "Understanding your business goals and target audience" },
              { step: "02", title: "Design", desc: "Creating mockups and prototypes tailored for Istanbul market" },
              { step: "03", title: "Development", desc: "Building your website with modern technologies" },
              { step: "04", title: "Launch", desc: "Testing, optimization, and going live" },
            ].map((phase) => (
              <div key={phase.step} className="border-t border-border pt-6">
                <span className="mb-2 block font-mono text-sm text-muted-foreground">
                  {phase.step}
                </span>
                <h3 className="mb-2 font-display text-xl font-bold">{phase.title}</h3>
                <p className="text-sm text-muted-foreground">{phase.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-2xl border border-border bg-muted/30 p-12 text-center">
          <h2 className="mb-4 font-display text-3xl font-bold">
            Ready to Start Your Project?
          </h2>
          <p className="mb-8 text-muted-foreground">
            Get an instant quote or schedule a free consultation to discuss your webdesign Istanbul needs.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="h-14 px-8 text-lg">
              <Link href="/rate-calculator">Get Instant Quote</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-14 px-8 text-lg">
              <Link href="/contact">Contact Me</Link>
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
};

export default WebdesignIstanbulPage;
