"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BlogCard, GridLayout } from "@/components/ui";
import { Search, Filter, Check, X } from "lucide-react";
import Link from "next/link";
import { BlogPost, BlogCategory } from "@/types";

interface BlogInteractiveProps {
  posts: BlogPost[];
  categories: BlogCategory[];
}

export default function BlogInteractive({
  posts,
  categories,
}: BlogInteractiveProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [newsletterError, setNewsletterError] = useState<string | null>(null);

  // Filter posts based on search and category
  const filteredPosts = useMemo(() => {
    let filtered = posts;

    // Filter by category
    if (selectedCategory) {
      const category = categories.find((c) => c.slug === selectedCategory);
      if (category) {
        // Handle both string category and object category
        filtered = filtered.filter((post) => {
          if (typeof post.category === "string") {
            return post.category === category.name;
          }
          return (
            (post.category as any)?.slug === selectedCategory ||
            (post.category as any)?.name === category.name
          );
        });
      }
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt?.toLowerCase().includes(query) ||
          post.content?.toLowerCase().includes(query) ||
          post.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [posts, searchQuery, selectedCategory, categories]);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribing(true);
    setNewsletterError(null);

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: newsletterEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to subscribe");
      }

      setIsSubscribed(true);
      setNewsletterEmail("");

      setTimeout(() => {
        setIsSubscribed(false);
      }, 5000);
    } catch (err) {
      if (err instanceof Error) {
        setNewsletterError(err.message);
      } else {
        setNewsletterError("Something went wrong. Please try again later.");
      }
      console.error("Error subscribing to newsletter:", err);
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <>
      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative mx-auto max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Categories Filter */}
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          size="sm"
          className="gap-2"
          onClick={() => setSelectedCategory(null)}
        >
          <Filter className="h-4 w-4" />
          All Categories
        </Button>
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.slug ? "default" : "ghost"}
            size="sm"
            onClick={() => setSelectedCategory(category.slug)}
          >
            {category.name}
          </Button>
        ))}
      </div>

      {/* Search Results Count */}
      {(searchQuery || selectedCategory) && (
        <div className="mb-6 text-center">
          <p className="text-sm text-muted-foreground">
            Found {filteredPosts.length} article
            {filteredPosts.length !== 1 ? "s" : ""}
            {searchQuery && ` matching "${searchQuery}"`}
            {selectedCategory &&
              ` in ${categories.find((c) => c.slug === selectedCategory)?.name}`}
          </p>
        </div>
      )}

      {/* Blog Posts Grid */}
      {filteredPosts.length > 0 ? (
        <GridLayout columns={3} gap="gap-8">
          {filteredPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </GridLayout>
      ) : (
        <div className="py-12 text-center">
          <p className="text-lg text-muted-foreground">
            No articles found matching your criteria.
          </p>
          {(searchQuery || selectedCategory) && (
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory(null);
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>
      )}

      {/* Newsletter Signup */}
      <div className="mt-16 rounded-lg bg-muted/50 p-8 text-center">
        <h3 className="mb-4 text-2xl font-semibold">
          Stay Updated with Design Insights
        </h3>
        <p className="mb-6 text-muted-foreground">
          Get the latest web design trends, SEO tips, and industry insights
          delivered to your inbox.
        </p>
        {isSubscribed ? (
          <div className="mx-auto flex max-w-md flex-col items-center gap-2">
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
              <Check className="h-6 w-6 text-primary" />
            </div>
            <h4 className="text-lg font-medium">Subscribed Successfully!</h4>
            <p className="text-sm text-muted-foreground">
              Thank you for subscribing. Check your inbox for a confirmation
              email.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleNewsletterSubmit}
            className="mx-auto flex max-w-md flex-col gap-2"
          >
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
              />
              <Button type="submit" disabled={isSubscribing}>
                {isSubscribing ? "Subscribing..." : "Subscribe"}
              </Button>
            </div>
            {newsletterError && (
              <p className="text-center text-sm text-red-500">
                {newsletterError}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              We respect your privacy. No spam, ever.
            </p>
          </form>
        )}
      </div>
    </>
  );
}

