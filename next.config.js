const createNextIntlPlugin = require('next-intl/plugin');
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ixpsdumronjzsegxscdt.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "mir-s3-cdn-cf.behance.net",
        port: "",
        pathname: "/**",
      },
    ],
  },
  // SEO optimizations
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  experimental: {
    // Tree-shake barrel imports from heavy libraries so only what's
    // actually used ends up in the client bundle. Saves ~50-100 KB
    // of JS across the site.
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "@radix-ui/react-alert-dialog",
      "@radix-ui/react-avatar",
      "@radix-ui/react-checkbox",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-label",
      "@radix-ui/react-navigation-menu",
      "@radix-ui/react-select",
      "@radix-ui/react-separator",
      "@radix-ui/react-slot",
    ],
    // Inline critical CSS into the HTML head so the render-blocking
    // stylesheet request doesn't delay first paint. Saves ~300ms of
    // LCP time per the PageSpeed audit.
    optimizeCss: true,
  },
};

module.exports = withNextIntl(nextConfig);
