"use client";
import Link from "next/link";
import React from "react";
import OrderTracking from "./order-tracking";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api/axios.interceptor";
import { endpoints } from "@/lib/data/endpoints";
import { Description } from '@headlessui/react';
import { Price } from "../common/price"; // Ensure correct import path

export default function OrderDetails({ orderId }: { orderId: string }) {
  const {
    data: orderData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["order"],
    queryFn: () => api.get(endpoints.order).then((res) => res.data.result),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching data</div>;
  }

  // If orderData is an array:
  const orderid = Array.isArray(orderData) ? orderData[0] : orderData;

  if (!orderid) {
    return <div>No order data found</div>;
  }

  console.log("orderid", orderid);

  return (
    <div className="py-14 px-4 md:px-6 2xl:px-6 2xl:container 2xl:mx-auto">
      <div className="flex justify-start item-start space-y-2 flex-col">
        <h1 className="text-3xl dark:text-white lg:text-4xl font-semibold leading-7 lg:leading-9 text-gray-800">
          Order #{orderId}
        </h1>
        {isLoading && <p>Loading...</p>}
        {isError && <p>Failed to load order details.</p>}

        {orderid && (
          <p className="text-base dark:text-gray-300 font-medium leading-6 text-gray-600">
            Placed on : {new Date(orderid.createdAt).toLocaleDateString('en-GB')}
          </p>
        )}
      </div>
      <div className="mt-10 flex flex-col xl:flex-row jusitfy-center items-stretch w-full xl:space-x-8 space-y-4 md:space-y-6 xl:space-y-0">
        <div className="flex flex-col justify-start items-start w-full space-y-4 md:space-y-6 xl:space-y-8">
          <div className="mt-10 flex flex-col xl:flex-row jusitfy-center items-stretch w-full xl:space-x-8 space-y-4 md:space-y-6 xl:space-y-0">
            <div className="flex flex-col justify-start items-start w-full space-y-4 md:space-y-6 xl:space-y-8">
              <div className="flex flex-col justify-start items-start dark:bg-gray-800 bg-gray-50 px-4 py-0 md:py-0 md:p-0 xl:p-0 w-full">
                <p className="text-lg md:text-xl dark:text-white font-semibold leading-6 xl:leading-5 text-gray-800">
                  Order Items
                </p>
                {orderid?.items?.map((item: any, index: number) => {
                  // Get the image URL from item.product.images[0] or item.product.thumbnail
                  const imageUrl =
                    item.product?.images?.length > 0
                      ? item.product.images[0]
                      : item.product?.thumbnail || "https://via.placeholder.com/80";

                  return (
                    <div
                      key={index} // Add key prop here
                      className="mt-4 md:mt-6 flex flex-col md:flex-row justify-start items-start md:items-center md:space-x-6 xl:space-x-8 w-full"
                    >
                      <div className="flex-shrink-0">
                        <img
                          src={imageUrl}
                          alt={item.product?.name || "Product Image"}
                          className="h-20 w-20 rounded object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "https://via.placeholder.com/80";
                          }}
                        />
                      </div>
                      <div className="md:flex-row flex-col flex justify-between items-start w-full pb-8 space-y-4 md:space-y-0">
                        <div className="w-full flex flex-col justify-start items-start space-y-8">
                          <h3 className="text-xl dark:text-white xl:text-2xl font-semibold leading-6 text-gray-800">
                            {item.product?.name || "Unknown Product"}
                          </h3>
                          <div className="flex justify-start items-start flex-col space-y-2">
                            <p className="text-sm dark:text-white leading-none text-gray-800">
                              <span className="dark:text-gray-600 text-gray-500">Description: </span>
                              {item.product.shortDescription || "Italic Minimal Design"}
                            </p>
                            <p className="text-sm dark:text-white leading-none text-gray-800">
                              <span className="dark:text-gray-600 text-gray-500">ModelNumber: </span>
                              {item.product.modelNumber || "Small"}
                            </p>
                            <p className="text-sm dark:text-white leading-none text-gray-800">
                              <span className="dark:text-gray-600 text-gray-500">Discount Percentage: </span>
                              {item.product.discountPercentage || "0"}%
                            </p>
                          </div>
                        </div>
                        <div className="flex justify-between items-start w-full">
                          {/* Offer Price and Original Price */}
                          <div className="flex flex-col space-y-1">
                            <p className="text-base dark:text-white xl:text-lg leading-6">
                              <Price amount={item.product.offerPrice || 0} />
                            </p>
                            <p className="text-base dark:text-white xl:text-lg leading-6">
                              <span className="text-red-300 line-through">
                                <Price amount={item.product.price || 0} />
                              </span>
                            </p>
                          </div>
                          {/* Quantity */}
                          <p className="text-base dark:text-white xl:text-lg leading-6 text-gray-800">
                            Quantity: {item.quantity || "01"}
                          </p>
                          {/* Total */}
                          <p className="text-base dark:text-white xl:text-lg font-semibold leading-6 text-gray-800">
                            <Price
                              amount={
                                (item.product.offerPrice || 0) * (item.quantity || 1)
                              }
                            />
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="flex justify-center flex-col md:flex-row items-stretch w-full space-y-4 md:space-y-0 md:space-x-6 xl:space-x-8">
            <div className="flex flex-col px-4 py-6 md:p-6 xl:p-8 w-full bg-gray-50 dark:bg-gray-800 space-y-6">
              <OrderTracking />
              <h3 className="text-xl dark:text-white font-semibold leading-5 text-gray-800">
                Summary
              </h3>
              <div className="flex justify-center items-center w-full space-y-4 flex-col border-gray-200 border-b pb-4">
                <div className="flex justify-between w-full">
                  <p className="text-base dark:text-white leading-4 text-gray-800">
                    Subtotal
                  </p>
                  <p className="text-base dark:text-gray-300 leading-4 text-gray-600">
                    $56.00
                  </p>
                </div>
                <div className="flex justify-between items-center w-full">
                  <p className="text-base dark:text-white leading-4 text-gray-800">
                    Discount{" "}
                    <span className="bg-gray-200 p-1 text-xs font-medium dark:bg-white dark:text-gray-800 leading-3 text-gray-800">
                      STUDENT
                    </span>
                  </p>
                  <p className="text-base dark:text-gray-300 leading-4 text-gray-600">
                    -$28.00 (50%)
                  </p>
                </div>
                <div className="flex justify-between items-center w-full">
                  <p className="text-base dark:text-white leading-4 text-gray-800">
                    Shipping
                  </p>
                  <p className="text-base dark:text-gray-300 leading-4 text-gray-600">
                    $8.00
                  </p>
                </div>
              </div>
              <div className="flex justify-between items-center w-full">
                <p className="text-base dark:text-white font-semibold leading-4 text-gray-800">
                  Total
                </p>
                <p className="text-base dark:text-gray-300 font-semibold leading-4 text-gray-600">
                  $36.00
                </p>
              </div>
            </div>
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
                  </div>
                  <div className="flex flex-col justify-start items-center">
                    <p className="text-lg leading-6 dark:text-white font-semibold text-gray-800">
                      DPD Delivery
                      <br />
                      <span className="font-normal">
                        Delivery with 24 Hours
                      </span>
                    </p>
                  </div>
                </div>
                <p className="text-lg font-semibold leading-6 dark:text-white text-gray-800">
                  $8.00
                </p>
              </div>
              <div className="w-full flex justify-center items-center">
                <button className="hover:bg-black dark:bg-white dark:text-gray-800 dark:hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 py-5 w-96 md:w-full bg-gray-800 text-base font-medium leading-4 text-white">
                  View Carrier Details
                </button>
              </div>
              <div>
                <h3 className="text-xl dark:text-white font-semibold leading-5 text-gray-800 mb-5">
                  Customer
                </h3>
                <div className="flex flex-col md:flex-row xl:flex-col justify-start items-stretch h-full w-full md:space-x-6 lg:space-x-8 xl:space-x-0">
                  <div className="flex flex-col justify-start items-start flex-shrink-0">
                    <div className="flex justify-center text-gray-800 dark:text-white md:justify-start items-center space-x-4 py-4 border-b border-gray-200 w-full">
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
                        {orderid?.user?.email || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between xl:h-full items-stretch w-full flex-col mt-6 md:mt-0">
                    <div className="flex justify-center md:justify-start xl:flex-col flex-col md:space-x-6 lg:space-x-8 xl:space-x-0 space-y-4 xl:space-y-12 md:space-y-0 md:flex-row items-center md:items-start">
                      <div className="flex justify-center md:justify-start items-center md:items-start flex-col space-y-4 xl:mt-8">
                        <p className="text-base dark:text-white font-semibold leading-4 text-center md:text-left text-gray-800">
                          Shipping Address
                        </p>
                        <div className="w-48 lg:w-full dark:text-gray-300 xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600">
                          {orderid?.shippingAddress ? (
                            <>
                              <p>{orderid.shippingAddress.addressLine1 || "N/A"}</p>
                              <p>{orderid.shippingAddress.addressLine2 || ""}</p>
                              <p>
                                {orderid.shippingAddress.city}, {orderid.shippingAddress.state}
                              </p>
                              <p>{orderid.shippingAddress.pincode}</p>
                              <p>{orderid.shippingAddress.country}</p>
                            </>
                          ) : (
                            <p>N/A</p>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-center md:justify-start items-center md:items-start flex-col space-y-4">
                        <p className="text-base dark:text-white font-semibold leading-4 text-center md:text-left text-gray-800">
                          Billing Address
                        </p>
                        <div className="w-48 lg:w-full dark:text-gray-300 xl:w-48 text-center md:text-left text-sm leading-5 text-gray-600">
                          {orderid?.billingAddress ? (
                            <>
                              <p>{orderid.billingAddress.addressLine1 || "N/A"}</p>
                              <p>{orderid.billingAddress.addressLine2 || ""}</p>
                              <p>
                                {orderid.billingAddress.city}, {orderid.billingAddress.state}
                              </p>
                              <p>{orderid.billingAddress.pincode}</p>
                              <p>{orderid.billingAddress.country}</p>
                            </>
                          ) : (
                            <p>N/A</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex w-full justify-center items-center md:justify-start md:items-start">
                  <Link
  href={`/profile/my-orders/${orderId}/invoice`}
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
      </div>
    </div>
  );
}