import { CartItem, useCart } from "@/hooks/use-cart";
import React, { ReactNode } from "react";
import CartBtn from "../layout/cart/cart-btn";
import { OrderSummary } from "../layout/cart";
import Loader from "../common/loader/loader";
import { Price } from "../common/price";
import { useRouter } from "next/navigation";
import CheckoutBlock from "./block";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";

export default function OrderSummaryDetails({
  children,
}: {
  children?: ReactNode;
}) {
  const { cart, isLoading, isError, removeMutation, subTotal } = useCart();
  const [showCart, setShowCart] = React.useState(false);
  const router = useRouter();
  if (isLoading)
    return (
      <div>
        <Loader />
      </div>
    );
  if (cart?.items?.length === 0) {
    router.push("/cart");
  }
  return (
    <>
      <h2 className="sr-only">Order summary</h2>
      <CheckoutBlock>
        <div
          onClick={() => setShowCart(!showCart)}
          className={clsx(
            "flex items-center justify-between cursor-pointer lg:hidden",
            showCart && "pb-3"
          )}
        >
          <span className="flex items-center gap-2">
            <h4 className="text-lg font-medium text-gray-900">Cart</h4>
            <p className="mt-1 text-sm text-gray-600">
              ({cart?.items?.length} items)
            </p>
          </span>
          <ChevronDown
            className={clsx("transition-transform ", showCart && "rotate-180")}
            size={16}
          />
        </div>
        <div
          className={clsx("flow-root lg:block", showCart ? "block" : "hidden")}
        >
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
                      <p className="text-gray-900">
                        <Price amount={item.product.price} />
                      </p>

                      <p className=" text-gray-500 ">
                        <CartBtn product={item} />
                      </p>
                    </div>
                    <div className="flex flex-none space-x-4">
                      <div className="flex pl-4">
                        <button
                          type="button"
                          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                          onClick={() =>
                            removeMutation.mutate(item.product._id)
                          }
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
      </CheckoutBlock>

      <div id="orderSummary" className="xl:mt-4">
        <OrderSummary subTotal={subTotal}>{children}</OrderSummary>
      </div>
    </>
  );
}
