"use client";

import dynamic from "next/dynamic";
import type { EmblaOptionsType } from "embla-carousel";

// match the prop shape you pass from page.tsx
type Slide = any;
type Props = { slides: Slide[]; options?: EmblaOptionsType };

const BannerSection = dynamic(() => import("./bannerSection"), {
  ssr: false,
  loading: () => (
    <div
      aria-busy
      className="h-40 w-full animate-pulse rounded-lg bg-muted/40"
    />
  ),
});

export default function BannerSectionClient(props: Props) {
  return <BannerSection {...props} />;
}
