import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function PaymentSuccess() {
  // You would typically get this from your API or URL params
  const orderId = "ORD-12345678";

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
          <div className="text-md text-gray-600 mt-2 font-bold">Order ID: 12345678</div>
          <Link
            href="/"
            className="mt-5 inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}