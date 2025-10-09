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
      selected ? "ring-indigo-500" : "ring-transparent hover:ring-gray-300",
      "w-full relative flex h-24 cursor-pointer items-center justify-center rounded-lg bg-white text-sm font-medium uppercase text-gray-900 focus:outline-none ring-2 ring-offset-2 transition-shadow duration-200"
    )}
    onClick={onClick}
    type="button"
  >
    <span className="absolute inset-0 overflow-hidden rounded-md flex items-center justify-center p-1">
      <Image
        src={image}
        width={100}
        height={100}
        alt={alt}
        className="max-h-full max-w-full object-contain"
      />
    </span>
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
    // 1. Grid setup: Mobile is 1 column (main image on top, thumbs below), Desktop is 8 columns.
    <div className="grid grid-cols-1 lg:grid-cols-8 lg:sticky top-32 self-start overflow-hidden lg:gap-4">
      {/* Thumbnail Container - Goes first on desktop, second on mobile */}
      {/* 2. Layout: Mobile uses col-span-1/8 for full width, Desktop uses lg:col-span-1 */}
      {/* 3. Spacing/Alignment: Use mt-6 for mobile, lg:mt-0 to remove top margin on desktop */}
      <div className="order-2 lg:order-1 col-span-1 lg:col-span-1 mx-auto mt-6 lg:mt-0 max-w-2xl w-full sm:block lg:max-w-none">
        {enableThumbCarousel ? (
          // Thumbnail Carousel (Embla) for 5+ images
          // 4. Embla Layout: Mobile is horizontal, Desktop is vertical with a fixed height and overflow
          <div
            className="embla overflow-hidden lg:h-[600px] lg:overflow-y-scroll px-3"
            ref={thumbEmblaRef}
          >
            {/* The lg:flex-col and lg:space-y-2 are key for vertical stacking */}
            <div className="embla__container flex space-x-2 lg:flex-col lg:space-y-2 lg:space-x-0 ">
              {images.map((image: string, index: number) => (
                // Important for vertical layout: min-width: 0 and full width on desktop
                <div
                  key={index}
                  className="embla__slide flex-shrink-0 min-w-[25%] lg:min-w-full"
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
          // Simple grid/flex layout for 4 or fewer images
          // 5. Grid Layout: Mobile is grid-cols-4, Desktop is lg:grid-cols-1
          <div className="grid grid-cols-4 gap-4 lg:grid-cols-1 lg:gap-2">
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

      {/* Main Image Carousel */}
      {/* 6. Main Image Layout: Order-1 (top) on mobile, lg:col-span-7 on desktop */}
      <div className="order-1 lg:order-2 col-span-1 lg:col-span-7 w-full h-auto mt-6 lg:mt-0 rounded-lg overflow-hidden bg-white relative">
        <div className="embla" ref={mainEmblaRef}>
          <div className="embla__container flex">
            {images.map((image: string, idx: number) => (
              <div
                key={idx}
                className="embla__slide flex-shrink-0 flex justify-center items-center w-full"
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
  <div className="lg:sticky top-10 self-start grid grid-cols-1 lg:grid-cols-8 lg:gap-4">
    {/* Desktop Thumbnail Placeholder (lg:col-span-1) */}
    <div className="hidden lg:block lg:col-span-1 space-y-2">
      <div className="w-full h-24 bg-gray-200 rounded-lg animate-pulse" />
      <div className="w-full h-24 bg-gray-200 rounded-lg animate-pulse" />
      <div className="w-full h-24 bg-gray-200 rounded-lg animate-pulse" />
      <div className="w-full h-24 bg-gray-200 rounded-lg animate-pulse" />
    </div>

    {/* Main Image Placeholder (lg:col-span-7) */}
    <div className="col-span-1 lg:col-span-7">
      <div className="w-full h-[600px] bg-gray-200 rounded-lg animate-pulse" />
    </div>

    {/* Mobile Thumbnail Placeholder (full width below main image) */}
    <div className="mt-6 flex space-x-4 lg:hidden col-span-1">
      <div className="w-1/4 h-24 bg-gray-200 rounded-lg animate-pulse" />
      <div className="w-1/4 h-24 bg-gray-200 rounded-lg animate-pulse" />
      <div className="w-1/4 h-24 bg-gray-200 rounded-lg animate-pulse" />
      <div className="w-1/4 h-24 bg-gray-200 rounded-lg animate-pulse" />
    </div>
  </div>
);
