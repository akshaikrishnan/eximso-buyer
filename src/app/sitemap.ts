// app/sitemap.ts
import type { MetadataRoute } from "next";

const BASE_URL = "https://eximso.com";
export const revalidate = 60 * 60 * 24; // 24 hours

type ProductApiResponse = {
  result?: {
    data?: { slug?: string; updatedAt?: string }[];
    meta?: {
      total?: number;
      page?: number;
      limit?: number;
      totalPages?: number;
    };
    pagination?: {
      total?: number;
      page?: number;
      limit?: number;
      totalPages?: number;
    };
  };
};

type Category = {
  id: string; // category slug
  name: string;
  subcategories?: {
    name: string;
    slug: string;
    url: string; // e.g. "/products/automobiles-parts/automotive-components"
  }[];
};

async function fetchAllProducts(): Promise<
  { slug: string; updatedAt?: string }[]
> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) {
    console.warn(
      "NEXT_PUBLIC_API_URL is not defined – product URLs will be skipped in sitemap."
    );
    return [];
  }

  const limit = 1000; // you said a large limit returns all products
  const url = `${baseUrl}/products?limit=${limit}`;

  try {
    const res = await fetch(url, {
      // this makes sure Next can cache & revalidate this request
      next: { revalidate },
    });

    if (!res.ok) {
      console.error("Failed to fetch products for sitemap", await res.text());
      return [];
    }

    const json: ProductApiResponse = await res.json();
    const products = json.result?.data ?? [];
    return products
      .filter((p) => !!p.slug)
      .map((p) => ({
        slug: p.slug as string,
        updatedAt: p.updatedAt,
      }));
  } catch (err) {
    console.error("Error fetching products for sitemap", err);
    return [];
  }
}

async function fetchCategories(): Promise<Category[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) {
    console.warn(
      "NEXT_PUBLIC_API_URL is not defined – category URLs will be skipped in sitemap."
    );
    return [];
  }

  const url = `${baseUrl}/category/page`;

  try {
    const res = await fetch(url, {
      next: { revalidate },
    });

    if (!res.ok) {
      console.error("Failed to fetch categories for sitemap", await res.text());
      return [];
    }

    const json: Category[] = await res.json();
    return json;
  } catch (err) {
    console.error("Error fetching categories for sitemap", err);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();

  // 1) Static routes from your current XML
  const staticPaths = [
    "/", // https://eximso.com/
    "/about-us",
    "/contact",
    "/FAQ",
    "/mission-vision",
    "/whysellwitheximso",
    "/secure-payment",
    "/cancellation",
    "/B2B-B2C",
    "/drives-us-everyday",
    "/category",
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${BASE_URL}${path === "/" ? "" : path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.8,
  }));

  // 2) Dynamic products
  const products = await fetchAllProducts();
  const productEntries: MetadataRoute.Sitemap = products.map((p) => ({
    // you said: "you can take the slug and update the dynamic value like this eximso.com/slug"
    url: `${BASE_URL}/${p.slug}`,
    lastModified: p.updatedAt || now,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  // 3) Dynamic categories + subcategories
  const categories = await fetchCategories();
  const categoryEntries: MetadataRoute.Sitemap = [];

  for (const cat of categories) {
    // category-level page -> /products/<category-slug>
    categoryEntries.push({
      url: `${BASE_URL}/products/${cat.id}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    });

    // subcategory pages
    for (const sub of cat.subcategories ?? []) {
      // Option A: use "url" directly from API (recommended to keep it single source of truth)
      categoryEntries.push({
        url: `${BASE_URL}${sub.url}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.6,
      });

      // Option B (if you ever want to recompute):
      // url: `${BASE_URL}/products/${cat.id}/${sub.slug}`
    }
  }

  return [...staticEntries, ...productEntries, ...categoryEntries];
}
