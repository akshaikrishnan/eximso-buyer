"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo } from "react";
import {
  CheckIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";

import { useAddToCart } from "@/hooks/use-add-to-cart";
import { useCart } from "@/hooks/use-cart";
import { useUpdateCartQuantity } from "@/hooks/use-update-cart-quantity";
import type { ProductShape } from "./product-detail";

interface AddToBagBtnProps {
  product: ProductShape;
}

function Spinner() {
  return (
    <svg
      className="h-5 w-5 animate-spin text-white"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}

export default function AddToBagBtn({ product }: AddToBagBtnProps) {
  const minimumOrderQuantity = product.minimumOrderQuantity ?? 1;
  const isOutOfStock =
    (product.stock ?? 0) < minimumOrderQuantity ||
    !product.isActive ||
    (product.stock ?? 0) <= 0;

  const addToCartMutation = useAddToCart({
    _id: product._id!,
    name: product.name,
    minimumOrderQuantity,
  });
  const updateCartMutation = useUpdateCartQuantity(product._id ?? "");
  const { cart, removeMutation } = useCart();

  const cartItem = useMemo(
    () => cart?.items?.find((item) => item.product._id === product._id),
    [cart?.items, product._id]
  );

  const isUpdating =
    updateCartMutation.isPending || removeMutation.isPending || false;

  const disableIncrement = Boolean(
    cartItem &&
      product.stock !== undefined &&
      product.stock !== null &&
      cartItem.quantity >= product.stock
  );
  const handleAddToCart = () => {
    if (isOutOfStock || addToCartMutation.isPending) return;
    addToCartMutation.mutate();
  };

  const handleIncrement = () => {
    if (!cartItem || disableIncrement) return;
    updateCartMutation.mutate(cartItem.quantity + 1);
  };

  const handleDecrement = () => {
    if (!cartItem) return;
    if (cartItem.quantity <= minimumOrderQuantity) {
      removeMutation.mutate(product._id!);
      return;
    }
    updateCartMutation.mutate(cartItem.quantity - 1);
  };

  return (
    <div className="flex w-full flex-1">
      <AnimatePresence mode="wait" initial={false}>
        {cartItem ? (
          <motion.div
            key="quantity-controls"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex w-full flex-col justify-between gap-3 rounded-2xl border border-indigo-100 bg-white px-4 py-4 shadow-sm sm:flex-row sm:items-center"
          >
            <div className="flex items-start gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                <CheckIcon className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">In your cart</p>
                <p className="text-xs text-slate-500">
                  MOQ {minimumOrderQuantity}
                  {product.uom ? ` ${product.uom}` : " units"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleDecrement}
                disabled={isUpdating}
                aria-label={
                  cartItem.quantity <= minimumOrderQuantity
                    ? "Remove from cart"
                    : "Decrease quantity"
                }
                className={clsx(
                  "flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-indigo-200 hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
                  (isUpdating || cartItem.quantity <= minimumOrderQuantity) &&
                    "disabled:cursor-not-allowed disabled:opacity-60"
                )}
              >
                <MinusIcon className="h-5 w-5" aria-hidden="true" />
              </button>
              <motion.span
                key={cartItem.quantity}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
                className="min-w-[3rem] text-center text-lg font-semibold text-slate-900"
              >
                {cartItem.quantity}
              </motion.span>
              <button
                type="button"
                onClick={handleIncrement}
                disabled={isUpdating || disableIncrement}
                aria-label="Increase quantity"
                className={clsx(
                  "flex h-10 w-10 items-center justify-center rounded-full border border-indigo-200 bg-indigo-50 text-indigo-600 transition hover:border-indigo-300 hover:bg-indigo-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
                  (isUpdating || disableIncrement) &&
                    "disabled:cursor-not-allowed disabled:opacity-60"
                )}
              >
                <PlusIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            {disableIncrement && (
              <p className="text-xs font-medium text-amber-600">
                Maximum available stock reached
              </p>
            )}
          </motion.div>
        ) : (
          <motion.button
            key="add-button"
            type="button"
            disabled={isOutOfStock || addToCartMutation.isPending}
            onClick={handleAddToCart}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className={clsx(
              "group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 px-6 py-4 text-base font-semibold text-white shadow-lg transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
              !isOutOfStock &&
                "hover:from-indigo-500 hover:via-indigo-600 hover:to-blue-600",
              (isOutOfStock || addToCartMutation.isPending) &&
                "cursor-not-allowed opacity-60"
            )}
          >
            <ShoppingBagIcon className="h-5 w-5" aria-hidden="true" />
            {addToCartMutation.isPending ? (
              <span className="flex items-center gap-2 text-sm font-medium">
                <Spinner />
                Adding to cart...
              </span>
            ) : (
              <span className="text-sm font-semibold uppercase tracking-wide">
                Add to Cart
              </span>
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
