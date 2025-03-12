"use client";
import { useState } from "react";
import ProductCard from "@/components/common/product-card";
import { useProducts } from "@/lib/hooks/useProducts";
import { InView } from "react-intersection-observer";

export default function ProductsGrid() {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useProducts({});

  const products: any[] = data?.pages?.flatMap((page) => page?.data || []) || [];

  return (
    <div className="p-6">
      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></div>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="text-center text-red-500">
          <p className="mb-2">Error: {error?.message || "Something went wrong."}</p>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && products.length === 0 && (
        <div className="text-center">
          <p className="text-gray-500">No products available.</p>
        </div>
      )}

      {/* Products Grid */}
      {!isLoading && !isError && products.length > 0 && (
        <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="hover:scale-105 transition-transform duration-300"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </section>
      )}

      {/* Infinite Scroll */}
      {hasNextPage && (
        <InView
          as="div"
          onChange={(inView) => inView && fetchNextPage()}
          className="flex justify-center items-center mt-6"
        >
          {isFetchingNextPage ? (
            <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-500"></div>
          ) : (
            <button className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300">
              Load More
            </button>
          )}
        </InView>
      )}
    </div>
  );
}
