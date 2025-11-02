"use client";

import { useCallback, useMemo, useRef } from "react";
import {
  ArrowPathIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";

import mergeClasses from "@/lib/utils/classNames";
import {
  isFlashSaleActive,
  useFlashSales,
} from "@/hooks/use-flash-sales";
import { useCountdown } from "@/hooks/use-countdown";

import FlashSlide from "./flash-slide";

const containerClasses = "col-span-full w-full lg:col-span-2 2xl:col-span-2";

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

  const activeSales = useMemo(
    () =>
      (flashSales ?? []).filter((sale) => isFlashSaleActive(sale)),
    [flashSales],
  );

  const autoplayRef = useRef(
    Autoplay({
      delay: 6000,
      stopOnInteraction: false,
      playOnInit: true,
    }),
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: "start",
      loop: activeSales.length > 1,
      containScroll: "trimSnaps",
      skipSnaps: false,
      dragFree: false,
    },
    activeSales.length > 1 ? [autoplayRef.current] : [],
  );

  const firstSale = activeSales[0];
  const countdown = useCountdown(firstSale?.endDate ?? null);

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
              isFetching ? "animate-spin" : "",
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
        <SparklesIcon
          className="mx-auto h-8 w-8 text-amber-500"
          aria-hidden
        />
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
      className={`${containerClasses} flex w-full flex-col gap-6 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur`}
    >
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-3">
          <p className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-orange-500 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow">
            <SparklesIcon className="h-4 w-4" aria-hidden />
            Flash Sale
          </p>
          <h2 className="text-2xl font-semibold text-slate-900">
            Grab these limited-time steals
          </h2>
        </div>

        <div className="flex flex-col gap-3 text-sm sm:items-end sm:text-right">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Ends in
          </span>
          <span
            className={mergeClasses(
              "inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold",
              countdown.expired
                ? "bg-slate-100 text-slate-500"
                : "bg-rose-100 text-rose-600",
            )}
          >
            {countdown.label}
          </span>
          {canNavigate && (
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous flash deal"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-rose-300 hover:text-rose-600"
              >
                <ChevronLeftIcon className="h-5 w-5" aria-hidden />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next flash deal"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-rose-300 hover:text-rose-600"
              >
                <ChevronRightIcon className="h-5 w-5" aria-hidden />
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="w-full overflow-hidden" ref={emblaRef}>
        <div className="flex w-full gap-6">
          {activeSales.map((sale) => (
            <div
              key={sale.flashSaleId}
              className="min-w-0 shrink-0 grow-0 basis-full snap-start md:basis-1/2 xl:basis-1/3"
            >
              <FlashSlide sale={sale} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
