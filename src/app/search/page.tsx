import ProductsListing from "@/components/products/products-listing";

export default async function Products({ params, searchParams }: any) {
  return <ProductsListing params={params} searchParams={searchParams} />;
}
