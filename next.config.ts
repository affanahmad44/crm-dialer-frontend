import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/dialer-api/:path*",
        destination: "http://34.0.227.220:3001/:path*",
      },
    ];
  },
};

export default nextConfig;