import React from "react";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api/axios.interceptor";
import { endpoints } from "@/lib/data/endpoints";
import { useRouter } from "next/navigation";

export const useAddToCart = (product: any) => {
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await api.post(endpoints.cart + "/add", {
        productId: product._id,
        quantity: product.minimumOrderQuantity,
      });

      console.log(response.data); // For debugging purposes

      return response.data;
    },
    onError: (error: any) => {
      console.error(error); // Log the error for debugging

      toast({
        title: `Error while adding to cart`,
        description: error.response?.data?.message || "Something went wrong",
        action: (
          <ToastAction
            onClick={() => router.push("/cart")}
            altText="Go to Cart"
          >
            Show Cart
          </ToastAction>
        ),
      });
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["cart"] }); // Invalidate cart data

      toast({
        title: `${product.name} added to cart`,
        description: `Added minimum order quantity ${product.minimumOrderQuantity}`,
        action: (
          <ToastAction
            onClick={() => router.push("/cart")}
            altText="Go to Cart"
          >
            Show Cart
          </ToastAction>
        ),
      });
    },
  });

  return mutation.mutate;
};
