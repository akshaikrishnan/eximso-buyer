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

  const ratingValue =
    product?.ratingSummary?.averageRating ?? product?.rating ?? 0;
  const reviewCount =
    product?.ratingSummary?.totalReviews ??
    product?.reviewCount ??
    product?.ratingSummary?.total ??
    0;
  const normalizedTags = Array.isArray(product?.tags)
    ? product.tags.filter(Boolean)
    : [];
  const sellerName = product?.seller?.name;
  const sellerCountry = product?.seller?.country;
  const quickFacts = (
    [
      {
        label: "Minimum Order",
        value: product?.minimumOrderQuantity
          ? `${product.minimumOrderQuantity} ${product?.uom ?? "units"}`
          : "Flexible",
      },
      {
        label: "Availability",
        value: isOutOfStock
          ? "Out of stock"
          : product?.stock <= 3
          ? `Only ${product?.stock} left`
          : "In stock",
      },
      {
        label: "Country of Origin",
        value: product?.countryOfOrigin ?? "—",
      },
      {
        label: "Brand",
        value: product?.brand ?? "—",
      },
      {
        label: "Seller",
        value: sellerName
          ? sellerCountry
            ? `${sellerName} · ${sellerCountry}`
            : sellerName
          : "—",
      },
      {
        label: "SKU",
        value: product?.sku ?? "—",
      },
    ] as { label: string; value: string }[]
  ).filter((fact) => fact.value && fact.value !== "—");

  return (
    <div className="bg-gradient-to-b from-slate-50 via-white to-white">
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">
            {categoryName ?? "Product"}
          </span>
          {subcategoryName && (
            <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-600">
              {subcategoryName}
            </span>
          )}
          {product?.sku && (
            <span className="text-xs uppercase tracking-wide text-slate-400">
              SKU: {product.sku}
            </span>
          )}
        </div>

        <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,_1.05fr)_minmax(0,_1fr)]">
          <ProductGallery
            images={images?.length ? images : [product?.thumbnail]}
            productName={product?.name}
          />

          <div className="space-y-8">
            <section className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur">
              <div className="flex flex-col gap-4">
                <div className="space-y-3">
                  <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                    {product?.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                      {[0, 1, 2, 3, 4].map((rating) => (
                        <StarIcon
                          key={rating}
                          className={classNames(
                            ratingValue > rating
                              ? "text-amber-400"
                              : "text-slate-200",
                            "h-5 w-5"
                          )}
                          aria-hidden="true"
                        />
                      ))}
                      <span className="font-medium text-slate-700">
                        {ratingValue.toFixed(1)}
                      </span>
                      <a
                        href="#reviews"
                        className="ml-1 text-indigo-600 hover:text-indigo-500"
                      >
                        ({reviewCount} reviews)
                      </a>
                    </div>
                    {sellerName && (
                      <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                        Sold by {sellerName}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-3 rounded-2xl bg-slate-900/95 p-5 text-white shadow-inner">
                  <div className="flex flex-wrap items-end gap-3">
                    <p className="text-4xl font-semibold">
                      <Price
                        amount={
                          product?.discountPercentage > 0
                            ? product?.offerPrice
                            : product?.price
                        }
                      />
                    </p>
                    {product?.discountPercentage > 0 && (
                      <>
                        <span className="text-lg text-slate-300 line-through">
                          <Price amount={product?.price} />
                        </span>
                        <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                          Save {product.discountPercentage}%
                        </span>
                      </>
                    )}
                  </div>
                  <p
                    className={classNames(
                      "text-sm font-semibold uppercase tracking-wide",
                      isOutOfStock
                        ? "text-rose-200"
                        : product?.stock <= 3
                        ? "text-amber-200"
                        : "text-emerald-200"
                    )}
                  >
                    {isOutOfStock
                      ? "Currently unavailable"
                      : product?.stock <= 3
                      ? `Hurry! Only ${product?.stock} left`
                      : "Ready to ship"}
                  </p>
                </div>

                <div className="space-y-3 text-sm leading-relaxed text-slate-600">
                  <div
                    dangerouslySetInnerHTML={{
                      __html:
                        product?.shortDescription ??
                        "No short description provided.",
                    }}
                  />
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <AddToBagBtn product={product} />
                  <AddToWishlistBtn
                    product={product}
                    className="flex-1 rounded-xl border border-slate-300 bg-white px-6 py-3 text-base font-medium text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50"
                    iconClassName="h-6 w-6"
                  />
                </div>
              </div>
            </section>

            {quickFacts.length > 0 && (
              <section className="rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur">
                <h2 className="text-lg font-semibold text-slate-900">
                  Quick Facts
                </h2>
                <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {quickFacts.map((fact) => (
                    <div
                      key={fact.label}
                      className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4"
                    >
                      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        {fact.label}
                      </dt>
                      <dd className="mt-1 text-sm font-medium text-slate-800">
                        {fact.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}

            {normalizedTags.length > 0 && (
              <section className="rounded-3xl border border-dashed border-indigo-200 bg-indigo-50/60 p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-indigo-700">
                  Tags & keywords
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {normalizedTags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-medium text-indigo-600 shadow-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </section>
            )}

            <section
              aria-labelledby="details-heading"
              className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur"
            >
              <h2
                id="details-heading"
                className="text-xl font-semibold tracking-tight text-slate-900"
              >
                Product specifications & details
              </h2>

              <div className="mt-4 space-y-6 text-sm leading-relaxed text-slate-600">
                <div
                  className="border border-slate-100/70 bg-slate-50/70 p-4 rounded-2xl"
                  dangerouslySetInnerHTML={{
                    __html:
                      product?.detailedDescription ??
                      "Full product details coming soon...",
                  }}
                />

                <div className="divide-y divide-slate-200">
                  {productDetail.map((detail) => (
                    <Disclosure
                      as="div"
                      key={detail.name}
                      defaultOpen={detail.name === "Dimensions"}
                    >
                      {({ open }) => (
                        <div>
                          <Disclosure.Button className="flex w-full items-center justify-between py-4 text-left">
                            <span
                              className={classNames(
                                "text-base font-medium transition-colors duration-200",
                                open ? "text-indigo-600" : "text-slate-800"
                              )}
                            >
                              {detail.name}
                            </span>
                            <span className="ml-4 flex items-center">
                              {open ? (
                                <MinusIcon
                                  className="h-6 w-6 text-indigo-400"
                                  aria-hidden="true"
                                />
                              ) : (
                                <PlusIcon
                                  className="h-6 w-6 text-slate-300"
                                  aria-hidden="true"
                                />
                              )}
                            </span>
                          </Disclosure.Button>
                          <Disclosure.Panel className="pb-4">
                            <ul className="list-disc space-y-2 pl-5 text-sm text-slate-600">
                              {detail.data.map((item) => (
                                <li key={item}>{item}</li>
                              ))}
                            </ul>
                          </Disclosure.Panel>
                        </div>
                      )}
                    </Disclosure>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>

        <div className="mt-16 space-y-16">
          {related?.length > 0 && (
            <section aria-labelledby="related-heading">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2
                  id="related-heading"
                  className="text-2xl font-semibold text-slate-900"
                >
                  Customers also bought
                </h2>
                <span className="text-sm text-slate-500">
                  Curated based on category insights
                </span>
              </div>

              {!isLoading && (
                <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-8">
                  {related.map((rp: any) => (
                    <RelatedProduct product={rp} key={rp._id} />
                  ))}
                </div>
              )}
            </section>
          )}

          {recent?.length > 0 && (
            <section aria-labelledby="recent-heading">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2
                  id="recent-heading"
                  className="text-2xl font-semibold text-slate-900"
                >
                  Recently viewed
                </h2>
                <span className="text-sm text-slate-500">
                  Continue exploring where you left off
                </span>
              </div>

              {!recentLoading && (
                <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-8">
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
