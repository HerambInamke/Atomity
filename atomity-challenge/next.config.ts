import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Clean URLs — no trailing slashes
  trailingSlash: false,

  // Strict mode for catching issues early
  reactStrictMode: true,

  // Allow images from dummyjson if ever needed
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dummyjson.com",
      },
    ],
  },

  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
