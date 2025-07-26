import React from "react";
import { Metadata } from "next";
import { getAllBlogPosts, getAllBlogCategories } from "../../data/blog";
import {
  BackgroundHero,
  SectionContainer,
  BlogCard,
  GridLayout,
  VisualElement,
} from "@/components/ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Search, Filter } from "lucide-react";

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

        {/* Categories Filter */}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            All Categories
          </Button>
          {categories.map((category) => (
            <Button key={category.id} variant="ghost" size="sm" asChild>
              <Link href={`/blog/category/${category.slug}`}>
                {category.name}
              </Link>
            </Button>
          ))}
        </div>

        {/* Blog Posts Grid */}
        <GridLayout columns={3} gap="gap-8">
          {allPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </GridLayout>

        {/* Newsletter Signup */}
        <div className="mt-16 rounded-lg bg-muted/50 p-8 text-center">
          <h3 className="mb-4 text-2xl font-semibold">
            Stay Updated with Design Insights
          </h3>
          <p className="mb-6 text-muted-foreground">
            Get the latest web design trends, SEO tips, and industry insights
            delivered to your inbox.
          </p>
          <div className="mx-auto flex max-w-md gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 rounded-md border bg-background px-3 py-2 text-sm"
            />
            <Button>Subscribe</Button>
          </div>
        </div>
      </SectionContainer>
    </main>
  );
};

export default BlogPage;
