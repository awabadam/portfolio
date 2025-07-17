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
        hostname: "xvnzxbtldhydyeimhdgz.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  // SEO optimizations
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  // Disable experimental features that cause build issues
  experimental: {
    // optimizeCss: true, // Removed due to critters dependency issues
  },
};

module.exports = nextConfig;
