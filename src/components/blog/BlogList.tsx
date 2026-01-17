"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BlogPost, BlogCategory } from "@/types";
import { ArrowRight, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BlogListProps {
  posts: BlogPost[];
  categories: BlogCategory[];
}

export default function BlogList({ posts, categories }: BlogListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const filteredPosts =
    selectedCategory === "All"
      ? posts
      : posts.filter((post) => post.category === selectedCategory);

  return (
    <div className="w-full">
      {/* Categories */}
      <div className="container mx-auto mb-16 px-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`rounded-full px-6 py-2 text-sm transition-all ${
              selectedCategory === "All"
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-background hover:border-primary"
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.name)}
              className={`rounded-full px-6 py-2 text-sm transition-all ${
                selectedCategory === category.name
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-background hover:border-primary"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Blog List */}
      <div className="divide-y divide-border border-y border-border">
        {filteredPosts.map((post, index) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group relative flex w-full flex-col gap-8 py-16 transition-colors hover:bg-muted/30 md:flex-row md:items-center md:justify-between"
          >
            <div className="container mx-auto px-4">
              <div className="grid gap-8 md:grid-cols-12 md:items-center">
                <div className="font-mono text-sm text-muted-foreground md:col-span-2">
                  {new Date(post.published_at || post.created_at).toLocaleDateString(
                    "en-US",
                    {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    },
                  )}
                </div>
                
                <div className="md:col-span-7">
                  <h2 className="mb-4 font-display text-3xl font-bold leading-tight tracking-tight transition-colors group-hover:text-primary md:text-5xl">
                    {post.title}
                  </h2>
                  <p className="line-clamp-2 max-w-xl text-muted-foreground">
                    {post.excerpt}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 md:col-span-3 md:justify-end">
                  <Badge variant="outline" className="rounded-full">
                    {post.category}
                  </Badge>
                  {post.reading_time && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{post.reading_time} min</span>
                    </div>
                  )}
                  <ArrowRight className="hidden h-6 w-6 -rotate-45 transition-transform duration-500 group-hover:rotate-0 md:block" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
