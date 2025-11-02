"use client";

import { CSSProperties, useEffect, useMemo, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "@/lib/api/axios.interceptor";
import { InView } from "react-intersection-observer";
import ProductCard from "@/components/common/product-card";
import { useSearchParams } from "next/navigation";
import { endpoints } from "@/lib/data/endpoints";
import { getSearchParamsObject } from "@/lib/getSearchParamsObj";
import mergeClasses from "@/lib/utils/classNames";

type GridLayoutConfig = {
  mobile: number;
  desktop: number;
};

const DEFAULT_GRID_LAYOUT: GridLayoutConfig = {
  mobile: 2,
  desktop: 4,
};

interface ProductsGridProps {
  params?: any;
  disableInfiniteScroll?: boolean;
  limit?: number;
  gridLayout?: GridLayoutConfig;
  activeColumns?: number;
  isMobileViewport?: boolean;
}

const ProductCardSkeleton = ({
  variant = "grid",
}: {
  variant?: "grid" | "list";
}) => {
  const isListLayout = variant === "list";
  return (
    <div
      className={mergeClasses(
        "overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm",
        isListLayout ? "flex gap-4 p-4" : "flex h-full flex-col"
      )}
    >
      <div
        className={mergeClasses(
          "relative bg-gray-100",
          isListLayout
            ? "aspect-square w-28 shrink-0 rounded-xl sm:w-32"
            : "aspect-square w-full sm:aspect-[3/4] lg:aspect-[4/5]"
        )}
      >
        <div className="absolute inset-0 animate-pulse bg-gray-200" />
      </div>
      <div
        className={mergeClasses(
          "flex flex-1 flex-col justify-between gap-3",
          isListLayout ? "" : "p-4"
        )}
      >
        <div className="space-y-3">
          <div className="h-3.5 w-24 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="space-y-3">
          <div className="h-3 w-32 animate-pulse rounded bg-gray-200" />
          <div className="h-3 w-28 animate-pulse rounded bg-gray-200" />
          <div className="h-6 w-24 animate-pulse rounded bg-gray-300" />
        </div>
      </div>
    </div>
  );
};

export default function ProductsGrid({
  params,
  disableInfiniteScroll = false,
  limit = 10,
  gridLayout,
  activeColumns,
  isMobileViewport,
}: ProductsGridProps) {
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

  const [localIsMobile, setLocalIsMobile] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(max-width: 767px)").matches;
  });

  useEffect(() => {
    setShowLoader(isLoading);
  }, [isLoading]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(max-width: 767px)");

    const handleChange = (event: MediaQueryListEvent) => {
      setLocalIsMobile(event.matches);
    };

    setLocalIsMobile(mediaQuery.matches);

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  useEffect(() => {
    if (nextPageLoading) {
      setShowScrollLoader(true);
      fetchNextPage().finally(() => {
        setNextPageLoading(false);
        setShowScrollLoader(false);
      });
    }
  }, [fetchNextPage, nextPageLoading]);

  const products: any[] =
    data?.pages?.flatMap((page) => page?.data || []) || [];

  // Limit products to first page if infinite scroll is disabled
  const displayedProducts = disableInfiniteScroll
    ? products.slice(0, limit)
    : products;

  const resolvedLayout: GridLayoutConfig = {
    mobile: gridLayout?.mobile ?? DEFAULT_GRID_LAYOUT.mobile,
    desktop: gridLayout?.desktop ?? DEFAULT_GRID_LAYOUT.desktop,
  };

  const effectiveIsMobile =
    typeof isMobileViewport === "boolean" ? isMobileViewport : localIsMobile;

  const activeColumnCount = activeColumns
    ? Math.max(activeColumns, 1)
    : Math.max(
        effectiveIsMobile ? resolvedLayout.mobile : resolvedLayout.desktop,
        1
      );

  const columnCount = Math.max(activeColumnCount, 1);

  const gridColumnsStyle = useMemo<CSSProperties>(
    () => ({
      gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
    }),
    [columnCount]
  );

  const gridClassName = mergeClasses(
    "grid gap-4 md:gap-6",
    effectiveIsMobile ? "" : "lg:gap-8"
  );

  const initialSkeletonCount = useMemo(() => {
    const rows = effectiveIsMobile ? 3 : 2;
    return activeColumnCount * rows;
  }, [activeColumnCount, effectiveIsMobile]);

  const loadMoreSkeletonCount = useMemo(() => {
    return activeColumnCount;
  }, [activeColumnCount]);

  const handleInViewChange = (inView: boolean) => {
    if (disableInfiniteScroll) return;
    if (inView && !isFetchingNextPage && hasNextPage && !nextPageLoading) {
      setNextPageLoading(true);
    }
  };

  const cardVariant =
    effectiveIsMobile && activeColumnCount === 1 ? "list" : "grid";

  return (
    <div className="p-0 md:p-6">
      {/* Initial Loading */}
      {isLoading && showLoader && (
        <section
          className={gridClassName}
          style={gridColumnsStyle}
          aria-hidden="true"
        >
          {Array.from({ length: initialSkeletonCount }).map((_, index) => (
            <ProductCardSkeleton
              key={`initial-skeleton-${index}`}
              variant={cardVariant}
            />
          ))}
        </section>
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
        <section className={gridClassName} style={gridColumnsStyle}>
          {displayedProducts.map((product) => (
            <div
              key={product._id}
              className={mergeClasses(
                "transition-transform duration-300",
                cardVariant === "grid" ? "hover:scale-105" : ""
              )}
            >
              <ProductCard
                product={product}
                layoutVariant={cardVariant}
                isMobileViewport={effectiveIsMobile}
              />
            </div>
          ))}
          {isFetchingNextPage &&
            hasNextPage &&
            Array.from({ length: loadMoreSkeletonCount }).map((_, index) => (
              <ProductCardSkeleton
                key={`next-page-skeleton-${index}`}
                variant={cardVariant}
              />
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
              <p>Loading more products...</p>
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
      {!hasNextPage &&
        !disableInfiniteScroll &&
        displayedProducts.length > 0 && (
          <div className="text-center text-gray-500 mt-6">
            🎉 <span className="font-medium">You’ve reached the end!</span> No
            more products to load.
          </div>
        )}
    </div>
  );
}
