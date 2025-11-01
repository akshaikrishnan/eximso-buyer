import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api/axios.interceptor";
import { endpoints } from "@/lib/data/endpoints";

export function useUpdateCartQuantity(productId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (quantity: number) => {
      const response = await api.post(`${endpoints.cart}/update`, {
        productId,
        quantity,
      });

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}
