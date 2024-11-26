// lib/api.ts
import axios from "axios";

export interface Product {
  id: string;
  title: string;
  image: string;
  rating: number;
  originalPrice: number;
  offerPrice: number;
  label?: string;
  // Add other fields as necessary
}

export interface ProductsResponse {
  data: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface FetchProductsParams {
  pageParam?: number;
  filters?: Record<string, any>;
  sort?: string;
}

export const fetchProducts = async ({
  pageParam = 1,
  filters = {},
  sort = "",
}: FetchProductsParams): Promise<ProductsResponse> => {
  const params: Record<string, any> = {
    page: pageParam,
    limit: 10, // Adjust as needed
    sort,
    ...filters,
  };

  const response = await axios.get<ProductsResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products`,
    {
      params,
    }
  );

  return response.data;
};
