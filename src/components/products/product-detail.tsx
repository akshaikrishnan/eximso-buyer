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

// Dummy Reviews Data (for display)
const reviews = [
  {
    id: 1,
    rating: 5,
    title: "Absolutely fantastic!",
    content:
      "The product exceeded my expectations in quality and design. Highly recommend to everyone.",
    author: "Aarav S.",
    date: "September 1, 2024",
  },
  {
    id: 2,
    rating: 4,
    title: "Great value for money.",
    content:
      "A solid purchase, though the color was slightly different than expected from the photos.",
    author: "Priya K.",
    date: "August 28, 2024",
  },
];

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

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="mx-auto  px-4 sm:px-6 py-10 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          {/* Product */}
          <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-12">
            {/* 💡 IMAGE GALLERY: Dynamically Imported Component */}
            <ProductGallery
              images={images?.length ? images : [product?.thumbnail]}
              productName={product?.name}
            />

            {/* Product Info */}
            <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-2">
                {product?.name}
              </h1>

              {/* Price Section */}
              <div className="mt-4 flex items-center space-x-3">
                <h2 className="sr-only">Product information</h2>
                <p className="text-4xl font-semibold tracking-tight text-gray-900">
                  <span className="text-indigo-600">
                    <Price
                      amount={
                        product?.discountPercentage > 0
                          ? product?.offerPrice
                          : product?.price
                      }
                    />
                  </span>
                </p>
                {/* Original Price and Discount Tag */}
                {product?.discountPercentage > 0 && (
                  <>
                    <p className="text-xl text-gray-500 line-through">
                      <Price amount={product?.price} />
                    </p>
                    <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-0.5 text-sm font-medium text-red-800">
                      {product?.discountPercentage}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* Reviews & Stock Status */}
              <div className="mt-4 flex items-center justify-between border-b pb-4">
                <div className="flex items-center">
                  <div className="flex items-center">
                    {[0, 1, 2, 3, 4].map((rating) => (
                      <StarIcon
                        key={rating}
                        className={classNames(
                          (product?.rating ?? 0) > rating
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
                    ({product?.reviewCount ?? 0} reviews)
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

              {/* Short Description */}
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  About This Product
                </h3>
                <div
                  className="space-y-6 text-base text-gray-700 leading-relaxed"
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

          {/* Review Section */}
          {/* <section
            id="reviews"
            aria-labelledby="reviews-heading"
            className="mt-10"
          >
            <h2
              id="reviews-heading"
              className="text-3xl font-bold tracking-tight text-gray-900 mb-6"
            >
              Customer Reviews ({product?.rating ?? "—"} out of 5)
            </h2>
            <div className="space-y-8">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="border p-6 rounded-xl bg-white shadow-xs hover:shadow-md transition duration-300"
                >
                  <div className="flex items-center mb-2">
                    {[0, 1, 2, 3, 4].map((rating) => (
                      <StarIcon
                        key={rating}
                        className={classNames(
                          review.rating > rating
                            ? "text-yellow-500"
                            : "text-gray-300",
                          "h-5 w-5 shrink-0"
                        )}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {review.title}
                  </h3>
                  <p className="text-gray-600 italic mb-3">
                    "{review.content}"
                  </p>
                  <div className="flex justify-between items-center text-sm text-gray-500 border-t pt-2">
                    <span>
                      Reviewed by{" "}
                      <span className="font-medium text-gray-700">
                        {review.author}
                      </span>
                    </span>
                    <span>on {review.date}</span>
                  </div>
                </div>
              ))}
              {reviews.length === 0 && (
                <p className="text-gray-500">
                  Be the first to leave a review for this product!
                </p>
              )}
              <button className="mt-6 w-full sm:w-auto inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700">
                Write a Review
              </button>
            </div>
          </section> */}

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
