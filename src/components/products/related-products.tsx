"use client";

import { useAddToCart } from "@/hooks/use-add-to-cart";
import api from "@/lib/api/axios.interceptor";
import { endpoints } from "@/lib/data/endpoints";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Price } from "../common/price";
import Image from "next/image";
import Link from "next/link";

// --- helpers (inlined so you don't add new files)
function toSlug(s?: string) {
  if (!s) return "";
  return s
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
function pickProducts(payload: any) {
  return payload?.result?.data ?? payload?.data ?? payload ?? [];
}
// ---

export function RelatedProduct({ product }: any) {
  const addToCart = useAddToCart(product);

  return (
    <div key={product._id}>
      <div className="relative">
        <Link href={"/" + product.slug}>
          <div className="relative h-72 w-full overflow-hidden rounded-lg">
            <Image
              width={277}
              height={288}
              src={product.thumbnail}
              alt={product.name}
              className="h-full w-full object-contain object-center"
            />
          </div>
          <div className="relative mt-4">
            <h3 className="text-sm font-medium text-gray-900">
              {product.name}
            </h3>
          </div>
          <div className="absolute inset-x-0 top-0 flex h-72 items-end justify-end overflow-hidden rounded-lg p-4">
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-36 bg-linear-to-t from-black opacity-50"
            />
            <p className="relative text-lg font-semibold text-white">
              <Price
                amount={
                  product?.discountPercentage > 0
                    ? product?.offerPrice
                    : product?.price
                }
              />
            </p>
          </div>
        </Link>
      </div>
      <div className="mt-6">
        <button
          onClick={() => {
            addToCart();
          }}
          className="relative flex w-full items-center justify-center rounded-md border border-transparent bg-gray-100 px-8 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200"
        >
          Add to bag
          <span className="sr-only">, {product.name}</span>
        </button>
      </div>
    </div>
  );
}

export default function RelatedProducts({ product }: any) {
  const categoryName: string | undefined =
    product?.category?.name ?? product?.categoryName;
  const subcategoryName: string | undefined =
    product?.subcategory?.name ?? product?.subcategoryName;

  const catSlug = toSlug(categoryName);
  const subSlug = toSlug(subcategoryName);

  const { data: related, isLoading, error } = useQuery({
    queryKey: ["products", "related", catSlug, subSlug, product?._id],
    enabled: !!catSlug,
    queryFn: async () => {
      try {
        // 1) same category by slug (✅ backend expects slug)
        const categoryRes = await api.get(endpoints.products, {
          params: { category: catSlug, limit: 5 },
        });
        const categoryProducts = pickProducts(categoryRes.data).filter(
          (p: any) => p._id !== product._id
        );
        if (categoryProducts.length) return categoryProducts;

        // 2) try subcategory by slug for tighter matches
        if (subSlug) {
          const subRes = await api.get(endpoints.products, {
            params: { subcategory: subSlug, limit: 5 },
          });
          const subProducts = pickProducts(subRes.data).filter(
            (p: any) => p._id !== product._id
          );
          if (subProducts.length) return subProducts;
        }

        // 3) fallback: newest/popular
        const fallbackRes = await api.get(endpoints.products, {
          params: { limit: 5, sort: "-createdAt" }, // or your "popular" key if supported
        });
        return pickProducts(fallbackRes.data).filter(
          (p: any) => p._id !== product._id
        );
      } catch (err) {
        console.error("Error fetching related products:", err);
        return [];
      }
    },
  });

  return (
    <section
      aria-labelledby="related-heading"
      className="mt-10 border-t border-gray-200 px-4 py-16 sm:px-0"
    >
      <h2 id="related-heading" className="text-xl font-bold text-gray-900">
        Customers also bought
      </h2>

      {!isLoading && related?.length > 0 && (
        <div className="mt-8 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
          {related.map((p: any) => (
            <RelatedProduct product={p} key={p._id} />
          ))}
        </div>
      )}

      {isLoading && (
        <div className="mt-8 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="relative h-72 w-full overflow-hidden rounded-lg bg-gray-200"></div>
              <div className="mt-4 h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="mt-6 h-10 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="mt-8 text-center py-8">
          <p className="text-red-500">
            Error loading related products. Please try again later.
          </p>
        </div>
      )}
    </section>
  );
}
