import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Check, Palette, PenTool, Image, Zap, Users, Star } from "lucide-react";

export const metadata: Metadata = {
  title: "Graphic Design Istanbul | Professional Design Services",
  description:
    "Professional graphic design Istanbul services. Expert logo design, branding, and UI/UX design in Istanbul, Turkey. Creative solutions that build your brand.",
  keywords: [
    "graphic design Istanbul",
    "logo design Istanbul",
    "graphic designer Istanbul",
    "branding Istanbul",
    "UI/UX design Istanbul",
    "visual design Istanbul",
    "professional graphic design Istanbul",
    "Istanbul graphic design services",
    "brand identity design Istanbul",
  ],
  openGraph: {
    title: "Graphic Design Istanbul | Professional Design Services",
    description:
      "Professional graphic design Istanbul services. Expert logo design, branding, and UI/UX design in Istanbul, Turkey.",
    url: "https://awab.design/graphic-design-istanbul",
    siteName: "Awab Elkhalil - Graphic Design Istanbul",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Graphic Design Istanbul | Professional Design Services",
    description:
      "Professional graphic design Istanbul services. Expert logo design, branding, and UI/UX design in Istanbul, Turkey.",
    images: ["/og-image.png"],
    creator: "@awabelkhalil",
  },
};

export default function GraphicDesignIstanbul() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center">
      {/* Hero Section */}
      <section className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-16">
        <div className="space-y-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Professional{" "}
            <span className="text-primary">Graphic Design Istanbul</span>
          </h1>
          <p className="mx-auto max-w-3xl text-xl leading-relaxed text-muted-foreground">
            Expert graphic design services in Istanbul, Turkey. Creating
            stunning logos, branding, and visual designs that make your business
            stand out in the competitive Istanbul market.
          </p>

          {/* Social Proof Stats */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">5+ Years Experience</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span className="font-medium">100+ Design Projects</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <span className="font-medium">24hr Response Time</span>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link href="#contact">Get Free Consultation</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/projects">View Portfolio</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="w-full bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">
              Graphic Design Istanbul Services
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
              Comprehensive graphic design solutions for Istanbul businesses
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader>
                <PenTool className="mb-4 h-10 w-10 text-primary" />
                <CardTitle>Logo Design Istanbul</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-muted-foreground">
                  Professional logo design that captures your brand's essence
                  and appeals to the Istanbul market.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-3 w-3 text-primary" />
                    Custom logo design
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-3 w-3 text-primary" />
                    Multiple variations
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-3 w-3 text-primary" />
                    Vector formats included
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-3 w-3 text-primary" />
                    Brand guidelines
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader>
                <Palette className="mb-4 h-10 w-10 text-primary" />
                <CardTitle>Brand Identity Design</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-muted-foreground">
                  Complete brand identity packages including color palettes,
                  typography, and visual guidelines.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-3 w-3 text-primary" />
                    Color palette development
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-3 w-3 text-primary" />
                    Typography selection
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-3 w-3 text-primary" />
                    Brand guidelines document
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-3 w-3 text-primary" />
                    Business card design
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader>
                <Image className="mb-4 h-10 w-10 text-primary" />
                <CardTitle>UI/UX Design</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-muted-foreground">
                  User-centered design that creates intuitive experiences and
                  drives engagement.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-3 w-3 text-primary" />
                    User research & personas
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-3 w-3 text-primary" />
                    Wireframes & prototypes
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-3 w-3 text-primary" />
                    Interactive mockups
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-3 w-3 text-primary" />
                    Design system creation
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="w-full py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">
              Why Choose Graphic Design Istanbul Services?
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
              Creative excellence combined with local market understanding
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold">Creative Excellence</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <strong>Modern Design Trends:</strong> Stay current with the
                    latest design trends and techniques
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <strong>Professional Quality:</strong> High-resolution,
                    print-ready designs for all applications
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <strong>Creative Process:</strong> Collaborative approach
                    with multiple revision rounds
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <strong>Brand Strategy:</strong> Design that aligns with
                    your business goals and target audience
                  </div>
                </li>
              </ul>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-semibold">Local Market Expertise</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <strong>Istanbul Market Understanding:</strong> Designs that
                    resonate with Turkish and international audiences
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <strong>Cultural Sensitivity:</strong> Designs that respect
                    Turkish cultural values and preferences
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <strong>Competitive Analysis:</strong> Research local
                    competitors to create unique, standout designs
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <strong>Local Business Focus:</strong> Specialized in
                    designs for Istanbul-based businesses
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="w-full bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">
              Graphic Design Istanbul Process
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
              A proven process that delivers exceptional results
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="mb-2 text-lg font-semibold">Discovery</h3>
              <p className="text-sm text-muted-foreground">
                Understanding your business, target audience, and design
                requirements
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="mb-2 text-lg font-semibold">Concept</h3>
              <p className="text-sm text-muted-foreground">
                Creating initial design concepts and presenting options for your
                review
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="mb-2 text-lg font-semibold">Refinement</h3>
              <p className="text-sm text-muted-foreground">
                Refining the chosen concept based on your feedback and
                requirements
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
                <span className="text-2xl font-bold text-primary">4</span>
              </div>
              <h3 className="mb-2 text-lg font-semibold">Delivery</h3>
              <p className="text-sm text-muted-foreground">
                Finalizing designs and delivering all files in required formats
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full bg-primary/5 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">
            Ready to Transform Your Brand with Graphic Design Istanbul?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-muted-foreground">
            Get a free consultation and design audit. Let's discuss how
            professional graphic design can elevate your Istanbul business.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/contact">Get Free Consultation</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/projects">View My Work</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
