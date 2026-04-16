interface CreativeWorkSchemaProps {
  name: string;
  description: string;
  url: string;
  imageUrl?: string;
  technologies?: string[];
  category?: string;
}

export default function CreativeWorkSchema({
  name,
  description,
  url,
  imageUrl,
  technologies,
  category,
}: CreativeWorkSchemaProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name,
    description,
    url: `https://www.awab.design${url}`,
    image: imageUrl,
    creator: {
      "@type": "Person",
      name: "Awab Elkhalil",
      url: "https://www.awab.design",
    },
    genre: category,
    keywords: technologies?.join(", "),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
