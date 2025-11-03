"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRightIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";

import { Price } from "@/components/common/price";
import {
  FlashSaleItem,
  getFlashSaleProgress,
} from "@/hooks/use-flash-sales";
import { useCountdown } from "@/hooks/use-countdown";

const sanitize = (value?: string) =>
  value?.replace(/<[^>]+>/g, " ")?.replace(/\s+/g, " ")?.trim();

const truncate = (value: string | undefined, limit = 90) => {
  if (!value) return "";
  return value.length > limit ? `${value.slice(0, limit - 1)}…` : value;
};

interface FlashSlideProps {
  sale: FlashSaleItem;
}

export default function FlashSlide({ sale }: FlashSlideProps) {
  const product = sale.product ?? {};
  const link = product.slug ? `/${product.slug}` : "#";
  const countdown = useCountdown(sale.endDate ?? null);
  const { claimed, left, percentClaimed } = getFlashSaleProgress(sale);
  const progressWidth = Math.min(100, Math.max(0, percentClaimed));

  const originalPrice = product.price ?? sale.originalProduct?.price ?? 0;
  const flashPrice =
    sale.flashPrice ?? product.flashPrice ?? product.offerPrice ?? originalPrice;
  const discountPercent =
    originalPrice > 0
      ? Math.round(((originalPrice - flashPrice) / originalPrice) * 100)
      : 0;
  const description =
    truncate(
      sanitize(product.shortDescription) ??
        sanitize(product.detailedDescription) ??
        sanitize(sale.originalProduct?.shortDescription) ??
        sanitize(sale.originalProduct?.detailedDescription),
    ) ||
    "Limited-time offer. Grab it while it's available.";

  return (
    <Link
      href={link}
      prefetch={false}
      className="group flex h-full w-full flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <div className="relative overflow-hidden rounded-xl bg-slate-50">
        <Image
          className="h-60 w-full object-cover transition duration-300 group-hover:scale-105"
          src={product.thumbnail ?? product.images?.[0] ?? "/placeholder-image.jpg"}
          alt={product.name ?? "Flash sale product"}
          width={640}
          height={480}
        />
        <div className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full border border-white/30 bg-slate-900/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
          <ShoppingBagIcon className="h-4 w-4" aria-hidden />
          Flash Deal
        </div>
        <div className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 backdrop-blur">
          <span>{countdown.label}</span>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="line-clamp-2 text-lg font-semibold text-slate-900">
          {product.name ?? "Flash sale product"}
        </h3>
        {description && (
          <p className="line-clamp-2 text-sm text-slate-500">{description}</p>
        )}

        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Flash price
            </p>
            <p className="text-2xl font-bold text-slate-900">
              <Price amount={flashPrice} />
            </p>
          </div>
          {originalPrice > flashPrice && (
            <div className="text-right text-sm text-slate-500">
              <span className="block line-through">
                <Price amount={originalPrice} />
              </span>
              {discountPercent > 0 && (
                <span className="text-xs font-semibold text-emerald-600">
                  Save {discountPercent}%
                </span>
              )}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-slate-200/60 bg-slate-50 p-4">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-500">
            <span>Claimed {claimed}</span>
            <span className="text-slate-700">
              {left > 0 ? `${left} left` : "Almost gone"}
            </span>
          </div>
          <div className="mt-3 h-2 w-full rounded-full bg-white/80">
            <div
              className="h-full rounded-full bg-slate-900 transition-all"
              style={{ width: `${progressWidth}%` }}
            />
          </div>
        </div>
      </div>

      <span className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
        Shop this deal
        <ArrowRightIcon className="h-4 w-4 text-slate-500 transition group-hover:translate-x-1" aria-hidden />
      </span>
    </Link>
  );
}
