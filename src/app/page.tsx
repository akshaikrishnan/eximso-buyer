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
import api from "@/lib/api/axios.interceptor";
import { endpoints } from "@/lib/data/endpoints";

export default async function Home() {
  const OPTIONS: EmblaOptionsType = { loop: true };

  // Define banner type
  interface Banner {
    image: string;
    title: string;
    linkUrl: string;
    type: string;
    createdAt?: string;
    updatedAt?: string;
  }

  // Fetch banner images dynamically
  let banners: Banner[] = [];
  try {
    const res = await api.get(endpoints.banner);
    console.log("API Response:", res.data);
    banners = res.data.result || [];
  } catch (error) {
    console.error("Error loading banners:", error);
  }

  // Sort banners by latest createdAt or updatedAt (descending order)
  banners.sort((a: Banner, b: Banner) => 
    new Date(b.createdAt || b.updatedAt || "").getTime() - 
    new Date(a.createdAt || a.updatedAt || "").getTime()
  );

  // Filter banners of type 'sidebar' and get only the latest 3
  const filteredBanners = banners
    .filter((banner: Banner) => banner.type === "sidebar")
    .slice(0, 3); // Take only the latest 3 banners

  // Transform API data into required format
  const SLIDES = filteredBanners.map((banner: Banner) => ({
    image: banner.image || "/placeholder-image.jpg",
    title: banner.title || "Banner",
    href: banner.linkUrl || "#",
  }));

  return (
    <main className="space-y-6">
      <Container className="pt-4">
        <HeroWithCategories />
      </Container>

      {/* Pass only the latest 3 banners */}
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



