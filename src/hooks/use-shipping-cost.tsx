import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import api from "@/lib/api/axios.interceptor";
import { endpoints } from "@/lib/data/endpoints";

// Defining types for better DX
interface UseCheckoutInfoProps {
  subTotal: number;
  addressId?: string;
  shippingProvider?: string; // Optional param
}

export const useShippingCost = ({
  subTotal,
  addressId,
  shippingProvider = "indiapost", // Default value
}: UseCheckoutInfoProps) => {
  const fetchCheckoutInfo = useCallback(
    async (id?: string, provider?: string) => {
      const response = await api.get(endpoints.getCheckoutInfo, {
        params: {
          addressId: id,
          shippingProvider: provider,
        },
      });
      return response.data;
    },
    [],
  );

  return useQuery({
    // Adding shippingProvider to the key ensures cache isolation
    queryKey: ["checkout-info", addressId, subTotal, shippingProvider],
    queryFn: () => fetchCheckoutInfo(addressId, shippingProvider),
    // Prevents UI "blinking" when changing providers
    placeholderData: (previousData) => previousData,
    // Optional: add a staleTime so it doesn't refetch too aggressively
    staleTime: 1000 * 60 * 5,
  });
};
