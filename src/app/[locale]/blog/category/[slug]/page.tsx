import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getBlogPostsByCategory,
  getAllBlogCategories,
} from "@/data/blog";
import {
  BackgroundHero,
  SectionContainer,
  BlogCard,
  GridLayout,
  VisualElement,
} from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Link } from '@/i18n/routing';
import { ArrowLeft } from "lucide-react";
import { getTranslations, getLocale } from 'next-intl/server';

// Revalidate every 60 seconds to show fresh blog content
export const revalidate = 60;

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getAllBlogCategories();
  const category = categories.find((cat) => cat.slug === slug);
  const locale = await getLocale();
  const ogLocale = locale === 'ar' ? 'ar_SA' : locale === 'tr' ? 'tr_TR' : 'en_US';

  if (!category) {
    return {
      title: "Category Not Found",
    };
  }

  return {
    title: `${category.name} Articles | Web Design Blog | Awab Elkhalil`,
    description:
      category.description ||
      `Browse ${category.name} articles and insights from a professional web designer in Istanbul.`,
    keywords: [
      category.name.toLowerCase(),
      "web design",
      "blog",
      "Istanbul",
      "design tips",
    ],
    openGraph: {
      title: `${category.name} Articles | Web Design Blog | Awab Elkhalil`,
      description:
        category.description ||
        `Browse ${category.name} articles and insights from a professional web designer in Istanbul.`,
      url: `https://awab.design/blog/category/${category.slug}`,
      locale: ogLocale,
    },
    alternates: {
      canonical: `/blog/category/${category.slug}`,
      languages: { en: `/blog/category/${category.slug}`, ar: `/ar/blog/category/${category.slug}`, tr: `/tr/blog/category/${category.slug}`, fr: `/fr/blog/category/${category.slug}` },
    },
  };
}

export async function generateStaticParams() {
  const categories = await getAllBlogCategories();

  return categories.map((category) => ({
    slug: category.slug,
  }));
}

const CategoryPage = async ({ params }: CategoryPageProps) => {
  const { slug } = await params;
  const t = await getTranslations('blog');
  const locale = await getLocale();
  const [posts, categories] = await Promise.all([
    getBlogPostsByCategory(slug, locale),
    getAllBlogCategories(),
  ]);

  const currentCategory = categories.find((cat) => cat.slug === slug);

  if (!currentCategory || posts.length === 0) {
    notFound();
  }

  return (
    <main className="flex min-h-screen w-full flex-col items-center">
      <BackgroundHero
        title={currentCategory.name}
        subtitle={t('categoryArticles')}
        description={
          currentCategory.description ||
          t('browse', { category: currentCategory.name })
        }
        backgroundSrc="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=2072&auto=format&fit=crop"
        className="relative overflow-hidden"
      />

      <SectionContainer
        title={`${currentCategory.name} Articles`}
        subtitle={t('browse', { category: currentCategory.name.toLowerCase() })}
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

        {/* Breadcrumb */}
        <nav className="mb-8">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/blog" className="gap-2">
              <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
              {t('backToBlog')}
            </Link>
          </Button>
        </nav>

        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={category.slug === slug ? "default" : "ghost"}
              size="sm"
              asChild
            >
              <Link href={`/blog/category/${category.slug}`}>
                {category.name}
              </Link>
            </Button>
          ))}
        </div>

        {/* Blog Posts Grid */}
        <GridLayout columns={3} gap="gap-8">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </GridLayout>

        {/* No Posts Message */}
        {posts.length === 0 && (
          <div className="py-12 text-center">
            <h3 className="mb-4 text-xl font-semibold">
              {t('noArticles')}
            </h3>
            <p className="mb-6 text-muted-foreground">
              {t('checkBack')}
            </p>
            <Button asChild>
              <Link href="/blog">{t('browseAll')}</Link>
            </Button>
          </div>
        )}
      </SectionContainer>
    </main>
  );
};

export default CategoryPage;
