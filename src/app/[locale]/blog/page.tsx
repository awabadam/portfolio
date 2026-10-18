import React from "react";
import { Metadata } from "next";
import { getAllBlogPosts, getAllBlogCategories } from "@/data/blog";
import BlogList from "@/components/blog/BlogList";
import BlogHero from "@/components/blog/BlogHero";
import AuditCta from "@/components/audit/AuditCta";
import { getTranslations, getLocale } from 'next-intl/server';
import { ogLocale, pageAlternates, localeUrl } from "@/lib/seo";

// Revalidate every 60 seconds to show fresh blog content
export const revalidate = 60;

// OG image: ./opengraph-image.tsx
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata.blog');
  const locale = await getLocale();

  return {
    title: t('title'),
    description: t('description'),
    keywords: [
      "clinic website blog",
      "medical tourism website",
      "Istanbul clinic website",
      "multilingual clinic website",
      "clinic lead tracking",
      "Google Ads offline conversions",
      "WhatsApp lead tracking",
    ],
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: localeUrl("/blog", locale),
      locale: ogLocale(locale),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t('title'),
      description: t('description'),
    },
    alternates: pageAlternates("/blog", locale),
  };
}

const BlogPage = async () => {
  const locale = await getLocale();
  const [allPosts, categories] = await Promise.all([
    getAllBlogPosts(locale),
    getAllBlogCategories(),
  ]);

  return (
    <main className="flex min-h-screen w-full flex-col bg-background pt-32">
      <BlogHero />
      <BlogList posts={allPosts} categories={categories} />
      {/* Dark closing band: the free readiness check is the lead magnet */}
      <AuditCta location="blog_list" className="mt-20 md:mt-28" />
    </main>
  );
};

export default BlogPage;
