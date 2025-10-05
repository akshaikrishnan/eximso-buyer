"use client";
import Loader from "@/components/common/loader/loader";
import EmptyCart from "./empty-cart";
import { useCart } from "@/hooks/use-cart";
import { CartItem } from "./cart-item";
import {
  CheckIcon,
  ClockIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/20/solid";
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
}: {
  subTotal: number;
  isAnyOfItemsOutOfStock?: boolean;
  children?: ReactNode;
}) {
  return (
    <section className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8 lg:sticky top-5">
      <h2 className="text-lg font-medium text-gray-900">Order summary</h2>
      <dl className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <dt className="text-sm text-gray-600">Subtotal</dt>
          <dd className="text-sm font-medium text-gray-900">
            <Price amount={subTotal} />
          </dd>
        </div>
        <ShippingEstimate />
        <TaxEstimate subTotal={subTotal} />
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <dt className="text-base font-medium text-gray-900">Order total</dt>
          <dd className="text-base font-medium text-gray-900">
            <Price
              amount={Math.ceil(
                subTotal +
                  subTotal * 0.05 +
                  (Number(process.env.shippingesstimate) || 40)
              )}
            />
          </dd>
        </div>
      </dl>
      {children ? (
        children
      ) : (
        <CheckoutButton disabled={isAnyOfItemsOutOfStock} />
      )}
    </section>
  );
}

function ShippingEstimate() {
  return (
    <div className="flex items-center justify-between border-t border-gray-200 pt-4">
      <dt className="flex items-center text-sm text-gray-600">
        <span>Shipping estimate</span>
        <a
          href="#"
          className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-500"
        >
          <QuestionMarkCircleIcon className="h-5 w-5" aria-hidden="true" />
        </a>
      </dt>
      <dd className="text-sm font-medium text-gray-900">
        <Price amount={40} />
      </dd>
    </div>
  );
}

function TaxEstimate({ subTotal }: { subTotal: number }) {
  return (
    <div className="flex items-center justify-between border-t border-gray-200 pt-4">
      <dt className="flex text-sm text-gray-600">
        <span>Tax estimate</span>
        <a
          href="#"
          className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-500"
        >
          <QuestionMarkCircleIcon className="h-5 w-5" aria-hidden="true" />
        </a>
      </dt>
      <dd className="text-sm font-medium text-gray-900">
        <Price amount={subTotal * 0.05} />
      </dd>
    </div>
  );
}

function CheckoutButton({ disabled = false }: { disabled: boolean }) {
  return (
    <div className="mt-6">
      <Link
        href={disabled ? "#" : "/checkout"}
        title={
          disabled ? "Please remove out of stock items" : "Proceed to Checkout"
        }
        className={clsx(
          "w-full rounded-md border inline-block text-center border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50",
          disabled && "cursor-not-allowed bg-gray-400 hover:bg-gray-400"
        )}
      >
        Checkout
      </Link>
    </div>
  );
}
