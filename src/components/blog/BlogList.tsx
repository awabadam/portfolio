"use client";

import { useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { BlogPost, BlogCategory } from "@/types";
import { ArrowUpRight } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/effects";
import { cn } from "@/lib/utils";

interface BlogListProps {
  posts: BlogPost[];
  categories: BlogCategory[];
}

const chipClass = (active: boolean) =>
  cn(
    "rounded-full px-4 py-1.5 text-sm transition-colors",
    active
      ? "bg-foreground text-background"
      : "border border-border bg-background text-muted-foreground hover:border-foreground/40 hover:text-foreground",
  );

export default function BlogList({ posts, categories }: BlogListProps) {
  const t = useTranslations('blog');
  const locale = useLocale();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Only offer chips for categories that actually have a published post.
  const usedCategories = categories.filter((category) =>
    posts.some((post) => post.category === category.name),
  );

  const filteredPosts =
    selectedCategory === "All"
      ? posts
      : posts.filter((post) => post.category === selectedCategory);

  return (
    <div className="w-full">
      {/* Categories */}
      {usedCategories.length > 1 && (
        <div className="container mx-auto mb-10 px-5 md:px-8">
          <ScrollReveal animation="fadeUp">
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setSelectedCategory("All")} className={chipClass(selectedCategory === "All")}>
                {t('all')}
              </button>
              {usedCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.name)}
                  className={chipClass(selectedCategory === category.name)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </ScrollReveal>
        </div>
      )}

      {/* Post list: one thin rule between entries, meta on a single mono row */}
      <StaggerContainer className="divide-y divide-border/60 border-y border-border/60" staggerDelay={0.08}>
        {filteredPosts.map((post) => {
          const cover = post.featured_image_url || post.cover_image;
          return (
          <StaggerItem key={post.id} animation="fadeUp">
            <Link
              href={`/blog/${post.slug}`}
              className="group block w-full py-8 transition-colors hover:bg-muted/30 md:py-10"
            >
              <div className="container mx-auto px-5 md:px-8">
                <div className="grid gap-4 md:grid-cols-12 md:gap-8">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs uppercase tracking-wide text-muted-foreground md:col-span-3 md:flex-col md:items-start md:gap-y-2">
                    <time dateTime={post.published_at || post.created_at}>
                      {new Date(post.published_at || post.created_at).toLocaleDateString(locale, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </time>
                    <span className="md:hidden" aria-hidden="true">·</span>
                    <span>{post.category}</span>
                    {post.reading_time && (
                      <>
                        <span className="md:hidden" aria-hidden="true">·</span>
                        <span>{post.reading_time} {t('minRead')}</span>
                      </>
                    )}
                  </div>

                  <div className="md:col-span-6">
                    <h2 className="font-display text-2xl leading-tight tracking-tight text-foreground md:text-[28px]">
                      {post.title}
                    </h2>
                    <p className="mt-3 line-clamp-2 max-w-xl text-muted-foreground">
                      {post.excerpt}
                    </p>
                  </div>

                  {cover ? (
                    <div className="relative order-first aspect-[16/9] overflow-hidden rounded-[10px] bg-muted md:order-none md:col-span-3 md:aspect-[3/2]">
                      <Image
                        src={cover}
                        alt=""
                        fill
                        sizes="(min-width: 1312px) 300px, (min-width: 768px) 25vw, 100vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      />
                    </div>
                  ) : (
                    <div className="hidden md:col-span-3 md:flex md:items-start md:justify-end">
                      <ArrowUpRight
                        aria-hidden="true"
                        className="h-5 w-5 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5 rtl:group-hover:translate-x-0"
                      />
                    </div>
                  )}
                </div>
              </div>
            </Link>
          </StaggerItem>
          );
        })}
      </StaggerContainer>
    </div>
  );
}
