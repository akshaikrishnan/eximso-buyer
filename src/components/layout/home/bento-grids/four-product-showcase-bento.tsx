import ProductCard from "@/components/common/product-card";

import type { BentoGridProps, BentoProduct } from "./types";

export default function FourProductShowcaseBento({
  title,
  products,
}: BentoGridProps) {
  const items: BentoProduct[] = (products ?? []).slice(0, 4);

  return (
    <section className="space-y-4">
      {title && (
        <header>
          <h2 className="text-xl font-semibold text-foreground md:text-2xl">
            {title}
          </h2>
        </header>
      )}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
        {items.length === 0 && (
          <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-muted-foreground/30 text-sm text-muted-foreground sm:col-span-2 xl:col-span-4">
            No products available.
          </div>
        )}
      </div>
    </section>
  );
}
