"use client";

import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

function classNames(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Custom Magnifier component for product image zoom on hover
 */
const Magnifier = ({
  src,
  alt,
  width,
  height,
  isZoomEnabled,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  isZoomEnabled: boolean;
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    const { left, top, width: rectWidth, height: rectHeight } =
      e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    const xPercentage = (x / rectWidth) * 100;
    const yPercentage = (y / rectHeight) * 100;

    setPosition({ x: xPercentage, y: yPercentage });
  };

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  const backgroundSize = `${width * 2.5}px ${height * 2.5}px`;

  return (
    <div
      className="group relative h-full w-full overflow-hidden rounded-3xl bg-white"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ aspectRatio: "1 / 1" }}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="h-full w-full object-contain"
        priority
      />
      {isHovering &&
        isZoomEnabled && (
          <div
            className="pointer-events-none absolute inset-0 hidden border-4 border-indigo-500/60 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100 lg:block"
            style={{
              backgroundImage: `url(${src})`,
              backgroundPosition: `${position.x}% ${position.y}%`,
              backgroundSize,
              backgroundRepeat: "no-repeat",
            }}
          />
        )}
    </div>
  );
};

interface ThumbButtonProps {
  selected: boolean;
  onClick: () => void;
  image: string;
  alt: string;
}

const ThumbButton = ({ selected, onClick, image, alt }: ThumbButtonProps) => (
  <button
    className={classNames(
      selected ? "ring-indigo-500" : "ring-transparent hover:ring-indigo-200",
      "relative flex h-24 w-full cursor-pointer items-center justify-center overflow-hidden rounded-2xl bg-white text-sm font-medium text-slate-900 ring-2 ring-offset-2 transition"
    )}
    onClick={onClick}
    type="button"
    aria-pressed={selected}
  >
    <span className="absolute inset-0 flex items-center justify-center overflow-hidden p-1">
      <Image
        src={image}
        width={160}
        height={160}
        alt={alt}
        className="max-h-full max-w-full object-contain"
      />
    </span>
  </button>
);

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mainEmblaRef, mainEmblaApi] = useEmblaCarousel({ loop: false });
  const enableThumbCarousel = images.length > 4;
  const [thumbEmblaRef, thumbEmblaApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
    slidesToScroll: 1,
    align: "start",
  });

  const scrollPrev = useCallback(() => {
    if (mainEmblaApi) mainEmblaApi.scrollPrev();
  }, [mainEmblaApi]);

  const scrollNext = useCallback(() => {
    if (mainEmblaApi) mainEmblaApi.scrollNext();
  }, [mainEmblaApi]);

  const onThumbClick = useCallback(
    (index: number) => {
      if (!mainEmblaApi) return;
      mainEmblaApi.scrollTo(index);
    },
    [mainEmblaApi]
  );

  const onSelect = useCallback(() => {
    if (!mainEmblaApi) return;
    const newIndex = mainEmblaApi.selectedScrollSnap();
    setSelectedIndex(newIndex);
    if (enableThumbCarousel && thumbEmblaApi) {
      thumbEmblaApi.scrollTo(newIndex);
    }
  }, [enableThumbCarousel, mainEmblaApi, thumbEmblaApi]);

  useEffect(() => {
    if (!mainEmblaApi) return;
    onSelect();
    mainEmblaApi.on("select", onSelect);
    mainEmblaApi.on("reInit", onSelect);
    return () => {
      mainEmblaApi.off("select", onSelect);
      mainEmblaApi.off("reInit", onSelect);
    };
  }, [mainEmblaApi, onSelect]);

  if (images.length === 0) return null;

  const isZoomEnabled = images.length > 0;

  return (
    <div className="grid grid-cols-1 gap-4 lg:sticky lg:top-24 lg:grid-cols-[minmax(0,128px)_minmax(0,1fr)] lg:items-start">
      <div className="order-2 w-full lg:order-1 lg:max-w-[140px]">
        {enableThumbCarousel ? (
          <div
            className="embla rounded-3xl border border-slate-200 bg-slate-50/90 px-3 py-3 shadow-sm lg:max-h-[520px] lg:overflow-y-auto"
            ref={thumbEmblaRef}
          >
            <div className="embla__container flex gap-3 lg:flex-col lg:gap-4">
              {images.map((image, index) => (
                <div key={image} className="embla__slide shrink-0 min-w-[25%] lg:min-w-full">
                  <ThumbButton
                    selected={index === selectedIndex}
                    onClick={() => onThumbClick(index)}
                    image={image}
                    alt={`${productName} thumbnail ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-3 lg:grid-cols-1 lg:gap-4">
            {images.map((image, index) => (
              <ThumbButton
                key={image}
                selected={index === selectedIndex}
                onClick={() => onThumbClick(index)}
                image={image}
                alt={`${productName} thumbnail ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="order-1 w-full overflow-hidden rounded-3xl border border-slate-200 bg-white/95 shadow-sm lg:order-2 relative">
        <div className="embla" ref={mainEmblaRef}>
          <div className="embla__container flex">
            {images.map((image, idx) => (
              <div
                key={image}
                className="embla__slide flex w-full items-center justify-center"
                style={{ minWidth: "100%" }}
              >
                <Magnifier
                  src={image}
                  alt={`${productName} image ${idx + 1}`}
                  width={800}
                  height={800}
                  isZoomEnabled={isZoomEnabled}
                />
              </div>
            ))}
          </div>
        </div>

        {images.length > 1 && (
          <>
            <button
              className="absolute left-6 top-1/2 hidden -translate-y-1/2 transform rounded-full bg-white/90 p-2 text-slate-700 shadow-md transition hover:bg-indigo-50 focus:outline-hidden lg:block"
              onClick={scrollPrev}
              type="button"
              aria-label="Previous image"
            >
              <ChevronLeftIcon className="h-6 w-6" />
            </button>
            <button
              className="absolute right-6 top-1/2 hidden -translate-y-1/2 transform rounded-full bg-white/90 p-2 text-slate-700 shadow-md transition hover:bg-indigo-50 focus:outline-hidden lg:block"
              onClick={scrollNext}
              type="button"
              aria-label="Next image"
            >
              <ChevronRightIcon className="h-6 w-6" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export const ProductGalleryPlaceholder = () => (
  <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,128px)_minmax(0,1fr)] lg:items-start">
    <div className="hidden lg:block lg:max-w-[140px] space-y-3">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="h-24 w-full rounded-2xl bg-slate-200/70 animate-pulse" />
      ))}
    </div>

    <div className="rounded-3xl border border-slate-200 bg-slate-200/80 pb-[75%] animate-pulse" />

    <div className="mt-4 flex items-center justify-center gap-3 lg:hidden">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="h-20 w-20 rounded-2xl bg-slate-200/80 animate-pulse" />
      ))}
    </div>
  </div>
);
