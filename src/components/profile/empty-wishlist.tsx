"use client";

import { useQuery } from "@tanstack/react-query";
import { SparklesIcon } from "@heroicons/react/24/solid";
import api from "@/lib/api/axios.interceptor";
import { endpoints } from "@/lib/data/endpoints";
import { RelatedProduct } from "@/components/products/related-products";

interface ProductShape {
  _id?: string;
  id?: string;
  name: string;
  price: number;
  offerPrice?: number;
  discountPercentage?: number;
  shortDescription?: string;
  detailedDescription?: string;
  tags?: string[];
  keywords?: string[];
  thumbnail?: string;
  images?: string[];
  slug?: string;
  brand?: string;
  manufacturer?: string;
  sku?: string;
  countryOfOrigin?: string;
  category?: any;
  subcategory?: any;
  seller?: any;
  uom?: string;
  minimumOrderQuantity?: number;
  stock?: number;
  dimensions?: any;
  isActive?: boolean;
  ratingSummary?: any;
  rating?: number;
  reviewCount?: number;
  material?: string;
  description?: string;
  categoryName?: string;
  subcategoryName?: string;
}

type ProductWithRequiredId = ProductShape & { _id: string };

type ProductEntry = ProductShape | { product?: ProductShape | null | undefined };

type ProductListResponse = {
  result?: { data?: ProductEntry[]; items?: ProductEntry[] };
  data?: ProductEntry[];
  items?: ProductEntry[];
};

function extractProductEntries(payload: unknown): ProductEntry[] {
  if (!payload) return [];

  if (Array.isArray(payload)) {
    return payload as ProductEntry[];
  }

  if (typeof payload === "object") {
    const candidate = payload as ProductListResponse;

    if (candidate.result?.data && Array.isArray(candidate.result.data)) {
      return candidate.result.data;
    }

    if (candidate.result?.items && Array.isArray(candidate.result.items)) {
      return candidate.result.items;
    }

    if (candidate.data && Array.isArray(candidate.data)) {
      return candidate.data;
    }

    if (candidate.items && Array.isArray(candidate.items)) {
      return candidate.items;
    }
  }

  return [];
}

export default function EmptyWishlist() {
  const {
    data: recent = [],
    isLoading: recentLoading,
  } = useQuery<ProductEntry[]>({
    queryKey: ["products", "recent"],
    staleTime: 1000 * 60 * 5,
    queryFn: async () => {
      const response = await api.get<ProductListResponse>(`${endpoints.products}/recent`, {
        params: {
          limit: 10,
        },
      });

      return extractProductEntries(response.data);
    },
  });

  const normalizedRecentProducts: ProductWithRequiredId[] = recent
    .map((entry) => {
      if (entry && typeof entry === "object" && "product" in entry) {
        return entry.product ?? null;
      }
      return entry as ProductShape;
    })
    .filter((item): item is ProductWithRequiredId =>
      Boolean(item && typeof item._id === "string" && item._id.trim().length > 0)
    );

  return (
    <>
      <div className="flex flex-col items-center justify-center py-10">
        <img
          src="https://cdn-icons-png.flaticon.com/512/4076/4076432.png"
          alt="Empty Wishlist"
          className="h-32 w-32"
        />
        <h2 className="text-xl font-semibold text-gray-800 mt-4">
          Your Wishlist is Empty
        </h2>
        <p className="text-gray-500">Start adding your favorite items!</p>
      </div>
      {normalizedRecentProducts.length > 0 && (
        <section aria-labelledby="recent-heading" className="mt-16 pb-12">
          <div className="flex items-center gap-3">
            <SparklesIcon className="h-6 w-6 text-indigo-500" aria-hidden="true" />
            <h2 id="recent-heading" className="text-2xl font-semibold text-slate-900">Recently Viewed</h2>
          </div>

          {!recentLoading && (
            <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 auto-rows-fr">
              {normalizedRecentProducts.map((recentProduct) => (
                <RelatedProduct product={recentProduct} key={recentProduct._id} />
              ))}
            </div>
          )}
        </section>
      )}
    </>
  );
}
