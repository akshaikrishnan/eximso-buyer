import React from "react";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api/axios.interceptor";
import { endpoints } from "@/lib/data/endpoints";
import { useRouter } from "next/navigation";

interface AddToCartProductShape {
  _id: string;
  name: string;
  minimumOrderQuantity?: number;
}

export const useAddToCart = (product: AddToCartProductShape) => {
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await api.post(`${endpoints.cart}/add`, {
        productId: product._id,
        quantity: product.minimumOrderQuantity ?? 1,
      });

      return response.data;
    },
    onError: (error: any) => {
      console.error(error);

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });

      toast({
        title: `${product.name} added to cart`,
        description: `Added minimum order quantity ${
          product.minimumOrderQuantity ?? 1
        }`,
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

  return mutation;
};
