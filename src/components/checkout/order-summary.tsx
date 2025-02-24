import { CartItem, useCart } from "@/hooks/use-cart";
import React from "react";
import CartBtn from "../layout/cart/cart-btn";

export default function OrderSummary() {
  const { cart, isLoading, isError, removeMutation, subTotal } = useCart();
  return (
    <div className="mx-auto w-full max-w-lg order-1 xl:order-2">
      <h2 className="sr-only">Order summary</h2>

      <div className="flow-root">
        <ul role="list" className="-my-6 divide-y divide-gray-200">
          {cart?.items.map((item: CartItem) => (
            <li key={item.id} className="flex space-x-6 py-6">
              <img
                src={item.product.thumbnail}
                alt={item.product.name}
                className="h-24 w-24 flex-none rounded-md bg-gray-100 object-cover object-center"
              />
              <div className="flex-auto">
                <div className="space-y-1 sm:flex sm:items-start sm:justify-between sm:space-x-6">
                  <div className="flex-auto space-y-1 text-sm font-medium">
                    <h3 className="text-gray-900">
                      <a href={item.product.slug}>{item.product.name}</a>
                    </h3>
                    <p className="text-gray-900">{item.product.price}</p>

                    <p className="hidden text-gray-500 sm:block">
                      <CartBtn product={item} />
                    </p>
                  </div>
                  <div className="flex flex-none space-x-4">
                    <button
                      type="button"
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Edit
                    </button>
                    <div className="flex border-l border-gray-300 pl-4">
                      <button
                        type="button"
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <dl className="mt-10 space-y-6 text-sm font-medium text-gray-500">
        <div className="flex justify-between">
          <dt>Subtotal</dt>
          <dd className="text-gray-900">$104.00</dd>
        </div>
        <div className="flex justify-between">
          <dt>Taxes</dt>
          <dd className="text-gray-900">$8.32</dd>
        </div>
        <div className="flex justify-between">
          <dt>Shipping</dt>
          <dd className="text-gray-900">$14.00</dd>
        </div>
        <div className="flex justify-between border-t border-gray-200 pt-6 text-gray-900">
          <dt className="text-base">Total</dt>
          <dd className="text-base">$126.32</dd>
        </div>
      </dl>
    </div>
  );
}
