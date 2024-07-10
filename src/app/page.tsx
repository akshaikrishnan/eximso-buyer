import Container from "@/components/layout/container";
import BannerSection from "@/components/layout/home/bannerSection";
import HeroWithCategories from "@/components/layout/home/hero-with-categories";
import { EmblaOptionsType } from "embla-carousel";
import React from "react";

export default function Home() {
  const OPTIONS: EmblaOptionsType = { loop: true };
  const SLIDES = [
    {
      image: "/images/banners/banner-1 (1).webp",
      title: "Banner 1",
      href: "#",
    },
    {
      image: "/images/banners/banner-2 (1).webp",
      title: "Banner 2",
      href: "#",
    },
    {
      image: "/images/banners/banner-3 (1).webp",
      title: "Banner 3",
      href: "#",
    },
  ];
  return (
    <>
      <Container className="pt-4">
        <HeroWithCategories />
      </Container>
      <BannerSection slides={SLIDES} options={OPTIONS} />
    </>
  );
}
