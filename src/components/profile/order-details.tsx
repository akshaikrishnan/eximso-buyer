"use client";

import Link from "next/link";
import React from "react";
import OrderTracking from "./order-tracking";
import api from "@/lib/api/axios.interceptor";
import { endpoints } from "@/lib/data/endpoints";
import { Price } from "../common/price";
import { useQuery, useQueries } from "@tanstack/react-query";
import ReviewManager from "@/components/reviews/review-manager";

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
    slug?: string;
  };
  quantity?: number;
};

type ConnectedOrder = {
  _id: string;
  orderNumber?: string;
  createdAt?: string;
};

type OrderRes = {
  _id: string;
  orderNumber?: string;
  createdAt?: string;
  status?: string;
  orderTotal?: number;
  shippingPrice?: number;
  shippingAmount?: number;
  taxAmount?: number;
  totalAmount?: number;
  itemsTotal?: number;
  user?: { email?: string };
  items: OrderItem[];
  shippingAddress?: any;
  billingAddress?: any;
  // shippingMethod can be a simple string or an object with a title
  shippingMethod?: string | { title?: string; icon?: string };
  connectedOrders?: ConnectedOrder[];
  paymentMethod?: {
    _id?: string;
    name?: string;
    image?: string;
    apiUrl?: string;
    slug?: string;
    description?: string;
    isActive?: boolean;
    isDelete?: boolean;
  };
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

      const data = res?.data?.result ?? res?.data;
      if (!data || typeof data !== "object") {
        throw new Error("Unexpected response shape");
      }
      return data as OrderRes;
    },
    enabled: !!orderNumber,
    retry: (failureCount, err: any) =>
      err?.response?.status &&
      err.response.status >= 400 &&
      err.response.status < 500
        ? false
        : failureCount < 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
  });

  // Fetch connected orders data
  const connectedOrdersQueries = useQueries({
    queries: (orderRes?.connectedOrders || []).map((connectedOrder) => ({
      queryKey: [
        "connectedOrder",
        connectedOrder.orderNumber || connectedOrder._id,
      ],
      queryFn: async () => {
        const res = await api.get(
          `${endpoints.order}/${
            connectedOrder.orderNumber || connectedOrder._id
          }`
        );
        const data = res?.data?.result ?? res?.data;
        return data as OrderRes;
      },
      enabled: !!(
        orderRes?.connectedOrders && orderRes.connectedOrders.length > 0
      ),
    })),
  });

  if (isLoading) return <div>Loading...</div>;

  if (isError || !orderRes) {
    const axiosErr = error as any;
    const status = axiosErr?.response?.status;
    const msg =
      axiosErr?.response?.data?.message ||
      axiosErr?.message ||
      "Error fetching order data";
    return (
      <div className="p-4 rounded border border-red-300 bg-red-50 text-red-800">
        <p className="font-semibold">Couldn&apos;t load this order.</p>
        {status ? <p>Status: {status}</p> : null}
        <p>{msg}</p>
      </div>
    );
  }
  const placedOn = orderRes.createdAt
    ? new Date(orderRes.createdAt).toLocaleDateString("en-GB")
    : "Unknown date";

  // ----- Dynamic calculation -----
  // Check if there are connected orders
  const hasConnectedOrders =
    orderRes.connectedOrders && orderRes.connectedOrders.length > 0;

  // Calculate total regular price (sum of all product prices)
  const totalPrice =
    orderRes.items?.reduce((acc, item) => {
      const regularPrice = item.product?.price || 0;
      const qty = item.quantity || 1;
      return acc + regularPrice * qty;
    }, 0) || 0;

  // Calculate subtotal (after applying offer prices)
  const subtotal =
    orderRes.items?.reduce((acc, item) => {
      const offerPrice = item.product?.offerPrice || 0;
      const regularPrice = item.product?.price || 0;
      const finalPrice = offerPrice > 0 ? offerPrice : regularPrice;
      const qty = item.quantity || 1;
      return acc + finalPrice * qty;
    }, 0) || 0;

  // Calculate total discount (difference between regular price and offer price)
  let totalDiscount = totalPrice - subtotal;

  // Calculate display price and discount from connected orders if they exist
  let displayPrice = orderRes.itemsTotal ?? subtotal;

  if (hasConnectedOrders) {
    // Sum up all regular prices from connected orders
    const connectedOrdersTotalPrice = connectedOrdersQueries.reduce(
      (acc, query) => {
        if (query.data?.items) {
          const orderPrice = query.data.items.reduce((itemAcc, item) => {
            const regularPrice = item.product?.price || 0;
            const qty = item.quantity || 1;
            return itemAcc + regularPrice * qty;
          }, 0);
          return acc + orderPrice;
        }
        return acc;
      },
      0
    );

    // Sum up all offer prices from connected orders (only actual offer prices)
    const connectedOrdersOfferPrice = connectedOrdersQueries.reduce(
      (acc, query) => {
        if (query.data?.items) {
          const orderOfferPrice = query.data.items.reduce((itemAcc, item) => {
            const offerPrice = item.product?.offerPrice || 0;
            const qty = item.quantity || 1;
            return itemAcc + offerPrice * qty;
          }, 0);
          return acc + orderOfferPrice;
        }
        return acc;
      },
      0
    );

    displayPrice = connectedOrdersTotalPrice;
    totalDiscount = connectedOrdersTotalPrice - connectedOrdersOfferPrice;
  }

  const shipping = orderRes.shippingAmount ?? orderRes.shippingPrice ?? 0;
  const tax = orderRes.taxAmount ?? 0;
  const total =
    orderRes.totalAmount ?? orderRes.orderTotal ?? subtotal + shipping + tax;

  return (
    <div className="py-14 px-4 md:px-6 2xl:px-6 2xl:container 2xl:mx-auto">
      {/* Header */}
      <div className="flex justify-start item-start space-y-2 flex-col">
        <h1 className="text-3xl dark:text-white lg:text-4xl font-semibold leading-7 lg:leading-9 text-gray-800">
          Order #{orderRes.orderNumber ?? orderRes._id ?? "N/A"}
        </h1>
        <p className="text-base dark:text-gray-300 font-medium leading-6 text-gray-600">
          Placed on : {placedOn}
        </p>
      </div>

      {/* Connected Orders */}
      {orderRes.connectedOrders &&
        orderRes.connectedOrders.length > 0 &&
        (() => {
          const filteredOrders = orderRes.connectedOrders.filter(
            (connectedOrder) =>
              connectedOrder._id !== orderRes._id &&
              connectedOrder.orderNumber !== orderRes.orderNumber
          );

          return filteredOrders.length > 0 ? (
            <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                Connected Orders
              </h2>
              <div className="space-y-2">
                {filteredOrders.map((connectedOrder, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800 dark:text-white">
                        Order #
                        {connectedOrder.orderNumber || connectedOrder._id}
                      </p>
                      {connectedOrder.createdAt && (
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {new Date(
                            connectedOrder.createdAt
                          ).toLocaleDateString("en-GB")}
                        </p>
                      )}
                    </div>
                    <Link
                      href={`/profile/my-orders/${
                        connectedOrder.orderNumber || connectedOrder._id
                      }`}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      View Order →
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ) : null;
        })()}

      {/* Order Items */}
      <div className="mt-10">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-4">
          Order Items
        </h2>

        {orderRes.items?.length ? (
          orderRes.items.map((item, index) => {
            const p = item.product || {};
            const imageUrl =
              (p.images && p.images[0]) ||
              p.thumbnail ||
              "https://via.placeholder.com/80";
            const qty = item.quantity || 1;
            const hasOffer =
              (p.offerPrice ?? 0) > 0 && p.offerPrice! < (p.price ?? 0);
            const regularPrice = p.price || 0;
            const offerPrice = hasOffer ? p.offerPrice! : regularPrice;

            return (
              <div
                key={p._id || index}
                className="flex flex-col sm:flex-row gap-4 sm:gap-6 border-b py-4"
              >
                {/* Left side */}
                <div className="flex items-center gap-3 flex-1">
                  <a href={"/" + p.slug}>
                    <img
                      src={imageUrl}
                      alt={p.name || "Product"}
                      className="h-16 w-16 sm:h-20 sm:w-20 rounded object-cover shrink-0"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "https://via.placeholder.com/80";
                      }}
                    />
                  </a>
                  <div className="min-w-0">
                    <a href={"/" + p.slug}>
                      <h3 className="text-base sm:text-lg font-semibold dark:text-white break-words">
                        {p.name || "Unknown Product"}
                      </h3>
                    </a>

                    {/* Price Display */}
                    <div className="mt-1 space-x-2">
                      {hasOffer ? (
                        <>
                          <span className="text-sm font-medium text-green-600 dark:text-green-400">
                            <Price amount={offerPrice} />
                          </span>
                          <span className="text-xs line-through text-gray-500 dark:text-gray-400">
                            <Price amount={regularPrice} />
                          </span>
                        </>
                      ) : (
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          <Price amount={regularPrice} />
                        </span>
                      )}
                    </div>

                    {(p.discountPercentage ?? 0) > 0 && (
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Discount: {p.discountPercentage}%
                      </p>
                    )}
                    <p className="text-sm dark:text-gray-300">
                      Qty: {qty}
                    </p>
                    {p._id && (
                      <div className="mt-3">
                        <ReviewManager
                          productId={p._id}
                          productName={p.name}
                          orderId={orderRes._id}
                          orderNumber={orderRes.orderNumber ?? orderNumber}
                          className="px-3 py-1.5 text-xs sm:text-sm"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p>No items in this order.</p>
        )}
      </div>

      {/* Summary & Customer */}
      <div className="flex justify-center flex-col md:flex-row items-stretch w-full space-y-4 md:space-y-0 md:space-x-6 xl:space-x-8 mt-10">
        {/* Summary */}
        <div className="flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 dark:bg-gray-800 space-y-6">
          <OrderTracking
            orderId={orderRes.orderNumber || orderRes._id}
            status={orderRes.status}
          />

          <h3 className="text-2xl dark:text-white font-bold leading-7 text-gray-800 mb-4">
            Summary
          </h3>

          <div className="flex justify-center items-center w-full space-y-4 flex-col pb-4">
            <div className="flex justify-between items-center w-full">
              <div className="flex items-center gap-2">
                <p className="text-base dark:text-white leading-5 text-gray-800">
                  Price (
                  {(() => {
                    if (hasConnectedOrders) {
                      // Calculate total items from all connected orders
                      return connectedOrdersQueries.reduce((acc, query) => {
                        return acc + (query.data?.items?.length || 0);
                      }, 0);
                    }
                    return orderRes.items?.length || 0;
                  })()}{" "}
                  items)
                </p>
              </div>
              <p className="text-base dark:text-gray-300 leading-5 text-gray-600">
                <Price amount={displayPrice} />
              </p>
            </div>

            {totalDiscount > 0 && (
              <div className="flex justify-between items-center w-full">
                <p className="text-base dark:text-white leading-5 text-gray-800">
                  Discount
                </p>
                <p className="text-base dark:text-green-400 leading-5 text-green-600 font-medium">
                  - <Price amount={totalDiscount} />
                </p>
              </div>
            )}

            <div className="flex justify-between items-center w-full">
              <p className="text-base dark:text-white leading-5 text-gray-800">
                Shipping Amount
              </p>
              <p className="text-base dark:text-gray-300 leading-5 text-gray-600">
                {shipping > 0 ? <Price amount={shipping} /> : "Free"}
              </p>
            </div>

            {tax > 0 && (
              <div className="flex justify-between items-center w-full">
                <p className="text-base dark:text-white leading-5 text-gray-800">
                  Tax Amount
                </p>
                <p className="text-base dark:text-gray-300 leading-5 text-gray-600">
                  <Price amount={tax} />
                </p>
              </div>
            )}
          </div>

          <div className="border-t-2 border-gray-200 dark:border-gray-600 pt-4">
            <div className="flex justify-between items-center w-full">
              <p className="text-lg dark:text-white font-bold leading-5 text-gray-800">
                Total Amount
              </p>
              <p className="text-lg dark:text-white font-bold leading-5 text-gray-800">
                <Price amount={total} />
              </p>
            </div>
          </div>

          {totalDiscount > 0 && (
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-600 dark:text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm font-medium text-green-700 dark:text-green-300">
                  You&apos;ll save <Price amount={totalDiscount} /> on this
                  order!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Shipping & Customer */}
        <div className="flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 dark:bg-gray-800 space-y-6">
          <h3 className="text-xl dark:text-white font-semibold leading-5 text-gray-800">
            Shipping
          </h3>

          <div className="flex justify-between items-start w-full">
            <div className="flex justify-center items-center space-x-4">
              <div className="w-8 h-8">
                <img
                  className="w-full h-full"
                  alt="logo"
                  src="https://i.ibb.co/L8KSdNQ/image-3.png"
                />
                <img
                  className="w-full h-full"
                  alt="logo"
                  src={
                    typeof orderRes?.shippingMethod === "object" &&
                    orderRes?.shippingMethod?.icon
                      ? orderRes.shippingMethod.icon
                      : "https://i.ibb.co/L8KSdNQ/image-3.png"
                  }
                />
              </div>
              <div className="flex flex-col justify-start items-center">
                <p className="text-lg leading-6 dark:text-white font-semibold text-gray-800">
                  {typeof orderRes?.shippingMethod === "string"
                    ? orderRes.shippingMethod
                    : orderRes?.shippingMethod?.title || "Standard Delivery"}
                  <br />
                  {/* <span className="font-normal">Delivery within 24 Hours</span> */}
                </p>
              </div>
            </div>
            <p className="text-lg font-semibold leading-6 dark:text-white text-gray-800">
              <Price amount={shipping} />
            </p>
          </div>

          <div className="w-full flex justify-start items-center">
            <button
              onClick={() => {
                if (orderRes?.paymentMethod?.apiUrl) {
                  window.open(orderRes.paymentMethod.apiUrl, "_blank");
                }
              }}
              disabled={!orderRes?.paymentMethod?.apiUrl}
              className="hover:bg-black dark:bg-white dark:text-gray-800 dark:hover:bg-gray-100 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 py-5 w-full md:w-full bg-gray-800 text-base font-medium leading-4 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              View Carrier Details
            </button>
          </div>

          <div>
            <h3 className="text-xl dark:text-white font-semibold leading-5 text-gray-800 mb-5">
              Customer
            </h3>
            <div className="flex flex-col md:flex-row xl:flex-col justify-start items-stretch h-full w-full md:space-x-6 lg:space-x-8 xl:space-x-0">
              {/* Customer email */}
              <div className="flex flex-col justify-start items-start shrink-0">
                <div className="flex justify-start text-gray-800 dark:text-white items-center space-x-4 py-4 border-b border-gray-200 w-full">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5Z"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M3 7L12 13L21 7"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p className="cursor-pointer text-sm leading-5">
                    {orderRes?.user?.email || "N/A"}
                  </p>
                  <p className="cursor-pointer text-sm leading-5">
                    {orderRes?.user?.email || "N/A"}
                  </p>
                </div>
              </div>
              {/* Payment Details */}
              <div className="flex flex-col justify-start items-start shrink-0">
                <div className="flex justify-start text-gray-800 dark:text-white items-center space-x-4 py-4 border-b border-gray-200 w-full">
                  <div className="flex flex-col">
                    <p className="text-base font-semibold leading-5">
                      Payment Method
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      {orderRes?.paymentMethod?.image && (
                        <img
                          src={orderRes.paymentMethod.image}
                          alt={orderRes.paymentMethod.name || "Payment Method"}
                          className="w-6 h-6 object-contain"
                        />
                      )}
                      <p className="text-sm leading-5 text-gray-600 dark:text-gray-300">
                        {orderRes?.paymentMethod?.name || "N/A"}
                      </p>
                    </div>
                    {orderRes?.paymentMethod?.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {orderRes.paymentMethod.description}
                      </p>
                    )}
                    <div className="mt-2">
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-200">
                        Payment Status:{" "}
                        <span className="font-semibold text-blue-600 bg-blue-200 px-2 py-1 rounded">
                          {orderRes.status === "paid"
                            ? "Paid"
                            : orderRes.status === "pending"
                            ? "Pending"
                            : orderRes.status || "Unknown"}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Shipping & Billing */}
              <div className="flex justify-between xl:h-full items-stretch w-full flex-col mt-6 md:mt-0">
                <div className="flex justify-start md:justify-start xl:flex-col flex-col md:space-x-6 lg:space-x-8 xl:space-x-0 space-y-4 xl:space-y-12 md:space-y-0 md:flex-row items-start md:items-start">
                  {/* Shipping Address */}
                  <div className="flex justify-start md:justify-start items-start md:items-start flex-col space-y-4 xl:mt-8">
                    <p className="text-base dark:text-white font-semibold leading-4 text-left text-gray-800">
                      Shipping Address
                    </p>
                    <div className="w-full lg:w-full dark:text-gray-300 xl:w-48 text-left text-sm leading-5 text-gray-600">
                      {orderRes?.shippingAddress ? (
                        <>
                          <p>
                            {orderRes.shippingAddress.addressLine1 || "N/A"}
                          </p>
                          <p>{orderRes.shippingAddress.addressLine2 || ""}</p>
                          <p>
                            {orderRes.shippingAddress.city},{" "}
                            {orderRes.shippingAddress.state}
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
                  <div className="flex justify-start md:justify-start items-start md:items-start flex-col space-y-4">
                    <p className="text-base dark:text-white font-semibold leading-4 text-left text-gray-800">
                      Billing Address
                    </p>
                    <div className="w-full lg:w-full dark:text-gray-300 xl:w-48 text-left text-sm leading-5 text-gray-600">
                      {orderRes?.billingAddress ? (
                        <>
                          <p>{orderRes.billingAddress.addressLine1 || "N/A"}</p>
                          <p>{orderRes.billingAddress.addressLine2 || ""}</p>
                          <p>
                            {orderRes.billingAddress.city},{" "}
                            {orderRes.billingAddress.state}
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

              {/* Invoice */}
              <div className="flex w-full justify-start items-start md:justify-start md:items-start">
                <Link
                  href={`/profile/my-orders/${orderRes.orderNumber}/invoice`}
                  className="mt-6 md:mt-0 text-center dark:border-white dark:hover:bg-gray-900 
                  dark:bg-transparent dark:text-white py-5 hover:bg-gray-200 
                  focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 
                  border border-gray-800 font-medium w-full 2xl:w-full text-base 
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
