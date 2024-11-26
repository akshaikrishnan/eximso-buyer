"use client";
import ProductCard from "@/components/common/product-card";
import { products } from "@/lib/data/products";
import { useProducts } from "@/lib/hooks/useProducts";
import { InView } from "react-intersection-observer";

export default function ProductsGrid() {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useProducts({});
  console.log(data);
  const products: any[] = data?.pages.flatMap((page) => page.data) || [];
  return (
    <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-x-2 gap-y-4 pt-5">
      {products.map((product) => (
        <ProductCard product={product} key={product._id} />
      ))}
      <InView as="div" onChange={(inView, entry) => fetchNextPage()}></InView>
    </section>
  );
}
