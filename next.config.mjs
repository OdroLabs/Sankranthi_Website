/** @type {import('next').NextConfig} */
const nextConfig = {
  // "standalone" output is for the self-hosted Docker build (see Dockerfile).
  // Vercel does its own bundling/tracing and this mode conflicts with its
  // build pipeline (causes "ENOENT ... next-server.js.nft.json"), so it's
  // only set when NOT building on Vercel. Vercel sets VERCEL=1 itself.
  output: process.env.VERCEL ? undefined : "standalone",
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
