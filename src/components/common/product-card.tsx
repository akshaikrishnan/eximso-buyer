import { BuildingStorefrontIcon, CubeIcon, GlobeAsiaAustraliaIcon } from "@heroicons/react/24/outline";
import { StarIcon, TagIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import React, { useMemo } from "react";
import mergeClasses from "@/lib/utils/classNames";
import { Price } from "./price";

type ProductCardVariant = "grid" | "list";

const getLabel = (product: any) => {
  // Check for out of stock first
  const isOutOfStock =
    product?.stock < product?.minimumOrderQuantity ||
    !product?.isActive ||
    product?.stock <= 0;
  if (isOutOfStock) {
    return "Out of Stock";
  }

  if (product.label) return product.label;
  const inputDate = new Date(product.createdAt);

  // Get today's date
  const today = new Date();

  // Calculate the difference in milliseconds
  const timeDiff = today.getTime() - inputDate.getTime();

  // Convert milliseconds to days
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

  // If the difference is within a week (7 days), return "new"
  if (daysDiff <= 7) {
    return "New Launch";
  }

  const priceDifference = product.price - product.offerPrice;

  // Calculate 40% of the original price
  const fortyPercent = product.price * 0.4;

  // If the difference is greater than 40%, return "Offer"
  if (priceDifference > fortyPercent) {
    return "Offer";
  } else {
    return null;
  }
};

const sanitizeText = (value?: string) =>
  value?.replace(/<[^>]+>/g, " ")?.replace(/\s+/g, " ")?.trim();

type ProductCardProps = {
  product: any;
  layoutVariant?: ProductCardVariant;
  isMobileViewport?: boolean;
};

const formatDimensionText = (dimensions?: any) => {
  if (!dimensions) return null;

  const { length, width, height } = dimensions;
  if (
    typeof length !== "number" ||
    typeof width !== "number" ||
    typeof height !== "number"
  ) {
    return null;
  }

  return `${length} × ${width} × ${height}`;
};

export default function ProductCard({
  product,
  layoutVariant = "grid",
  isMobileViewport = false,
}: ProductCardProps) {
  const isOutOfStock =
    product?.stock < product?.minimumOrderQuantity ||
    !product?.isActive ||
    product?.stock <= 0;

  const brandName =
    sanitizeText(product?.brand) ||
    sanitizeText(product?.manufacturer) ||
    sanitizeText(product?.seller?.name);
  const shortDescription = sanitizeText(product?.shortDescription);
  const hasDiscount =
    Boolean(product?.offerPrice) && product.offerPrice < product.price;
  const effectivePrice = hasDiscount ? product.offerPrice : product.price;
  const discountPercentage = useMemo(() => {
    if (typeof product?.discountPercentage === "number") {
      return product.discountPercentage;
    }

    if (hasDiscount && product?.price) {
      const discount = ((product.price - product.offerPrice) / product.price) * 100;
      return Math.round(discount);
    }

    return 0;
  }, [hasDiscount, product?.discountPercentage, product?.offerPrice, product?.price]);

  const ratingValue = Number(product?.rating ?? product?.averageRating ?? 0);
  const reviewsCount = product?.reviewsCount ?? product?.totalReviews;
  const dimensionText = formatDimensionText(product?.dimensions);
  const weightText =
    typeof product?.dimensions?.weight === "number"
      ? `${product.dimensions.weight} kg`
      : undefined;

  const tags: string[] = Array.isArray(product?.tags)
    ? product.tags.filter(Boolean).slice(0, 4)
    : [];

  const isListLayout = layoutVariant === "list";

  return (
    <article
      key={product._id}
      className={mergeClasses(
        "relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300",
        isOutOfStock
          ? "opacity-60"
          : "hover:-translate-y-1 hover:shadow-xl",
        isListLayout
          ? "flex w-full gap-4 p-4"
          : "flex h-full flex-col"
      )}
    >
      {isOutOfStock && (
        <div className="absolute top-3 left-3 z-20 rounded-full bg-red-500/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-lg">
          Out of Stock
        </div>
      )}
      {getLabel(product) && !isOutOfStock && (
        <div className="absolute top-3 left-3 z-20 rounded-full bg-primary/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow">
          {getLabel(product)}
        </div>
      )}
      <Link
        href={"/" + product.slug}
        className="absolute inset-0 z-10"
        prefetch={false}
      >
        <span className="sr-only">View {product.name}</span>
      </Link>

      {isOutOfStock && (
        <div className="pointer-events-none absolute inset-0 z-10 bg-white/60 backdrop-blur-[1px]"></div>
      )}

      <div
        className={mergeClasses(
          "relative bg-slate-50",
          isListLayout
            ? "aspect-square w-28 shrink-0 overflow-hidden rounded-xl sm:w-32"
            : "aspect-[4/3] w-full overflow-hidden rounded-b-none border-b border-slate-100"
        )}
      >
        <Image
          src={product.thumbnail}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={mergeClasses(
            "object-contain",
            isListLayout ? "p-2 sm:p-3" : "p-4"
          )}
          priority={false}
        />
      </div>

      <div
        className={mergeClasses(
          "flex flex-1 flex-col gap-4",
          isListLayout ? "" : "px-5 pb-5 pt-4"
        )}
      >
        <header className="flex flex-col gap-2">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              {brandName && (
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                  {brandName}
                </p>
              )}
              <h3 className="text-base font-semibold leading-tight text-slate-900 line-clamp-2">
                {product.name}
              </h3>
            </div>
            {discountPercentage > 0 && (
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
                Save {discountPercentage}%
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
            {ratingValue > 0 ? (
              <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-600">
                <StarIcon className="h-4 w-4" />
                {ratingValue.toFixed(1)}
                {reviewsCount ? (
                  <span className="text-[11px] text-slate-500">({reviewsCount})</span>
                ) : null}
              </span>
            ) : (
              <span className="text-xs text-slate-500">No ratings yet</span>
            )}
            {product?.countryOfOrigin && (
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <GlobeAsiaAustraliaIcon className="h-4 w-4" />
                {product.countryOfOrigin}
              </span>
            )}
          </div>
        </header>

        {shortDescription && (
          <p
            className={mergeClasses(
              "text-sm text-slate-600",
              isListLayout || isMobileViewport ? "line-clamp-3" : "line-clamp-2"
            )}
          >
            {shortDescription}
          </p>
        )}

        <dl
          className={mergeClasses(
            "grid gap-3 text-xs text-slate-600",
            isListLayout ? "grid-cols-2" : "sm:grid-cols-2"
          )}
        >
          {product?.minimumOrderQuantity ? (
            <div className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
              <BuildingStorefrontIcon className="h-4 w-4 text-slate-400" />
              <div>
                <dt className="font-medium text-slate-700">MOQ</dt>
                <dd className="text-slate-500">
                  {product.minimumOrderQuantity}
                  {product?.uom ? ` ${product.uom}` : " units"}
                </dd>
              </div>
            </div>
          ) : null}
          {typeof product?.stock === "number" && product.stock >= 0 ? (
            <div className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
              <TagIcon className="h-4 w-4 text-slate-400" />
              <div>
                <dt className="font-medium text-slate-700">Available</dt>
                <dd className="text-slate-500">{product.stock} in stock</dd>
              </div>
            </div>
          ) : null}
          {dimensionText && (
            <div className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
              <CubeIcon className="h-4 w-4 text-slate-400" />
              <div>
                <dt className="font-medium text-slate-700">Dimensions</dt>
                <dd className="text-slate-500">{dimensionText}</dd>
              </div>
            </div>
          )}
          {weightText && (
            <div className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
              <CubeIcon className="h-4 w-4 text-slate-400" />
              <div>
                <dt className="font-medium text-slate-700">Weight</dt>
                <dd className="text-slate-500">{weightText}</dd>
              </div>
            </div>
          )}
        </dl>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <footer className="mt-auto flex items-end justify-between gap-3">
          <div className="space-y-1">
            <p className="text-lg font-semibold text-slate-900">
              <Price amount={effectivePrice} />
            </p>
            {hasDiscount && (
              <p className="text-xs text-slate-400 line-through">
                <Price amount={product.price} />
              </p>
            )}
            {hasDiscount && discountPercentage > 0 && (
              <p className="text-xs font-medium text-emerald-600">
                You save {discountPercentage}%
              </p>
            )}
          </div>

          {product?.minimumOrderQuantity ? (
            <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              MOQ: {product.minimumOrderQuantity}
              {product?.uom ? ` ${product.uom}` : " units"}
            </div>
          ) : null}
        </footer>
      </div>
    </article>
  );
}
