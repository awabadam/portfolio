"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function BlogContent({ content }: { content: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Convert markdown content to HTML
  const convertMarkdownToHtml = (markdown: string) => {
    return markdown
      .replace(
        /^### (.*$)/gim,
        '<h3 class="text-2xl font-bold mt-12 mb-6 font-display tracking-tight">$1</h3>',
      )
      .replace(
        /^## (.*$)/gim,
        '<h2 class="text-3xl font-bold mt-16 mb-8 font-display tracking-tight">$1</h2>',
      )
      .replace(
        /^# (.*$)/gim,
        '<h1 class="text-4xl font-bold mt-16 mb-8 font-display tracking-tight">$1</h1>',
      )
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors">$1</a>')
      .replace(/^- (.*$)/gim, '<li class="ml-4 mb-2 relative pl-6 before:content-[\'•\'] before:absolute before:left-0 before:text-primary">$1</li>')
      .replace(/\n\n/g, '</p><p class="mb-8 leading-relaxed text-lg text-muted-foreground">')
      .replace(/^<p/, '<p class="mb-8 leading-relaxed text-lg text-muted-foreground"')
      .replace(/<\/p>$/, "</p>");
  };

  return (
    <div 
      ref={containerRef}
      className="prose prose-lg max-w-none dark:prose-invert"
      dangerouslySetInnerHTML={{
        __html: convertMarkdownToHtml(content),
      }}
    />
  );
}
