// components/ProductSkeletonLoader.js

import React from "react";

const SkeletonItem = () => (
  // Individual product item skeleton
  <div className="border border-gray-200 rounded-lg p-3 bg-white shadow-sm animate-pulse">
    {/* Image Placeholder */}
    <div className="h-48 bg-gray-200 rounded-md mb-3"></div>
    {/* Offer Tag Placeholder */}
    <div className="h-4 w-12 bg-gray-300 rounded text-xs font-semibold mb-2"></div>
    {/* Title Placeholder */}
    <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
    {/* Price Placeholder */}
    <div className="h-5 bg-gray-300 rounded w-1/4"></div>
  </div>
);

const SidebarSkeleton = () => (
  // Sidebar/Filter section skeleton (visible only on desktop)
  <div className="hidden lg:block w-full max-w-xs p-4 space-y-4">
    {/* Title Placeholder */}
    <div className="h-8 w-48 bg-gray-300 rounded"></div>
    {/* Category Links Placeholder */}
    <div className="space-y-3">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
      ))}
    </div>
  </div>
);

const ProductGridSkeleton = () => (
  // Main product grid skeleton
  <div className="w-full">
    {/* Header/Sort Placeholder */}
    <div className="flex justify-between items-center mb-6">
      <div className="h-8 w-40 bg-gray-300 rounded"></div>
      <div className="h-8 w-20 bg-gray-200 rounded"></div>
    </div>

    {/* Product Grid: 2 columns on mobile, 3 columns on desktop */}
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {[...Array(12)].map((_, i) => (
        <SkeletonItem key={i} />
      ))}
    </div>
  </div>
);

const ProductSkeletonLoader = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Page Title Placeholder */}
      <div className="h-10 w-64 bg-gray-400 rounded-lg mb-8 animate-pulse"></div>

      <div className="flex space-x-6">
        {/* 1. Sidebar Skeleton (Hidden on mobile) */}
        <SidebarSkeleton />

        {/* 2. Product Grid Skeleton (Takes full width on mobile) */}
        <ProductGridSkeleton />
      </div>
    </div>
  );
};

export default ProductSkeletonLoader;
