import React from "react";
import { Metadata } from "next";
import { getAllBlogPosts, getAllBlogCategories } from "../../data/blog";
import {
  BackgroundHero,
  SectionContainer,
  VisualElement,
} from "@/components/ui";
import BlogInteractive from "@/components/blog/BlogInteractive";

// Revalidate every 60 seconds to show fresh blog content
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog | Web Design & Development Insights | Awab Elkhalil",
  description:
    "Explore insights on web design, UI/UX, SEO, and digital marketing. Expert tips and trends from a professional web designer in Istanbul.",
  keywords: [
    "web design blog",
    "UI/UX design tips",
    "SEO strategies",
    "digital marketing insights",
    "web development blog",
    "design trends",
    "freelance design tips",
    "Istanbul web designer blog",
  ],
  openGraph: {
    title: "Blog | Web Design & Development Insights | Awab Elkhalil",
    description:
      "Explore insights on web design, UI/UX, SEO, and digital marketing. Expert tips and trends from a professional web designer in Istanbul.",
    url: "https://awab.design/blog",
  },
  alternates: {
    canonical: "/blog",
  },
};

const BlogPage = async () => {
  const [allPosts, categories] = await Promise.all([
    getAllBlogPosts(),
    getAllBlogCategories(),
  ]);

  return (
    <main className="flex min-h-screen w-full flex-col items-center">
      <BackgroundHero
        title="Blog"
        subtitle="Design Insights & Tips"
        description="Explore the latest trends in web design, UI/UX best practices, SEO strategies, and insights from the digital design industry."
        backgroundSrc="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=2072&auto=format&fit=crop"
        className="relative overflow-hidden"
      />

      <SectionContainer
        title="All Articles"
        subtitle="Browse through our latest insights and tips"
        centered
        decorative
        className="relative overflow-hidden"
      >
        <VisualElement
          type="blob"
          position="bottom-right"
          size="medium"
          opacity={0.05}
        />

        <BlogInteractive posts={allPosts} categories={categories} />
      </SectionContainer>
    </main>
  );
};

export default BlogPage;
