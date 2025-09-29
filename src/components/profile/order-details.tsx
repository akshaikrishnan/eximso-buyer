// components/profile/order-details.tsx
"use client";

import Link from "next/link";
import React from "react";
import OrderTracking from "./order-tracking";
import api from "@/lib/api/axios.interceptor";
import { endpoints } from "@/lib/data/endpoints";
import { Price } from "../common/price";
import { useQuery } from "@tanstack/react-query";

type OrderItem = {
  product?: {
    _id?: string;
    name?: string;
    images?: string[];
    thumbnail?: string;
    shortDescription?: string;
    modelNumber?: string;
    discountPercentage?: number;
    price?: number;
    offerPrice?: number;
    orderNumber?: string;

  };
  quantity?: number;
};

type OrderRes = {
  _id: string;
  orderNumber?: string;
  createdAt?: string;
  status?: string;
  user?: { email?: string };
  items: OrderItem[];
  shippingAddress?: any;
  billingAddress?: any;
};

export default function OrderDetails({ orderNumber }: { orderNumber: string }) {

  const {
    data: orderRes,
    isLoading,
    isError,
    error,
  } = useQuery<OrderRes>({
    queryKey: ["orderNumber", orderNumber],
    queryFn: async () => {
      const res = await api.get(`${endpoints.order}/${orderNumber}`);
      // Support both { result: {...} } and direct object
      const data = res?.data?.result ?? res?.data;
      if (!data || typeof data !== "object") {
        throw new Error("Unexpected response shape");
      }
      // console.log("✅ API response successful:", data);
      return data as OrderRes;
    },
    enabled: !!orderNumber,
    retry: (failureCount, err: any) =>
      err?.response?.status && err.response.status >= 400 && err.response.status < 500
        ? false
        : failureCount < 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
  });

  if (isLoading) return <div>Loading...</div>;

  if (isError || !orderRes) {
    // console.log("❌ Error fetching order data:", error);

    const axiosErr = error as any;
    const status = axiosErr?.response?.status;
    const msg =
      axiosErr?.response?.data?.message ||
      axiosErr?.message ||
      "Error fetching order data";
    return (
      <div className="p-4 rounded border border-red-300 bg-red-50 text-red-800">
        <p className="font-semibold">Couldn’t load this order.</p>
        {status ? <p>Status: {status}</p> : null}
        <p>{msg}</p>
      </div>
    );
  }

  const placedOn = orderRes.createdAt
    ? new Date(orderRes.createdAt).toLocaleDateString("en-GB")
    : "Unknown date";

  return (
    <div className="py-14 px-4 md:px-6 2xl:px-6 2xl:container 2xl:mx-auto">
      <div className="flex justify-start item-start space-y-2 flex-col">
        <h1 className="text-3xl dark:text-white lg:text-4xl font-semibold leading-7 lg:leading-9 text-gray-800">
          Order #{orderRes.orderNumber ?? orderRes._id ?? "N/A"}
        </h1>
        <p className="text-base dark:text-gray-300 font-medium leading-6 text-gray-600">
          Placed on : {placedOn}
        </p>
      </div>

      {/* Items */}
      <div className="mt-10">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-4">
          Order Items
        </h2>

        {orderRes.items?.length ? (
          orderRes.items.map((item, index) => {
            const p = item.product || {};
            const imageUrl =
              (p.images && p.images[0]) || p.thumbnail || "https://via.placeholder.com/80";
            const qty = item.quantity || 1;
            const price = p.offerPrice && p.offerPrice > 0 ? p.offerPrice : p.price || 0;
            const originalPrice = p.offerPrice && p.offerPrice > 0 ? p.price : price;

            return (
              <div
                key={p._id || index}
                className="flex flex-col sm:flex-row gap-4 sm:gap-6 border-b py-4"
              >
                {/* Left side: image + name parallel */}
                <div className="flex items-center gap-3 flex-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt={p.name || "Product"}
                    className="h-16 w-16 sm:h-20 sm:w-20 rounded object-cover flex-shrink-0"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "https://via.placeholder.com/80";
                    }}
                  />

                  <div className="min-w-0">
                    <h3 className="text-base sm:text-lg font-semibold dark:text-white break-words">
                      {p.name || "Unknown Product"}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Model: {p.modelNumber || "N/A"}
                    </p>
                    {(p.discountPercentage ?? 0) > 0 && (
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Discount: {p.discountPercentage}%
                      </p>
                    )}

                  </div>
                </div>

                {/* Right side: pricing */}
                <div className="sm:text-right mt-2 sm:mt-0 flex">
                  {/* {originalPrice > price && (
              <p className="text-xs sm:text-sm text-red-400 line-through">
                <Price amount={originalPrice!} />
              </p>
            )} */}
                  {/* <p className="text-base sm:text-lg font-semibold dark:text-white">
              <Price amount={price} />
            </p> */}
                  <p className="text-base dark:text-white">
                    Qty: {qty} &nbsp;  &nbsp; <Price amount={price * qty} />
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <p>No items in this order.</p>
        )}
      </div>


      {/* Tracking & Invoice + Customer/Addresses (your existing JSX kept) */}
      <div className="flex justify-center flex-col md:flex-row items-stretch w-full space-y-4 md:space-y-0 md:space-x-6 xl:space-x-8">
        <div className="flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 dark:bg-gray-800 space-y-6">
          <OrderTracking orderId={orderRes._id} status={orderRes.status} />
          <h3 className="text-xl dark:text-white font-semibold leading-5 text-gray-800">
            Summary
          </h3>
          {/* (Static summary preserved as in your code) */}
          <div className="flex justify-center items-center w-full space-y-4 flex-col border-gray-200 border-b pb-4">
            <div className="flex justify-between w-full">
              <p className="text-base dark:text-white leading-4 text-gray-800">Subtotal</p>
              <p className="text-base dark:text-gray-300 leading-4 text-gray-600">$56.00</p>
            </div>
            <div className="flex justify-between items-center w-full">
              <p className="text-base dark:text-white leading-4 text-gray-800">
                Discount{" "}
                <span className="bg-gray-200 p-1 text-xs font-medium dark:bg-white dark:text-gray-800 leading-3 text-gray-800">
                  STUDENT
                </span>
              </p>
              <p className="text-base dark:text-gray-300 leading-4 text-gray-600">-$28.00 (50%)</p>
            </div>
            <div className="flex justify-between items-center w-full">
              <p className="text-base dark:text-white leading-4 text-gray-800">Shipping</p>
              <p className="text-base dark:text-gray-300 leading-4 text-gray-600">$8.00</p>
            </div>
          </div>
          <div className="flex justify-between items-center w-full">
            <p className="text-base dark:text-white font-semibold leading-4 text-gray-800">Total</p>
            <p className="text-base dark:text-gray-300 font-semibold leading-4 text-gray-600">$36.00</p>
          </div>
        </div>

        <div className="flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 dark:bg-gray-800 space-y-6">
          <h3 className="text-xl dark:text-white font-semibold leading-5 text-gray-800">Shipping</h3>
          <div className="flex justify-between items-start w-full">
            <div className="flex justify-center items-center space-x-4">
              <div className="w-8 h-8">
                <img className="w-full h-full" alt="logo" src="https://i.ibb.co/L8KSdNQ/image-3.png" />
              </div>
              <div className="flex flex-col justify-start items-center">
                <p className="text-lg leading-6 dark:text-white font-semibold text-gray-800">
                  DPD Delivery
                  <br />
                  <span className="font-normal">Delivery with 24 Hours</span>
                </p>
              </div>
            </div>
            <p className="text-lg font-semibold leading-6 dark:text-white text-gray-800">$8.00</p>
          </div>

          <div className="w-full flex justify-center items-center">
            <button className="hover:bg-black dark:bg-white dark:text-gray-800 dark:hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 py-5 w-96 md:w-full bg-gray-800 text-base font-medium leading-4 text-white">
              View Carrier Details
            </button>
          </div>

          <div>
            <h3 className="text-xl dark:text-white font-semibold leading-5 text-gray-800 mb-5">Customer</h3>
            <div className="flex flex-col md:flex-row xl:flex-col justify-start items-stretch h-full w-full md:space-x-6 lg:space-x-8 xl:space-x-0">
              <div className="flex flex-col justify-start items-start flex-shrink-0">
                <div className="flex justify-center text-gray-800 dark:text-white md:justify-start items-center space-x-4 py-4 border-b border-gray-200 w-full">
                  {/* mail icon */}
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M3 7L12 13L21 7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p className="cursor-pointer text-sm leading-5">{orderRes?.user?.email || "N/A"}</p>
                </div>
              </div>

              <div className="flex justify-between xl:h-full items-stretch w-full flex-col mt-6 md:mt-0">
                <div className="flex justify-center md:justify-start xl:flex-col flex-col md:space-x-6 lg:space-x-8 xl:space-x-0 space-y-4 xl:space-y-12 md:space-y-0 md:flex-row items-center md:items-start">
                  {/* Shipping Address */}
                  <div className="flex justify-center md:justify-start items-center md:items-start flex-col space-y-4 xl:mt-8">
                    <p className="text-base dark:text-white font-semibold leading-4 text-center md:text-left text-gray-800">
                      Shipping Address
                    </p>
                    <div className="w-48 lg:w-full dark:text-gray-300 xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600">
                      {orderRes?.shippingAddress ? (
                        <>
                          <p>{orderRes.shippingAddress.addressLine1 || "N/A"}</p>
                          <p>{orderRes.shippingAddress.addressLine2 || ""}</p>
                          <p>
                            {orderRes.shippingAddress.city}, {orderRes.shippingAddress.state}
                          </p>
                          <p>{orderRes.shippingAddress.pincode}</p>
                          <p>{orderRes.shippingAddress.country}</p>
                        </>
                      ) : (
                        <p>N/A</p>
                      )}
                    </div>
                  </div>

                  {/* Billing Address */}
                  <div className="flex justify-center md:justify-start items-center md:items-start flex-col space-y-4">
                    <p className="text-base dark:text-white font-semibold leading-4 text-center md:text-left text-gray-800">
                      Billing Address
                    </p>
                    <div className="w-48 lg:w-full dark:text-gray-300 xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600">
                      {orderRes?.billingAddress ? (
                        <>
                          <p>{orderRes.billingAddress.addressLine1 || "N/A"}</p>
                          <p>{orderRes.billingAddress.addressLine2 || ""}</p>
                          <p>
                            {orderRes.billingAddress.city}, {orderRes.billingAddress.state}
                          </p>
                          <p>{orderRes.billingAddress.pincode}</p>
                          <p>{orderRes.billingAddress.country}</p>
                        </>
                      ) : (
                        <p>N/A</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Invoice link */}
              <div className="flex w-full justify-center items-center md:justify-start md:items-start">
                <Link
                  href={`/profile/my-orders/${orderRes.orderNumber}/invoice`}
                  className="mt-6 md:mt-0 text-center dark:border-white dark:hover:bg-gray-900 
                  dark:bg-transparent dark:text-white py-5 hover:bg-gray-200 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 
                  border border-gray-800 font-medium w-96 2xl:w-full text-base 
                  leading-4 text-gray-800"
                >
                  Download Invoice
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
