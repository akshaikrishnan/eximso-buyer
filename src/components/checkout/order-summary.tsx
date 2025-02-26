import { CartItem, useCart } from "@/hooks/use-cart";
import React, { ReactNode } from "react";
import CartBtn from "../layout/cart/cart-btn";
import { OrderSummary } from "../layout/cart";
import Loader from "../common/loader/loader";

export default function OrderSummaryDetails({
  children,
}: {
  children?: ReactNode;
}) {
  const { cart, isLoading, isError, removeMutation, subTotal } = useCart();
  if (isLoading)
    return (
      <div>
        <Loader />
      </div>
    );
  return (
    <>
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
                    <div className="flex pl-4">
                      <button
                        type="button"
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                        onClick={() => removeMutation.mutate(item.product._id)}
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
      <div className="xl:mt-4">
        <OrderSummary subTotal={subTotal}>{children}</OrderSummary>
      </div>
    </>
  );
}
