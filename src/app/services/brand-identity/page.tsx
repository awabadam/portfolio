import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, Clock, DollarSign } from "lucide-react";

export const metadata: Metadata = {
  title: "Brand Identity Design Services Istanbul | Awab Elkhalil",
  description:
    "Complete graphic design Istanbul packages including logos, color palettes, typography, and brand guidelines for Istanbul businesses. Starting from $550. 1-2 weeks delivery.",
  keywords: [
    "brand identity Istanbul",
    "logo design Istanbul",
    "graphic design Istanbul",
    "branding Istanbul",
    "brand guidelines Istanbul",
    "corporate identity Istanbul",
    "Istanbul brand designer",
    "business card design Istanbul",
  ],
  openGraph: {
    title: "Brand Identity Design Services Istanbul",
    description:
      "Complete graphic design Istanbul packages including logos, color palettes, typography, and brand guidelines for Istanbul businesses.",
    url: "https://awab.design/services/brand-identity",
  },
  alternates: {
    canonical: "/services/brand-identity",
  },
};

const BrandIdentityPage = () => {
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

        <div className="mb-16">
          <h1 className="mb-6 font-display text-5xl font-bold leading-tight tracking-tight md:text-6xl">
            Graphic Design Istanbul
            <br />
            Brand Identity
          </h1>
          <p className="lead mb-8 max-w-3xl text-2xl leading-relaxed text-muted-foreground md:text-3xl">
            Complete graphic design Istanbul packages including logos, color
            palettes, typography, and brand guidelines for Istanbul businesses.
          </p>

          <div className="flex flex-wrap items-center gap-8">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <span className="text-xl font-semibold text-primary">
                Starting from $550
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span className="text-lg text-muted-foreground">1-2 weeks</span>
            </div>
          </div>
        </div>

        <section className="mb-16">
          <h2 className="mb-8 font-display text-3xl font-bold">
            What's Included
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {[
              "Logo design & variations",
              "Color palette & typography",
              "Brand guidelines",
              "Business card & stationery",
              "Istanbul market branding",
              "Brand style guide document",
              "Social media templates",
              "Letterhead & envelope design",
              "Brand asset package",
              "Multiple logo formats (PNG, SVG, PDF)",
            ].map((benefit) => (
              <div key={benefit} className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 shrink-0 text-primary" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="mb-8 font-display text-3xl font-bold">
            Our Process
          </h2>
          <div className="grid gap-8 md:grid-cols-4">
            {[
              { step: "01", title: "Discovery", desc: "Understanding your brand values and Istanbul market" },
              { step: "02", title: "Concepts", desc: "Developing multiple logo and brand direction options" },
              { step: "03", title: "Refine", desc: "Perfecting chosen direction and creating brand system" },
              { step: "04", title: "Deliver", desc: "Providing complete brand package and guidelines" },
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

        <section className="rounded-2xl border border-border bg-muted/30 p-12 text-center">
          <h2 className="mb-4 font-display text-3xl font-bold">
            Ready to Build Your Brand?
          </h2>
          <p className="mb-8 text-muted-foreground">
            Get an instant quote or schedule a free consultation to discuss your brand identity needs.
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

export default BrandIdentityPage;
