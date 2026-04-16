import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogPostBySlug, getAllBlogPosts } from "@/data/blog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from '@/i18n/routing';
import Image from "next/image";
import { Calendar, Clock, ArrowLeft, Share2 } from "lucide-react";
import BlogContent from "@/components/blog/BlogContent";
import BlogCTA from "@/components/blog/BlogCTA";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import ArticleSchema from "@/components/seo/ArticleSchema";
import { getTranslations, getLocale } from 'next-intl/server';

// Revalidate every 60 seconds to show fresh blog content
export const revalidate = 60;

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  const locale = await getLocale();
  const ogLocale = locale === 'ar' ? 'ar_SA' : locale === 'tr' ? 'tr_TR' : 'en_US';

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt,
    keywords: post.tags,
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt,
      url: `https://www.awab.design/blog/${post.slug}`,
      type: "article",
      locale: ogLocale,
      publishedTime: post.published_at,
      modifiedTime: post.updated_at,
      authors: ["Awab Elkhalil"],
      tags: post.tags,
      images: post.featured_image_url
        ? [
            {
              url: post.featured_image_url,
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt,
      images: post.featured_image_url ? [post.featured_image_url] : [],
    },
    alternates: {
      canonical: `/blog/${post.slug}`,
      languages: { en: `/blog/${post.slug}`, ar: `/ar/blog/${post.slug}`, tr: `/tr/blog/${post.slug}`, fr: `/fr/blog/${post.slug}` },
    },
  };
}

export async function generateStaticParams() {
  const posts = await getAllBlogPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

const BlogPostPage = async ({ params }: BlogPostPageProps) => {
  const { slug } = await params;
  const t = await getTranslations('blog');
  const locale = await getLocale();
  const post = await getBlogPostBySlug(slug, locale);

  if (!post) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
    <Breadcrumbs items={[
      { name: "Home", url: "/" },
      { name: "Blog", url: "/blog" },
      { name: post.title, url: `/blog/${post.slug}` },
    ]} />
    <ArticleSchema
      title={post.title}
      description={post.meta_description || post.excerpt}
      url={`/blog/${post.slug}`}
      imageUrl={post.featured_image_url}
      publishedTime={post.published_at || post.created_at}
      modifiedTime={post.updated_at}
      authorName="Awab Elkhalil"
      tags={post.tags}
    />
    <main className="min-h-screen bg-background">
      {/* Immersive Hero */}
      <div className="relative h-[80vh] w-full overflow-hidden">
        {post.featured_image_url && (
          <Image
            src={post.featured_image_url}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-black/60" />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container px-4 text-center">
            <div className="mx-auto max-w-4xl space-y-8">
              <div className="flex justify-center gap-4">
                <Badge variant="secondary" className="rounded-full bg-white/10 text-white hover:bg-white/20">
                  {post.category}
                </Badge>
              </div>

              <h1 className="font-display text-5xl font-bold leading-tight tracking-tight text-white md:text-7xl">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center justify-center gap-8 text-white/80">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(post.published_at || post.created_at)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{post.reading_time} {t('minRead')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-24">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/blog"
            className="mb-12 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
            {t('backToJournal')}
          </Link>

          <p className="lead mb-16 text-2xl leading-relaxed text-foreground md:text-3xl">
            {post.excerpt}
          </p>

          <BlogContent content={post.content} />

          <div className="mt-16 flex flex-wrap gap-2 border-t border-border pt-16">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="rounded-full px-4 py-2">
                #{tag}
              </Badge>
            ))}
          </div>

          <div className="mt-12 flex justify-between border-t border-border pt-12">
            <Button variant="outline" className="gap-2">
              <Share2 className="h-4 w-4" />
              {t('shareArticle')}
            </Button>
          </div>

          <BlogCTA />
        </div>
      </div>
    </main>
    </>
  );
};

export default BlogPostPage;
