import { StarIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function ProductCard({ product }: any) {
  return (
    <div
      key={product.id}
      className="relative overflow-hidden rounded-lg shadow-lg transition-transform duration-300 ease-in-out hover:shadow-xl hover:-translate-y-2"
    >
      <div className="absolute top-2 left-2 px-2 py-1 rounded-md bg-primary text-white text-xs font-medium bg-gray-600/60">
        {product.label}
      </div>
      <Link href="#" className="absolute inset-0 z-10" prefetch={false}>
        <span className="sr-only">View {product.title}</span>
      </Link>
      <Image
        src={product.image}
        alt={product.title}
        width={400}
        height={400}
        className="object-cover w-full h-64"
      />
      <div className="p-4 bg-background">
        <h3 className="text-md font-semibold">{product.title}</h3>
        <div className="flex items-center gap-2 text-sm">
          <div className="flex items-center gap-0.5">
            <StarIcon className="w-4 h-4 fill-primary" />
            <span>{product.rating}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground line-through text-xs text-gray-500">
              ${product.originalPrice.toFixed(2)}
            </span>
          </div>
        </div>
        <span className="font-semibold">${product.offerPrice.toFixed(2)}</span>
      </div>
    </div>
  );
}
