"use client";

import { useCallback, useRef } from "react";
import {
  ArrowPathIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";

import mergeClasses from "@/lib/utils/classNames";
import { isFlashSaleActive, useFlashSales } from "@/hooks/use-flash-sales";

import FlashSlide from "./flash-slide";

const containerClasses = "col-span-full lg:col-span-2";

const FlashSaleSkeleton = () => (
  <section
    className={`${containerClasses} flex flex-col gap-6 rounded-3xl border border-slate-200 bg-white/60 p-6 shadow-sm backdrop-blur`}
  >
    <div className="flex items-center justify-between">
      <div className="h-7 w-40 animate-pulse rounded-full bg-slate-200" />
      <div className="h-6 w-32 animate-pulse rounded-full bg-slate-200" />
    </div>
    <div className="h-48 w-full animate-pulse rounded-2xl bg-slate-200" />
  </section>
);

export default function FlashSale() {
  const {
    data: flashSales,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useFlashSales();

  const activeSales = (flashSales ?? []).filter((sale) =>
    isFlashSaleActive(sale)
  );

  const autoplayRef = useRef(
    Autoplay({
      delay: 6000,
      stopOnInteraction: false,
      playOnInit: true,
    })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: "start",
      loop: activeSales.length > 1,
      containScroll: "trimSnaps",
      skipSnaps: false,
      dragFree: false,
    },
    activeSales.length > 1 ? [autoplayRef.current] : []
  );

  const handlePrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const handleNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  if (isLoading) {
    return <FlashSaleSkeleton />;
  }

  if (isError) {
    return (
      <section
        className={`${containerClasses} flex flex-col gap-4 rounded-3xl border border-rose-200 bg-rose-50/80 p-6 text-sm text-rose-700 shadow-sm`}
      >
        <div className="flex items-center gap-2 text-base font-semibold">
          <SparklesIcon className="h-5 w-5" aria-hidden />
          Unable to load flash sale picks right now.
        </div>
        <button
          onClick={() => refetch()}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-500"
          type="button"
        >
          <ArrowPathIcon
            className={mergeClasses(
              "h-4 w-4",
              isFetching ? "animate-spin" : ""
            )}
            aria-hidden
          />
          Retry
        </button>
      </section>
    );
  }

  if (activeSales.length === 0) {
    return (
      <section
        className={`${containerClasses} flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white/70 p-6 text-center shadow-sm`}
      >
        <SparklesIcon className="mx-auto h-8 w-8 text-amber-500" aria-hidden />
        <h3 className="text-lg font-semibold text-slate-900">
          No flash sale right now
        </h3>
        <p className="text-sm text-slate-600">
          Check back soon for lightning deals from your favourite sellers.
        </p>
      </section>
    );
  }

  const canNavigate = activeSales.length > 1;

  return (
    <section
      className={`${containerClasses} flex w-full max-w-none flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm`}
    >
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-15 items-center justify-center rounded-full border border-slate-200 bg-gradient-to-r from-rose-600 to-orange-500 text-white">
            <SparklesIcon className="h-5 w-5" aria-hidden />
          </span>
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 ">
              Flash Sale
            </p>
            <h2 className="text-xl font-semibold text-slate-900">
              Hand-picked limited deals
            </h2>
          </div>
        </div>

        {canNavigate && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous flash deal"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
            >
              <ChevronLeftIcon className="h-5 w-5" aria-hidden />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next flash deal"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
            >
              <ChevronRightIcon className="h-5 w-5" aria-hidden />
            </button>
          </div>
        )}
      </header>

      <div className="w-full overflow-hidden" ref={emblaRef}>
        <div className="flex w-full gap-6">
          {activeSales.map((sale) => (
            <div
              key={sale.flashSaleId}
              className="min-w-0 shrink-0 grow-0 basis-full snap-start"
            >
              <FlashSlide sale={sale} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
