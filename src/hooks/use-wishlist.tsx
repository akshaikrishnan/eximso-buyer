import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api/axios.interceptor";
import { endpoints } from "@/lib/data/endpoints";

export interface WishlistItemShape {
  id?: string;
  product?: {
    _id?: string;
    id?: string;
    name?: string;
  } | null;
}

export function useWishlist() {
  return useQuery<WishlistItemShape[]>({
    queryKey: ["wishlist"],
    staleTime: 1000 * 60,
    queryFn: async () => {
      try {
        const response = await api.get(endpoints.wishlist);
        const result = response.data?.result;
        if (Array.isArray(result)) {
          return result as WishlistItemShape[];
        }
        return [];
      } catch (error) {
        console.error("Error fetching wishlist", error);
        return [];
      }
    },
  });
}
