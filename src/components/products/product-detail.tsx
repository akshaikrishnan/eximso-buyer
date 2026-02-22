"use client";

import { Disclosure } from "@headlessui/react";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/20/solid";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api/axios.interceptor";
import { endpoints } from "@/lib/data/endpoints";
import AddToBagBtn from "./add-to-bag";
import AddToWishlistBtn from "./add-to-wishlist";
import { RelatedProduct } from "./related-products";
import { Price } from "../common/price";
import Image from "next/image";
import { useProductReviews } from "@/hooks/use-product-reviews";
import ProductReviews from "./product-reviews";

// 💡 NEW: Dynamic Import for the Product Gallery
import dynamic from "next/dynamic";
import { ProductGalleryPlaceholder } from "./product-carousal"; // Import the placeholder for SSR/Loading state

const ProductGallery = dynamic(() => import("./product-carousal"), {
  ssr: false, // Prevents server-side rendering, ensuring Embla/client-side dependencies are only loaded in the browser
  loading: () => <ProductGalleryPlaceholder />, // Show a nice skeleton during load
});
// ----------------------------------------------------

// --- helpers (inlined so you don't add new files)
function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
function toSlug(s?: string) {
  if (!s) return "";
  return s
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
function pickProducts(payload: any) {
  return payload?.result?.data ?? payload?.data ?? payload ?? [];
}
// ---

export default function ProductDetail({ product }: any) {
  const images: string[] = Array.isArray(product?.images)
    ? product.images
    : product?.thumbnail
    ? [product.thumbnail]
    : [];

  const categoryName: string | undefined =
    product?.category?.name ?? product?.categoryName;
  const subcategoryName: string | undefined =
    product?.subcategory?.name ?? product?.subcategoryName;

  const productId: string | undefined = product?._id ?? product?.id;
  const reviewsQuery = useProductReviews(productId, 6);
  const reviewStats = reviewsQuery.data?.pages?.[0]?.stats;
  const averageRating = reviewStats?.averageRating ?? product?.rating ?? 0;
  const totalReviews = reviewStats?.total ?? product?.reviewCount ?? 0;

  const productDetail = [
    {
      name: "Dimensions",
      data: [
        `Length: ${product?.dimensions?.length ?? "—"} cm`,
        `Width: ${product?.dimensions?.width ?? "—"} cm`,
        `Height: ${product?.dimensions?.height ?? "—"} cm`,
        `Weight: ${product?.dimensions?.weight ?? "—"} kg`,
      ],
    },
    ...(categoryName ? [{ name: "Category", data: [categoryName] }] : []),
    ...(subcategoryName
      ? [{ name: "Sub Category", data: [subcategoryName] }]
      : []),
    ...(product?.brand ? [{ name: "Brand", data: [product.brand] }] : []),
  ] as { name: string; data: string[] }[];

  if (product?.description) {
    productDetail.push({ name: "Description", data: [product.description] });
  }
  if (product?.material) {
    productDetail.push({ name: "Material", data: [product.material] });
  }
  if (product?.countryOfOrigin) {
    productDetail.push({
      name: "Country of Origin",
      data: [product.countryOfOrigin],
    });
  }

  // Use category slug for related products fetch
  const catSlug = toSlug(categoryName);

  const { data: related, isLoading } = useQuery({
    queryKey: ["products", "related", catSlug, product?._id],
    enabled: !!catSlug,
    queryFn: () =>
      api
        .get(endpoints.products, {
          params: {
            category: catSlug,
            limit: 6,
          },
        })
        .then((res) =>
          pickProducts(res.data).filter((p: any) => p._id !== product._id)
        )
        .catch((err) => {
          console.error("Related fetch error:", err);
          return [];
        }),
  });

  const { data: recent, isLoading: recentLoading } = useQuery({
    queryKey: ["products", "recent"],
    queryFn: () =>
      api
        .get(`${endpoints.products}/recent`, {
          params: {
            limit: 10,
          },
        })
        .then((res) =>
          pickProducts(res.data?.items).filter(
            (p: any) => p._id !== product._id
          )
        )
        .catch((err) => {
          console.error("Related fetch error:", err);
          return [];
        }),
  });

  const isOutOfStock =
    product?.stock < product?.minimumOrderQuantity ||
    !product?.isActive ||
    product?.stock <= 0;

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
                      ? `${key === "weight" ? rawValue.toFixed(2) : rawValue} ${unit ?? ""}`.trim()

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
                    <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
                      {priceInfo.isFlashSale ? "Flash Price" : "Price"}
                    </p>
                    <p className="text-4xl font-semibold text-slate-900">
                      <span
                        className={classNames(
                          priceInfo.isFlashSale ? "text-rose-600" : "text-indigo-600",
                        )}
                      >
                        <Price amount={priceInfo.displayPrice} />
                      </span>
                    </p>
                  </div>

                  {priceInfo.discountPercent > 0 && (
                    <div className="flex flex-col items-start gap-2 text-sm text-slate-500 sm:flex-row sm:items-center sm:gap-3">
                      <span className="text-lg text-slate-400 line-through">
                        <Price amount={priceInfo.originalPrice} />
                      </span>
                      <span
                        className={classNames(
                          "inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold",
                          priceInfo.isFlashSale
                            ? "bg-rose-100 text-rose-600"
                            : "bg-red-50 text-red-600",
                        )}
                      >
                        {priceInfo.isFlashSale ? "Flash Deal" : "Save"} {priceInfo.discountPercent}% OFF
                      </span>
                    </div>
                  )}
                </div>

              {/* Reviews & Stock Status */}
              <div className="mt-4 flex items-center justify-between border-b pb-4">
                <div className="flex items-center">
                  <div className="flex items-center">
                    {[0, 1, 2, 3, 4].map((ratingIndex) => (
                      <StarIcon
                        key={ratingIndex}
                        className={classNames(
                          averageRating > ratingIndex
                            ? "text-yellow-400"
                            : "text-gray-300",
                          "h-5 w-5 shrink-0"
                        )}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <a
                    href="#reviews"
                    className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    ({totalReviews} reviews)
                  </a>
                </div>

                <p
                  className={classNames(
                    isOutOfStock ? "text-red-600" : (product?.stock <= 3 ? "text-orange-600" : "text-green-600"),
                    "text-sm font-semibold uppercase"
                  )}
                >
                  {isOutOfStock ? "Out of Stock" : (product?.stock <= 3 ? `Only ${product?.stock} left ` : `In Stock `)}
                </p>
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

            {/* {emiEligibleAmount > 0 && <PayuEmiCard amount={emiEligibleAmount} />} */}
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
                    __html:
                      product?.shortDescription ??
                      "No short description provided.",
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div className="mt-10 flex items-center flex-row gap-4">
                <AddToBagBtn product={product} />
                <AddToWishlistBtn
                  product={product}
                  className="flex-1 rounded-md border border-gray-300 bg-white px-8 py-3 text-base font-medium text-gray-700 hover:bg-gray-100"
                  iconClassName="h-6 w-6"
                />
              </div>

              {/* Detailed Description and Specs */}
              <section aria-labelledby="details-heading" className="mt-12">
                <h2
                  id="details-heading"
                  className="text-2xl font-bold tracking-tight text-gray-900"
                >
                  Product Specifications & Details
                </h2>

                {/* Long Description */}
                <div className="mt-6">
                  <h3 className="sr-only">Detailed Description</h3>
                  <div
                    className="space-y-6 text-base text-gray-700 leading-relaxed border-b pb-6"
                    dangerouslySetInnerHTML={{
                      __html:
                        product?.detailedDescription ??
                        "Full product details coming soon...",
                    }}
                  />
                </div>

                {/* Additional Details (Accordion) */}
                <div className="divide-y divide-gray-200">
                  {productDetail.map((detail) => (
                    <Disclosure
                      as="div"
                      key={detail.name}
                      defaultOpen={detail.name === "Dimensions"}
                    >
                      {({ open }) => (
                        <>
                          <h3 className="mb-0">
                            <Disclosure.Button className="group relative flex w-full items-center justify-between py-4 text-left">
                              <span
                                className={classNames(
                                  open
                                    ? "text-indigo-600 font-semibold"
                                    : "text-gray-900",
                                  "text-lg font-medium transition-colors duration-200"
                                )}
                              >
                                {detail.name}
                              </span>
                              <span className="ml-6 flex items-center">
                                {open ? (
                                  <MinusIcon
                                    className="block h-6 w-6 text-indigo-400 group-hover:text-indigo-500"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <PlusIcon
                                    className="block h-6 w-6 text-gray-400 group-hover:text-gray-500"
                                    aria-hidden="true"
                                  />
                                )}
                              </span>
                            </Disclosure.Button>
                          </h3>
                          <Disclosure.Panel as="div" className="pb-6">
                            <ul
                              role="list"
                              className="list-disc space-y-2 pl-5 text-gray-600 text-sm"
                            >
                              {detail.data.map((item) => (
                                <li key={item} className="text-gray-700">
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  ))}
                </div>
              </section>
            </div>
          </div>

          {/* <hr className="my-16 border-gray-200" /> */}

          <ProductReviews
            productId={productId}
            productName={product?.name}
            reviewsQuery={reviewsQuery}
          />

          <hr className="my-16 border-gray-200" />

          {/* Related Products */}
          {related?.length > 0 && (
            <section aria-labelledby="related-heading" className="mt-10 pb-16">
              <h2
                id="related-heading"
                className="text-2xl font-bold text-gray-900"
              >
                Customers also bought
              </h2>

              {!isLoading && (
                <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-8">
                  {related.map((rp: any) => (
                    <RelatedProduct product={rp} key={rp._id} />
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Recent Products */}
          {recent?.length > 0 && (
            <section aria-labelledby="related-heading" className="mt-10 pb-16">
              <h2
                id="related-heading"
                className="text-2xl font-bold text-gray-900"
              >
                Recently Viewed
              </h2>

              {!recentLoading && (
                <div className="mt-8 gap-x-4 grid grid-cols-2 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-8">
                  {recent.map((rp: any) => (
                    <RelatedProduct
                      product={rp?.product}
                      key={rp?.product?._id}
                    />
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
