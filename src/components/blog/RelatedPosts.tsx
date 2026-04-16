import { Link } from "@/i18n/routing";
import { BlogPost } from "@/types";
import Image from "next/image";

interface RelatedPostsProps {
  posts: BlogPost[];
  heading: string;
}

export default function RelatedPosts({ posts, heading }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-16 border-t border-border pt-16">
      <h2 className="mb-8 font-display text-2xl font-bold">{heading}</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group rounded-xl border border-border/40 overflow-hidden transition-all hover:border-primary/30 hover:shadow-md"
          >
            {post.featured_image_url && (
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={post.featured_image_url}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
            )}
            <div className="p-4">
              <h3 className="font-display font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                {post.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                {post.excerpt}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
