import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
