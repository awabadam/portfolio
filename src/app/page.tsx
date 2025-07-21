import {
  Header,
  Projects,
  About,
  Skills,
  Services,
  Testimonials,
  Contact,
} from "../components";
import { Metadata } from "next";
import { getFeaturedProjects } from "../data/projects";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Webdesign Istanbul | Graphic Design Istanbul | Awab Elkhalil",
  description:
    "Professional webdesign Istanbul & graphic design Istanbul services. Expert web designer and graphic designer in Istanbul, Turkey. Modern websites, logos, branding & UI/UX design. Free consultation available.",
  keywords: [
    "webdesign Istanbul",
    "graphic design Istanbul",
    "web designer Istanbul",
    "graphic designer Istanbul",
    "website design Istanbul",
    "logo design Istanbul",
    "branding Istanbul",
    "UI/UX design Istanbul",
    "web development Istanbul",
    "digital design Istanbul",
    "responsive web design Istanbul",
    "e-commerce website Istanbul",
    "business website Istanbul",
    "portfolio website Istanbul",
    "SEO optimization Istanbul",
  ],
  authors: [{ name: "Awab Elkhalil" }],
  creator: "Awab Elkhalil",
  openGraph: {
    title:
      "Webdesign Istanbul | Graphic Design Istanbul | Professional Designer",
    description:
      "Expert webdesign and graphic design services in Istanbul. Professional web designer and graphic designer creating stunning websites, logos, and branding solutions.",
    url: "https://awab.design",
    siteName: "Awab Elkhalil - Webdesign & Graphic Design Istanbul",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Webdesign Istanbul | Graphic Design Istanbul | Awab Elkhalil",
    description:
      "Professional webdesign and graphic design services in Istanbul. Expert designer creating modern websites and branding solutions.",
    images: ["/og-image.png"],
    creator: "@awabelkhalil",
  },
};

export default async function Home() {
  const featuredProjects = await getFeaturedProjects(3);

  return (
    <main className="flex min-h-screen w-full flex-col items-center">
      {/* Hero Section - First impression and lead capture */}
      <Header />

      {/* Services Section - What I offer */}
      <Services />

      {/* Featured Projects - Showcase work */}
      <div className="w-full">
        <Projects projects={featuredProjects} featured={true} />
      </div>

      {/* Testimonials - Social proof */}
      <Testimonials />

      {/* About Section - Personal connection */}
      <About />

      {/* Skills Section - Technical expertise */}
      <Skills />

      {/* Local SEO Section */}
      <section className="w-full bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-3xl font-bold">
            Webdesign Istanbul & Graphic Design Expert
          </h2>
          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
            <div>
              <h3 className="mb-4 text-xl font-semibold">
                Webdesign Istanbul Services
              </h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className="text-primary">•</span>
                  Professional website design in Istanbul
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">•</span>
                  Responsive web development
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">•</span>
                  E-commerce website design
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">•</span>
                  SEO-optimized websites
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">•</span>
                  Local Istanbul business websites
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-xl font-semibold">
                Graphic Design Istanbul Services
              </h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className="text-primary">•</span>
                  Logo design in Istanbul
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">•</span>
                  Brand identity design
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">•</span>
                  UI/UX design services
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">•</span>
                  Marketing materials design
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-primary">•</span>
                  Istanbul business branding
                </li>
              </ul>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-12 text-center">
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/rate-calculator">Get Instant Price Quote</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="#contact">Free Consultation</Link>
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Get a personalized quote for your Istanbul business website
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section - Final conversion point */}
      <Contact />
    </main>
  );
}
