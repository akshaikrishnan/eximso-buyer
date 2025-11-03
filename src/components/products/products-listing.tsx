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
        ...searchParams,
      },
    });
    return res.data.result;
  };

  const queryClient = new QueryClient();
  console.log(["products", params?.params, searchParams]);

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["products", params?.params, searchParams],
    queryFn: getProducts,
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => lastPage.nextPage,
    pages: 2,
  });

  const res = await api.get(endpoints.products, {
    params: {
      page: 1,
      limit: 1,
      category: params?.params?.[0] || null,
      subcategory: params?.params?.[1] || null,
      ...searchParams,
    },
  });
  console.log(res?.data);
  const pageData: any = await queryClient.getQueryData(["products", {}, ""]);
  const title = res.data?.result?.title ?? "Products";
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductLayout
        params={params.params}
        searchParams={searchParams}
        title={title}
      >
        <ProductsGrid params={params.params} />
      </ProductLayout>
    </HydrationBoundary>
  );
}
