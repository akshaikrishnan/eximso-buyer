import ProductsGrid from "@/components/layout/home/products";
import ProductLayout from "@/components/products/product-layout";
import api from "@/lib/api/axios.interceptor";
import { endpoints } from "@/lib/data/endpoints";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

const getProducts = async ({ pageParam = 1 }: { pageParam: number }) => {
  const res = await api.get(endpoints.products, {});
  return res.data.result;
};

export default async function Products({ params }: any) {
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["products", params.slug?.[0] || "allProducts", {}],
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
