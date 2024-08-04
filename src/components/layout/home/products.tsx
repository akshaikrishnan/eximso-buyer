import ProductCard from "@/components/common/product-card";
import { products } from "@/lib/data/products";

export default function ProductsGrid() {
  return (
    <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-x-2 gap-y-4 pt-5">
      {products.map((product) => (
        <ProductCard product={product} key={product.id} />
      ))}
    </section>
  );
}
