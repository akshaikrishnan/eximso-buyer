"use client";

import { Disclosure } from "@headlessui/react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  MinusIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/20/solid";
import {
  ArrowsPointingOutIcon,
  ArrowsRightLeftIcon,
  ArrowsUpDownIcon,
  BuildingStorefrontIcon,
  CubeIcon,
  GlobeAsiaAustraliaIcon,
  MapPinIcon,
  ScaleIcon,
  ShieldCheckIcon,
  SparklesIcon,
  Squares2X2Icon,
  TagIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type SVGProps,
} from "react";

import { useProductReviews } from "@/hooks/use-product-reviews";
import api from "@/lib/api/axios.interceptor";
import { endpoints } from "@/lib/data/endpoints";
import { Price } from "../common/price";
import AddToBagBtn from "./add-to-bag";
import AddToWishlistBtn from "./add-to-wishlist";
import { ProductGalleryPlaceholder } from "./product-carousal";
import { RelatedProduct } from "./related-products";
import ProductReviews from "./product-reviews";

const ProductGallery = dynamic(() => import("./product-carousal"), {
  ssr: false,
  loading: () => <ProductGalleryPlaceholder />,
});

interface ProductDimension {
  length?: number;
  width?: number;
  height?: number;
  weight?: number;
}

interface ProductCategory {
  _id?: string;
  name?: string;
  slug?: string;
}

interface ProductSeller {
  _id?: string;
  name?: string;
  logo?: string;
  country?: string;
}

interface RatingSummary {
  averageRating?: number;
  totalReviews?: number;
  total?: number;
  outOf?: number;
  distribution?: Record<string, number>;
}

export interface ProductShape {
  _id?: string;
  id?: string;
  name: string;
  price: number;
  offerPrice?: number;
  discountPercentage?: number;
  shortDescription?: string;
  detailedDescription?: string;
  tags?: string[];
  keywords?: string[];
  thumbnail?: string;
  images?: string[];
  slug?: string;
  brand?: string;
  manufacturer?: string;
  sku?: string;
  countryOfOrigin?: string;
  category?: ProductCategory;
  subcategory?: ProductCategory;
  seller?: ProductSeller;
  uom?: string;
  minimumOrderQuantity?: number;
  stock?: number;
  dimensions?: ProductDimension;
  isActive?: boolean;
  ratingSummary?: RatingSummary;
  rating?: number;
  reviewCount?: number;
  material?: string;
  description?: string;
  categoryName?: string;
  subcategoryName?: string;
}

interface ProductDetailProps {
  product: ProductShape;
}

interface QuickFact {
  label: string;
  value: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}

interface DimensionHighlight {
  key: keyof ProductDimension;
  label: string;
  unit?: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}

type ProductWithRequiredId = ProductShape & { _id: string };

type ProductEntry = ProductShape | { product?: ProductShape | null | undefined };

type ProductListResponse = {
  result?: { data?: ProductEntry[]; items?: ProductEntry[] };
  data?: ProductEntry[];
  items?: ProductEntry[];
};

const DESCRIPTION_CLAMP_HEIGHT = 512;

function classNames(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

function toSlug(value?: string): string {
  if (!value) return "";
  return value
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function extractProductEntries(payload: unknown): ProductEntry[] {
  if (!payload) return [];

  if (Array.isArray(payload)) {
    return payload as ProductEntry[];
  }

  if (typeof payload === "object") {
    const candidate = payload as ProductListResponse;

    if (candidate.result?.data && Array.isArray(candidate.result.data)) {
      return candidate.result.data;
    }

    if (candidate.result?.items && Array.isArray(candidate.result.items)) {
      return candidate.result.items;
    }

    if (candidate.data && Array.isArray(candidate.data)) {
      return candidate.data;
    }

    if (candidate.items && Array.isArray(candidate.items)) {
      return candidate.items;
    }
  }

  return [];
}

function pickProducts(payload: unknown): ProductWithRequiredId[] {
  return extractProductEntries(payload)
    .map((entry) => {
      if (entry && typeof entry === "object" && "product" in entry) {
        return entry.product ?? null;
      }
      return entry as ProductShape;
    })
    .filter((item): item is ProductWithRequiredId =>
      Boolean(item && typeof item._id === "string" && item._id.trim().length > 0)
    );
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const images = useMemo(() => {
    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images;
    }

    return product.thumbnail ? [product.thumbnail] : [];
  }, [product.images, product.thumbnail]);

  const categoryName = product.category?.name ?? product.categoryName;
  const subcategoryName = product.subcategory?.name ?? product.subcategoryName;
  const categorySlug = product.category?.slug ?? (categoryName ? toSlug(categoryName) : "");
  const subcategorySlug =
    product.subcategory?.slug ?? (subcategoryName ? toSlug(subcategoryName) : "");
  const categoryPath = categorySlug ? `/products/${categorySlug}` : undefined;
  const subcategoryPath =
    categorySlug && subcategorySlug ? `/products/${categorySlug}/${subcategorySlug}` : undefined;
  const productId = product._id ?? product.id;

  const reviewsQuery = useProductReviews(productId, 6);
  const reviewStats = reviewsQuery.data?.pages?.[0]?.stats;
  const fallbackAverage =
    product.ratingSummary?.averageRating ?? product.rating ?? 0;
  const fallbackTotal =
    product.ratingSummary?.totalReviews ??
    product.ratingSummary?.total ??
    product.reviewCount ??
    0;
  const averageRating = reviewStats?.averageRating ?? fallbackAverage;
  const totalReviews = reviewStats?.total ?? fallbackTotal;

  const descriptionRef = useRef<HTMLElement | null>(null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [shouldClampDescription, setShouldClampDescription] = useState(false);

  useEffect(() => {
    setIsDescriptionExpanded(false);
  }, [productId]);

  useEffect(() => {
    const element = descriptionRef.current;

    if (!element) {
      setShouldClampDescription(false);
      return;
    }

    const clampHeight = DESCRIPTION_CLAMP_HEIGHT;

    const updateClampState = () => {
      const requiresClamp = element.scrollHeight > clampHeight;
      setShouldClampDescription(requiresClamp);
    };

    updateClampState();

    if (typeof ResizeObserver === "function") {
      const observer = new ResizeObserver(() => {
        updateClampState();
      });
      observer.observe(element);

      return () => {
        observer.disconnect();
      };
    }

    const timeout = window.setTimeout(updateClampState, 200);
    return () => window.clearTimeout(timeout);
  }, [product.detailedDescription]);

  const tagKeywords = useMemo(() => {
    const items = new Set<string>();

    for (const tag of product.tags ?? []) {
      if (typeof tag === "string" && tag.trim()) {
        items.add(tag.trim());
      }
    }

    for (const keyword of product.keywords ?? []) {
      if (typeof keyword === "string" && keyword.trim()) {
        items.add(keyword.trim());
      }
    }

    return Array.from(items);
  }, [product.keywords, product.tags]);

  const specificationSections = useMemo(() => {
    const sections: Array<{ name: string; data: string[] }> = [];

    if (categoryName) {
      sections.push({ name: "Category", data: [categoryName] });
    }

    if (subcategoryName) {
      sections.push({ name: "Sub Category", data: [subcategoryName] });
    }

    if (product.brand) {
      sections.push({ name: "Brand", data: [product.brand] });
    }

    if (product.description) {
      sections.push({ name: "Description", data: [product.description] });
    }

    if (product.material) {
      sections.push({ name: "Material", data: [product.material] });
    }

    if (product.countryOfOrigin) {
      sections.push({ name: "Country of Origin", data: [product.countryOfOrigin] });
    }

    return sections;
  }, [categoryName, subcategoryName, product.brand, product.countryOfOrigin, product.description, product.material]);

  const quickFacts = useMemo(() => {
    const facts: Array<QuickFact | null> = [
      product.brand
        ? {
            label: "Brand",
            value: product.brand,
            icon: BuildingStorefrontIcon,
          }
        : null,
      product.minimumOrderQuantity
        ? {
            label: "Minimum Order",
            value: `${product.minimumOrderQuantity} ${product.uom ?? "units"}`,
            icon: Squares2X2Icon,
          }
        : null,
      product.sku
        ? {
            label: "SKU",
            value: product.sku,
            icon: TagIcon,
          }
        : null,
      categoryName
        ? {
            label: "Category",
            value: categoryName,
            icon: CubeIcon,
          }
        : null,
      product.seller?.name
        ? {
            label: "Seller",
            value: product.seller.name,
            icon: UsersIcon,
          }
        : null,
      product.manufacturer
        ? {
            label: "Manufacturer",
            value: product.manufacturer,
            icon: ShieldCheckIcon,
          }
        : null,
      product.countryOfOrigin
        ? {
            label: "Origin",
            value: product.countryOfOrigin,
            icon: GlobeAsiaAustraliaIcon,
          }
        : null,
      product.seller?.country
        ? {
            label: "Ships From",
            value: product.seller.country,
            icon: MapPinIcon,
          }
        : null,
    ];

    return facts.filter((fact): fact is QuickFact => fact !== null);
  }, [categoryName, product.brand, product.countryOfOrigin, product.manufacturer, product.minimumOrderQuantity, product.seller?.country, product.seller?.name, product.sku, product.uom]);

  const dimensionHighlights: DimensionHighlight[] = useMemo(
    () => [
      {
        key: "length",
        label: "Length",
        unit: "cm",
        icon: ArrowsRightLeftIcon,
      },
      {
        key: "width",
        label: "Width",
        unit: "cm",
        icon: ArrowsPointingOutIcon,
      },
      {
        key: "height",
        label: "Height",
        unit: "cm",
        icon: ArrowsUpDownIcon,
      },
      {
        key: "weight",
        label: "Weight",
        unit: "kg",
        icon: ScaleIcon,
      },
    ],
    []
  );

  const catSlug = toSlug(categoryName);

  const {
    data: related = [],
    isLoading: relatedLoading,
  } = useQuery<ProductWithRequiredId[]>({
    queryKey: ["products", "related", catSlug, product._id],
    enabled: Boolean(catSlug),
    staleTime: 1000 * 60 * 5,
    queryFn: async () => {
      const response = await api.get<ProductListResponse>(endpoints.products, {
        params: {
          category: catSlug,
          limit: 6,
        },
      });

      return pickProducts(response.data).filter((item) => item._id !== product._id);
    },
  });

  const {
    data: recent = [],
    isLoading: recentLoading,
  } = useQuery<ProductEntry[]>({
    queryKey: ["products", "recent"],
    staleTime: 1000 * 60 * 5,
    queryFn: async () => {
      const response = await api.get<ProductListResponse>(`${endpoints.products}/recent`, {
        params: {
          limit: 10,
        },
      });

      return extractProductEntries(response.data).filter((entry) => {
        const candidate =
          entry && typeof entry === "object" && "product" in entry
            ? entry.product
            : (entry as ProductShape);
        return candidate?._id !== product._id;
      });
    },
  });

  const normalizedRecentProducts: ProductWithRequiredId[] = useMemo(() => {
    return recent
      .map((entry) => {
        if (entry && typeof entry === "object" && "product" in entry) {
          return entry.product ?? null;
        }
        return entry as ProductShape;
      })
      .filter((item): item is ProductWithRequiredId =>
        Boolean(item && typeof item._id === "string" && item._id.trim().length > 0)
      );
  }, [recent]);

  const isOutOfStock =
    (product.stock ?? 0) < (product.minimumOrderQuantity ?? 1) ||
    product.isActive === false ||
    (product.stock ?? 0) <= 0;

  return (
    <div className="bg-gradient-to-b from-slate-50 via-white to-white">
      <main className="mx-auto w-full max-w-none px-4 py-12 sm:px-6 lg:px-10 2xl:px-16">
        <div className="grid gap-10 xl:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] xl:items-start">
          <div className="space-y-8">
            <article className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur">
              <ProductGallery
                images={images.length ? images : [product.thumbnail ?? ""]}
                productName={product.name}
              />
            </article>

            <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-xl font-semibold text-slate-900">Dimensions at a Glance</h2>
                <SparklesIcon className="h-6 w-6 text-indigo-500" aria-hidden="true" />
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {dimensionHighlights.map(({ key, label, unit, icon: Icon }) => {
                  const rawValue = product.dimensions?.[key];
                  const formattedValue =
                    typeof rawValue === "number" && Number.isFinite(rawValue)
                      ? `${rawValue} ${unit ?? ""}`.trim()
                      : "—";

                  return (
                    <div
                      key={key}
                      className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50/60 px-4 py-3"
                    >
                      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </span>
                      <div>
                        <p className="text-sm font-medium text-slate-600">{label}</p>
                        <p className="text-lg font-semibold text-slate-900">{formattedValue}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          <aside className="space-y-8">
            <article className="rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-sm backdrop-blur">
              <header className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                  {categoryName && (
                    categoryPath ? (
                      <Link
                        href={categoryPath}
                        className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                      >
                        <CubeIcon className="h-4 w-4" aria-hidden="true" />
                        {categoryName}
                      </Link>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-3 py-1">
                        <CubeIcon className="h-4 w-4" aria-hidden="true" />
                        {categoryName}
                      </span>
                    )
                  )}
                  {subcategoryName && (
                    subcategoryPath ? (
                      <Link
                        href={subcategoryPath}
                        className="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-indigo-700 transition hover:border-indigo-300 hover:bg-indigo-100"
                      >
                        <Squares2X2Icon className="h-4 w-4" aria-hidden="true" />
                        {subcategoryName}
                      </Link>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-indigo-700">
                        <Squares2X2Icon className="h-4 w-4" aria-hidden="true" />
                        {subcategoryName}
                      </span>
                    )
                  )}
                </div>

                <div>
                  <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">{product.name}</h1>
                  <div
                    className="prose prose-sm mt-3 max-w-none text-base leading-relaxed text-slate-600"
                    dangerouslySetInnerHTML={{
                      __html: product.shortDescription ?? "No short description provided.",
                    }}
                  />
                </div>
              </header>

              <div className="mt-6 flex flex-col gap-4">
                <div className="flex flex-wrap items-end gap-4">
                  <div>
                    <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Price</p>
                    <p className="text-4xl font-semibold text-slate-900">
                      <span className="text-indigo-600">
                        <Price
                          amount={
                            product.discountPercentage && product.discountPercentage > 0
                              ? product.offerPrice ?? product.price
                              : product.price
                          }
                        />
                      </span>
                    </p>
                  </div>

                  {product.discountPercentage && product.discountPercentage > 0 && (
                    <div className="flex items-center gap-3">
                      <span className="text-lg text-slate-400 line-through">
                        <Price amount={product.price} />
                      </span>
                      <span className="inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-sm font-semibold text-red-600">
                        {product.discountPercentage}% OFF
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center">
                      {[0, 1, 2, 3, 4].map((ratingIndex) => (
                        <StarIcon
                          key={ratingIndex}
                          className={classNames(
                            averageRating > ratingIndex ? "text-yellow-400" : "text-slate-300",
                            "h-5 w-5"
                          )}
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                    <a
                      href="#reviews"
                      className="text-sm font-medium text-indigo-600 transition hover:text-indigo-500"
                    >
                      ({totalReviews} reviews)
                    </a>
                  </div>

                  <p
                    className={classNames(
                      isOutOfStock
                        ? "text-red-600"
                        : (product.stock ?? 0) <= 3
                        ? "text-amber-600"
                        : "text-emerald-600",
                      "text-sm font-semibold uppercase tracking-wide"
                    )}
                  >
                    {isOutOfStock
                      ? "Out of Stock"
                      : (product.stock ?? 0) <= 3
                      ? `Only ${product.stock} left`
                      : "In Stock"}
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <AddToBagBtn product={product} />
                  <AddToWishlistBtn product={product} className="sm:flex-1" />
                </div>
              </div>

              {tagKeywords.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Tags</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {tagKeywords.map((tag) => (
                      <Link
                        key={tag}
                        href={`/search?q=${encodeURIComponent(tag)}`}
                        className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-medium uppercase tracking-wide text-indigo-600 transition hover:border-indigo-200 hover:bg-indigo-100 hover:text-indigo-700"
                      >
                        <TagIcon className="h-4 w-4" aria-hidden="true" />
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </article>

            {quickFacts.length > 0 && (
              <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <ShieldCheckIcon className="h-6 w-6 text-indigo-500" aria-hidden="true" />
                  <h2 className="text-lg font-semibold text-slate-900">Quick Facts</h2>
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {quickFacts.map(({ label, value, icon: Icon }) => (
                    <div
                      key={label}
                      className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
                        <p className="text-sm font-medium text-slate-800">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </aside>
        </div>

        <section aria-labelledby="details-heading" className="mt-12 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <SparklesIcon className="h-6 w-6 text-indigo-500" aria-hidden="true" />
            <h2 id="details-heading" className="text-2xl font-semibold text-slate-900">
              Product Story & Specifications
            </h2>
          </div>

          <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
            <div className="flex flex-col">
              <div className="relative">
                <article
                  ref={descriptionRef}
                  className={classNames(
                    "prose prose-slate max-w-none text-base text-slate-700 transition-[max-height] duration-300 ease-in-out",
                    shouldClampDescription && !isDescriptionExpanded
                      ? "max-h-[32rem] overflow-hidden"
                      : ""
                  )}
                  dangerouslySetInnerHTML={{
                    __html: product.detailedDescription ?? "Full product details coming soon...",
                  }}
                />

                {shouldClampDescription && !isDescriptionExpanded && (
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 rounded-b-3xl bg-gradient-to-t from-white/95 via-white/75 to-transparent" />
                )}
              </div>

              {shouldClampDescription && (
                <div className="mt-6 flex justify-center lg:justify-start">
                  <button
                    type="button"
                    onClick={() => setIsDescriptionExpanded((prev) => !prev)}
                    className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-5 py-2 text-sm font-semibold text-indigo-600 transition hover:border-indigo-200 hover:bg-indigo-100"
                  >
                    {isDescriptionExpanded ? "Show less" : "View more"}
                    {isDescriptionExpanded ? (
                      <ChevronUpIcon className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {specificationSections.length === 0 ? (
                <p className="text-sm text-slate-500">Additional specifications will be available soon.</p>
              ) : (
                specificationSections.map((detail) => (
                  <Disclosure
                    as="div"
                    key={detail.name}
                    defaultOpen
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                  >
                    {({ open }) => (
                      <>
                        <Disclosure.Button className="flex w-full items-center justify-between px-4 py-3 text-left">
                          <span
                            className={classNames(
                              open ? "text-indigo-600" : "text-slate-900",
                              "text-sm font-semibold uppercase tracking-wide"
                            )}
                          >
                            {detail.name}
                          </span>
                          {open ? (
                            <MinusIcon className="h-5 w-5 text-indigo-500" aria-hidden="true" />
                          ) : (
                            <PlusIcon className="h-5 w-5 text-slate-400" aria-hidden="true" />
                          )}
                        </Disclosure.Button>
                        <Disclosure.Panel className="border-t border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                          <ul className="list-inside space-y-2">
                            {detail.data.map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                ))
              )}
            </div>
          </div>
        </section>

        <section id="reviews" className="mt-12">
          <ProductReviews productId={productId} productName={product.name} reviewsQuery={reviewsQuery} />
        </section>

        {related.length > 0 && (
          <section aria-labelledby="related-heading" className="mt-16">
            <div className="flex items-center gap-3">
              <SparklesIcon className="h-6 w-6 text-indigo-500" aria-hidden="true" />
              <h2 id="related-heading" className="text-2xl font-semibold text-slate-900">Customers also bought</h2>
            </div>

            {!relatedLoading && (
              <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 auto-rows-fr">
                {related.map((relatedProduct) => (
                  <RelatedProduct product={relatedProduct} key={relatedProduct._id} />
                ))}
              </div>
            )}
          </section>
        )}

        {normalizedRecentProducts.length > 0 && (
          <section aria-labelledby="recent-heading" className="mt-16 pb-12">
            <div className="flex items-center gap-3">
              <SparklesIcon className="h-6 w-6 text-indigo-500" aria-hidden="true" />
              <h2 id="recent-heading" className="text-2xl font-semibold text-slate-900">Recently Viewed</h2>
            </div>

            {!recentLoading && (
              <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 auto-rows-fr">
                {normalizedRecentProducts.map((recentProduct) => (
                  <RelatedProduct product={recentProduct} key={recentProduct._id} />
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
