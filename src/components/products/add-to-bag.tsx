"use client";
import React from "react";
import { useAddToCart } from "@/hooks/use-add-to-cart";

export default function AddToBagBtn({ product }: any) {
  const addToCart = useAddToCart(product);
  return (
    <button
      onClick={() => {
        addToCart();
      }}
      className="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
      >
      Add to bag
    </button>
  );
}
