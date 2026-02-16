import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  workboxOptions: {
    skipWaiting: true,
    disableDevLogs: true,
  },
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // @ts-ignore - Silence strict Turbopack check for next-pwa
  turbopack: {},
};

export default withPWA(nextConfig);
