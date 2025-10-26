import type { ComponentType } from "react";

import FourProductShowcaseBento from "./four-product-showcase-bento";
import ThreeProductHeroBento from "./three-product-hero-bento";
import TwoProductOneBannerBento from "./two-product-one-banner-bento";
import type { BentoGridProps } from "./types";

export type BentoGridComponent = ComponentType<BentoGridProps>;

export const homeBentoGrids = {
  twoProductOneBanner: TwoProductOneBannerBento,
  threeProductHero: ThreeProductHeroBento,
  fourProductShowcase: FourProductShowcaseBento,
} satisfies Record<string, BentoGridComponent>;

export type HomeBentoGridKey = keyof typeof homeBentoGrids;
