// hooks/useProducts.ts
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchProducts, ProductsResponse } from "@/lib/api/products";
import api from "../api/axios.interceptor";
import { endpoints } from "../data/endpoints";
import { useSearchParams } from "next/navigation";

interface UseProductsParams {
  filters?: Record<string, any>;
  sort?: string;
  slug?: string;
}

export const useProducts = ({
  filters = {},
  sort = "",
  slug = "",
}: UseProductsParams) => {
  const searchParams = useSearchParams();
  const name = searchParams.get("q");
  const getProducts = async ({ pageParam = 1 }: { pageParam: number }) => {
    const res = await api.get(endpoints.products, {
      params: {
        name: name,
        page: pageParam,
        limit: 10,
      },
    });
    return res.data.result;
  };

  return useInfiniteQuery({
    queryKey: ["products", { q: name }, filters, slug],
    queryFn: getProducts,
    getNextPageParam: (lastPage: any, allPages) => {
      //console.log("lastPage", lastPage);
      const nextPage = lastPage.nextPage;
      return nextPage;
    },
    initialPageParam: 1, // Add this line with an appropriate initial value
  });
};
