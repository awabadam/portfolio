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
  title: "Awab . Design | Graphic & Web Designer",
  description:
    "Portfolio of Awab Elkhalil, a graphic and web designer specializing in modern web design with Next.js and Tailwind CSS.",
  keywords: [
    "graphic design",
    "web design",
    "portfolio",
    "Next.js",
    "Tailwind CSS",
    "UI/UX",
    "Istanbul",
  ],
  authors: [{ name: "Awab Elkhalil" }],
  creator: "Awab Elkhalil",
  openGraph: {
    title: "Awab . Design | Graphic & Web Designer",
    description:
      "Portfolio of Awab Elkhalil, a graphic and web designer specializing in modern web design with Next.js and Tailwind CSS.",
    url: "https://awab.design",
    siteName: "Awab Elkhalil Portfolio",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Twitter meta tags*/}
      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content="awab.design" />
      <meta property="twitter:url" content="https://awab.design" />
      <meta
        name="twitter:title"
        content="Awab Elkhalil | Web Designer & Developer | Istanbul"
      />
      <meta
        name="twitter:description"
        content="Professional web design and development services that help businesses stand out online and convert visitors into customers."
      />
      <meta name="twitter:image" content="/awab-design-thumpnail.png" />
      {/* og meta tags*/}
      <meta property="og:url" content="https://awab.design" />
      <meta property="og:type" content="website" />
      <meta
        property="og:title"
        content="Awab Elkhalil | Web Designer & Developer | Istanbul"
      />
      <meta
        property="og:description"
        content="Professional web design and development services that help businesses stand out online and convert visitors into customers."
      />
      <meta property="og:image" content="/awab-design-thumpnail.png" />
      {/* body*/}
      <body
        className={cn(
          "flex min-h-screen flex-col items-center justify-center bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
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
