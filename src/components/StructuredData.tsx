export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Awab Elkhalil",
    jobTitle: "Web Designer & Developer",
    description:
      "Professional web designer and developer specializing in modern, conversion-focused websites",
    url: "https://awab.design",
    sameAs: [
      "https://linkedin.com/in/awabelkhalil",
      "https://github.com/awabelkhalil",
      "https://twitter.com/awabelkhalil",
    ],
    worksFor: {
      "@type": "Organization",
      name: "Freelance",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Istanbul",
      addressCountry: "TR",
    },
    knowsAbout: [
      "Web Design",
      "Web Development",
      "UI/UX Design",
      "Next.js",
      "React",
      "Tailwind CSS",
      "JavaScript",
      "TypeScript",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
