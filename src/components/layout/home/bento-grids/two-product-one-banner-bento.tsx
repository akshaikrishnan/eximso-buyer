import Image from "next/image";
import Link from "next/link";

import ProductCard from "@/components/common/product-card";

import type { BentoGridProps, BentoProduct, BentoBanner } from "./types";

function BannerCard({ banner }: { banner: BentoBanner }) {
  return (
    <Link
      href={banner.linkUrl || "#"}
      className="group relative flex h-full w-full overflow-hidden rounded-xl bg-muted/40"
    >
      <Image
        src={banner.image}
        alt={banner.title ?? "Promotional banner"}
        fill
        priority={false}
        sizes="(max-width: 1024px) 100vw, 33vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      {banner.title && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent p-4 text-white">
          <h3 className="text-lg font-semibold">{banner.title}</h3>
          {banner.description && (
            <p className="mt-1 text-sm text-white/80 line-clamp-2">
              {banner.description}
            </p>
          )}
        </div>
      )}
    </Link>
  );
}

export default function TwoProductOneBannerBento({
  title,
  products,
  banners,
}: BentoGridProps) {
  const featuredProducts: BentoProduct[] = (products ?? []).slice(0, 2);
  const primaryBanner = (banners ?? [])[0];

  return (
    <section className="space-y-4">
      {title && (
        <header>
          <h2 className="text-xl font-semibold text-foreground md:text-2xl">
            {title}
          </h2>
        </header>
      )}
      <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="grid gap-4 sm:grid-cols-2">
          {featuredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
          {featuredProducts.length === 0 && (
            <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-muted-foreground/30 text-sm text-muted-foreground">
              No products available.
            </div>
          )}
        </div>
        <div className="min-h-[240px]">
          {primaryBanner ? (
            <BannerCard banner={primaryBanner} />
          ) : (
            <div className="flex h-full min-h-[240px] items-center justify-center rounded-xl border border-dashed border-muted-foreground/30 text-sm text-muted-foreground">
              No banner available.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
