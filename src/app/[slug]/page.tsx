// app/products/[slug]/page.tsx
import ProductDetail from "@/components/products/product-detail";
import { endpoints } from "@/lib/data/endpoints";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Script from "next/script";
import { cookies } from "next/headers";

export const revalidate = 300; // re-gen metadata/page every 5 minutes

type Product = {
  _id: string;
  id: string;
  name: string;
  price: number;
  offerPrice?: number;
  discountPercentage?: number;
  shortDescription?: string;
  detailedDescription?: string; // HTML
  tags?: string[];
  thumbnail?: string;
  images?: string[];
  slug: string;
  brand?: string;
  manufacturer?: string;
  sku?: string;
  countryOfOrigin?: string;
  category?: { _id: string; name: string };
  subcategory?: { _id: string; name: string };
  seller?: { _id: string; name: string; logo?: string; country?: string };
  uom?: string;
  minimumOrderQuantity?: number;
  stock?: number;
};

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://eximso.com";
const API_URL = process.env.NEXT_PUBLIC_API_URL!;

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;
    const deviceToken = cookieStore.get("device_token")?.value;
    const res = await fetch(`${API_URL + endpoints.products}/${slug}`, {
      next: { revalidate },
      headers: {
        Accept: "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...(deviceToken ? { Devicetoken: deviceToken } : {}),
      },
      credentials: "include",
    });
    if (!res.ok) return null;

    const json = await res.json();
    if (!json?.success || !json?.result) return null;
    return json.result as Product;
  } catch {
    return null;
  }
}

// ✅ Next.js 15: params is a Promise and must be awaited
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) {
    return {
      title: "Product not found | Eximso",
      robots: { index: false, follow: false },
    };
  }

  const {
    name,
    shortDescription,
    images = [],
    thumbnail,
    brand,
    tags = [],
    category,
    subcategory,
    seller,
  } = product;

  const title = `${name}${brand ? ` by ${brand.trim()}` : ""} | Eximso`;
  const desc = (
    shortDescription ??
    `${name}${brand ? ` by ${brand.trim()}` : ""} available on Eximso.`
  ).slice(0, 300);

  const ogImages: string[] = (
    images.length ? images : thumbnail ? [thumbnail] : []
  ).slice(0, 4);
  const canonical = `${BASE_URL}/products/${product.slug}`;

  return {
    title,
    description: desc,
    keywords: [
      name,
      brand ?? "",
      ...tags,
      category?.name ?? "",
      subcategory?.name ?? "",
      "Eximso",
      "buy online",
      "B2B",
      "B2C",
    ].filter(Boolean),
    alternates: { canonical },
    openGraph: {
      type: "website", // use a supported union
      url: canonical,
      siteName: "Eximso",
      title,
      description: desc,
      images: ogImages, // strings satisfy the type cleanly
    },
    twitter: {
      card: ogImages.length ? "summary_large_image" : "summary",
      title,
      description: desc,
      images: ogImages,
      creator: seller?.name ? `@${seller.name}` : undefined, // adjust to a real handle if you have one
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params; // ✅ await first
  const product = await getProduct(slug);
  if (!product) notFound();

  const {
    name,
    images = [],
    thumbnail,
    price,
    offerPrice = 0,
    discountPercentage = 0,
    brand,
    sku,
    seller,
    category,
    subcategory,
    countryOfOrigin,
    minimumOrderQuantity,
    stock,
  } = product;

  // Product JSON-LD
  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    image: (images.length ? images : thumbnail ? [thumbnail] : []).slice(0, 6),
    sku: sku || undefined,
    brand: brand ? { "@type": "Brand", name: brand.trim() } : undefined,
    category:
      [category?.name, subcategory?.name].filter(Boolean).join(" / ") ||
      undefined,
    countryOfOrigin: countryOfOrigin || undefined,
    offers: {
      "@type": "Offer",
      url: `${BASE_URL}/products/${product.slug}`,
      priceCurrency: "INR",
      price: offerPrice && offerPrice > 0 ? offerPrice : price,
      availability:
        stock && stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: seller?.name
        ? { "@type": "Organization", name: seller.name }
        : undefined,
      itemCondition: "https://schema.org/NewCondition",
      eligibleQuantity: minimumOrderQuantity
        ? { "@type": "QuantitativeValue", value: minimumOrderQuantity }
        : undefined,
    },
  };

  return (
    <>
      <Script
        id="product-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }}
      />
      <ProductDetail product={product} />
    </>
  );
}
