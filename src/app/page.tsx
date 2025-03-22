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

export const metadata: Metadata = {
  title: "Awab Elkhalil | Web Designer & Developer | Istanbul",
  description:
    "Awab Elkhalil is a professional web designer and developer specializing in creating stunning, conversion-focused websites for businesses in Istanbul and worldwide.",
  keywords: [
    "web design",
    "web development",
    "UI/UX design",
    "Istanbul web designer",
    "responsive websites",
    "Next.js developer",
    "Tailwind CSS",
    "brand identity",
    "portfolio",
  ],
  authors: [{ name: "Awab Elkhalil" }],
  creator: "Awab Elkhalil",
  openGraph: {
    title: "Awab Elkhalil | Web Designer & Developer | Istanbul",
    description:
      "Professional web design and development services that help businesses stand out online and convert visitors into customers.",
    url: "https://awabekhalil.com",
    siteName: "Awab Elkhalil Portfolio",
    locale: "en_US",
    type: "website",
  },
};

export default function Home() {
  const featuredProjects = getFeaturedProjects(3);

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

      {/* Testimonials - Social proof  <Testimonials /> */}

      {/* About Section - Personal connection */}
      <About />

      {/* Skills Section - Technical expertise */}
      <Skills />

      {/* Contact Section - Final conversion point */}
      <Contact />
    </main>
  );
}
