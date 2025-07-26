import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogPostBySlug, getAllBlogPosts } from "../../../data/blog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Calendar, Clock, ArrowLeft, Share2, BookOpen } from "lucide-react";
import { BlogPost } from "@/types";

// Revalidate every 60 seconds to show fresh blog content
export const revalidate = 60;

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);

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
      url: `https://awab.design/blog/${post.slug}`,
      type: "article",
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
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Convert markdown content to HTML (simple conversion for now)
  const convertMarkdownToHtml = (markdown: string) => {
    return markdown
      .replace(
        /^### (.*$)/gim,
        '<h3 class="text-xl font-semibold mb-4 mt-6">$1</h3>',
      )
      .replace(
        /^## (.*$)/gim,
        '<h2 class="text-2xl font-bold mb-6 mt-8">$1</h2>',
      )
      .replace(
        /^# (.*$)/gim,
        '<h1 class="text-3xl font-bold mb-6 mt-8">$1</h1>',
      )
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/^- (.*$)/gim, '<li class="ml-4">$1</li>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/^<p/, '<p class="mb-4"')
      .replace(/<\/p>$/, "</p>");
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-br from-primary/5 to-secondary/5 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            {/* Breadcrumb */}
            <nav className="mb-8">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/blog" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Blog
                </Link>
              </Button>
            </nav>

            {/* Post Header */}
            <div className="mb-8">
              <Badge variant="secondary" className="mb-4">
                {post.category}
              </Badge>
              <h1 className="mb-4 text-4xl font-bold leading-tight md:text-5xl">
                {post.title}
              </h1>
              <p className="mb-6 text-xl text-muted-foreground">
                {post.excerpt}
              </p>

              {/* Post Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {formatDate(post.published_at || post.created_at)}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{post.reading_time} min read</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  <span>{post.view_count} views</span>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            {post.featured_image_url && (
              <div className="mb-8 aspect-video overflow-hidden rounded-lg">
                <img
                  src={post.featured_image_url}
                  alt={post.title}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="w-full py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-8 lg:grid-cols-4">
              {/* Main Content */}
              <article className="lg:col-span-3">
                <div
                  className="prose prose-lg prose-headings:font-bold prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-li:text-muted-foreground max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: convertMarkdownToHtml(post.content),
                  }}
                />

                {/* Tags */}
                <div className="mt-8 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Share Buttons */}
                <div className="mt-8 flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    Share this article:
                  </span>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </div>
              </article>

              {/* Sidebar */}
              <aside className="lg:col-span-1">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="mb-4 text-lg font-semibold">
                      About the Author
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Awab Elkhalil is a professional web designer and developer
                      based in Istanbul, specializing in creating modern,
                      conversion-focused websites.
                    </p>
                    <Button asChild className="mt-4 w-full">
                      <Link href="/about">Learn More</Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardContent className="p-6">
                    <h3 className="mb-4 text-lg font-semibold">
                      Related Articles
                    </h3>
                    <div className="space-y-3">
                      <Link
                        href="/blog"
                        className="block text-sm text-muted-foreground hover:text-foreground"
                      >
                        Web Design Trends That Will Dominate 2024
                      </Link>
                      <Link
                        href="/blog"
                        className="block text-sm text-muted-foreground hover:text-foreground"
                      >
                        SEO Tips Every Web Designer Should Know
                      </Link>
                      <Link
                        href="/blog"
                        className="block text-sm text-muted-foreground hover:text-foreground"
                      >
                        Freelance Design Success: Tips from an Istanbul Designer
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </aside>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default BlogPostPage;
