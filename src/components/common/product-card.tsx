"use client";

import {
  BuildingStorefrontIcon,
  CubeIcon,
  GlobeAsiaAustraliaIcon,
  ScaleIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { StarIcon, TagIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import React, { useMemo } from "react";
import mergeClasses from "@/lib/utils/classNames";
import { Price } from "./price";
import {
  getFlashSaleProgress,
  isFlashSaleActive,
  useFlashSaleForProduct,
} from "@/hooks/use-flash-sales";
import { useCountdown } from "@/hooks/use-countdown";

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
  value
    ?.replace(/<[^>]+>/g, " ")
    ?.replace(/\s+/g, " ")
    ?.trim();

const resolveLabelTheme = (label?: string) => {
  const baseTheme = {
    backgroundClass: "bg-slate-900/90",
    textClass: "text-white",
  } as const;

  if (!label) return baseTheme;

  const normalized = label.toLowerCase();

  if (normalized.includes("new")) {
    return {
      backgroundClass: "bg-emerald-600/95",
      textClass: "text-white",
    } as const;
  }

  if (
    normalized.includes("offer") ||
    normalized.includes("deal") ||
    normalized.includes("discount")
  ) {
    return {
      backgroundClass: "bg-amber-500/95",
      textClass: "text-white",
    } as const;
  }

  if (normalized.includes("limited") || normalized.includes("exclusive")) {
    return {
      backgroundClass: "bg-purple-600/95",
      textClass: "text-white",
    } as const;
  }

  return baseTheme;
};

type ProductCardProps = {
  product: any;
  layoutVariant?: ProductCardVariant;
  isMobileViewport?: boolean;
  activeColumns?: number;
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
  activeColumns,
}: ProductCardProps) {
  const isOutOfStock =
    product?.stock < product?.minimumOrderQuantity ||
    !product?.isActive ||
    product?.stock <= 0;

  const { sale: flashSale } = useFlashSaleForProduct(
    product?._id,
    product?.flashSaleId ?? null
  );

  const flashSaleVisible = Boolean(
    flashSale &&
    !product?.flashSaleHidden &&
    !flashSale.product?.flashSaleHidden
  );

  const flashSaleCountdown = useCountdown(
    flashSaleVisible ? flashSale?.endDate ?? null : null
  );

  const flashSaleActive =
    flashSaleVisible &&
    !flashSaleCountdown.expired &&
    isFlashSaleActive(flashSale);

  const flashSaleProgress = useMemo(
    () => getFlashSaleProgress(flashSaleActive ? flashSale : undefined),
    [flashSale, flashSaleActive]
  );

  const flashSaleProgressWidth = useMemo(
    () => Math.min(100, Math.max(0, flashSaleProgress.percentClaimed)),
    [flashSaleProgress.percentClaimed]
  );

  const labelText = flashSaleActive
    ? "Flash Sale"
    : getLabel(product) ?? undefined;
  const labelTheme = flashSaleActive
    ? {
      backgroundClass: "bg-gradient-to-r from-rose-600 to-orange-500",
      textClass: "text-white",
    }
    : resolveLabelTheme(labelText);

  const brandName =
    sanitizeText(product?.brand) ||
    sanitizeText(product?.manufacturer) ||
    sanitizeText(product?.seller?.name);
  const shortDescription = sanitizeText(product?.shortDescription);

  const basePrice = Number(product?.price ?? 0);
  const defaultOfferPrice =
    product?.offerPrice && product.offerPrice > 0
      ? product.offerPrice
      : basePrice;
  const flashPrice = flashSaleActive
    ? flashSale?.flashPrice ??
    flashSale?.product?.flashPrice ??
    product?.flashPrice ??
    defaultOfferPrice
    : undefined;

  const flashPriceValue =
    typeof flashPrice === "number"
      ? flashPrice
      : Number.isFinite(Number(flashPrice))
        ? Number(flashPrice)
        : undefined;

  const hasDiscount = flashSaleActive
    ? typeof flashPriceValue === "number" &&
    basePrice > 0 &&
    flashPriceValue < basePrice
    : Boolean(product?.offerPrice) && product.offerPrice < product.price;

  const effectivePrice =
    flashPriceValue ?? (hasDiscount ? defaultOfferPrice : basePrice);
  const strikePrice = flashSaleActive
    ? basePrice
    : hasDiscount
      ? product.price
      : undefined;

  const discountPercentage = useMemo(() => {
    if (flashSaleActive && flashPriceValue && basePrice > 0) {
      const discount = basePrice - flashPriceValue;
      return Math.max(0, Math.round((discount / basePrice) * 100));
    }

    if (typeof product?.discountPercentage === "number") {
      return product.discountPercentage;
    }

    if (hasDiscount && product?.price) {
      const discount =
        ((product.price - defaultOfferPrice) / product.price) * 100;
      return Math.round(discount);
    }

    return 0;
  }, [
    basePrice,
    defaultOfferPrice,
    flashPriceValue,
    flashSaleActive,
    hasDiscount,
    product?.discountPercentage,
    product?.price,
  ]);

  const ratingValue = Number(
    product?.ratingSummary?.averageRating ?? product?.averageRating ?? 0
  );
  const reviewsCount = product?.reviewsCount ?? product?.totalReviews;
  const dimensionText = formatDimensionText(product?.dimensions);
  const weightText =
    typeof product?.dimensions?.weight === "number"
      ? `${product.dimensions.weight.toFixed(2)} kg`
      : undefined;

  const tags: string[] = Array.isArray(product?.tags)
    ? product.tags.filter(Boolean).slice(0, 4)
    : [];

  const isListLayout = layoutVariant === "list";
  const showIconsOnly = activeColumns !== undefined && activeColumns >= 6;
  const isSixColumns = activeColumns === 6;

  return (
    <article
      key={product._id}
      className={mergeClasses(
        "relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300",
        isOutOfStock ? "opacity-60" : "hover:-translate-y-1 hover:shadow-xl",
        isListLayout ? "flex w-full gap-4 p-4" : "flex h-full flex-col"
      )}
    >
      {isOutOfStock && (
        <div className="absolute top-3 left-3 z-20 rounded-full bg-red-500/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-lg">
          Out of Stock
        </div>
      )}
      {labelText && !isOutOfStock && (
        <div
          className={mergeClasses(
            "absolute top-3 left-3 z-20 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide shadow",
            labelTheme.backgroundClass,
            labelTheme.textClass
          )}
        >
          {labelText}
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
          src={
            product.thumbnail ?? product.images?.[0] ?? "/placeholder-image.jpg"
          }
          alt={product.name ?? "Product image"}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={mergeClasses(
            "object-contain",
            isListLayout ? "p-2 sm:p-3" : isSixColumns ? "p-3" : "p-4"
          )}
          priority={false}
        />
      </div>

      <div
        className={mergeClasses(
          "flex min-w-0 flex-1 flex-col",
          isListLayout ? "gap-4" : isSixColumns ? "px-3 pb-3 pt-2 gap-2" : "px-5 pb-5 pt-4 gap-4"
        )}
      >
        <header className="flex min-w-0 flex-col gap-2">
          <div className="flex min-w-0 items-start justify-between gap-2">
            <div className="min-w-0 space-y-1 flex-1">
              {brandName && (
                <p className={mergeClasses(
                  "font-semibold uppercase tracking-wide text-primary",
                  isSixColumns ? "text-[10px] leading-tight" : "text-xs"
                )}>
                  {brandName}
                </p>
              )}
              <h3 className={mergeClasses(
                "font-semibold leading-tight text-slate-900 break-words",
                isSixColumns ? "text-sm line-clamp-2" : "text-base line-clamp-1"
              )}>
                {product.name}
              </h3>
            </div>
            {discountPercentage > 0 && (
              <span
                className={mergeClasses(
                  "shrink-0 rounded-full px-2 py-1 font-semibold whitespace-nowrap",
                  isSixColumns ? "text-[10px] px-1.5 py-0.5" : "text-xs px-2.5 py-1",
                  flashSaleActive
                    ? "bg-rose-100 text-rose-600"
                    : "bg-emerald-50 text-emerald-600"
                )}
              >
                {flashSaleActive ? "Flash" : "Save"} {discountPercentage}%
              </span>
            )}
          </div>

          <div className="flex min-w-0 flex-wrap items-center gap-2 text-slate-600">
            {ratingValue > 0 ? (
              <span className={mergeClasses(
                "flex items-center gap-1 rounded-full bg-amber-50 font-medium text-amber-600",
                isSixColumns ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-1 text-xs"
              )}>
                <StarIcon className={mergeClasses("shrink-0", isSixColumns ? "h-3 w-3" : "h-4 w-4")} />
                {ratingValue.toFixed(1)}
                {reviewsCount ? (
                  <span className="text-[9px] text-slate-500">
                    ({reviewsCount})
                  </span>
                ) : null}
              </span>
            ) : (
              <span className={mergeClasses("text-slate-500", isSixColumns ? "text-[10px]" : "text-xs")}>
                No ratings
              </span>
            )}
            {product?.countryOfOrigin && (
              <span className={mergeClasses(
                "flex min-w-0 items-center gap-1 text-slate-500",
                isSixColumns ? "text-[10px]" : "text-xs"
              )}>
                <GlobeAsiaAustraliaIcon className={mergeClasses("shrink-0", isSixColumns ? "h-3 w-3" : "h-4 w-4")} />
                <span className="truncate">{product.countryOfOrigin}</span>
              </span>
            )}
          </div>
        </header>

        {shortDescription && !isSixColumns && (
          <div className="flex flex-col justify-center h-10 overflow-hidden"> 
            <p className="text-sm leading-5 text-slate-600 text-center line-clamp-2">
              {shortDescription}
            </p>
          </div>
        )}

        <dl
          className={mergeClasses(
            "grid min-w-0 gap-2 text-slate-600",
            isListLayout ? "grid-cols-2" : showIconsOnly ? "grid-cols-4" : isSixColumns ? "grid-cols-2" : "sm:grid-cols-2"
          )}
        >
          {!flashSaleActive && product?.minimumOrderQuantity ? (
            <div 
              className={mergeClasses(
                "flex min-w-0 items-center rounded-lg border border-slate-100 bg-slate-50",
                showIconsOnly ? "justify-center p-1.5" : "gap-1.5 px-2 py-1.5",
                isSixColumns ? "text-[10px]" : "text-xs"
              )}
              title={showIconsOnly ? `MOQ: ${product.minimumOrderQuantity}${product?.uom ? ` ${product.uom}` : " units"}` : undefined}
            >
              <BuildingStorefrontIcon className={mergeClasses("shrink-0 text-slate-400", isSixColumns ? "h-3 w-3" : "h-4 w-4")} />
              {!showIconsOnly && (
                <div className="min-w-0">
                  <dt className="truncate font-medium text-slate-700">MOQ</dt>
                  <dd className="truncate text-slate-500">
                    {product.minimumOrderQuantity}
                    {product?.uom ? ` ${product.uom}` : " units"}
                  </dd>
                </div>
              )}
            </div>
          ) : null}
          {!flashSaleActive &&
            typeof product?.stock === "number" &&
            product.stock >= 0 ? (
            <div 
              className={mergeClasses(
                "flex min-w-0 items-center rounded-lg border border-slate-100 bg-slate-50",
                showIconsOnly ? "justify-center p-1.5" : "gap-1.5 px-2 py-1.5",
                isSixColumns ? "text-[10px]" : "text-xs"
              )}
              title={showIconsOnly ? `Available: ${product.stock} in stock` : undefined}
            >
              <TagIcon className={mergeClasses("shrink-0 text-slate-400", isSixColumns ? "h-3 w-3" : "h-4 w-4")} />
              {!showIconsOnly && (
                <div className="min-w-0">
                  <dt className="truncate font-medium text-slate-700">Available</dt>
                  <dd className="truncate text-slate-500">{product.stock} in stock</dd>
                </div>
              )}
            </div>
          ) : null}
          {!flashSaleActive && dimensionText && (
            <div 
              className={mergeClasses(
                "flex min-w-0 items-center rounded-lg border border-slate-100 bg-slate-50",
                showIconsOnly ? "justify-center p-1.5" : "gap-1.5 px-2 py-1.5",
                isSixColumns ? "text-[10px]" : "text-xs"
              )}
              title={showIconsOnly ? `Dimensions: ${dimensionText}` : undefined}
              aria-label={showIconsOnly ? `Dimensions: ${dimensionText}` : undefined}
            >
              <CubeIcon className={mergeClasses("shrink-0 text-slate-400", isSixColumns ? "h-3 w-3" : "h-4 w-4")} />
              {!showIconsOnly && (
                <div className="min-w-0">
                  <dt className="truncate font-medium text-slate-700">Dimensions</dt>
                  <dd className="truncate text-slate-500">{dimensionText}</dd>
                </div>
              )}
            </div>
          )}
          {!flashSaleActive && weightText && (
            <div 
              className={mergeClasses(
                "flex min-w-0 items-center rounded-lg border border-slate-100 bg-slate-50",
                showIconsOnly ? "justify-center p-1.5" : "gap-1.5 px-2 py-1.5",
                isSixColumns ? "text-[10px]" : "text-xs"
              )}
              title={showIconsOnly ? `Weight: ${weightText}` : undefined}
              aria-label={showIconsOnly ? `Weight: ${weightText}` : undefined}
            >
              <ScaleIcon className={mergeClasses("shrink-0 text-slate-400", isSixColumns ? "h-3 w-3" : "h-4 w-4")} />
              {!showIconsOnly && (
                <div className="min-w-0">
                  <dt className="truncate font-medium text-slate-700">Weight</dt>
                  <dd className="truncate text-slate-500">{weightText}</dd>
                </div>
              )}
            </div>
          )}
        </dl>

        {tags.length > 0 && !isSixColumns && (
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

        {flashSaleActive && (
          <div className={mergeClasses(
            "rounded-2xl border border-rose-200 bg-rose-50/70 p-2 text-slate-600 shadow-inner",
            isSixColumns ? "text-[9px]" : "p-3 text-xs"
          )}>
            <div className="flex min-w-0 items-center justify-between gap-1 text-rose-600">
              <span className="inline-flex min-w-0 items-center gap-1 font-semibold uppercase tracking-wide">
                <SparklesIcon className={mergeClasses("shrink-0", isSixColumns ? "h-3 w-3" : "h-4 w-4")} aria-hidden />
                Flash sale
              </span>
              <span className="font-semibold">{flashSaleCountdown.label}</span>
            </div>
            <div className="mt-1.5 h-1 w-full rounded-full bg-rose-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-rose-500 to-orange-400"
                style={{ width: `${flashSaleProgressWidth}%` }}
              />
            </div>
            <div className="mt-1.5 flex items-center justify-between font-medium">
              <span>
                Claimed {flashSaleProgress.claimed}
                {flashSaleProgress.total > 0
                  ? ` / ${flashSaleProgress.total}`
                  : ""}
              </span>
              <span className="text-rose-600">
                {flashSaleProgress.left > 0
                  ? `${flashSaleProgress.left} left`
                  : "Almost gone"}
              </span>
            </div>
          </div>
        )}

        <footer className="mt-auto flex min-w-0 items-end justify-between gap-2">
          <div className="min-w-0 space-y-0.5">
            <p className={mergeClasses("font-semibold text-slate-900", isSixColumns ? "text-base" : "text-lg")}>
              <Price amount={effectivePrice} />
            </p>
            {typeof strikePrice === "number" && strikePrice > 0 && (
              <p className={mergeClasses("text-slate-400 line-through", isSixColumns ? "text-[10px]" : "text-xs")}>
                <Price amount={strikePrice} />
              </p>
            )}
            {hasDiscount && discountPercentage > 0 && (
              <p
                className={mergeClasses(
                  "font-medium",
                  isSixColumns ? "text-[9px]" : "text-xs",
                  flashSaleActive ? "text-rose-600" : "text-emerald-600"
                )}
              >
                {flashSaleActive ? "Flash savings" : "You save"}{" "}
                {discountPercentage}%
              </p>
            )}
          </div>
        </footer>
      </div>
    </article>
  );
}