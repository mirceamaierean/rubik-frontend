/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    domains: ["d1gymyavdvyjgt.cloudfront.net", "picsum.photos"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "platform-lookaside.fbsbx.com",
        port: "",
      },
    ],
  },
  output: "standalone",
};

export default nextConfig;
