import type { Metadata, Viewport } from "next";
import { Inter as FontSans, Azeret_Mono as FontMono, Cairo as FontArabic } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import { cn } from "@/lib/utils";
import CookieConsent from "@/components/ui/CookieConsent";
// 💰 Pricing source of truth: edit prices in src/lib/pricing.ts
import { getTier, formatPrice, projectTiers, carePlans } from "@/lib/pricing";
import { SITE_URL } from "@/lib/seo";

const fontSans = FontSans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
});

// Switzer (variable) — display face for headings, labels and nav.
const fontDisplay = localFont({
  src: "../../public/fonts/switzer/Switzer-Variable.woff2",
  variable: "--font-display",
  weight: "100 900",
  display: "swap",
});

// Azeret Mono — kickers, arrows and small mono labels.
const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: "400",
  display: "swap",
});

const fontArabic = FontArabic({
  subsets: ["arabic"],
  variable: "--font-arabic",
  weight: ["400", "700"],
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
    { media: "(prefers-color-scheme: light)", color: "#f7f7f7" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "Clinic Website Design Istanbul | Awab Design",
    template: "%s | Awab Design",
  },
  description:
    "Multilingual websites for dental, aesthetic and hair transplant clinics in Istanbul, with lead tracking to your CRM. Fixed USD pricing.",
  keywords: [
    "clinic website design Istanbul",
    "dental clinic website",
    "aesthetic clinic website",
    "hair transplant clinic website",
    "medical tourism website design",
    "multilingual clinic website",
    "Arabic clinic website",
    "web designer Istanbul",
    "klinik web sitesi tasarımı İstanbul",
  ],
  authors: [{ name: "Awab Elkhalil", url: SITE_URL }],
  creator: "Awab Elkhalil",
  publisher: "Awab Elkhalil",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(SITE_URL),
  // Pages override these with self-referencing alternates via pageAlternates().
  alternates: {
    canonical: "/",
    languages: {
      en: "/",
      ar: "/ar",
      tr: "/tr",
      fr: "/fr",
      "x-default": "/",
    },
  },
  openGraph: {
    title: "Clinic Website Design Istanbul | Awab Design",
    description:
      "Multilingual websites for dental, aesthetic and hair transplant clinics in Istanbul, with lead tracking to your CRM.",
    url: SITE_URL,
    siteName: "Awab Design",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/img/hero-image.jpg",
        width: 1200,
        height: 630,
        alt: "Awab Design, clinic website design in Istanbul",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Clinic Website Design Istanbul | Awab Design",
    description:
      "Multilingual websites for dental, aesthetic and hair transplant clinics in Istanbul, with lead tracking to your CRM.",
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

// Google Business Profile ("Awab Design - Web Designer & Developer"). Linking it
// here tells Google the site and the Maps listing are the same business.
const GBP_URL = "https://share.google/Osnpe5PuKxyl1e17M";

// Site-wide structured data. Prices come from pricing.ts; no ratings or
// reviews are claimed here because none are collected on the site.
const SAME_AS = [
  "https://www.linkedin.com/in/awab-adam/",
  "https://www.instagram.com/awabeladam/",
  "https://github.com/awabadam",
];

const AREA_SERVED = [
  {
    "@type": "City",
    name: "Istanbul",
    containedInPlace: { "@type": "Country", name: "Turkey" },
  },
  { "@type": "Country", name: "Turkey" },
  { "@type": "Country", name: "France" },
  { "@type": "AdministrativeArea", name: "Middle East" },
];

const PACKAGE_NAMES: Record<string, string> = {
  business: "Clinic Website",
  custom: "Clinic Growth System",
};
const PLAN_NAMES: Record<string, string> = {
  careStandard: "Site Care",
  carePro: "Growth Retainer",
};

const OFFER_CATALOG = {
  "@type": "OfferCatalog",
  name: "Clinic website services, Istanbul",
  itemListElement: [
    {
      "@type": "OfferCatalog",
      name: "Clinic website packages",
      itemListElement: projectTiers.map((tier) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: PACKAGE_NAMES[tier.id] ?? tier.id,
          url: `${SITE_URL}/pricing`,
          serviceType: "Clinic website design",
        },
        price: String(tier.price),
        priceCurrency: "USD",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: String(tier.price),
          priceCurrency: "USD",
          unitText: "project",
        },
      })),
    },
    {
      "@type": "OfferCatalog",
      name: "Hosting and care plans",
      itemListElement: carePlans.map((plan) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: PLAN_NAMES[plan.id] ?? plan.id,
          url: `${SITE_URL}/services/website-maintenance`,
          serviceType: "Clinic website maintenance",
        },
        price: String(plan.price),
        priceCurrency: "USD",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          ...(plan.fromPrice ? { minPrice: String(plan.price) } : { price: String(plan.price) }),
          priceCurrency: "USD",
          unitText: "month",
        },
      })),
    },
  ],
};

const PRICE_RANGE = `${formatPrice(getTier("business").price)} - ${formatPrice(getTier("custom").price)}`;

const PERSON_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${SITE_URL}/#person`,
  name: "Awab Elkhalil",
  alternateName: "Awab Design",
  jobTitle: "Web Designer & Developer",
  description:
    "Web designer and developer in Istanbul who builds multilingual websites for dental, aesthetic and hair transplant clinics, with lead tracking to the clinic's CRM.",
  url: SITE_URL,
  email: "hello@awab.design",
  telephone: "+905541759945",
  image: `${SITE_URL}/img/awab-portrait.webp`,
  sameAs: SAME_AS,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Istanbul",
    addressCountry: "TR",
  },
  areaServed: AREA_SERVED,
  worksFor: { "@id": `${SITE_URL}/#business` },
  knowsLanguage: ["en", "ar", "tr", "fr"],
  knowsAbout: [
    "Clinic Website Design",
    "Medical Tourism Website Design",
    "Dental Clinic Websites",
    "Aesthetic Clinic Websites",
    "Hair Transplant Clinic Websites",
    "Multilingual Website Development",
    "Arabic Website Design",
    "SEO",
    "Conversion Rate Optimization",
    "Next.js",
    "React",
    "TypeScript",
    "Web Design Istanbul",
    "Klinik Web Tasarım",
  ],
};

const WEBSITE_JSON_LD = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: "Awab Design",
    alternateName: ["Awab Elkhalil", "awab.design"],
    url: SITE_URL,
    publisher: { "@id": `${SITE_URL}/#person` },
    inLanguage: ["en", "ar", "tr", "fr"],
  },
  {
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    "@id": `${SITE_URL}/#navigation`,
    name: "Main Navigation",
    hasPart: [
      { "@type": "WebPage", name: "Services", url: `${SITE_URL}/services` },
      { "@type": "WebPage", name: "Pricing", url: `${SITE_URL}/pricing` },
      { "@type": "WebPage", name: "Case Studies", url: `${SITE_URL}/projects` },
      { "@type": "WebPage", name: "Web Design Istanbul", url: `${SITE_URL}/services/webdesign-istanbul` },
      { "@type": "WebPage", name: "Free Clinic Website Check", url: `${SITE_URL}/audit` },
    ],
  },
];

const BUSINESS_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${SITE_URL}/#business`,
  name: "Awab Design",
  description:
    "Clinic website design studio in Istanbul. Multilingual websites for dental, aesthetic and hair transplant clinics, with lead tracking, hosting and care plans. Fixed USD pricing.",
  url: SITE_URL,
  telephone: "+905541759945",
  email: "hello@awab.design",
  image: `${SITE_URL}/img/hero-image.jpg`,
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
  hasMap: GBP_URL,
  priceRange: PRICE_RANGE,
  currenciesAccepted: "USD",
  areaServed: AREA_SERVED,
  availableLanguage: ["en", "ar", "tr", "fr"],
  hasOfferCatalog: OFFER_CATALOG,
  founder: { "@id": `${SITE_URL}/#person` },
  sameAs: [GBP_URL, ...SAME_AS],
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
      </head>
      <body
        className={cn(
          "h-full w-screen overflow-x-clip bg-background font-sans antialiased",
          fontSans.variable,
          fontDisplay.variable,
          fontMono.variable,
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
        {/* Google Tag Manager. lazyOnload: GTM + gtag are ~450 KiB of JS that
            otherwise compete with the hero image for bandwidth on mobile. */}
        <Script
          id="gtm-script"
          strategy="lazyOnload"
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
          strategy="lazyOnload"
        />
        <Script id="ga-script" strategy="lazyOnload">
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

        {/* All JSON-LD structured data: must be <script> tags, not <meta> */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_JSON_LD) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_JSON_LD) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(BUSINESS_JSON_LD) }}
        />

        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
