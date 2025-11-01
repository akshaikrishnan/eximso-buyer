"use client";

import { AnimatePresence, motion, type Transition } from "framer-motion";
import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import {
  HeartIcon as HeartOutline,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";

import { useAddToWishlist } from "@/hooks/use-add-to-wishlist";
import { useWishlist } from "@/hooks/use-wishlist";
import type { ProductShape } from "./product-detail";

interface AddToWishlistBtnProps {
  product: ProductShape;
  className?: string;
  iconClassName?: string;
}

const heartTransition: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 20,
};

export default function AddToWishlistBtn({
  product,
  className,
  iconClassName,
}: AddToWishlistBtnProps) {
  const productId = product._id ?? product.id;
  const { data: wishlistItems = [] } = useWishlist();

  const toggleWishlistMutation = useAddToWishlist({
    _id: product._id!,
    name: product.name,
  });

  const isWishlisted = useMemo(() => {
    if (!productId) return false;
    return wishlistItems.some((item) => {
      const wishId = item.product?._id || item.product?.id || item.id;
      return wishId === productId;
    });
  }, [productId, wishlistItems]);

  const [isActive, setIsActive] = useState(isWishlisted);

  useEffect(() => {
    setIsActive(isWishlisted);
  }, [isWishlisted]);

  const handleToggle = () => {
    if (!productId || toggleWishlistMutation.isPending) return;
    const nextState = !isActive;
    setIsActive(nextState);
    toggleWishlistMutation.mutate(
      { shouldAdd: nextState },
      {
        onError: () => setIsActive((prev) => !prev),
      }
    );
  };

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.96 }}
      whileHover={{ scale: 1.02 }}
      disabled={toggleWishlistMutation.isPending || !productId}
      onClick={handleToggle}
      className={clsx(
        "relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl border px-5 py-3 text-sm font-semibold shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
        isActive
          ? "border-rose-200 bg-rose-50 text-rose-600"
          : "border-rose-100 bg-white text-rose-500 hover:border-rose-200 hover:bg-rose-50",
        toggleWishlistMutation.isPending && "cursor-wait opacity-70",
        className
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isActive && (
          <motion.span
            key="glow"
            className="pointer-events-none absolute inset-0 -z-10 rounded-2xl bg-rose-100"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait" initial={false}>
        {isActive ? (
          <motion.span
            key="heart-solid"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={heartTransition}
            className="relative"
          >
            <HeartSolid
              className={clsx("h-6 w-6 text-rose-500", iconClassName)}
              aria-hidden="true"
            />
            <SparklesIcon
              className="absolute -right-2 -top-2 h-3 w-3 text-amber-400"
              aria-hidden="true"
            />
          </motion.span>
        ) : (
          <motion.span
            key="heart-outline"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={heartTransition}
          >
            <HeartOutline
              className={clsx("h-6 w-6 text-rose-500", iconClassName)}
              aria-hidden="true"
            />
          </motion.span>
        )}
      </AnimatePresence>

      <span className="text-sm font-semibold">
        {toggleWishlistMutation.isPending
          ? "Updating..."
          : isActive
          ? "In Wishlist"
          : "Add to Wishlist"}
      </span>
    </motion.button>
  );
}
