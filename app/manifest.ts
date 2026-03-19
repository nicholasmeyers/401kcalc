import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "401kcalc",
    short_name: "401kcalc",
    description:
      "Model your 401k growth with transparent assumptions, year-by-year retirement drawdown simulation, and practical planning guides.",
    start_url: "/",
    display: "standalone",
    background_color: "#F7F7F7",
    theme_color: "#2563eb",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "16x16 32x32 48x48",
        type: "image/x-icon",
      },
      {
        src: "/images/logo-icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/images/logo-icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
