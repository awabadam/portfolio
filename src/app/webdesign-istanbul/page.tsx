import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Check, Code, Layout, Palette, Zap, Users, Star } from "lucide-react";

export const metadata: Metadata = {
  title: "Webdesign Istanbul | Professional Website Design Services",
  description:
    "Professional webdesign Istanbul services. Expert website design and development in Istanbul, Turkey. Modern, responsive websites that convert. Free consultation available.",
  keywords: [
    "webdesign Istanbul",
    "website design Istanbul",
    "web designer Istanbul",
    "website development Istanbul",
    "responsive web design Istanbul",
    "e-commerce website Istanbul",
    "business website Istanbul",
    "professional webdesign Istanbul",
    "Istanbul web design services",
  ],
  openGraph: {
    title: "Webdesign Istanbul | Professional Website Design Services",
    description:
      "Professional webdesign Istanbul services. Expert website design and development in Istanbul, Turkey. Modern, responsive websites that convert.",
    url: "https://awab.design/webdesign-istanbul",
    siteName: "Awab Elkhalil - Webdesign Istanbul",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Webdesign Istanbul | Professional Website Design Services",
    description:
      "Professional webdesign Istanbul services. Expert website design and development in Istanbul, Turkey.",
    images: ["/og-image.png"],
    creator: "@awabelkhalil",
  },
};

export default function WebdesignIstanbul() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center">
      {/* Hero Section */}
      <section className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-16">
        <div className="space-y-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Professional{" "}
            <span className="text-primary">Webdesign Istanbul</span>
          </h1>
          <p className="mx-auto max-w-3xl text-xl leading-relaxed text-muted-foreground">
            Expert webdesign services in Istanbul, Turkey. Creating modern,
            conversion-focused websites that help businesses grow online and
            rank well on Google.
          </p>

          {/* Social Proof Stats */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">5+ Years Experience</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span className="font-medium">50+ Websites Created</span>
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
              Webdesign Istanbul Services
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
              Comprehensive webdesign solutions tailored for Istanbul businesses
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader>
                <Layout className="mb-4 h-10 w-10 text-primary" />
                <CardTitle>Business Website Design</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-muted-foreground">
                  Professional business websites designed to convert visitors
                  into customers.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-3 w-3 text-primary" />
                    Mobile-first responsive design
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-3 w-3 text-primary" />
                    SEO optimization for Istanbul market
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-3 w-3 text-primary" />
                    Contact forms & lead capture
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-3 w-3 text-primary" />
                    Fast loading times
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader>
                <Code className="mb-4 h-10 w-10 text-primary" />
                <CardTitle>E-commerce Website Design</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-muted-foreground">
                  Complete e-commerce solutions for online businesses in
                  Istanbul.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-3 w-3 text-primary" />
                    Shopping cart & payment integration
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-3 w-3 text-primary" />
                    Product catalog management
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-3 w-3 text-primary" />
                    Order tracking system
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-3 w-3 text-primary" />
                    Mobile shopping experience
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader>
                <Palette className="mb-4 h-10 w-10 text-primary" />
                <CardTitle>Portfolio Website Design</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-muted-foreground">
                  Showcase your work with stunning portfolio websites.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-3 w-3 text-primary" />
                    Project showcase galleries
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-3 w-3 text-primary" />
                    Professional about sections
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-3 w-3 text-primary" />
                    Contact forms
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <Check className="h-3 w-3 text-primary" />
                    Social media integration
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
              Why Choose Webdesign Istanbul Services?
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
              Local expertise combined with international design standards
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold">
                Local Istanbul Expertise
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <strong>Understanding of Istanbul Market:</strong> Deep
                    knowledge of local business needs and competition
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <strong>Local SEO Optimization:</strong> Websites optimized
                    for Istanbul and Turkish search results
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <strong>Turkish Language Support:</strong> Bilingual
                    websites for Turkish and international audiences
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <strong>Local Payment Integration:</strong> Support for
                    Turkish payment methods and banking
                  </div>
                </li>
              </ul>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-semibold">Professional Standards</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <strong>Modern Design:</strong> Latest design trends and
                    user experience best practices
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <strong>Fast Performance:</strong> Optimized for speed and
                    Core Web Vitals
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <strong>Mobile-First:</strong> Responsive design that works
                    perfectly on all devices
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 text-primary" />
                  <div>
                    <strong>Ongoing Support:</strong> Maintenance and updates to
                    keep your website current
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full bg-primary/5 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">
            Ready to Start Your Webdesign Istanbul Project?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-muted-foreground">
            Get a free consultation and website audit. Let's discuss how
            professional webdesign can grow your Istanbul business.
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
