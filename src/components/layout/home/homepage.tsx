import Container from "@/components/layout/container";
import BannerSectionClient from "@/components/layout/home/banner-client";
import CollectionGroups from "@/components/layout/home/collection-groups";
import FullwidthSingleBgBanner from "@/components/layout/home/fullwidth-single-bg-banner";
import HeroWithCategories from "@/components/layout/home/hero-with-categories";
import HomePageWidgets from "@/components/layout/home/homepage-widgets";
import ProductsGrid from "@/components/layout/home/products";
import ThreeGridCollection from "@/components/layout/home/three-grid-collection";
import { endpoints } from "@/lib/data/endpoints";
import { EmblaOptionsType } from "embla-carousel";
import { Suspense } from "react";

type Banner = {
  image: string;
  title: string;
  link: string;
  type: string;
  createdAt?: string;
  updatedAt?: string;
};

type Product = {
  title: string;
  href: string;
  image: string;
  description?: string;
};

type CollectionGroupProps = {
  title: string;
  products: Product[];
};

export default async function HomePage() {
  const OPTIONS: EmblaOptionsType = { loop: true };

  let banners: Banner[] = [];
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/${endpoints.banner}`,
      {
        cache: "force-cache",
        next: { revalidate: 3600, tags: ["cache", "banners"] },
      }
    ).then((response) => response.json());
    banners = res.result || [];
  } catch (error) {
    console.error("Error loading banners:", error);
  }

  banners.sort(
    (a: Banner, b: Banner) =>
      new Date(b.createdAt || b.updatedAt || "").getTime() -
      new Date(a.createdAt || a.updatedAt || "").getTime()
  );

  const filteredBanners = banners
    .filter((banner: Banner) => banner.type === "sidebar")
    .slice(0, 3);

  const SLIDES = filteredBanners.map((banner: Banner) => ({
    image: banner.image || "/placeholder-image.jpg",
    title: banner.title || "Banner",
    href: banner.link || "#",
  }));

  let collectionData: CollectionGroupProps[] = [];
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/${endpoints.collection}`,
      {
        cache: "force-cache",
        next: { revalidate: 3600, tags: ["cache", "collections"] },
      }
    ).then((response) => response.json());
    collectionData = res.result || [];
  } catch (error) {
    console.error("Error loading collection groups:", error);
  }

  return (
    <main className="space-y-6">
      <Container className="pt-4">
        <HeroWithCategories />
      </Container>

      <Suspense
        fallback={
          <div className="h-40 w-full animate-pulse rounded-lg bg-muted/40" />
        }
      >
        {SLIDES.length > 0 && (
          <BannerSectionClient slides={SLIDES} options={OPTIONS} />
        )}
      </Suspense>

      <Container>
        <CollectionGroups data={collectionData} />
      </Container>

      <Container>
        <HomePageWidgets />
      </Container>

      <FullwidthSingleBgBanner />

      <Container>
        <ThreeGridCollection />
        <ProductsGrid disableInfiniteScroll={true} limit={10} />
      </Container>
    </main>
  );
}
