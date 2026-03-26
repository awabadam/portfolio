"use client";

import { BlogPost } from "@/types";
import { BlogCard } from "@/components/cards/BlogCard";
import { SectionContainer, GridLayout } from "@/components/layout";
import { VisualElement } from "@/components/effects";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface BlogSectionProps {
  posts: BlogPost[];
}

export const Blog = ({ posts }: BlogSectionProps) => {
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-muted/20 py-16">
      <SectionContainer
        title="Latest Insights"
        subtitle="Design Tips & Industry Trends"
        centered
        decorative
        className="relative overflow-hidden"
      >
        <p className="mx-auto mb-8 max-w-3xl text-center text-muted-foreground">
          Stay updated with the latest web design trends, SEO tips, and insights
          from the design industry. Discover practical advice to improve your
          digital presence.
        </p>
        <VisualElement
          type="blob"
          position="top-left"
          size="medium"
          opacity={0.05}
        />

        {/* Featured Blog Posts */}
        <GridLayout columns={3} gap="gap-8" className="mb-12">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </GridLayout>

        {/* Call to Action */}
        <div className="text-center">
          <Button asChild size="lg" className="group">
            <Link href="/blog">
              View All Articles
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </SectionContainer>
    </section>
  );
};
