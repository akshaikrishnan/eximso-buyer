import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "eximso.com",
    short_name: "Eximso",
    start_url: "/",
    screenshots: [
      {
        src: "/meta/preview.png",
        sizes: "1280x720",
        type: "image/png",
      },
    ],
    icons: [
      {
        src: "/meta/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/meta/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    theme_color: "#521dd3",
    background_color: "#ffffff",
    display: "standalone",
  };
}
