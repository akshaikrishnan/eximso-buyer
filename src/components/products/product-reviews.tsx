"use client";

import { useMemo } from "react";
import { StarIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import type { InfiniteData, UseInfiniteQueryResult } from "@tanstack/react-query";

import type { ProductReviewPage } from "@/hooks/use-product-reviews";
import {
  getReviewBody,
  getReviewHeadline,
  getReviewRating,
  getReviewTimestamp,
  getReviewerName,
  isSameReview,
} from "@/lib/utils/review-utils";

interface ProductReviewsProps {
  productId?: string;
  productName?: string;
  reviewsQuery: UseInfiniteQueryResult<InfiniteData<ProductReviewPage>, Error>;
}

const stars = [1, 2, 3, 4, 5];

const getReviewIdentifier = (review: any) =>
  review?._id ?? review?.id ?? review?.reviewId ?? review?.uuid ?? null;

const formatDate = (value?: string) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getDistributionEntries = (
  distribution?: Record<number, number> | null,
  total?: number
) => {
  const totalCount = total ?? 0;
  return stars
    .slice()
    .reverse()
    .map((value) => {
      const count = distribution?.[value] ?? 0;
      const percent = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
      return { value, count, percent };
    });
};

const ReviewSkeleton = () => (
  <div className="animate-pulse rounded-2xl border border-gray-100 bg-white/60 p-6">
    <div className="flex items-center gap-2">
      <div className="h-4 w-32 rounded-full bg-gray-200" />
      <div className="h-4 w-12 rounded-full bg-gray-200" />
    </div>
    <div className="mt-4 space-y-2">
      <div className="h-3 w-full rounded bg-gray-200" />
      <div className="h-3 w-3/4 rounded bg-gray-200" />
      <div className="h-3 w-1/2 rounded bg-gray-200" />
    </div>
  </div>
);

const EmptyState = ({ productName }: { productName?: string }) => (
  <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center">
    <h3 className="text-lg font-semibold text-gray-900">No reviews yet</h3>
    <p className="mt-2 text-sm text-gray-500">
      {productName
        ? `Be the first to share your experience with ${productName}.`
        : "Be the first to share your experience with this product."}
    </p>
  </div>
);

const ReviewCard = ({
  review,
  isHighlighted,
}: {
  review: any;
  isHighlighted: boolean;
}) => {
  const rating = getReviewRating(review);
  const headline = getReviewHeadline(review);
  const body = getReviewBody(review);
  const name = getReviewerName(review);
  const timestamp = getReviewTimestamp(review);
  const formattedDate = formatDate(timestamp);

  return (
    <article
      className={clsx(
        "rounded-2xl border bg-white p-6 shadow-sm transition hover:shadow-md",
        isHighlighted
          ? "border-indigo-200 ring-1 ring-indigo-200"
          : "border-gray-100"
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            {stars.map((star) => (
              <StarIcon
                key={star}
                className={clsx(
                  "h-4 w-4",
                  rating >= star ? "text-amber-400" : "text-gray-200"
                )}
              />
            ))}
          </div>
          <h3 className="mt-3 text-base font-semibold text-gray-900">
            {headline || "Rated this product"}
          </h3>
        </div>
        <div className="flex flex-col items-end gap-1 text-right">
          <span className="text-sm font-medium text-gray-900">{name}</span>
          {formattedDate && (
            <span className="text-xs text-gray-500">{formattedDate}</span>
          )}
          {isHighlighted && (
            <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600">
              Your review
            </span>
          )}
        </div>
      </div>
      {body && (
        <p className="mt-4 text-sm leading-relaxed text-gray-600">{body}</p>
      )}
    </article>
  );
};

export const ProductReviews = ({
  productId,
  productName,
  reviewsQuery,
}: ProductReviewsProps) => {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = reviewsQuery;

  const pages = useMemo(() => data?.pages ?? [], [data]);
  const stats = pages[0]?.stats;
  const total = stats?.total ?? 0;
  const averageRating = stats?.averageRating ?? 0;
  const distribution = stats?.distribution;
  const userReview = useMemo(() => {
    for (const page of pages) {
      if (page.stats.userReview) return page.stats.userReview;
    }
    return null;
  }, [pages]);

  const allReviews = pages.flatMap((page) => page.items ?? []);
  const orderedReviews = useMemo(() => {
    if (!userReview) return allReviews;
    const rest = allReviews.filter((review) => !isSameReview(review, userReview));
    return [userReview, ...rest];
  }, [allReviews, userReview]);

  const distributionEntries = getDistributionEntries(distribution, total);
  const ratingLabel = averageRating ? averageRating.toFixed(1) : "—";

  return (
    <section
      id="reviews"
      aria-labelledby="reviews-heading"
      className="mt-16 scroll-mt-24"
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-stretch">
        <div className="flex-1 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
            Customer reviews
          </p>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-6">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-4xl font-bold text-gray-900">{ratingLabel}</span>
                <div className="flex items-center gap-1">
                  {stars.map((star) => (
                    <StarIcon
                      key={star}
                      className={clsx(
                        "h-5 w-5",
                        averageRating >= star
                          ? "text-amber-400"
                          : "text-gray-200"
                      )}
                    />
                  ))}
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Based on {total} review{total === 1 ? "" : "s"}
              </p>
            </div>
            <div className="flex-1 space-y-2">
              {distributionEntries.map(({ value, count, percent }) => (
                <div key={value} className="flex items-center gap-3 text-sm">
                  <span className="w-12 text-gray-600">{value}★</span>
                  <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="absolute inset-y-0 left-0 rounded-full bg-indigo-500 transition-all"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-xs text-gray-500">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full max-w-sm rounded-2xl border border-gray-200 bg-gradient-to-br from-indigo-50 via-white to-white p-6 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900">How reviews work</h3>
          <p className="mt-2 text-sm text-gray-600">
            Reviews are from verified shoppers who have purchased this product.
            You can manage your review from the order details page after delivery.
          </p>
          {isError && (
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-4 inline-flex items-center justify-center rounded-lg border border-indigo-200 bg-white px-4 py-2 text-sm font-medium text-indigo-600 transition hover:bg-indigo-50"
            >
              Retry loading reviews
            </button>
          )}
        </div>
      </div>

      <div className="mt-10 space-y-4">
        {isLoading && !data && (
          <div className="grid gap-4 md:grid-cols-2">
            {[...Array(4)].map((_, index) => (
              <ReviewSkeleton key={index} />
            ))}
          </div>
        )}

        {!isLoading && orderedReviews.length === 0 && (
          <EmptyState productName={productName} />
        )}

        {orderedReviews.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            {orderedReviews.map((review) => (
              <ReviewCard
                key={getReviewIdentifier(review) ?? `${getReviewerName(review)}-${getReviewTimestamp(review)}`}
                review={review}
                isHighlighted={Boolean(
                  userReview && isSameReview(userReview, review)
                )}
              />
            ))}
          </div>
        )}

        {hasNextPage && (
          <div className="flex justify-center pt-4">
            <button
              type="button"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-5 py-2 text-sm font-medium text-gray-700 transition hover:border-indigo-400 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isFetchingNextPage ? "Loading..." : "Load more reviews"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductReviews;
