"use client";

import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";

import { useAddToCart } from "@/hooks/use-add-to-cart";
import api from "@/lib/api/axios.interceptor";
import { endpoints } from "@/lib/data/endpoints";

import { Price } from "../common/price";
import type { ProductShape } from "./product-detail";

type RelatedProductShape = Omit<
  Pick<
    ProductShape,
    | "_id"
    | "name"
    | "slug"
    | "thumbnail"
    | "price"
    | "offerPrice"
    | "discountPercentage"
    | "brand"
    | "images"
  >,
  "_id"
> & { _id: string };

type ProductEntry =
  | RelatedProductShape
  | { product?: RelatedProductShape | null | undefined }
  | null
  | undefined;

type ProductListResponse = {
  result?: { data?: ProductEntry[]; items?: ProductEntry[] };
  data?: ProductEntry[];
  items?: ProductEntry[];
};

interface RelatedProductProps {
  product: RelatedProductShape;
}

interface RelatedProductsProps {
  product: ProductShape;
}

function toSlug(value?: string | null): string {
  if (!value) return "";
  return value
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function extractProductEntries(payload: unknown): ProductEntry[] {
  if (!payload) {
    return [];
  }

  if (Array.isArray(payload)) {
    return payload as ProductEntry[];
  }

  if (typeof payload === "object") {
    const candidate = payload as ProductListResponse;

    if (candidate.result?.data && Array.isArray(candidate.result.data)) {
      return candidate.result.data;
    }

    if (candidate.result?.items && Array.isArray(candidate.result.items)) {
      return candidate.result.items;
    }

    if (candidate.data && Array.isArray(candidate.data)) {
      return candidate.data;
    }

    if (candidate.items && Array.isArray(candidate.items)) {
      return candidate.items;
    }
  }

  return [];
}

function normalizeProduct(value: ProductEntry): RelatedProductShape | null {
  if (!value) {
    return null;
  }

  const rawProduct =
    value && typeof value === "object" && "product" in value
      ? value.product
      : value;

  if (!rawProduct) {
    return null;
  }

  const candidate = rawProduct as Partial<RelatedProductShape> & {
    price?: number | string | null;
    offerPrice?: number | string | null;
    discountPercentage?: number | string | null;
  };

  const id = candidate._id;
  const name = candidate.name;
  const rawPrice = candidate.price;
  const normalizedPrice =
    typeof rawPrice === "number" ? rawPrice : Number(rawPrice ?? NaN);

  if (
    typeof id !== "string" ||
    typeof name !== "string" ||
    !Number.isFinite(normalizedPrice)
  ) {
    return null;
  }

  const rawOffer = candidate.offerPrice;
  const normalizedOffer =
    typeof rawOffer === "number" ? rawOffer : Number(rawOffer ?? NaN);

  const rawDiscount = candidate.discountPercentage;
  const normalizedDiscount =
    typeof rawDiscount === "number" ? rawDiscount : Number(rawDiscount ?? NaN);

  return {
    _id: id,
    name,
    slug: candidate.slug,
    thumbnail: candidate.thumbnail,
    images: candidate.images,
    price: normalizedPrice,
    offerPrice: Number.isFinite(normalizedOffer) ? normalizedOffer : undefined,
    discountPercentage: Number.isFinite(normalizedDiscount)
      ? normalizedDiscount
      : undefined,
    brand: candidate.brand,
  };
}

function pickProducts(payload: unknown): RelatedProductShape[] {
  return extractProductEntries(payload)
    .map((entry) => normalizeProduct(entry))
    .filter((item): item is RelatedProductShape => Boolean(item));
}

export function RelatedProduct({ product }: RelatedProductProps) {
  const addToCart = useAddToCart(product);

  const imageSrc =
    (product.thumbnail && product.thumbnail.trim().length > 0
      ? product.thumbnail
      : product.images?.[0]) ?? "/images/products/p-3.png";

  const hasDiscount =
    (product.discountPercentage ?? 0) > 0 && (product.offerPrice ?? 0) > 0;
  const currentPrice = hasDiscount
    ? product.offerPrice ?? product.price
    : product.price;
  const discountLabel = Math.round(product.discountPercentage ?? 0);
  const href = product.slug ? `/${product.slug}` : `/product/${product._id}`;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg">
      <div className="relative flex flex-1 flex-col">
        <Link
          href={href}
          className="group/link flex flex-1 flex-col"
          aria-label={`View details for ${product.name}`}
        >
          <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-2xl bg-slate-50">
            <Image
              fill
              sizes="(min-width: 1536px) 220px, (min-width: 1280px) 200px, (min-width: 1024px) 180px, (min-width: 640px) 45vw, 80vw"
              src={imageSrc}
              alt={product.name}
              className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
            />

            {hasDiscount && (
              <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-red-500/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                -{discountLabel}%
              </span>
            )}
          </div>

          <div className="mt-4 space-y-2">
            <h3 className="line-clamp-2 text-sm font-semibold text-slate-900 transition group-hover/link:text-indigo-600">
              {product.name}
            </h3>
            {product.brand && (
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                {product.brand}
              </p>
            )}
            <div className="flex items-baseline gap-2">
              <p className="text-lg font-semibold text-indigo-600">
                <Price amount={currentPrice} />
              </p>
              {hasDiscount && (
                <p className="text-sm text-slate-400 line-through">
                  <Price amount={product.price} />
                </p>
              )}
            </div>
          </div>
        </Link>
      </div>

      <button
        type="button"
        onClick={() => addToCart.mutate()}
        disabled={addToCart.isPending}
        className="mt-4 inline-flex items-center justify-center gap-2 rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-600 transition hover:border-indigo-200 hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <ShoppingBagIcon className="h-4 w-4" aria-hidden="true" />
        {addToCart.isPending ? "Adding..." : "Add to bag"}
      </button>
    </article>
  );
}

export default function RelatedProducts({ product }: RelatedProductsProps) {
  const categoryName = product.category?.name ?? product.categoryName;
  const subcategoryName = product.subcategory?.name ?? product.subcategoryName;

  const catSlug = toSlug(categoryName);
  const subSlug = toSlug(subcategoryName);

  const {
    data: relatedProducts = [],
    isLoading,
    isError,
  } = useQuery<RelatedProductShape[]>({
    queryKey: ["products", "related", catSlug, subSlug, product?._id],
    enabled: Boolean(catSlug),
    staleTime: 1000 * 60 * 10,
    queryFn: async () => {
      try {
        const params = { limit: 6 } as Record<string, string | number>;

        const categoryRes = await api.get(endpoints.products, {
          params: { ...params, category: catSlug },
        });
        const categoryProducts = pickProducts(categoryRes.data).filter(
          (item) => item._id !== product._id
        );
        if (categoryProducts.length > 0) {
          return categoryProducts;
        }

        if (subSlug) {
          const subcategoryRes = await api.get(endpoints.products, {
            params: { ...params, subcategory: subSlug },
          });
          const subcategoryProducts = pickProducts(subcategoryRes.data).filter(
            (item) => item._id !== product._id
          );
          if (subcategoryProducts.length > 0) {
            return subcategoryProducts;
          }
        }

        const fallbackRes = await api.get(endpoints.products, {
          params: { ...params, sort: "-createdAt" },
        });
        return pickProducts(fallbackRes.data).filter(
          (item) => item._id !== product._id
        );
      } catch (error) {
        console.error("Error fetching related products", error);
        return [];
      }
    },
  });

  return (
    <section
      aria-labelledby="related-heading"
      className="mt-10 border-t border-slate-200 px-4 py-16 sm:px-0"
    >
      <h2 id="related-heading" className="text-xl font-bold text-slate-900">
        Customers also bought
      </h2>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoading &&
          Array.from({ length: 6 }).map((_, index) => (
            <div
              key={`related-skeleton-${index}`}
              className="flex flex-col rounded-3xl border border-slate-200 bg-white/60 p-4 shadow-sm"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-slate-100" />
              <div className="mt-4 h-4 w-3/4 rounded bg-slate-200" />
              <div className="mt-2 h-3 w-1/2 rounded bg-slate-200" />
              <div className="mt-4 h-10 rounded-2xl bg-slate-200" />
            </div>
          ))}

        {!isLoading &&
          !isError &&
          relatedProducts.length > 0 &&
          relatedProducts.map((relatedProduct) => (
            <RelatedProduct product={relatedProduct} key={relatedProduct._id} />
          ))}

        {isError && (
          <div className="col-span-full rounded-3xl border border-red-200 bg-red-50/80 p-6 text-center text-sm text-red-600">
            Unable to load related products right now. Please try again later.
          </div>
        )}
      </div>
    </section>
  );
}
