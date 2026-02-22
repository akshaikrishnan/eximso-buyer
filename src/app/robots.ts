import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === "production") {
    return {
      rules: [
        {
          userAgent: "*",
          allow: ["/"],
        },
      ],
      sitemap: `${process.env.NEXT_PUBLIC_BASE_URL}/sitemap.xml`,
    };
  }
  return {
    rules: [
      {
        userAgent: "*",
        disallow: ["/"],
      },
    ],
  };
}
