import { StarIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Price } from "./price";

const getLabel = (product: any) => {
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
  return (
    <div
      key={product._id}
      className="relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 ease-in-out hover:shadow-xl hover:-translate-y-2"
    >
      {getLabel(product) && (
        <div className="absolute top-2 left-2 px-2 py-1 rounded-md bg-primary text-white text-xs font-medium bg-gray-600/60">
          {getLabel(product)}
        </div>
      )}
      <Link
        href={"/" + product.slug}
        className="absolute inset-0 z-10"
        prefetch={false}
      >
        <span className="sr-only">View {product.name}</span>
      </Link>
      <Image
        src={product.thumbnail}
        alt={product.name}
        width={400}
        height={400}
        className=" w-full h-64"
      />
      <div className="p-4 bg-background">
        <h3 className="text-md font-semibold">{product.name}</h3>
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
