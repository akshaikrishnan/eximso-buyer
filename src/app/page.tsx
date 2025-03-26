"use client"
import Container from "@/components/layout/container";
import BannerSection from "@/components/layout/home/bannerSection";
import CollectionGroups from "@/components/layout/home/collection-groups";
import FullwidthSingleBgBanner from "@/components/layout/home/fullwidth-single-bg-banner";
import HeroWithCategories from "@/components/layout/home/hero-with-categories";
import ProductsGrid from "@/components/layout/home/products";
import ThreeGridCollection from "@/components/layout/home/three-grid-collection";
import { collectionGroup } from "@/lib/data/collection";
import { EmblaOptionsType } from "embla-carousel";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api/axios.interceptor";
import { endpoints } from "@/lib/data/endpoints";
import Loader from "@/components/common/loader/loader";

export default function Home() {
  const OPTIONS: EmblaOptionsType = { loop: true };

  // Fetch banner images dynamically
  const { data: banners, isLoading, isError, error } = useQuery({
    queryKey: ["hero-banners"],
    queryFn: async () => {
      const res = await api.get(endpoints.banner);
      console.log("API Response:", res.data);
      return res.data.result || []; // Ensure fallback to empty array
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Handle loading state
  if (isLoading) {
    return <Loader fullScreen />;
  }

  // Handle error state
  if (isError || !banners.length) {
    return (
      <div className="text-center text-gray-500">
        {isError ? "Error loading banners" : "No banners available"}
      </div>
    );
  }

  // Transform API data into required format
  const SLIDES = banners.map((banner: any) => ({
    image: banner.image || "/placeholder-image.jpg",
    title: banner.title || "Banner",
    href: banner.linkUrl || "#",
  }));

  return (
    <main className="space-y-6">
      <Container className="pt-4">
        <HeroWithCategories />
      </Container>

      {/* Pass API-fetched banners */}
      <BannerSection slides={SLIDES} options={OPTIONS} />

      <Container>
        <CollectionGroups data={collectionGroup} />
      </Container>

      <FullwidthSingleBgBanner />

      <Container>
        <ThreeGridCollection />
        <ProductsGrid />
      </Container>
    </main>
  );
}
