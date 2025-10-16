import { StarIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Price } from "./price";

const getLabel = (product: any) => {
  // Check for out of stock first
  const isOutOfStock =
    product?.stock < product?.minimumOrderQuantity ||
    !product?.isActive ||
    product?.stock <= 0;
  if (isOutOfStock) {
    return "Out of Stock";
  }

  if (product.label) return product.label;
  const inputDate = new Date(product.createdAt);

  // Get today's date
  const today = new Date();

  // Calculate the difference in milliseconds
  const timeDiff = today.getTime() - inputDate.getTime();

  // Convert milliseconds to days
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

  // If the difference is within a week (7 days), return "new"
  if (daysDiff <= 7) {
    return "New Launch";
  }

  const priceDifference = product.price - product.offerPrice;

  // Calculate 40% of the original price
  const fortyPercent = product.price * 0.4;

  // If the difference is greater than 40%, return "Offer"
  if (priceDifference > fortyPercent) {
    return "Offer";
  } else {
    return null;
  }
};

export default function ProductCard({ product }: any) {
  const isOutOfStock =
    product?.stock < product?.minimumOrderQuantity ||
    !product?.isActive ||
    product?.stock <= 0;

  return (
    <div
      key={product._id}
      className={`relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 ease-in-out ${
        isOutOfStock
          ? "opacity-50 cursor-not-allowed"
          : "hover:shadow-xl hover:-translate-y-2"
      }`}
    >
      {isOutOfStock && (
        <div className="absolute top-2 left-2 px-2 py-1 rounded-md bg-red-600 text-white text-xs font-medium z-20 shadow-lg">
          Out of Stock
        </div>
      )}
      {getLabel(product) && !isOutOfStock && (
        <div className="absolute top-2 left-2 px-2 py-1 rounded-md bg-gray-600/60 text-white text-xs font-medium z-20">
          {getLabel(product)}
        </div>
      )}
      {isOutOfStock && (
        <div className="absolute inset-0 bg-white-500/50 z-10 rounded-lg"></div>
      )}
      <Link
        href={"/" + product.slug}
        className="absolute inset-0 z-10"
        prefetch={false}
      >
        <span className="sr-only">View {product.name}</span>
      </Link>

      {/* Responsive image container */}
      <div className="relative w-full bg-gray-50" style={{ height: "200px" }}>
        <Image
          src={product.thumbnail}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-contain p-2"
          priority={false}
        />
      </div>

      <div className="p-4 bg-background">
        <h3 className="text-md font-semibold line-clamp-1">{product.name}</h3>
        <div className="flex items-center gap-2 text-sm">
          <div className="flex items-center gap-0.5">
            <StarIcon className="w-4 h-4 fill-primary" />
            <span>{product.rating}</span>
          </div>
          <div className="flex items-center gap-2">
            {product.offerPrice && (
              <span className="text-muted-foreground line-through text-xs text-gray-500">
                <Price amount={product.price} />
              </span>
            )}
          </div>
        </div>
        <span className="font-semibold">
          <Price
            amount={product.offerPrice ? product.offerPrice : product.price}
          />
        </span>
      </div>
    </div>
  );
}
