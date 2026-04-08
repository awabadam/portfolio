import React from "react";
import { Metadata } from "next";
import { getAllBlogPosts, getAllBlogCategories } from "@/data/blog";
import BlogList from "@/components/blog/BlogList";
import BlogHero from "@/components/blog/BlogHero";
import { getTranslations, getLocale } from 'next-intl/server';

// Revalidate every 60 seconds to show fresh blog content
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata.blog');
  const locale = await getLocale();
  const ogLocale = locale === 'ar' ? 'ar_SA' : locale === 'tr' ? 'tr_TR' : 'en_US';

  return {
    title: t('title'),
    description: t('description'),
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
      title: t('title'),
      description: t('description'),
      url: "https://awab.design/blog",
      locale: ogLocale,
    },
    alternates: {
      canonical: "/blog",
      languages: { en: '/blog', ar: '/ar/blog', tr: '/tr/blog', fr: '/fr/blog' },
    },
  };
}

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
