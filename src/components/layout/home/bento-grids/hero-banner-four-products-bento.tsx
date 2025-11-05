import Image from "next/image";
import Link from "next/link";

import ProductCard from "@/components/common/product-card";

import type { BentoGridProps, BentoBanner, BentoProduct } from "./types";

function HeroBanner({ banner }: { banner: BentoBanner }) {
  return (
    <Link
      href={banner.linkUrl || "#"}
      className="group relative block w-full overflow-hidden rounded-2xl bg-muted/40
                 aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9]"
    >
      <Image
        src={banner.image}
        alt={banner.title ?? "Hero banner"}
        fill
        priority
        sizes="(max-width: 768px) 100vw, 100vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent p-6 text-white">
        <div className="max-w-sm space-y-3">
          {banner.title && (
            <h3 className="text-2xl font-semibold md:text-3xl">
              {banner.title}
            </h3>
          )}
          {banner.description && (
            <p className="text-sm text-white/80 md:text-base line-clamp-3">
              {banner.description}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function HeroBannerFourProductsPreview({
  title,
  products,
  banners,
}: BentoGridProps) {
  const heroBanner = (banners ?? [])[0];
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

      {/* Hero Banner */}
      <div className="w-full">
        {heroBanner ? (
          <HeroBanner banner={heroBanner} />
        ) : (
          <div className="flex h-48 w-full items-center justify-center rounded-2xl border border-dashed border-muted-foreground/30 text-sm text-muted-foreground">
            No hero banner available.
          </div>
        )}
      </div>

      {/* Four Products Grid */}
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
