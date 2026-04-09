import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  // Block crawling entirely on preview/development deploys so Vercel preview
  // URLs (and any other non-production hostnames) never get indexed.
  // VERCEL_ENV is one of: "production" | "preview" | "development".
  const isProduction = process.env.VERCEL_ENV === "production";

  if (!isProduction) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/login",
          "/api",
          "/api/",
          "/thank-you",
        ],
      },
    ],
    sitemap: "https://awab.design/sitemap.xml",
    host: "https://awab.design",
  };
}
