import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function EmptyCart() {
  return (
    <div className="h-[80dvh] grid place-items-center">
      <div className="grid place-items-center">
        <Image
          src="/images/common/empty-cart.svg"
          alt="empty cart"
          width={400}
          height={400}
        />
        <div className="text-center mt-5">
          <div className="text-3xl font-bold">Your cart is empty</div>
          <div className="text-xl text-gray-500">Add items to get started</div>
          <Link
            href="/"
            className="mt-5 inline-block bg-eximblue-500 text-white px-4 py-2 rounded-md"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </div>
  );
}
