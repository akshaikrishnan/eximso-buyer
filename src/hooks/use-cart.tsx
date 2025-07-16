import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api/axios.interceptor";
import { endpoints } from "@/lib/data/endpoints";

export interface CartItem {
  id: string;
  product: {
    _id: string;
    name: string;
    price: number;
    offerPrice?: number;
    thumbnail: string;
    slug: string;
  };
  quantity: number;
  color?: string;
  size?: string;
  inStock?: boolean;
}

interface CartData {
  items: CartItem[];
}

export function useCart() {
  const queryClient = useQueryClient();

  const {
    data: cart,
    isLoading,
    isError,
  } = useQuery<CartData>({
    queryKey: ["cart"],
    queryFn: () => api.get(endpoints.cart).then((res) => res.data.result),
  });

  const removeMutation = useMutation({
    mutationFn: (productId: string) =>
      api
        .post(endpoints.cart + "/remove/", { productId })
        .then((res) => res.data.result),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const subTotal =
    cart?.items?.reduce(
      (acc, item) => acc + (item.product.offerPrice ?? item.product.price) * item.quantity,
      0
    ) || 0;

  return {
    cart,
    isLoading,
    isError,
    removeMutation,
    subTotal,
  };
}
