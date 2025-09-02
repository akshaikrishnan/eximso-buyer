import ProductsListing from "@/components/products/products-listing";

export default async function Products(props: any) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  return <ProductsListing params={params} searchParams={searchParams} />;
}
