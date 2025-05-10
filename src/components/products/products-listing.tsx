import ProductsGrid from "@/components/layout/home/products";
import ProductLayout from "@/components/products/product-layout";
import api from "@/lib/api/axios.interceptor";
import { endpoints } from "@/lib/data/endpoints";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function ProductsListing({ params, searchParams }: any) {
  const { q, sort } = searchParams;
  const getProducts = async ({ pageParam = 1 }: { pageParam: number }) => {
    const res = await api.get(endpoints.products, {
      params: {
        page: pageParam,
        limit: 10,
        category: params?.params?.[0] || null,
        subcategory: params?.params?.[1] || null,
        name: q || null,
        sort: sort || null,
      },
    });
    return res.data.result;
  };

  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: [
      "products",
      params,
      searchParams?.q || "",
      searchParams?.sort || "",
    ],
    queryFn: getProducts,
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => lastPage.nextPage,
    pages: 2,
  });
  const pageData: any = await queryClient.getQueryData(["products", {}, ""]);
  console.log(pageData);
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductLayout>
        <ProductsGrid params={params} searchParams={searchParams} />
      </ProductLayout>
    </HydrationBoundary>
  );
}
