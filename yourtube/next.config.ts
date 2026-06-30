import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: {
    BACKEND_URL: process.env.BACKEND_URL,
  },
  // 🔥 FIXED: Firebase Popups ko cross-origin blocks se bachane ke liye safe setup
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups", 
          },
        ],
      },
    ];
  },
};

export default nextConfig;