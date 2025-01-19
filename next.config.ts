import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/queue',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
