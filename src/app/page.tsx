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

  // Fetch banner images dynamically
  let banners = [];
  try {
    const res = await api.get(endpoints.banner);
    // console.log("API Response:", res.data);
    banners = res.data.result || [];
  } catch (error) {
    console.error("Error loading banners:", error);
  }

  // Transform API data into required format
  const SLIDES = banners.map((banner: { image: any; title: any; linkUrl: any; }) => ({
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
