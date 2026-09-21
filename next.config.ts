import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Put the stylesheet in the HTML instead of two <link> requests that block
    // the first paint — Lighthouse measured ~570 ms of render-blocking CSS on
    // every page on simulated slow 4G. The reference CSS is small (22 KB), so
    // inlining it costs less than the round trips it removes.
    inlineCss: true,
  },
  images: {
    // Every photograph is delivered by Cloudinary with f_auto,q_auto — see
    // src/lib/cloudinary-loader.ts. Next's own optimiser is bypassed entirely,
    // which is the point: resizing on our own Node process is what made the
    // Phase 3 mobile LCP slow.
    loader: "custom",
    loaderFile: "./src/lib/cloudinary-loader.ts",
  },
};

export default nextConfig;
