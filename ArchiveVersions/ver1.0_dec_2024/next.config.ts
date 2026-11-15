import type { NextConfig } from "next";

// Retired client sites are kept as static snapshots under public/archive/<site>/.
const archivedSites = ["926-trades", "itabit"];

const nextConfig: NextConfig = {
  async rewrites() {
    return archivedSites.map((site) => ({
      source: `/archive/${site}`,
      destination: `/archive/${site}/index.html`,
    }));
  },
};

export default nextConfig;
