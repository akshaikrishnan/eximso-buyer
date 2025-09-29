"use client";
import { useAddToCart } from "@/hooks/use-add-to-cart";
import api from "@/lib/api/axios.interceptor";
import { endpoints } from "@/lib/data/endpoints";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Price } from "../common/price";
import Image from "next/image";
import Link from "next/link";

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
              className="h-full w-full object-cover object-center"
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
              className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black opacity-50"
            />
            <p className="relative text-lg font-semibold text-white">
              <Price amount={product.price} />
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
  const { data: related, isLoading, error } = useQuery({
    queryKey: ["products", product?.category?._id, "related"],
    queryFn: async () => {
      if (!product?.category?._id) {
        console.log("No category ID found for product:", product);
        return [];
      }

      try {
        // First try: Get products from the same category
        const categoryRes = await api.get(endpoints.products, {
          params: {
            category: product.category._id,
            limit: 5,
          },
        });

        console.log("Category-specific API response:", categoryRes.data);

        const categoryProducts = categoryRes.data?.result?.data || categoryRes.data?.data || categoryRes.data || [];
        const filteredCategoryProducts = categoryProducts.filter((p: any) => p._id !== product._id);

        // If we found products in the same category, return them
        if (filteredCategoryProducts.length > 0) {
          console.log("Found category-specific products:", filteredCategoryProducts);
          return filteredCategoryProducts;
        }

        // Fallback: Get popular/trending products
        console.log("No category-specific products found, trying fallback...");

        const fallbackRes = await api.get(endpoints.products, {
          params: {
            limit: 5,
            sort: "popular",
          },
        });

        const fallbackProducts = fallbackRes.data?.result?.data || fallbackRes.data?.data || fallbackRes.data || [];
        const filteredFallbackProducts = fallbackProducts.filter((p: any) => p._id !== product._id);

        console.log("Fallback products:", filteredFallbackProducts);
        return filteredFallbackProducts;
      } catch (err) {
        console.error("Error fetching related products:", err);
        return [];
      }
    },
    enabled: !!product?.category?._id,
  });
  console.log(related);

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
          {related.map((product: any) => (
            <RelatedProduct product={product} key={product._id} />
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
          <p className="text-red-500">Error loading related products. Please try again later.</p>
        </div>
      )}
    </section>
  );
}
