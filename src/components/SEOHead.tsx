import Head from "next/head";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: string;
}

export default function SEOHead({
  title,
  description,
  keywords = [],
  image = "/img/hero-image.jpg",
  url,
  type = "website",
}: SEOHeadProps) {
  const siteTitle = title
    ? `${title} | Awab Elkhalil`
    : "Awab Elkhalil | Web Designer & Developer | Istanbul";
  const siteDescription =
    description ||
    "Professional web designer and developer in Istanbul. Specializing in modern, conversion-focused websites using Next.js, React, and Tailwind CSS.";
  const siteUrl = url || "https://awab.design";

  return (
    <Head>
      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />

      {/* DNS prefetch for performance */}
      <link rel="dns-prefetch" href="//images.unsplash.com" />
      <link rel="dns-prefetch" href="//xvnzxbtldhydyeimhdgz.supabase.co" />

      {/* Additional meta tags */}
      <meta name="theme-color" content="#000000" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Awab Design" />

      {/* Manifest */}
      <link rel="manifest" href="/manifest.json" />

      {/* Additional Open Graph tags */}
      <meta property="og:site_name" content="Awab Elkhalil Portfolio" />
      <meta property="og:locale" content="en_US" />

      {/* Additional Twitter tags */}
      <meta name="twitter:site" content="@awabelkhalil" />

      {/* Keywords meta tag */}
      {keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(", ")} />
      )}

      {/* Canonical URL */}
      <link rel="canonical" href={siteUrl} />
    </Head>
  );
}
