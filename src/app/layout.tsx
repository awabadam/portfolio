import type { Metadata } from "next";
import { Inter as FontSans, Space_Grotesk as FontDisplay } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "../components";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";
import { cn } from "@/lib/utils";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import PageTracking from "@/components/PageTracking";
import { WhatsAppProvider } from "@/components/chat/WhatsAppContext";
import ScrollProgress from "@/components/ui/ScrollProgress";
import SmoothScroll from "@/components/ui/SmoothScroll";
import NoiseOverlay from "@/components/ui/NoiseOverlay";
import { AnimatePresence } from "framer-motion";
import PageTransition from "@/components/ui/PageTransition";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontDisplay = FontDisplay({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Awab Elkhalil | Web Designer & Developer | Istanbul",
    template: "%s | Awab Elkhalil",
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
  authors: [{ name: "Awab Elkhalil" }],
  creator: "Awab Elkhalil",
  publisher: "Awab Elkhalil",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://awab.design"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Awab Elkhalil | Web Designer & Developer | Istanbul",
    description:
      "Professional web design and development services that help businesses stand out online and convert visitors into customers.",
    url: "https://awab.design",
    siteName: "Awab Elkhalil Portfolio",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/img/hero-image.jpg",
        width: 1200,
        height: 630,
        alt: "Awab Elkhalil - Web Designer & Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Awab Elkhalil | Web Designer & Developer | Istanbul",
    description:
      "Professional web design and development services that help businesses stand out online and convert visitors into customers.",
    images: ["/img/hero-image.jpg"],
    creator: "@awabelkhalil",
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
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  other: {
    "application/ld+json": JSON.stringify({
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
    }),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "h-full w-screen overflow-x-clip bg-background font-sans antialiased",
          fontSans.variable,
          fontDisplay.variable,
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

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <WhatsAppProvider>
            <GoogleAnalytics />
            <PageTracking />
            <ScrollProgress />
            <SmoothScroll />
            <NoiseOverlay />
            <ConditionalLayout />
            <PageTransition>{children}</PageTransition>
          </WhatsAppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
