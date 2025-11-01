import React from "react";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api/axios.interceptor";
import { endpoints } from "@/lib/data/endpoints";
import { useRouter } from "next/navigation";

type ToggleWishlistVariables = {
  shouldAdd: boolean;
};

interface WishlistProductShape {
  _id: string;
  name: string;
}

export const useAddToWishlist = (product: WishlistProductShape) => {
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ shouldAdd }: ToggleWishlistVariables) => {
      const response = await api.post(endpoints.wishlist, {
        productId: product._id,
      });

      return { ...response.data, shouldAdd };
    },
    onError: (error: any, { shouldAdd }) => {
      console.error(error);

      toast({
        title: shouldAdd
          ? "Error while adding to wishlist"
          : "Error while removing from wishlist",
        description: error.response?.data?.message || "Something went wrong",
        action: (
          <ToastAction
            onClick={() => router.push("/profile/my-wishlist")}
            altText="Go to Wishlist"
          >
            Show Wishlist
          </ToastAction>
        ),
      });
    },
    onSuccess: (_data, { shouldAdd }) => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });

      toast({
        title: shouldAdd
          ? `${product.name} added to wishlist`
          : `${product.name} removed from wishlist`,
        description: shouldAdd
          ? "You can view this item in your wishlist."
          : "The product has been removed from your wishlist.",
        action: (
          <ToastAction
            onClick={() => router.push("/profile/my-wishlist")}
            altText="Go to Wishlist"
          >
            Show Wishlist
          </ToastAction>
        ),
      });
    },
  });

  return mutation;
};
