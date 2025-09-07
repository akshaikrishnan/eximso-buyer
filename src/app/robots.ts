import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: "/profile/orders/",
      },
    ],
    sitemap: "https://eximso.com/sitemap.xml",
  };
}
