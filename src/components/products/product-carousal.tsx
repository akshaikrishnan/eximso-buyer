"use client";

import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

function classNames(...classes: any[]) {
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
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    const xPercentage = (x / width) * 100;
    const yPercentage = (y / height) * 100;

    setPosition({ x: xPercentage, y: yPercentage });
  };

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  // Background size set to 2.5 times the image size for the zoom effect
  const backgroundSize = `${width * 2.5}px ${height * 2.5}px`;

  return (
    <div
      className="relative overflow-hidden cursor-zoom-in group w-full h-full"
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
        className="object-contain w-full h-full sm:rounded-lg"
        priority // Consider priority loading for the main image
      />
      {/* Magnifier Overlay for Desktop */}
      {isHovering &&
        isZoomEnabled && ( // Only show zoom if enabled
          <div
            className="hidden lg:block absolute inset-0 border-4 border-indigo-500 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
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

/**
 * Thumbnail Button Component
 */
const ThumbButton = ({
  selected,
  onClick,
  image,
  alt,
}: {
  selected: boolean;
  onClick: () => void;
  image: string;
  alt: string;
}) => (
  <button
    className={classNames(
      "group relative w-full cursor-pointer overflow-hidden rounded-xl border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
      selected
        ? "border-indigo-400 ring-2 ring-indigo-200 shadow-lg shadow-indigo-100"
        : "border-transparent hover:border-indigo-200 hover:shadow-sm"
    )}
    onClick={onClick}
    type="button"
    aria-label={alt}
  >
    <div className="relative aspect-square w-full min-w-[72px] max-w-full bg-white p-2">
      <Image
        src={image}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 110px, 25vw"
        className="object-contain drop-shadow-sm transition-transform duration-200 group-hover:scale-105"
      />
    </div>
  </button>
);

/**
 * Main Product Gallery Component using Embla Carousel
 */
export default function ProductGallery({
  images,
  productName,
}: {
  images: string[];
  productName: string;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mainEmblaRef, mainEmblaApi] = useEmblaCarousel({ loop: false });

  // Decide whether to use the vertical Embla carousel for thumbnails
  const enableThumbCarousel = images.length > 4;
  const [thumbEmblaRef, thumbEmblaApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
    slidesToScroll: 1,
    align: "start",
    // 💡 Change: Set axis to 'x' for mobile (default for Embla is 'x')
    // We conditionally apply 'axis: "y"' in CSS for large screens
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
    // Auto-scroll the thumbnail carousel
    if (enableThumbCarousel && thumbEmblaApi) {
      // 💡 Improvement: Scroll to selected index only if the main embla is available
      thumbEmblaApi.scrollTo(newIndex);
    }
  }, [mainEmblaApi, thumbEmblaApi, setSelectedIndex, enableThumbCarousel]);

  useEffect(() => {
    if (!mainEmblaApi) return;
    onSelect();
    mainEmblaApi.on("select", onSelect);
    mainEmblaApi.on("reInit", onSelect);
    // Cleanup function
    return () => {
      mainEmblaApi.off("select", onSelect);
      mainEmblaApi.off("reInit", onSelect);
    };
  }, [mainEmblaApi, onSelect]);

  if (images.length === 0) return null;

  // Magnifier is enabled if there are images
  const isZoomEnabled = images.length > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[120px_minmax(0,_1fr)] lg:sticky top-28 self-start overflow-visible lg:gap-6">
      <div className="order-2 lg:order-1 col-span-1 mx-auto mt-6 w-full max-w-2xl sm:block lg:mt-0 lg:max-w-none">
        {enableThumbCarousel ? (
          <div
            className="embla rounded-2xl border border-slate-200/70 bg-white/70 px-2 py-3 shadow-sm backdrop-blur lg:max-h-[560px] lg:overflow-y-auto"
            ref={thumbEmblaRef}
          >
            <div className="embla__container flex space-x-2 lg:flex-col lg:space-y-4 lg:space-x-0">
              {images.map((image: string, index: number) => (
                <div
                  key={index}
                  className="embla__slide min-w-[30%] shrink-0 lg:min-w-full"
                >
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
          <div className="grid grid-cols-4 gap-4 px-2 py-2 lg:grid-cols-1 lg:gap-6">
            {images.map((image: string, index: number) => (
              <ThumbButton
                key={index}
                selected={index === selectedIndex}
                onClick={() => onThumbClick(index)}
                image={image}
                alt={`${productName} thumbnail ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="order-1 col-span-1 mt-6 w-full overflow-hidden rounded-2xl border border-slate-200/70 bg-white/80 shadow-sm backdrop-blur lg:order-2 lg:mt-0">
        <div className="embla" ref={mainEmblaRef}>
          <div className="embla__container flex">
            {images.map((image: string, idx: number) => (
              <div
                key={idx}
                className="embla__slide shrink-0 flex justify-center items-center w-full"
                style={{ minWidth: "100%" }}
              >
                <Magnifier
                  src={image}
                  alt={`${productName} image ${idx + 1}`}
                  width={600}
                  height={600}
                  isZoomEnabled={isZoomEnabled}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              className="absolute top-1/2 left-3 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg z-10 transition-opacity hover:opacity-100 opacity-70"
              onClick={scrollPrev}
            >
              <ChevronLeftIcon className="w-6 h-6 text-gray-800" />
            </button>
            <button
              className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg z-10 transition-opacity hover:opacity-100 opacity-70"
              onClick={scrollNext}
            >
              <ChevronRightIcon className="w-6 h-6 text-gray-800" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// Export a placeholder for Next.js dynamic import loading state
export const ProductGalleryPlaceholder = () => (
  <div className="grid grid-cols-1 lg:grid-cols-[120px_minmax(0,_1fr)] lg:gap-6">
    <div className="hidden lg:block space-y-3">
      <div className="w-full h-24 bg-gray-200 rounded-lg animate-pulse" />
      <div className="w-full h-24 bg-gray-200 rounded-lg animate-pulse" />
      <div className="w-full h-24 bg-gray-200 rounded-lg animate-pulse" />
      <div className="w-full h-24 bg-gray-200 rounded-lg animate-pulse" />
    </div>

    <div className="col-span-1">
      <div className="h-[420px] w-full rounded-2xl border border-slate-200 bg-gray-200/70 animate-pulse lg:h-[560px]" />
    </div>

    <div className="col-span-1 mt-6 flex space-x-4 lg:hidden">
      <div className="w-1/4 h-24 bg-gray-200 rounded-lg animate-pulse" />
      <div className="w-1/4 h-24 bg-gray-200 rounded-lg animate-pulse" />
      <div className="w-1/4 h-24 bg-gray-200 rounded-lg animate-pulse" />
      <div className="w-1/4 h-24 bg-gray-200 rounded-lg animate-pulse" />
    </div>
  </div>
);
