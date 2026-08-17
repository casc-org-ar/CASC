import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Shopping logos are square PNG/JPG served from /public at small render
    // sizes. These two widths cover the 1x/2x cases the carousel actually uses.
    imageSizes: [128, 256],
  },
};

export default nextConfig;
