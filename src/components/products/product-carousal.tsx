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

  const backgroundPosition = `${position.x}% ${position.y}%`;
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
      {isHovering && (
        <div
          className="hidden lg:block absolute inset-0 border-4 border-indigo-500 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            backgroundImage: `url(${src})`,
            backgroundPosition,
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
      "relative flex h-24 cursor-pointer items-center justify-center rounded-lg bg-white text-sm font-medium uppercase text-gray-900 focus:outline-none ring-2 ring-offset-2 transition-shadow duration-200"
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
  // 💡 Fix 1: Removed Embla for thumbnails if there are 4 or fewer images
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
  }, [mainEmblaApi, thumbEmblaApi, setSelectedIndex, enableThumbCarousel]);

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

  // Magnifier is enabled for single image or for the main carousel
  const isZoomEnabled = images.length > 0;

  return (
    <div className="flex flex-col-reverse lg:sticky top-10 self-start">
      {/* Thumbnail Container */}
      <div className="mx-auto mt-6 w-full max-w-2xl sm:block lg:max-w-none">
        {enableThumbCarousel ? (
          // Thumbnail Carousel (Embla) for 5+ images
          <div className="embla" ref={thumbEmblaRef}>
            <div className="embla__container flex space-x-4">
              {images.map((image: string, index: number) => (
                <div
                  key={index}
                  className="embla__slide flex-shrink-0"
                  style={{ minWidth: "25%" }}
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
          // 💡 Fix 1: Simple grid/flex layout for 4 or fewer images
          <div className="grid grid-cols-4 gap-4">
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
      {/* 💡 Fix 3: Removed shadow from this container */}
      <div className="w-full h-auto mt-6 lg:mt-0 rounded-lg overflow-hidden bg-white relative">
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
  <div className="lg:sticky top-10 self-start">
    <div className="w-full h-[600px] bg-gray-200 rounded-lg animate-pulse" />
    <div className="mt-6 flex space-x-4">
      <div className="w-1/4 h-24 bg-gray-200 rounded-lg animate-pulse" />
      <div className="w-1/4 h-24 bg-gray-200 rounded-lg animate-pulse" />
      <div className="w-1/4 h-24 bg-gray-200 rounded-lg animate-pulse" />
      <div className="w-1/4 h-24 bg-gray-200 rounded-lg animate-pulse" />
    </div>
  </div>
);
