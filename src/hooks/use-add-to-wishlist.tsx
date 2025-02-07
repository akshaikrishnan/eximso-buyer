//use-add-to-wishlist 
 import React from "react";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api/axios.interceptor";
import { endpoints } from "@/lib/data/endpoints";
import { useRouter } from "next/navigation";

export const useAddToWishlist = (product: any) => {
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await api.post(endpoints.wishlist , {
        productId: product._id,
      });

      console.log(response.data); // For debugging purposes

      return response.data;
    },
    onError: (error: any) => {
      console.error(error); // Log the error for debugging

      toast({
        title: 'Error while adding to wishlist',
        description: error.response?.data?.message || "Something went wrong",
        action: (
          <ToastAction
            onClick={() => router.push("/wishlist")}
            altText="Go to Wishlist"
          >
            Show Wishlist
          </ToastAction>
        ),
      });
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] }); // Invalidate wishlist data

      toast({
        title: '${product.name} added to wishlist',
        description:' You can view this item in your wishlist.',
        action: (
          <ToastAction
            onClick={() => router.push("/wishlist")}
            altText="Go to Wishlist"
          >
            Show Wishlist
          </ToastAction>
        ),
      });
    },
  });

  return mutation.mutate;
};