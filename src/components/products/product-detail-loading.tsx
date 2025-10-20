// components/ProductDetailSkeleton.js

import React from "react";

// A single generic line placeholder
const LinePlaceholder = ({ width = "w-full" }) => (
  <div className={`h-4 bg-gray-200 rounded ${width} mb-2`}></div>
);

// --- Left Column: Image Gallery ---
const ImageGallerySkeleton = () => (
  <div className="w-full lg:w-1/2 p-2 lg:sticky lg:top-8">
    {/* Main Image Placeholder */}
    <div className="w-full aspect-video bg-gray-300 rounded-lg mb-4 animate-pulse">
      {/* Optional: Add placeholders for carousel arrows if needed */}
    </div>

    {/* Thumbnail Gallery Placeholder (visible on both mobile and desktop) */}
    <div className="flex justify-center lg:justify-start space-x-2">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-md border-2 border-gray-300 animate-pulse"
        ></div>
      ))}
    </div>
  </div>
);

// --- Right Column: Product Details ---
const ProductInfoSkeleton = () => (
  <div className="w-full lg:w-1/2 p-2 pt-4">
    <div className="animate-pulse">
      {/* Product Title Placeholder */}
      <div className="h-10 bg-gray-300 rounded w-full sm:w-3/4 mb-4"></div>

      {/* Price & Offer Placeholder */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="h-8 w-32 bg-indigo-200 rounded"></div>{" "}
        {/* Current Price */}
        <div className="h-5 w-20 bg-gray-200 rounded line-through"></div>{" "}
        {/* Old Price */}
        <div className="h-6 w-16 bg-red-100 rounded"></div> {/* Discount Tag */}
      </div>

      {/* Reviews and Stock Placeholder */}
      <div className="flex items-center space-x-4 mb-8">
        <div className="h-4 w-20 bg-gray-200 rounded"></div>{" "}
        {/* Stars/Reviews */}
        <div className="h-4 w-20 bg-green-200 rounded"></div> {/* In Stock */}
      </div>

      {/* CTA Button Placeholder */}
      <div className="h-12 w-full max-w-sm bg-purple-400 rounded-lg mb-8"></div>

      {/* --- About This Product Section --- */}
      <h2 className="text-xl font-semibold mb-3">
        <div className="h-6 w-32 bg-gray-300 rounded"></div>
      </h2>
      <LinePlaceholder width="w-full" />
      <LinePlaceholder width="w-11/12" />
      <LinePlaceholder width="w-10/12" />
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>

      {/* --- Product Specifications & Details Section --- */}
      <h2 className="text-xl font-semibold mt-6 mb-3">
        <div className="h-6 w-48 bg-gray-300 rounded"></div>
      </h2>

      {/* Specs List Placeholder (e.g., 5 rows) */}
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="flex justify-between items-center border-b border-gray-100 pb-2"
          >
            <div className="h-4 w-24 bg-gray-200 rounded"></div>{" "}
            {/* Spec Name */}
            <div className="h-4 w-40 bg-gray-100 rounded"></div>{" "}
            {/* Spec Value */}
          </div>
        ))}
      </div>
    </div>
  </div>
);

// --- Main Component ---
const ProductDetailSkeleton = () => {
  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
      {/* Main Container: Flex on large screens, stacked on mobile */}
      <div className="flex flex-col lg:flex-row lg:space-x-8 max-w-7xl mx-auto">
        {/* 1. Image Gallery (Left Side on Desktop) */}
        <ImageGallerySkeleton />

        {/* 2. Product Details (Right Side on Desktop) */}
        <ProductInfoSkeleton />
      </div>
    </div>
  );
};

export default ProductDetailSkeleton;
