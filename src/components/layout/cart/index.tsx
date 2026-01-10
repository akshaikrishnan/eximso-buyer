"use client";
import Loader from "@/components/common/loader/loader";
import EmptyCart from "./empty-cart";
import { useCart } from "@/hooks/use-cart";
import { CartItem } from "./cart-item";
import Link from "next/link";
import { ReactNode } from "react";
import { Price } from "@/components/common/price";
import clsx from "clsx";

export default function Cart() {
  const { cart, isLoading, isError, removeMutation, subTotal } = useCart();
  const isAnyOfItemsOutOfStock = cart?.items?.some(
    (item: any) => item.product.stock <= 0
  );

  if (isLoading) return <Loader fullScreen />;
  if (cart?.items?.length === 0 || isError || !cart) return <EmptyCart />;

  return (
    <div className="bg-white">
      <div className="mx-auto container px-4 pb-24 pt-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Shopping Cart
        </h1>
        <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <section aria-labelledby="cart-heading" className="lg:col-span-7">
            <h2 id="cart-heading" className="sr-only">
              Items in your shopping cart
            </h2>
            <ul className="divide-y divide-gray-200 border-b border-t border-gray-200">
              {cart.items.map((item) => (
                <CartItem
                  key={item.id}
                  item={{ ...item, inStock: item.product.stock > 0 }}
                  onRemove={removeMutation.mutate}
                />
              ))}
            </ul>
          </section>

          <OrderSummary
            subTotal={subTotal}
            isAnyOfItemsOutOfStock={isAnyOfItemsOutOfStock}
            itemCount={cart.items.length}
            cart={cart}
          />
        </form>
      </div>
    </div>
  );
}

export function OrderSummary({
  subTotal,
  children,
  isAnyOfItemsOutOfStock = false,
  itemCount = 0,
  cart,
  checkoutInfo,
  isCheckoutInfoLoading = false,
}: {
  subTotal: number;
  isAnyOfItemsOutOfStock?: boolean;
  children?: ReactNode;
  itemCount?: number;
  cart?: any;
  checkoutInfo?: any;
  isCheckoutInfoLoading?: boolean;
}) {
  // Calculate total regular price (sum of all product prices)
  const totalPrice =
    cart?.items?.reduce((acc: number, item: any) => {
      const regularPrice = item.product?.price || 0;
      const qty = item.quantity || 1;
      return acc + regularPrice * qty + (checkoutInfo?.shippingAmount || 100);
    }, 0) || subTotal;

  // Calculate total discount
  const totalDiscount = totalPrice - subTotal;

  const shippingEstimate = Number(checkoutInfo?.shippingAmount) || 100;
  const taxAmount = subTotal * 0.05;
  const orderTotal = Math.ceil(subTotal + taxAmount + shippingEstimate);

  return (
    <section className="mt-16 lg:col-span-5 lg:mt-0 lg:sticky top-5">
      <div className="flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 dark:bg-gray-800 space-y-6 rounded-lg">
        <h3 className="text-2xl dark:text-white font-bold leading-7 text-gray-800">
          Summary
        </h3>

        <div className="flex justify-center items-center w-full space-y-4 flex-col pb-4">
          <div className="flex justify-between items-center w-full">
            <p className="text-base dark:text-white leading-5 text-gray-800">
              Price ({itemCount} {itemCount === 1 ? "item" : "items"})
            </p>
            <p className="text-base dark:text-gray-300 leading-5 text-gray-600">
              <Price amount={totalPrice} />
            </p>
          </div>

          {totalDiscount > 0 && (
            <div className="flex justify-between items-center w-full">
              <p className="text-base dark:text-white leading-5 text-gray-800">
                Discount
              </p>
              <p className="text-base dark:text-green-400 leading-5 text-green-600 font-medium">
                - <Price amount={totalDiscount} />
              </p>
            </div>
          )}

          <div className="flex justify-between items-center w-full">
            <p className="text-base dark:text-white leading-5 text-gray-800">
              Shipping Amount
            </p>
            <p className="text-base dark:text-gray-300 leading-5 text-gray-600">
              <Price
                amount={shippingEstimate}
                isLoadingExternal={isCheckoutInfoLoading}
              />
            </p>
          </div>

          <div className="flex justify-between items-center w-full">
            <p className="text-base dark:text-white leading-5 text-gray-800">
              Tax Amount
            </p>
            <p className="text-base dark:text-gray-300 leading-5 text-gray-600">
              <Price amount={taxAmount} />
            </p>
          </div>
        </div>

        <div className="border-t-2 border-gray-200 dark:border-gray-600 pt-4">
          <div className="flex justify-between items-center w-full">
            <p className="text-lg dark:text-white font-bold leading-5 text-gray-800">
              Total Amount
            </p>
            <p className="text-lg dark:text-white font-bold leading-5 text-gray-800">
              <Price
                amount={orderTotal}
                isLoadingExternal={isCheckoutInfoLoading}
                className=""
              />
            </p>
          </div>
        </div>

        {children ? (
          children
        ) : (
          <CheckoutButton disabled={isAnyOfItemsOutOfStock} />
        )}

        {totalDiscount > 0 && (
          <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-green-600 dark:text-green-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-sm font-medium text-green-700 dark:text-green-300">
                You&apos;ll save <Price amount={totalDiscount} /> on this order!
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function CheckoutButton({ disabled = false }: { disabled: boolean }) {
  return (
    <div className="w-full">
      <Link
        href={disabled ? "#" : "/checkout"}
        title={
          disabled ? "Please remove out of stock items" : "Proceed to Checkout"
        }
        className={clsx(
          "w-full inline-block text-center py-5 text-base font-medium leading-4",
          disabled
            ? "cursor-not-allowed bg-gray-400 text-white"
            : "w-full rounded-md border inline-block text-center border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-xs hover:bg-indigo-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50",
          disabled && "cursor-not-allowed bg-gray-400 hover:bg-gray-400"
        )}
      >
        Checkout
      </Link>
    </div>
  );
}
