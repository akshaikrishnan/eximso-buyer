export interface BentoProduct {
  _id: string;
  slug: string;
  name: string;
  thumbnail: string;
  price: number;
  offerPrice?: number;
  rating?: number;
  minimumOrderQuantity?: number;
  stock?: number;
  isActive?: boolean;
}

export interface BentoBanner {
  id: string;
  image: string;
  linkUrl: string;
  title?: string;
  description?: string;
}

export interface BentoGridContent {
  title?: string;
  products?: BentoProduct[];
  banners?: BentoBanner[];
}

export type BentoGridProps = BentoGridContent;
