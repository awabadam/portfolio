import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getBlogPostsByCategory,
  getAllBlogCategories,
} from "../../../../data/blog";
import {
  BackgroundHero,
  SectionContainer,
  BlogCard,
  GridLayout,
  VisualElement,
} from "@/components/ui";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// Revalidate every 60 seconds to show fresh blog content
export const revalidate = 60;

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const categories = await getAllBlogCategories();
  const category = categories.find((cat) => cat.slug === params.slug);

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
    },
    alternates: {
      canonical: `/blog/category/${category.slug}`,
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
  const [posts, categories] = await Promise.all([
    getBlogPostsByCategory(params.slug),
    getAllBlogCategories(),
  ]);

  const currentCategory = categories.find((cat) => cat.slug === params.slug);

  if (!currentCategory || posts.length === 0) {
    notFound();
  }

  return (
    <main className="flex min-h-screen w-full flex-col items-center">
      <BackgroundHero
        title={currentCategory.name}
        subtitle="Category Articles"
        description={
          currentCategory.description ||
          `Browse ${currentCategory.name} articles and insights.`
        }
        backgroundSrc="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=2072&auto=format&fit=crop"
        className="relative overflow-hidden"
      />

      <SectionContainer
        title={`${currentCategory.name} Articles`}
        subtitle={`Browse through our ${currentCategory.name.toLowerCase()} insights and tips`}
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
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>
          </Button>
        </nav>

        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={category.slug === params.slug ? "default" : "ghost"}
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
              No articles found in this category
            </h3>
            <p className="mb-6 text-muted-foreground">
              Check back soon for new articles in this category.
            </p>
            <Button asChild>
              <Link href="/blog">Browse All Articles</Link>
            </Button>
          </div>
        )}
      </SectionContainer>
    </main>
  );
};

export default CategoryPage;
