import { Metadata } from "next";
import AboutHero from "@/components/about/AboutHero";
import AboutContent from "@/components/about/AboutContent";
import DetailedSkills from "@/components/about/DetailedSkills";
import { skillCategories } from "@/data/skills";

export const metadata: Metadata = {
  title: "About Awab Elkhalil | Web Designer & Developer",
  description:
    "Learn more about Awab Elkhalil, a professional web designer and developer based in Istanbul, specializing in creating stunning, conversion-focused websites.",
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
