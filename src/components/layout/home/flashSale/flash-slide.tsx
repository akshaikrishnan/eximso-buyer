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

const truncate = (value: string | undefined, limit = 120) => {
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
  const { claimed, total, left, percentClaimed } = getFlashSaleProgress(sale);
  const progressWidth = Math.min(100, Math.max(0, percentClaimed));

  const originalPrice = product.price ?? sale.originalProduct?.price ?? 0;
  const flashPrice =
    sale.flashPrice ?? product.flashPrice ?? product.offerPrice ?? originalPrice;
  const youSave = originalPrice > 0 ? originalPrice - flashPrice : 0;
  const discountPercent =
    originalPrice > 0 ? Math.round((youSave / originalPrice) * 100) : 0;
  const description =
    truncate(
      sanitize(product.shortDescription) ??
        sanitize(product.detailedDescription) ??
        sanitize(sale.originalProduct?.shortDescription) ??
        sanitize(sale.originalProduct?.detailedDescription),
    ) ||
    "Limited-time offer. Claim yours before the timer hits zero.";

  return (
    <Link
      href={link}
      prefetch={false}
      className="group flex h-full w-full flex-col gap-5 rounded-3xl border border-rose-100 bg-gradient-to-br from-white via-rose-50 to-orange-50 p-5 shadow transition hover:border-rose-200 hover:shadow-lg"
    >
      <div className="relative overflow-hidden rounded-2xl bg-white">
        <Image
          className="h-60 w-full object-cover transition duration-300 group-hover:scale-105"
          src={product.thumbnail ?? product.images?.[0] ?? "/placeholder-image.jpg"}
          alt={product.name ?? "Flash sale product"}
          width={640}
          height={480}
        />
        <div className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full bg-rose-600/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
          <ShoppingBagIcon className="h-4 w-4" aria-hidden />
          Limited Deal
        </div>
        <div className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-rose-600 backdrop-blur">
          <span>{countdown.label}</span>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-slate-900 line-clamp-2">
          {product.name ?? "Flash sale product"}
        </h3>
        <p className="text-sm leading-relaxed text-slate-600">{description}</p>

        <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-rose-500">
              Flash price
            </p>
            <p className="text-2xl font-bold text-rose-600">
              <Price amount={flashPrice} />
            </p>
          </div>
          {originalPrice > flashPrice && (
            <div className="flex flex-col text-sm text-slate-500">
              <span className="line-through">
                <Price amount={originalPrice} />
              </span>
              {discountPercent > 0 && (
                <span className="inline-flex items-center gap-1 text-emerald-600">
                  Save <Price amount={youSave} /> ({discountPercent}% off)
                </span>
              )}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-rose-100 bg-white/70 p-4 shadow-inner">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <span>
              Claimed {claimed}
              {total > 0 ? ` / ${total}` : ""}
            </span>
            <span className="text-rose-600">
              {left > 0 ? `${left} left` : "Almost gone"}
            </span>
          </div>
          <div className="mt-3 h-2.5 w-full rounded-full bg-rose-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-rose-500 to-orange-400 transition-all"
              style={{ width: `${progressWidth}%` }}
            />
          </div>
          {sale.maxUnitsPerUser && sale.maxUnitsPerUser > 0 && (
            <p className="mt-3 text-xs text-slate-500">
              Max {sale.maxUnitsPerUser} per customer. Stock updates live as shoppers claim the deal.
            </p>
          )}
        </div>
      </div>

      <span className="mt-auto inline-flex items-center justify-center gap-2 rounded-full bg-rose-600 px-5 py-2 text-sm font-semibold text-white shadow transition group-hover:bg-rose-500">
        Shop this deal
        <ArrowRightIcon className="h-4 w-4" aria-hidden />
      </span>
    </Link>
  );
}
