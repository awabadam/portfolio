import React from "react";
import { Metadata } from "next";
import { getAllBlogPosts, getAllBlogCategories } from "../../data/blog";
import BlogList from "@/components/blog/BlogList";

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
      <div className="container mx-auto mb-24 px-4">
        <h1 className="font-display text-display-1 font-bold leading-none tracking-tighter">
          JOURNAL
          <span className="ml-4 text-lg font-normal tracking-normal text-muted-foreground md:text-xl">
            ({allPosts.length})
          </span>
        </h1>
        <p className="mt-8 max-w-2xl text-xl leading-relaxed text-muted-foreground">
          Thoughts on design, development, and the future of digital experiences.
        </p>
      </div>

      <BlogList posts={allPosts} categories={categories} />
    </main>
  );
};

export default BlogPage;
