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
  params?: Record<string, any>;
}

export const useProducts = ({
  filters = {},
  slug = "",
  params = [],
}: UseProductsParams) => {
  console.log("params", params);
  const searchParams = useSearchParams();
  const name = searchParams.get("q");
  const sort = searchParams.get("sort");
  const getProducts = async ({ pageParam = 1 }: { pageParam: number }) => {
    console.log("paramsaaaa", params);
    const res = await api.get(endpoints.products, {
      params: {
        name: name,
        page: pageParam,
        limit: 10,
        category: params?.params?.[0] || null,
        subcategory: params?.params?.[1] || null,
        sort: sort || null,
      },
    });
    return res.data.result;
  };

  return useInfiniteQuery({
    queryKey: ["products", params, name, sort],
    queryFn: getProducts,
    getNextPageParam: (lastPage: any, allPages) => {
      if (!lastPage || !lastPage.nextPage) {
        // If lastPage is undefined or nextPage is missing, there are no more pages
        return undefined;
      }
      return lastPage.nextPage;
    },
    initialPageParam: 1, // Add this line with an appropriate initial value
  });
};
