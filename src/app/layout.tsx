import type { Metadata, Viewport } from "next";
import { Inter as FontSans, Space_Grotesk as FontDisplay, Tajawal as FontArabic } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { cn } from "@/lib/utils";
import CookieConsent from "@/components/ui/CookieConsent";

const fontSans = FontSans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
});

const fontDisplay = FontDisplay({
  subsets: ["latin", "latin-ext"],
  variable: "--font-display",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const fontArabic = FontArabic({
  subsets: ["arabic"],
  variable: "--font-arabic",
  weight: ["300", "400", "500", "700", "800"],
  display: "swap",
});

// Explicit viewport + theme-color. Next.js auto-generates a default
// viewport but being explicit ensures viewport-fit=cover for iPhone
// notches and gives Google a clear mobile-optimized signal.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "Awab Design | Web Designer & Developer | Istanbul",
    template: "%s | Awab Design",
  },
  description:
    "Professional web designer and developer in Istanbul. Specializing in modern, conversion-focused websites using Next.js, React, and Tailwind CSS. View portfolio and get in touch.",
  keywords: [
    "web designer",
    "web developer",
    "UI/UX designer",
    "Istanbul web designer",
    "Next.js developer",
    "React developer",
    "Tailwind CSS",
    "responsive web design",
    "conversion optimization",
    "brand identity design",
    "portfolio",
    "freelance web designer",
  ],
  authors: [{ name: "Awab Design" }],
  creator: "Awab Elkhalil",
  publisher: "Awab Elkhalil",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://www.awab.design"),
  alternates: {
    canonical: "/",
    languages: {
      en: "/",
      ar: "/ar",
      tr: "/tr",
      fr: "/fr",
    },
  },
  openGraph: {
    title: "Awab Design | Web Designer & Developer | Istanbul",
    description:
      "Professional web design and development services that help businesses stand out online and convert visitors into customers.",
    url: "https://www.awab.design",
    siteName: "Awab Design",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/img/hero-image.jpg",
        width: 1200,
        height: 630,
        alt: "Awab Design - Web Designer & Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Awab Design | Web Designer & Developer | Istanbul",
    description:
      "Professional web design and development services that help businesses stand out online and convert visitors into customers.",
    images: ["/img/hero-image.jpg"],
    creator: "@awabeladam",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Root layout stays fully static with lang="en" so that Next.js can
  // still SSG every [locale] page. Per-locale signals are delivered via
  // the hreflang alternate links in metadata — Google uses hreflang as
  // the primary locale signal. The critical fix is that we NO LONGER
  // mutate <html lang> client-side after hydration (we deleted
  // LocaleHtmlAttributes), which was causing the hreflang/lang
  // inconsistency Googlebot mobile was seeing.
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/*
          Preconnect to third-party origins we load AFTER hydration
          (GTM, GA, font files). Opening these TCP + TLS connections
          early saves ~200-300ms of connection setup when the scripts
          actually fire. These are only hints — browsers may ignore
          them if they'd hurt critical rendering.
        */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={cn(
          "h-full w-screen overflow-x-clip bg-background font-sans antialiased",
          fontSans.variable,
          fontDisplay.variable,
          fontArabic.variable,
        )}
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WJHCGKSQ"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* Google Tag Manager */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-WJHCGKSQ');
            `,
          }}
        />

        {/* Google Analytics 4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-EL4WEH4X3X"
          strategy="afterInteractive"
        />
        <Script id="ga-script" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-EL4WEH4X3X', {
              page_title: document.title,
              page_location: window.location.href,
            });
          `}
        </Script>

        {/* All JSON-LD structured data — must be <script> tags, not <meta> */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": ["Person", "ProfessionalService"],
              "@id": "https://www.awab.design/#person",
              name: "Awab Design",
              jobTitle: "Web Designer & Developer",
              description:
                "Professional web designer and developer in Istanbul specializing in modern, conversion-focused websites, UI/UX design, SEO, and AI chatbot integration.",
              url: "https://www.awab.design",
              email: "awabe.adam@gmail.com",
              telephone: "+905541759945",
              image: "https://www.awab.design/img/hero-image.jpg",
              sameAs: [
                "https://www.linkedin.com/in/awab-adam/",
                "https://www.instagram.com/awabeladam/",
              ],
              address: {
                "@type": "PostalAddress",
                addressLocality: "Istanbul",
                addressCountry: "TR",
              },
              areaServed: ["Worldwide", "Turkey", "France", "Middle East"],
              knowsLanguage: ["en", "ar", "tr", "fr"],
              knowsAbout: [
                "Web Design", "Web Development", "UI/UX Design", "SEO",
                "AI Chatbot Integration", "Brand Identity", "Next.js", "React", "TypeScript",
              ],
              priceRange: "$150 - $1500+",
              makesOffer: [
                {
                  "@type": "Offer",
                  itemOffered: { "@type": "Service", name: "Landing Page Design" },
                  priceSpecification: { "@type": "UnitPriceSpecification", price: "150", priceCurrency: "USD" },
                },
                {
                  "@type": "Offer",
                  itemOffered: { "@type": "Service", name: "Business Website Design & Development" },
                  priceSpecification: { "@type": "UnitPriceSpecification", price: "500", priceCurrency: "USD" },
                },
                {
                  "@type": "Offer",
                  itemOffered: { "@type": "Service", name: "Custom Website Development" },
                  priceSpecification: { "@type": "UnitPriceSpecification", price: "1500", priceCurrency: "USD" },
                },
              ],
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "5.0",
                reviewCount: "4",
                bestRating: "5",
              },
              review: [
                {
                  "@type": "Review",
                  author: { "@type": "Person", name: "Dr. Ahmed Hassan" },
                  reviewRating: { "@type": "Rating", ratingValue: "5" },
                  reviewBody: "Awab transformed our clinic's online presence completely. Our new website has increased our patient inquiries by 40%.",
                },
                {
                  "@type": "Review",
                  author: { "@type": "Person", name: "Sarah Johnson" },
                  reviewRating: { "@type": "Rating", ratingValue: "5" },
                  reviewBody: "Working with Awab was a game-changer for our aesthetic clinic. The SEO optimization has significantly improved our search rankings.",
                },
                {
                  "@type": "Review",
                  author: { "@type": "Person", name: "Mehmet Yılmaz" },
                  reviewRating: { "@type": "Rating", ratingValue: "5" },
                  reviewBody: "Awab created a stunning website for our restaurant. The online ordering integration was seamless.",
                },
                {
                  "@type": "Review",
                  author: { "@type": "Person", name: "Fatima Al-Zahra" },
                  reviewRating: { "@type": "Rating", ratingValue: "5" },
                  reviewBody: "Awab's expertise helped us establish a strong online presence. His attention to detail made all the difference.",
                },
              ],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "@id": "https://www.awab.design/#website",
                name: "Awab Design",
                alternateName: ["Awab Elkhalil", "awab.design"],
                url: "https://www.awab.design",
                publisher: { "@id": "https://www.awab.design/#person" },
                inLanguage: ["en", "ar", "tr", "fr"],
              },
              {
                "@context": "https://schema.org",
                "@type": "SiteNavigationElement",
                "@id": "https://www.awab.design/#navigation",
                name: "Main Navigation",
                hasPart: [
                  { "@type": "WebPage", name: "Services", url: "https://www.awab.design/services" },
                  { "@type": "WebPage", name: "Web Design Istanbul", url: "https://www.awab.design/services/webdesign-istanbul" },
                  { "@type": "WebPage", name: "AI Chatbot Integration", url: "https://www.awab.design/services/ai-chatbot-integration" },
                  { "@type": "WebPage", name: "Clinic Websites", url: "https://www.awab.design/services/clinic-websites" },
                  { "@type": "WebPage", name: "Brand Identity", url: "https://www.awab.design/services/brand-identity" },
                  { "@type": "WebPage", name: "Rate Calculator", url: "https://www.awab.design/rate-calculator" },
                ],
              },
            ]),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              "@id": "https://www.awab.design/#business",
              name: "Awab Design",
              url: "https://www.awab.design",
              telephone: "+905541759945",
              email: "awabe.adam@gmail.com",
              image: "https://www.awab.design/img/hero-image.jpg",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Istanbul",
                addressCountry: "TR",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 41.00824,
                longitude: 28.97836,
              },
              openingHoursSpecification: {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                opens: "09:00",
                closes: "18:00",
              },
              priceRange: "$150 - $1500+",
              areaServed: ["Worldwide", "Turkey", "France", "Middle East"],
              founder: { "@id": "https://www.awab.design/#person" },
              sameAs: [
                "https://www.linkedin.com/in/awab-adam/",
                "https://www.instagram.com/awabeladam/",
              ],
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "5.0",
                reviewCount: "4",
                bestRating: "5",
              },
            }),
          }}
        />

        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
