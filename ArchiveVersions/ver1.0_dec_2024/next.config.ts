import type { NextConfig } from "next";

// Static snapshots served from public/: retired client sites and earlier versions of this portfolio.
const staticSnapshots = [
  "archive/926-trades",
  "archive/itabit",
  "versions/v1",
  "versions/v2",
];

const nextConfig: NextConfig = {
  async rewrites() {
    return staticSnapshots.map((path) => ({
      source: `/${path}`,
      destination: `/${path}/index.html`,
    }));
  },
};

export default nextConfig;
