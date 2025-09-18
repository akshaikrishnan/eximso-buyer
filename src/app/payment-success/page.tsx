"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "N/A";

  return (
    <div className="h-[80dvh] grid place-items-center">
      <div className="grid place-items-center">
        <Image
          src="/images/common/payment-3.svg"
          alt="Payment Success"
          width={400}
          height={400}
        />
        <div className="text-center mt-5">
          <div className="text-3xl font-bold text-black">Payment Successful!</div>
          <div className="text-xl text-gray-600">Thank you for your purchase.</div>
          <div className="text-md text-gray-600 mt-2 font-bold">Order ID {orderId}</div>
          <Link
            href="/profile/my-orders"
            className="mt-5 inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
          >
            View your order
          </Link>
        </div>
      </div>
    </div>
  );
}