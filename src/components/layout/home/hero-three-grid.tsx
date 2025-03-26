"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api/axios.interceptor";
import { endpoints } from "@/lib/data/endpoints";
import Loader from "@/components/common/loader/loader";

// Define interface for banner item
interface BannerItem {
  id: string;
  image: string;
  linkUrl: string;
  width: number;
  height: number;
  alt: string;
}

export default function HeroThreeGrid() {
  // Fetch banners using React Query
  const {
    data: queryData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["hero-banners"],
    queryFn: async () => {
      const res = await api.get(endpoints.banner);
      console.log("API Full Response:", res.data); // Check full API response
      return res.data.result || []; // Ensure fallback to empty array
    },
    staleTime: 5 * 60 * 1000,
  });

  // Ensure only 3 banners are displayed
  const banners: BannerItem[] = Array.isArray(queryData) ? queryData.slice(0, 3) : [];

  // Comprehensive logging
  console.log("Banner Query Debug:", {
    queryData,
    banners,
    isLoading,
    isError,
    error: error ? error.message : null,
  });

  // Show loader while fetching
  if (isLoading) {
    return <Loader fullScreen />;
  }

  // Handle error or empty state
  if (isError || banners.length === 0) {
    return (
      <div className="col-span-full lg:col-span-5 xl:col-span-5 row-span-full lg:row-auto grid grid-cols-2 gap-2 md:gap-3.5 lg:gap-5 xl:gap-7">
        <div className="col-span-2 text-center text-gray-500">
          {isError ? "Error loading banners" : "No banners available"}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`col-span-full lg:col-span-5 xl:col-span-5 row-span-full lg:row-auto grid ${banners.length === 3 ? "grid-cols-2" : "grid-cols-1"} gap-2 md:gap-3.5 lg:gap-5 xl:gap-7`}
    >
      {banners.map((banner: BannerItem, index: number) => (
        <div
          key={banner.id || `banner-${index}`}
          className={`mx-auto ${banners.length === 3 && index === 0 ? "col-span-2" : "col-span-1"} w-full`}
        >
          <Link
            className="h-full group flex justify-center relative overflow-hidden"
            href={banner.linkUrl || "/"}
          >
            <Image
              className="bg-gray-300 object-cover w-full rounded-md h-[150px] sm:h-[200px] md:h-[300px] lg:h-[300px] xl:h-[350px]"
              src={banner.image || "/placeholder-image.jpg"}
              width={banner.width || 370}
              height={banner.height || 450}
              alt={banner.alt || `Banner ${index + 1}`}
              priority={index < 2} // Prioritize first two images
            />
          </Link>
        </div>
      ))}
    </div>
  );
}
