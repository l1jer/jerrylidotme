import type { NextConfig } from "next";

// Static snapshots served from public/: retired client sites and earlier versions of this portfolio.
const staticSnapshots = [
  "archive/926-trades",
  "archive/itabit",
  "versions/v1",
  "versions/v2",
  // 3D lab, built from /lab with `npm run build:site`.
  "lab",
];

// Archived pages must never appear in search results. The header applies to every file under
// these folders (HTML, CSS, fonts, images). Crawling stays allowed in robots.txt on purpose:
// a crawler that cannot fetch a page never sees its noindex and may still list the URL.
const noIndexPaths = ["/archive/:path*", "/versions/:path*"];

const nextConfig: NextConfig = {
  async headers() {
    return noIndexPaths.map((source) => ({
      source,
      headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive, nosnippet, noimageindex" }],
    }));
  },
  async rewrites() {
    return staticSnapshots.map((path) => ({
      source: `/${path}`,
      destination: `/${path}/index.html`,
    }));
  },
};

export default nextConfig;
