import ProductsGrid from "@/components/layout/home/products";
import ProductLayout from "@/components/products/product-layout";
import api from "@/lib/api/axios.interceptor";
import { endpoints } from "@/lib/data/endpoints";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function Search({ params, searchParams }: any) {
  const queryClient = new QueryClient();
  const { q } = searchParams;
  console.log("searchParams", q);

  const getProducts = async ({ pageParam = 1 }: { pageParam: number }) => {
    const res = await api.get(endpoints.products, {
      params: {
        name: q,
        page: pageParam,
        limit: 10,
      },
    });
    return res.data.result;
  };

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["products", q, {}],
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
        <ProductsGrid />
      </ProductLayout>
    </HydrationBoundary>
  );
}
