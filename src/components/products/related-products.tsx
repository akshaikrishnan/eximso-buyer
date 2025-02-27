"use client";
import { useAddToCart } from "@/hooks/use-add-to-cart";
import api from "@/lib/api/axios.interceptor";
import { endpoints } from "@/lib/data/endpoints";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Price } from "../common/price";
import Image from "next/image";
import Link from "next/link";

export function RelatedProduct({ product }: any) {
  const addToCart = useAddToCart(product);

  return (
    <div key={product._id}>
      <div className="relative">
        <Link href={"/" + product.slug}>
          <div className="relative h-72 w-full overflow-hidden rounded-lg">
            <Image
              width={277}
              height={288}
              src={product.thumbnail}
              alt={product.name}
              className="h-full w-full object-cover object-center"
            />
          </div>
          <div className="relative mt-4">
            <h3 className="text-sm font-medium text-gray-900">
              {product.name}
            </h3>
          </div>
          <div className="absolute inset-x-0 top-0 flex h-72 items-end justify-end overflow-hidden rounded-lg p-4">
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black opacity-50"
            />
            <p className="relative text-lg font-semibold text-white">
              <Price amount={product.price} />
            </p>
          </div>
        </Link>
      </div>
      <div className="mt-6">
        <button
          onClick={() => {
            addToCart();
          }}
          className="relative flex w-full items-center justify-center rounded-md border border-transparent bg-gray-100 px-8 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200"
        >
          Add to bag
          <span className="sr-only">, {product.name}</span>
        </button>
      </div>
    </div>
  );
}

export default function RelatedProducts({ product }: any) {
  const { data: related, isLoading } = useQuery({
    queryKey: ["products", product.category._id],
    queryFn: () =>
      api
        .get(endpoints.products, {
          params: {
            category: product.category._id,
            limit: 5,
          },
        })
        .then((res) =>
          res.data.result.data.filter((p: any) => p._id !== product._id)
        )
        .catch((err) => console.log(err)),
  });
  console.log(related);
  return (
    <section
      aria-labelledby="related-heading"
      className="mt-10 border-t border-gray-200 px-4 py-16 sm:px-0"
    >
      <h2 id="related-heading" className="text-xl font-bold text-gray-900">
        Customers also bought
      </h2>

      {!isLoading && (
        <div className="mt-8 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
          {related.map((product: any) => (
            <RelatedProduct product={product} key={product._id} />
          ))}
        </div>
      )}
    </section>
  );
}
