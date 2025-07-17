import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { Navbar, Footer, ThemeProvider } from "../components";
import { cn } from "@/lib/utils";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
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
        url: "/og-image.png",
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
    images: ["/og-image.png"],
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
      {/* Google Tag Manager */}
      <script
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
      {/* body*/}
      <body
        className={cn(
          "h-full w-screen overflow-x-clip bg-background font-sans antialiased",
          fontSans.variable,
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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
