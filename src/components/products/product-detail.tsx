"use client";

import {
  Disclosure,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
} from "@headlessui/react";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/20/solid";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api/axios.interceptor";
import { endpoints } from "@/lib/data/endpoints";
import AddToBagBtn from "./add-to-bag";
import AddToWishlistBtn from "./add-to-wishlist";
import { RelatedProduct } from "./related-products";
import { Price } from "../common/price";

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

// --- helpers (inlined so you don't add new files)
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
    ...(subcategoryName ? [{ name: "Sub Category", data: [subcategoryName] }] : []),
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

  // ✅ FIX: use category slug (backend expects slug, not ObjectId)
  const catSlug = toSlug(categoryName);

  const { data: related, isLoading } = useQuery({
    queryKey: ["products", "related", catSlug, product?._id],
    enabled: !!catSlug,
    queryFn: () =>
      api
        .get(endpoints.products, {
          params: {
            category: catSlug, // <-- slug, not _id
            limit: 4,
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

  return (
    <div className="bg-white">
      <main className="mx-auto max-w-7xl sm:px-6 sm:pt-16 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          {/* Product */}
          <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
            {/* Image gallery */}
            <Tab.Group as="div" className="flex flex-col-reverse lg:sticky top-10">
              {/* Image selector */}
              <div className="mx-auto mt-6 w-full max-w-2xl sm:block lg:max-w-none">
                <TabList className="grid grid-cols-4 gap-6">
                  {images.map((image: string, index: number) => (
                    <Tab
                      key={index}
                      className="relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-4"
                    >
                      {({ selected }) => (
                        <>
                          <span className="absolute inset-0 overflow-hidden rounded-md flex items-center justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={image}
                              alt={product?.name ?? "Product image"}
                              className="max-h-full max-w-full object-contain"
                            />
                          </span>
                          <span
                            className={classNames(
                              selected ? "ring-indigo-500" : "ring-transparent",
                              "pointer-events-none absolute inset-0 rounded-md ring-2 ring-offset-2"
                            )}
                            aria-hidden="true"
                          />
                        </>
                      )}
                    </Tab>
                  ))}
                </TabList>
              </div>

              <TabPanels className="w-full">
                {images.map((image: string, idx: number) => (
                  <TabPanel key={idx} className="flex justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image}
                      alt={product?.name ?? "Product image"}
                      className="max-w-full max-h-[80vh] object-contain sm:rounded-lg"
                    />
                  </TabPanel>
                ))}
              </TabPanels>
            </Tab.Group>

            {/* Product info */}
            <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                {product?.name}
              </h1>

              <div className="mt-3">
                <h2 className="sr-only">Product information</h2>
                <p className="text-3xl tracking-tight text-gray-900">
                  <span className="text-red-600">
                    {product?.discountPercentage > 0 &&
                      product?.discountPercentage + "%"}
                  </span>{" "}
                  <Price
                    amount={
                      product?.discountPercentage > 0
                        ? product?.offerPrice
                        : product?.price
                    }
                  />
                </p>
                {product?.discountPercentage > 0 && (
                  <p className="text-sm">
                    M.R.P :{" "}
                    <del>
                      <Price amount={product?.price} />
                    </del>
                  </p>
                )}
              </div>

              {/* Reviews */}
              <div className="mt-3">
                <h3 className="sr-only">Reviews</h3>
                <div className="flex items-center">
                  <div className="flex items-center">
                    {[0, 1, 2, 3, 4].map((rating) => (
                      <StarIcon
                        key={rating}
                        className={classNames(
                          (product?.rating ?? 0) > rating
                            ? "text-indigo-500"
                            : "text-gray-300",
                          "h-5 w-5 flex-shrink-0"
                        )}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <p className="sr-only">{product?.rating} out of 5 stars</p>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="sr-only">Description</h3>
                <div
                  className="space-y-6 text-base text-gray-700"
                  dangerouslySetInnerHTML={{
                    __html: product?.shortDescription ?? "",
                  }}
                />
              </div>

              <div className="mt-6">
                <div className="mt-10 flex ">
                  <AddToBagBtn product={product} />
                  <button
                    type="button"
                    className="ml-4 flex items-center justify-center rounded-md px-3 py-3 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                  >
                    <AddToWishlistBtn
                      product={product}
                      className="ml-4 w-12 h-12 flex items-center justify-center"
                    />
                    <span className="sr-only">Add to favorites</span>
                  </button>
                </div>
              </div>

              <section aria-labelledby="details-heading" className="mt-12">
                <h2 id="details-heading" className="sr-only">
                  Additional details
                </h2>
                <div className="mt-6">
                  <h3 className="sr-only">Description</h3>
                  <div
                    className="space-y-6 text-base text-gray-700"
                    dangerouslySetInnerHTML={{
                      __html: product?.detailedDescription ?? "",
                    }}
                  />
                </div>

                <div className="py-6 mt-4 border-dashed border-t-2 border-gray-200">
                  <h3 className="text-md font-medium text-gray-900">
                    Additional Details
                  </h3>
                </div>
                <div className="divide-y divide-gray-200 border-t">
                  {productDetail.map((detail) => (
                    <Disclosure as="div" key={detail.name}>
                      {({ open }) => (
                        <>
                          <h3>
                            <Disclosure.Button className="group relative flex w-full items-center justify-between py-6 text-left">
                              <span
                                className={classNames(
                                  open ? "text-indigo-600" : "text-gray-900",
                                  "text-sm font-medium"
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
                          <Disclosure.Panel
                            as="div"
                            className="prose prose-sm pb-6"
                          >
                            <ul role="list">
                              {detail.data.map((item) => (
                                <li key={item}>{item}</li>
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

          {related?.length > 0 && (
            <section
              aria-labelledby="related-heading"
              className="mt-10 border-t border-gray-200 px-4 py-16 sm:px-0"
            >
              <h2
                id="related-heading"
                className="text-xl font-bold text-gray-900"
              >
                Customers also bought
              </h2>

              {!isLoading && (
                <div className="mt-8 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
                  {related.map((rp: any) => (
                    <RelatedProduct product={rp} key={rp._id} />
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
