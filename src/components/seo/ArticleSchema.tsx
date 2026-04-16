interface ArticleSchemaProps {
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  publishedTime: string;
  modifiedTime: string;
  authorName: string;
  tags: string[];
  wordCount?: number;
}

export default function ArticleSchema({
  title,
  description,
  url,
  imageUrl,
  publishedTime,
  modifiedTime,
  authorName,
  tags,
  wordCount,
}: ArticleSchemaProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url: `https://www.awab.design${url}`,
    image: imageUrl,
    datePublished: publishedTime,
    dateModified: modifiedTime,
    wordCount,
    author: {
      "@type": "Person",
      name: authorName,
      url: "https://www.awab.design",
    },
    publisher: {
      "@type": "Person",
      name: "Awab Design",
      url: "https://www.awab.design",
      logo: {
        "@type": "ImageObject",
        url: "https://www.awab.design/img/hero-image.jpg",
      },
    },
    keywords: tags.join(", "),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.awab.design${url}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
