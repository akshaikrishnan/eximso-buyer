import Container from "@/components/layout/container";
import BannerSection from "@/components/layout/home/bannerSection";
import CollectionGroups from "@/components/layout/home/collection-groups";
import FullwidthSingleBgBanner from "@/components/layout/home/fullwidth-single-bg-banner";
import HeroWithCategories from "@/components/layout/home/hero-with-categories";
import ProductsGrid from "@/components/layout/home/products";
import ThreeGridCollection from "@/components/layout/home/three-grid-collection";
import { EmblaOptionsType } from "embla-carousel";
import React from "react";
import api from "@/lib/api/axios.interceptor";
import { endpoints } from "@/lib/data/endpoints";

// Type interfaces
interface Banner {
  image: string;
  title: string;
  linkUrl: string;
  type: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Product {
  title: string;
  href: string;
  image: string;
  description?: string;
}

interface CollectionGroupProps {
  title: string;
  products: Product[];
}

export default async function Home() {
  const OPTIONS: EmblaOptionsType = { loop: true };

  // Banner Fetching Logic
  let banners: Banner[] = [];
  try {
    const res = await api.get(endpoints.banner);
    banners = res.data.result || [];
  } catch (error) {
    console.error("Error loading banners:", error);
  }

  banners.sort((a: Banner, b: Banner) =>
    new Date(b.createdAt || b.updatedAt || "").getTime() -
    new Date(a.createdAt || a.updatedAt || "").getTime()
  );

  const filteredBanners = banners
    .filter((banner: Banner) => banner.type === "sidebar")
    .slice(0, 3);

  const SLIDES = filteredBanners.map((banner: Banner) => ({
    image: banner.image || "/placeholder-image.jpg",
    title: banner.title || "Banner",
    href: banner.linkUrl || "#",
  }));

  // ✅ Fetch collection groups from backend
  let collectionData: CollectionGroupProps[] = [];
  try {
    const res = await api.get(endpoints.collection); // make sure endpoint is defined
    console.log('collectionDataRes',res.data);
    collectionData = res.data.result || [];
  } catch (error) {
    console.error("Error loading collection groups:", error);
  }

  return (
    <main className="space-y-6">
      
      <Container className="pt-4">
        <HeroWithCategories />
      </Container>

      <BannerSection slides={SLIDES} options={OPTIONS} />

      <Container>
        <CollectionGroups data={collectionData} />
      </Container>

      <FullwidthSingleBgBanner />

      <Container>
        <ThreeGridCollection />
        <ProductsGrid disableInfiniteScroll={true} limit={10}/>
      </Container>
    </main>
  );
}
