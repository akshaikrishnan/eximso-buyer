export interface ReviewUser {
  _id?: string;
  id?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  username?: string;
  [key: string]: unknown;
}

export interface ProductReview {
  _id?: string;
  id?: string;
  reviewId?: string;
  rating?: number;
  score?: number;
  stars?: number;
  value?: number;
  headline?: string;
  header?: string;
  title?: string;
  subject?: string;
  summary?: string;
  heading?: string;
  body?: string;
  comment?: string;
  content?: string;
  description?: string;
  message?: string;
  text?: string;
  createdAt?: string;
  updatedAt?: string;
  user?: ReviewUser;
  author?: ReviewUser;
  createdBy?: ReviewUser;
  isMine?: boolean;
  isUserReview?: boolean;
  isCurrentUser?: boolean;
  createdByCurrentUser?: boolean;
  [key: string]: unknown;
}

export interface NormalizedReviewResponse {
  reviews: ProductReview[];
  meta: {
    total?: number;
    totalPages?: number;
    currentPage?: number;
    perPage?: number;
    page?: number;
    limit?: number;
    hasNextPage?: boolean;
  };
  averageRating: number;
  ratingDistribution?: Record<number, number> | null;
  userReview: ProductReview | null;
}

const numberOrUndefined = (value: unknown): number | undefined => {
  if (value === null || value === undefined) return undefined;
  const num = Number(value);
  if (Number.isNaN(num)) return undefined;
  return num;
};

const pickFirstObject = (...candidates: unknown[]): Record<string, unknown> | null => {
  for (const candidate of candidates) {
    if (candidate && typeof candidate === "object" && !Array.isArray(candidate)) {
      return candidate as Record<string, unknown>;
    }
  }
  return null;
};

const pickArray = (...candidates: unknown[]): ProductReview[] => {
  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate as ProductReview[];
    }
    if (candidate && typeof candidate === "object") {
      const nested = pickArray(
        (candidate as Record<string, unknown>).items,
        (candidate as Record<string, unknown>).data,
        (candidate as Record<string, unknown>).reviews,
        (candidate as Record<string, unknown>).rows,
        (candidate as Record<string, unknown>).list
      );
      if (nested.length) {
        return nested;
      }
    }
  }
  return [];
};

export const isSameReview = (
  a?: ProductReview | null,
  b?: ProductReview | null
): boolean => {
  if (!a || !b) return false;
  const pickId = (review: ProductReview) =>
    review._id ?? review.id ?? review.reviewId ?? (review as any)?.uuid ?? null;
  const idA = pickId(a);
  const idB = pickId(b);
  if (idA && idB) {
    return String(idA) === String(idB);
  }
  return a === b;
};

export const normalizeReviewResponse = (
  payload: unknown
): NormalizedReviewResponse => {
  const layers = [
    payload,
    (payload as any)?.result,
    (payload as any)?.data,
    (payload as any)?.result?.data,
  ];

  const metaSource =
    pickFirstObject(
      (payload as any)?.meta,
      (payload as any)?.pagination,
      (payload as any)?.page,
      (payload as any)?.result?.meta,
      (payload as any)?.result?.pagination,
      (payload as any)?.data?.meta,
      (payload as any)?.data?.pagination,
      (payload as any)?.result?.data?.meta,
      (payload as any)?.result?.data?.pagination
    ) || {};

  const reviews = pickArray(
    ...(layers as unknown[])
  );

  const averageCandidate =
    numberOrUndefined((payload as any)?.averageRating) ??
    numberOrUndefined((payload as any)?.avgRating) ??
    numberOrUndefined((payload as any)?.rating) ??
    numberOrUndefined((payload as any)?.result?.averageRating) ??
    numberOrUndefined((payload as any)?.result?.avgRating) ??
    numberOrUndefined((payload as any)?.result?.rating) ??
    numberOrUndefined((payload as any)?.data?.averageRating) ??
    numberOrUndefined((payload as any)?.data?.avgRating) ??
    numberOrUndefined((payload as any)?.data?.rating) ??
    numberOrUndefined((payload as any)?.result?.data?.averageRating) ??
    numberOrUndefined((payload as any)?.result?.data?.avgRating) ??
    numberOrUndefined((payload as any)?.result?.data?.rating);

  const distributionSource =
    pickFirstObject(
      (payload as any)?.ratingDistribution,
      (payload as any)?.distribution,
      (payload as any)?.ratingBreakdown,
      (payload as any)?.ratings,
      (payload as any)?.result?.ratingDistribution,
      (payload as any)?.result?.data?.ratingDistribution,
      (payload as any)?.result?.data?.distribution,
      (payload as any)?.data?.ratingDistribution,
      (payload as any)?.data?.distribution,
      (payload as any)?.data?.ratingBreakdown
    );

  let distribution: Record<number, number> | null = null;
  if (distributionSource) {
    distribution = {};
    Object.entries(distributionSource).forEach(([key, value]) => {
      const ratingKey = numberOrUndefined(key) ?? numberOrUndefined((value as any)?.rating);
      const countValue =
        numberOrUndefined((value as any)?.count) ??
        numberOrUndefined((value as any)?.value) ??
        numberOrUndefined(value);
      if (ratingKey !== undefined && countValue !== undefined) {
        distribution![ratingKey] = countValue;
      }
    });
    if (Object.keys(distribution).length === 0) {
      distribution = null;
    }
  }

  const metaTotal =
    numberOrUndefined((metaSource as any)?.total) ??
    numberOrUndefined((metaSource as any)?.totalItems) ??
    numberOrUndefined((metaSource as any)?.totalCount) ??
    numberOrUndefined((metaSource as any)?.count) ??
    numberOrUndefined((metaSource as any)?.items) ??
    numberOrUndefined((payload as any)?.total) ??
    numberOrUndefined((payload as any)?.count);
  const metaLimit =
    numberOrUndefined((metaSource as any)?.limit) ??
    numberOrUndefined((metaSource as any)?.perPage) ??
    numberOrUndefined((metaSource as any)?.pageSize) ??
    numberOrUndefined((metaSource as any)?.itemsPerPage);
  const metaCurrentPage =
    numberOrUndefined((metaSource as any)?.currentPage) ??
    numberOrUndefined((metaSource as any)?.page) ??
    numberOrUndefined((metaSource as any)?.pageNumber) ??
    numberOrUndefined((metaSource as any)?.pageIndex);
  const metaTotalPages =
    numberOrUndefined((metaSource as any)?.totalPages) ??
    numberOrUndefined((metaSource as any)?.pages) ??
    numberOrUndefined((metaSource as any)?.pageCount);

  let hasNextPage = (metaSource as any)?.hasNextPage as boolean | undefined;
  if (typeof hasNextPage === "undefined" && metaCurrentPage !== undefined && metaTotalPages !== undefined) {
    hasNextPage = metaCurrentPage < metaTotalPages;
  }
  if (typeof hasNextPage === "undefined" && metaLimit && metaTotal) {
    hasNextPage = metaLimit * (metaCurrentPage ?? 1) < metaTotal;
  }

  const userReviewCandidate =
    (payload as any)?.userReview ??
    (payload as any)?.review ??
    (payload as any)?.myReview ??
    (payload as any)?.data?.userReview ??
    (payload as any)?.data?.review ??
    (payload as any)?.result?.userReview ??
    (payload as any)?.result?.data?.userReview ??
    (payload as any)?.result?.data?.review ??
    null;

  const userReviewFromList = reviews.find(
    (review) =>
      review?.isMine ||
      review?.isUserReview ||
      review?.isCurrentUser ||
      review?.createdByCurrentUser ||
      (review as any)?.isUser
  );

  const userReview = (() => {
    if (userReviewCandidate && typeof userReviewCandidate === "object") {
      const match = reviews.find((review) => isSameReview(review, userReviewCandidate as ProductReview));
      return (match || (userReviewCandidate as ProductReview)) ?? null;
    }
    return userReviewFromList ?? null;
  })();

  return {
    reviews,
    meta: {
      total: metaTotal ?? reviews.length,
      totalPages: metaTotalPages ?? undefined,
      currentPage: metaCurrentPage ?? undefined,
      perPage: metaLimit ?? undefined,
      page: metaCurrentPage ?? undefined,
      limit: metaLimit ?? undefined,
      hasNextPage,
    },
    averageRating: averageCandidate ?? 0,
    ratingDistribution: distribution,
    userReview: userReview ?? null,
  };
};

export const getReviewRating = (review?: ProductReview | null): number => {
  if (!review) return 0;
  const candidates = [
    review.rating,
    review.score,
    review.stars,
    review.value,
    (review as any)?.ratings,
  ];
  for (const candidate of candidates) {
    const num = numberOrUndefined(candidate);
    if (num !== undefined) {
      return num;
    }
  }
  return 0;
};

export const getReviewHeadline = (review?: ProductReview | null): string => {
  if (!review) return "";
  const candidates = [
    review.headline,
    review.header,
    review.title,
    review.subject,
    review.summary,
    review.heading,
  ];
  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim().length) {
      return candidate.trim();
    }
  }
  return "";
};

export const getReviewBody = (review?: ProductReview | null): string => {
  if (!review) return "";
  const candidates = [
    review.body,
    review.comment,
    review.content,
    review.description,
    review.message,
    review.text,
  ];
  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim().length) {
      return candidate.trim();
    }
  }
  return "";
};

export const getReviewerName = (review?: ProductReview | null): string => {
  if (!review) return "Anonymous";
  const user =
    review.user ??
    review.author ??
    review.createdBy ??
    (review as any)?.userInfo ??
    (review as any)?.customer;
  if (user && typeof user === "object") {
    const parts = [user.firstName, user.lastName]
      .filter((part): part is string => Boolean(part && typeof part === "string" && part.trim().length))
      .map((part) => part.trim());
    if (parts.length) {
      return parts.join(" ");
    }
    const candidateNames = [user.name, user.username, user.email];
    for (const name of candidateNames) {
      if (typeof name === "string" && name.trim().length) {
        return name.trim();
      }
    }
  }
  if (typeof (review as any)?.userName === "string" && (review as any)?.userName.trim().length) {
    return ((review as any)?.userName as string).trim();
  }
  if (typeof (review as any)?.customerName === "string" && (review as any)?.customerName.trim().length) {
    return ((review as any)?.customerName as string).trim();
  }
  return "Anonymous";
};

export const getReviewTimestamp = (review?: ProductReview | null): string | undefined => {
  if (!review) return undefined;
  return review.updatedAt ?? review.createdAt ?? (review as any)?.date ?? undefined;
};
