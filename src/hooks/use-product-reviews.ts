"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import api from "@/lib/api/axios.interceptor";
import { endpoints } from "@/lib/data/endpoints";
import {
  NormalizedReviewResponse,
  ProductReview,
  normalizeReviewResponse,
} from "@/lib/utils/review-utils";

export interface ProductReviewPage {
  items: ProductReview[];
  stats: {
    averageRating: number;
    total: number;
    distribution?: Record<number, number> | null;
    userReview: ProductReview | null;
  };
  page: number;
  hasNext: boolean;
}

const getHasNextPage = (
  normalized: NormalizedReviewResponse,
  currentPage: number,
  pageSize: number
) => {
  if (typeof normalized.meta.hasNextPage === "boolean") {
    return normalized.meta.hasNextPage;
  }
  if (
    typeof normalized.meta.currentPage === "number" &&
    typeof normalized.meta.totalPages === "number"
  ) {
    return normalized.meta.currentPage < normalized.meta.totalPages;
  }
  if (
    typeof normalized.meta.total === "number" &&
    typeof normalized.meta.limit === "number"
  ) {
    return currentPage * normalized.meta.limit < normalized.meta.total;
  }
  if (
    typeof normalized.meta.total === "number" &&
    normalized.meta.total > 0 &&
    pageSize > 0
  ) {
    return currentPage * pageSize < normalized.meta.total;
  }
  return normalized.reviews.length === pageSize;
};

export const useProductReviews = (
  productId?: string,
  pageSize = 5
) =>
  useInfiniteQuery<ProductReviewPage>({
    queryKey: ["product-reviews", productId, pageSize],
    enabled: Boolean(productId),
    initialPageParam: 1,
    staleTime: 1000 * 30,
    queryFn: async ({ pageParam }) => {
      if (!productId) {
        return {
          items: [],
          stats: {
            averageRating: 0,
            total: 0,
            distribution: null,
            userReview: null,
          },
          page: Number(pageParam) || 1,
          hasNext: false,
        };
      }

      const res = await api.get(`${endpoints.reviews}/product/${productId}`, {
        params: {
          page: pageParam,
          limit: pageSize,
        },
      });

      const normalized = normalizeReviewResponse(res.data);

      return {
        items: normalized.reviews,
        stats: {
          averageRating: normalized.averageRating ?? 0,
          total: normalized.meta.total ?? normalized.reviews.length,
          distribution: normalized.ratingDistribution,
          userReview: normalized.userReview,
        },
        page: Number(pageParam) || 1,
        hasNext: getHasNextPage(normalized, Number(pageParam) || 1, pageSize),
      };
    },
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.page + 1 : undefined,
  });

export type ProductReviewsQueryResult = ReturnType<typeof useProductReviews>;
