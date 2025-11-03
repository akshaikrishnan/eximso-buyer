"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  StarIcon as StarSolidIcon,
} from "@heroicons/react/20/solid";
import {
  PencilSquareIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import api from "@/lib/api/axios.interceptor";
import { endpoints } from "@/lib/data/endpoints";
import {
  ProductReview,
  getReviewBody,
  getReviewHeadline,
  getReviewRating,
  normalizeReviewResponse,
} from "@/lib/utils/review-utils";
import { toast } from "@/hooks/use-toast";

interface ReviewManagerProps {
  productId?: string;
  productName?: string;
  orderId?: string;
  orderNumber?: string;
  className?: string;
}

interface ReviewFormValues {
  headline?: string;
  body?: string;
}

const ratingScale = [1, 2, 3, 4, 5];

const getReviewIdentifier = (review?: ProductReview | null) =>
  review?._id ?? review?.id ?? review?.reviewId ?? null;

const buildPayload = (
  values: ReviewFormValues,
  rating: number,
  productId?: string,
  orderId?: string,
  orderNumber?: string
) => {
  const payload: Record<string, unknown> = {
    productId,
    rating,
  };

  if (orderId) {
    payload.orderId = orderId;
  }
  if (orderNumber) {
    payload.orderNumber = orderNumber;
  }

  const trimmedHeadline = values.headline?.trim();
  const trimmedBody = values.body?.trim();

  if (trimmedHeadline) {
    payload.headline = trimmedHeadline;
    payload.header = trimmedHeadline;
    payload.title = trimmedHeadline;
  }

  if (trimmedBody) {
    payload.body = trimmedBody;
    payload.comment = trimmedBody;
    payload.content = trimmedBody;
  }

  return payload;
};

export const ReviewManager = ({
  productId,
  productName,
  orderId,
  orderNumber,
  className,
}: ReviewManagerProps) => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [ratingError, setRatingError] = useState<string | null>(null);

  const { register, handleSubmit, reset } = useForm<ReviewFormValues>({
    defaultValues: {
      headline: "",
      body: "",
    },
  });

  const reviewQuery = useQuery({
    queryKey: ["product-review", productId, orderNumber ?? orderId ?? ""],
    enabled: Boolean(productId),
    queryFn: async () => {
      if (!productId) return null;

      try {
        const res = await api.get(`${endpoints.reviews}/product/${productId}`, {
          params: {
            page: 1,
            limit: 1,
            mine: true,
            orderId,
            orderNumber,
          },
        });

        const normalized = normalizeReviewResponse(res.data);
        return normalized.userReview ?? null;
      } catch (error: any) {
        const status = error?.response?.status;
        if (status === 404) {
          return null;
        }
        throw error;
      }
    },
    staleTime: 1000 * 30,
  });

  const existingReview = reviewQuery.data ?? null;
  const existingReviewId = useMemo(
    () => getReviewIdentifier(existingReview),
    [existingReview]
  );

  const resetForm = () => {
    reset({
      headline: existingReview ? getReviewHeadline(existingReview) : "",
      body: existingReview ? getReviewBody(existingReview) : "",
    });
    setRating(existingReview ? getReviewRating(existingReview) : 0);
    setHoverRating(null);
    setRatingError(null);
  };

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, existingReviewId]);

  const invalidateRelatedQueries = async () => {
    const tasks: Promise<unknown>[] = [];
    if (productId) {
      tasks.push(
        queryClient.invalidateQueries({ queryKey: ["product-review", productId] })
      );
      tasks.push(
        queryClient.invalidateQueries({ queryKey: ["product-reviews", productId] })
      );
    }
    tasks.push(queryClient.invalidateQueries({ queryKey: ["orders"] }));
    if (orderNumber) {
      tasks.push(
        queryClient.invalidateQueries({ queryKey: ["orderNumber", orderNumber] })
      );
    } else if (orderId) {
      tasks.push(
        queryClient.invalidateQueries({ queryKey: ["orderNumber", orderId] })
      );
    }
    await Promise.all(tasks);
  };

  const handleMutationError = (error: any, fallback: string) => {
    const description =
      error?.response?.data?.message || error?.message || fallback;
    toast({
      title: "Something went wrong",
      description,
      variant: "destructive",
    });
  };

  const handleMutationSuccess = async (message: string, resetState = false) => {
    toast({
      title: message,
      description: productName
        ? `Thanks for reviewing ${productName}.`
        : undefined,
    });
    if (resetState) {
      reset({ headline: "", body: "" });
      setRating(0);
      setHoverRating(null);
    }
    await invalidateRelatedQueries();
    setIsOpen(false);
  };

  const createMutation = useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      return api.post(endpoints.reviews, payload);
    },
    onSuccess: async () => {
      await handleMutationSuccess("Review submitted", true);
    },
    onError: (error) => handleMutationError(error, "Failed to submit review"),
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: Record<string, unknown>;
    }) => {
      return api.put(`${endpoints.reviews}/${id}`, payload);
    },
    onSuccess: async () => {
      await handleMutationSuccess("Review updated");
    },
    onError: (error) => handleMutationError(error, "Failed to update review"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => api.delete(`${endpoints.reviews}/${id}`),
    onSuccess: async () => {
      await handleMutationSuccess("Review removed", true);
    },
    onError: (error) => handleMutationError(error, "Failed to delete review"),
  });

  const isSaving = createMutation.isPending || updateMutation.isPending;
  const isDeleting = deleteMutation.isPending;
  const isLoadingReview = reviewQuery.isLoading;

  const onSubmit = handleSubmit((values) => {
    if (!productId) {
      toast({
        title: "Unable to submit review",
        description: "Missing product information.",
        variant: "destructive",
      });
      return;
    }

    if (rating <= 0) {
      setRatingError("Please choose a rating to continue.");
      return;
    }

    const payload = buildPayload(values, rating, productId, orderId, orderNumber);

    if (existingReviewId) {
      updateMutation.mutate({ id: existingReviewId, payload });
    } else {
      createMutation.mutate(payload);
    }
  });

  const handleDelete = () => {
    if (!existingReviewId || isDeleting) return;
    const confirmed = window.confirm(
      "Are you sure you want to delete this review?"
    );
    if (!confirmed) return;
    deleteMutation.mutate(existingReviewId);
  };

  const currentRating = existingReview
    ? getReviewRating(existingReview)
    : undefined;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        disabled={isLoadingReview || isSaving}
        className={clsx(
          "inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2",
          existingReview
            ? "border-indigo-500 bg-indigo-600 text-white shadow-sm hover:bg-indigo-500 focus:ring-indigo-500"
            : "border-gray-200 bg-white text-gray-700 hover:border-indigo-400 hover:text-indigo-600 focus:ring-indigo-500",
          (isLoadingReview || isSaving) && "opacity-70 cursor-not-allowed",
          className
        )}
      >
        {existingReview ? (
          <PencilSquareIcon className="h-4 w-4" />
        ) : (
          <PlusIcon className="h-4 w-4" />
        )}
        {existingReview ? "Edit review" : "Add review"}
        {typeof currentRating === "number" && currentRating > 0 && (
          <span className="ml-1 inline-flex items-center gap-0.5 text-xs font-semibold">
            <StarSolidIcon className="h-4 w-4 text-amber-300" />
            {currentRating.toFixed(1)}
          </span>
        )}
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={setIsOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-150"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-2xl">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Dialog.Title className="text-lg font-semibold text-gray-900">
                        {existingReview ? "Update your review" : "Add a product review"}
                      </Dialog.Title>
                      {productName && (
                        <p className="mt-1 text-sm text-gray-500">
                          {productName}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <XMarkIcon className="h-5 w-5" />
                      <span className="sr-only">Close</span>
                    </button>
                  </div>

                  <form onSubmit={onSubmit} className="mt-6 space-y-6">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Rate your experience <span className="text-red-500">*</span>
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        {ratingScale.map((value) => {
                          const displayRating = hoverRating ?? rating;
                          const isActive = value <= displayRating;
                          return (
                            <button
                              key={value}
                              type="button"
                              onMouseEnter={() => setHoverRating(value)}
                              onMouseLeave={() => setHoverRating(null)}
                              onFocus={() => setHoverRating(value)}
                              onBlur={() => setHoverRating(null)}
                              onClick={() => {
                                setRating(value);
                                setRatingError(null);
                              }}
                              className={clsx(
                                "relative flex h-10 w-10 items-center justify-center rounded-full border transition focus:outline-none focus:ring-2 focus:ring-indigo-500",
                                isActive
                                  ? "border-amber-300 bg-amber-50"
                                  : "border-gray-200 bg-white hover:border-gray-300"
                              )}
                              aria-label={`${value} star${value > 1 ? "s" : ""}`}
                              aria-pressed={rating === value}
                            >
                              <StarSolidIcon
                                className={clsx(
                                  "h-6 w-6",
                                  isActive ? "text-amber-400" : "text-gray-300"
                                )}
                              />
                            </button>
                          );
                        })}
                      </div>
                      <p className="mt-2 text-xs text-gray-500">
                        {rating > 0
                          ? `Selected rating: ${rating} out of 5`
                          : "Tap on the stars to rate this product."}
                      </p>
                      {ratingError && (
                        <p className="mt-2 text-sm text-red-500">{ratingError}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="headline"
                        className="text-sm font-medium text-gray-900"
                      >
                        Review headline <span className="text-gray-400">(optional)</span>
                      </label>
                      <input
                        id="headline"
                        type="text"
                        {...register("headline")}
                        placeholder="Summarise your experience"
                        maxLength={120}
                        className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="body"
                        className="text-sm font-medium text-gray-900"
                      >
                        Review details <span className="text-gray-400">(optional)</span>
                      </label>
                      <textarea
                        id="body"
                        rows={4}
                        {...register("body")}
                        placeholder="Share details that will help other shoppers."
                        className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-900 shadow-sm transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                      {existingReviewId && (
                        <button
                          type="button"
                          onClick={handleDelete}
                          disabled={isDeleting}
                          className="inline-flex items-center justify-center rounded-lg border border-transparent bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isDeleting ? "Deleting..." : "Delete review"}
                        </button>
                      )}
                      <div className="flex flex-1 justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => setIsOpen(false)}
                          className="inline-flex items-center justify-center rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSaving}
                          className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          {isSaving
                            ? "Saving..."
                            : existingReviewId
                              ? "Update review"
                              : "Submit review"}
                        </button>
                      </div>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default ReviewManager;
