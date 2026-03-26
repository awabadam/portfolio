import React from "react";
import { Metadata } from "next";
import { getAllBlogPosts, getAllBlogCategories } from "../../data/blog";
import BlogList from "@/components/blog/BlogList";
import BlogHero from "@/components/blog/BlogHero";

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
    <main className="flex min-h-screen w-full flex-col bg-background pt-32">
      <BlogHero postCount={allPosts.length} />
      <BlogList posts={allPosts} categories={categories} />
    </main>
  );
};

export default BlogPage;
