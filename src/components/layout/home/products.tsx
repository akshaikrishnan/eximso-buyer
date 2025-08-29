"use client";

import { useState, useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "@/lib/api/axios.interceptor";
import { InView } from "react-intersection-observer";
import ProductCard from "@/components/common/product-card";
import { useSearchParams } from "next/navigation";
import { endpoints } from "@/lib/data/endpoints";
import { getSearchParamsObject } from "@/lib/getSearchParamsObj";

export default function ProductsGrid({
  params,
  disableInfiniteScroll = false,
  limit = 10,
}: any) {
  const searchParams = useSearchParams();
  const name = searchParams.get("q") || "";
  const sort = searchParams.get("sort") || "";
  const category = params?.[0] || null;
  const subcategory = params?.[1] || null;

  const searchParamsObj = getSearchParamsObject(searchParams);

  const fetchProducts = async ({ pageParam = 1 }) => {
    const res = await axios.get(endpoints.products, {
      params: {
        page: pageParam,
        limit,
        category,
        subcategory,
        ...searchParamsObj,
      },
    });
    return res.data.result;
  };
  console.log(["products", params, searchParamsObj]);
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["products", params, searchParamsObj],
    queryFn: fetchProducts,
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage?.pagination?.page ?? 1;
      const totalPages = lastPage?.pagination?.totalPages ?? 1;
      return disableInfiniteScroll
        ? undefined
        : currentPage < totalPages
        ? currentPage + 1
        : undefined;
    },
    initialPageParam: 1,
    enabled: !disableInfiniteScroll || limit > 0,
  });

  const [showLoader, setShowLoader] = useState(true);
  const [showScrollLoader, setShowScrollLoader] = useState(false);
  const [nextPageLoading, setNextPageLoading] = useState(false);

  useEffect(() => {
    setShowLoader(isLoading);
  }, [isLoading]);

  useEffect(() => {
    if (nextPageLoading) {
      setShowScrollLoader(true);
      fetchNextPage().finally(() => {
        setNextPageLoading(false);
        setShowScrollLoader(false);
      });
    }
  }, [nextPageLoading]);

  const products: any[] =
    data?.pages?.flatMap((page) => page?.data || []) || [];

  // Limit products to first page if infinite scroll is disabled
  const displayedProducts = disableInfiniteScroll
    ? products.slice(0, limit)
    : products;

  const handleInViewChange = (inView: boolean) => {
    if (disableInfiniteScroll) return;
    if (inView && !isFetchingNextPage && hasNextPage && !nextPageLoading) {
      setNextPageLoading(true);
    }
  };

  return (
    <div className="p-6">
      {/* Initial Loading */}
      {isLoading && showLoader && (
        <div className="flex flex-col justify-center items-center h-48">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></div>
          <p className="mt-2 text-gray-600">Loading products...</p>
        </div>
      )}

      {/* Error Handling */}
      {!isLoading && isError && (
        <div className="text-center text-red-500">
          <p className="mb-2">
            Error: {error?.message || "Something went wrong."}
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
          >
            Retry
          </button>
        </div>
      )}

      {/* No Products */}
      {!isLoading && !isError && displayedProducts.length === 0 && (
        <div className="text-center text-gray-500">No products available.</div>
      )}

      {/* Product Grid */}
      {!isLoading && !isError && displayedProducts.length > 0 && (
        <section className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {displayedProducts.map((product) => (
            <div
              key={product._id}
              className="hover:scale-105 transition-transform duration-300"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </section>
      )}

      {/* Infinite Scroll Trigger */}
      {!disableInfiniteScroll && hasNextPage && (
        <InView
          as="div"
          threshold={0.5}
          onChange={handleInViewChange}
          className="flex justify-center items-center mt-6 min-h-[50px]"
        >
          <div
            className={`transition-opacity  ease-in-out ${
              showScrollLoader ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <div className="flex items-center gap-2 text-gray-600">
              <p>Loading...</p>
              <div
                role="status"
                aria-live="polite"
                className="animate-spin rounded-full h-4 w-4 border-t-4 border-blue-500"
              ></div>
            </div>
          </div>
        </InView>
      )}

      {/* End Message */}
      {!hasNextPage && displayedProducts.length > 0 && (
        <div className="text-center text-gray-500 mt-6">
          🎉 <span className="font-medium">You’ve reached the end!</span> No
          more products to load.
        </div>
      )}
    </div>
  );
}
