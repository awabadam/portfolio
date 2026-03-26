"use client";

import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, Tag } from "lucide-react";
import { BlogPost } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export const BlogCard = ({ post, featured = false }: BlogCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card className="group h-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <Link href={`/blog/${post.slug}`} className="block h-full">
        <div className="relative aspect-video overflow-hidden">
          {post.featured_image_url ? (
            <Image
              src={post.featured_image_url}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-muted">
              <div className="text-muted-foreground">No Image</div>
            </div>
          )}
          {featured && (
            <Badge className="absolute left-2 top-2 bg-primary text-primary-foreground">
              Featured
            </Badge>
          )}
        </div>

        <CardContent className="p-6">
          <div className="mb-3 flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(post.published_at || post.created_at)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{post.reading_time} min read</span>
            </div>
          </div>

          <Badge variant="secondary" className="mb-3">
            {post.category}
          </Badge>

          <h3 className="mb-3 text-xl font-semibold leading-tight transition-colors group-hover:text-primary">
            {post.title}
          </h3>

          <p className="line-clamp-3 text-muted-foreground">{post.excerpt}</p>
        </CardContent>

        <CardFooter className="p-6 pt-0">
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {post.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{post.tags.length - 3} more
              </Badge>
            )}
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
};
