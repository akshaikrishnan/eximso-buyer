"use client";

import { TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import api from "@/lib/api/axios.interceptor";
import { endpoints } from "@/lib/data/endpoints";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Loader from "@/components/common/loader/loader";
import EmptyWishlist from "./empty-wishlist";
import { RelatedProduct } from "@/components/products/related-products";

interface WishlistItem {
  id: string;
  product: {
    id: string;
    name: string;
    thumbnail: string;
    shortDescription: string;
    offerPrice: string;
    price: string;
    discountPercentage: number;
    slug: string;
  };
}

const WishlistPage = () => {
  const queryClient = useQueryClient();

  // Fetch wishlist data
  const {
    data: wishlist,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["wishlist"],
    queryFn: () => api.get(endpoints.wishlist).then((res) => res.data.result),
  });

  // Remove item from wishlist
  const removeMutation = useMutation({
    mutationFn: (productId: string) =>
      api.post(endpoints.wishlist, { productId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: (error) => {
      console.error("Error removing item from wishlist:", error);
    },
  });

  const handleRemove = (productId: string) => {
    console.log("Removing product:", productId);
    removeMutation.mutate(productId);
  };

  // Show loader while fetching
  if (isLoading) return <Loader fullScreen />;

  // Show empty state
  if (!wishlist || wishlist.length === 0 || isError) return <EmptyWishlist />;

  // Filter out invalid wishlist items
  const validWishlist = wishlist.filter(
    (wishItem: WishlistItem) => wishItem?.product?.id
  );

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold text-gray-800">
        My Wishlist ({validWishlist.length})
      </h1>

      <div className="mt-6 space-y-4">
        {validWishlist.map((wishItem: WishlistItem) => {
          const item = wishItem.product;

          return (
            <div
              key={item.id}
              className="flex items-center justify-between p-5 shadow-xs ring-1 ring-gray-900/5 sm:rounded pb-4"
            >
              <Link
                href={`/${item.slug}`}
                className="flex items-center space-x-4 flex-1"
              >
                <img
                  src={item.thumbnail}
                  alt={item.name}
                  className="h-20 w-20 rounded object-contain object-center sm:h-24 sm:w-24"
                />
                <div>
                  <h3 className="text-lg font-medium text-gray-800">
                    {item.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-1">
                    {item.shortDescription}
                  </p>
                  <div className="mt-2 flex items-center space-x-2 text-sm">
                    <p className="text-lg font-semibold text-gray-900">
                      {Number(item.offerPrice) === 0
                        ? item.price
                        : item.offerPrice}
                    </p>
                    {Number(item.offerPrice) !== 0 && (
                      <p className="text-gray-500 line-through">{item.price}</p>
                    )}
                    {Number(item.offerPrice) !== 0 &&
                      item.discountPercentage > 0 && (
                        <p className="text-green-500">
                          {item.discountPercentage}% Off
                        </p>
                      )}
                  </div>
                </div>
              </Link>

              <button
                className="text-gray-500 hover:text-red-500"
                onClick={() => handleRemove(item.id)}
                disabled={removeMutation.isPending}
              >
                <TrashIcon className="h-6 w-6" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WishlistPage;
