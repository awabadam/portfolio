import { Metadata } from "next";
import AboutHero from "@/components/about/AboutHero";
import AboutContent from "@/components/about/AboutContent";
import DetailedSkills from "@/components/about/DetailedSkills";
import { skillCategories } from "@/data/skills";

export const metadata: Metadata = {
  title: "About Awab Elkhalil | Web Designer & Developer in Istanbul",
  description:
    "Learn about Awab Elkhalil, a professional web designer and developer based in Istanbul. Specializing in modern web design, UI/UX, and conversion-focused websites.",
  keywords: [
    "about Awab Elkhalil",
    "Istanbul web designer",
    "web developer portfolio",
    "UI/UX designer Istanbul",
    "professional web designer",
  ],
  openGraph: {
    title: "About Awab Elkhalil | Web Designer & Developer in Istanbul",
    description:
      "Learn about Awab Elkhalil, a professional web designer and developer based in Istanbul. Specializing in modern web design, UI/UX, and conversion-focused websites.",
    url: "https://awab.design/about",
  },
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center">
      <AboutHero />
      <AboutContent />
      <DetailedSkills skillCategories={skillCategories} />
    </main>
  );
}
