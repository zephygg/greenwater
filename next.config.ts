import type { NextConfig } from "next";

const apk = process.env.NEXT_PUBLIC_APK === "1";

const nextConfig: NextConfig = {
  ...(apk
    ? {
        output: "export" as const,
        distDir: ".next-apk",
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;
