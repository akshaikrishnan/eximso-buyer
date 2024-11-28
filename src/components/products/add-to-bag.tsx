import React from "react";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api/axios.interceptor";
import { endpoints } from "@/lib/data/endpoints";

export default function AddToBagBtn({ product }: any) {
  const { toast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  const goToCart = () => {
    router.push("/cart");
  };
  const mutation = useMutation({
    mutationFn: (product: any) =>
      api
        .post(endpoints.cart + "/add", {
          productId: product._id,
          quantity: product.minimumOrderQuantity,
        })
        .then((res) => {
          console.log(res.data);
        }),
    onError: (error: any) => {
      console.log(error);
      toast({
        title: `Error while adding to cart`,
        description: error.response.data.message,
        action: (
          <ToastAction onClick={goToCart} altText="Try again">
            Show Cart
          </ToastAction>
        ),
      });
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast({
        title: `${product.name} added to cart`,
        description: `Added minimum order quantity ${product.minimumOrderQuantity}`,
        action: (
          <ToastAction onClick={goToCart} altText="Try again">
            Show Cart
          </ToastAction>
        ),
      });
    },
  });
  return (
    <button
      onClick={() => {
        mutation.mutate(product);
      }}
      className="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
    >
      Add to bag
    </button>
  );
}
