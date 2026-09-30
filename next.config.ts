import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/grazzi-modas",
  assetPrefix: "/grazzi-modas/",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
