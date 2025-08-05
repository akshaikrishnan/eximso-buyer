"use client";
import React from "react";
import { useQuery } from '@tanstack/react-query';
import api from "@/lib/api/axios.interceptor";
import { endpoints } from "@/lib/data/endpoints";
import { Price } from "@/components/common/price";

export default function ExportInvoice({ orderId }: { orderId: string }) {
  const { data: orderData, isLoading, isError } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => api.get(endpoints.order, { params: { orderId } }).then(res => res.data.result),
    enabled: !!orderId,
  });

  if (isLoading) {
    return <div className="p-6 bg-gray-50 min-h-screen flex justify-center items-center">
      <div className="bg-white shadow-lg rounded-xl p-8">
        <p>Loading invoice details...</p>
      </div>
    </div>;
  }

  if (isError) {
    return <div className="p-6 bg-gray-50 min-h-screen flex justify-center items-center">
      <div className="bg-white shadow-lg rounded-xl p-8">
        <p>Error loading invoice details</p>
      </div>
    </div>;
  }

  // If orderData is an array, find the order matching orderId
  const order = Array.isArray(orderData)
    ? orderData.find((order: any) => order._id === orderId || order.id === orderId)
    : orderData;

  if (!order) {
    return <div className="p-6 bg-gray-50 min-h-screen flex justify-center items-center">
      <div className="bg-white shadow-lg rounded-xl p-8">
        <p>No order data found</p>
      </div>
    </div>;
  }

  // Calculate total amount
  const totalAmount = order?.items?.reduce((total: number, item: any) => {
    const price = item.product.offerPrice && item.product.offerPrice > 0
      ? item.product.offerPrice
      : item.product.price;
    return total + (price * item.quantity);
  }, 0) || 0;

  // Format amount in words
  const formatAmountInWords = (amount: number) => {
    return `USD ${amount.toFixed(2)}`;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex justify-center items-center">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-5xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b-2 border-gray-200 pb-4">
          <div>
            <div className="flex items-center space-x-4">
              <img
                src="/images/common/logo.png"
                alt="EXIMSO Logo"
                className="h-10 w-auto"
              />
              <h1 className="text-2xl font-extrabold text-blue-600">
                EXIMSO PRIVATE LIMITED
              </h1>
            </div>
            <p className="text-sm text-gray-700">
              PM Kareem Centre, No 15/1031 Wonderla Road,
            </p>
            <p className="text-sm text-gray-700">
              Athani Junction, Kakkanad, Ernakulam, PIN 682030, Kerala India
            </p>
            <p className="text-sm text-gray-700">
              Phone: +91 9037535940, contact@eximso.com, www.eximso.com
            </p>
            <p className="text-sm text-gray-700">CIN: U46909KL2023PTC084715</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-400">
              EXPORT INVOICE
            </h2>
            <h5 className="text-2xl font-semibold text-gray-800">#{orderId}</h5>
          </div>
        </div>

        {/* Shipper and Customer */}
        <div className="grid grid-cols-2 gap-8 mb-6">
          <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
            <h3 className="font-bold text-gray-800 mb-2">SHIPPER</h3>
            <p className="text-sm text-gray-700">
              PROLO SOLUTION PRIVATE LIMITED
            </p>
            <p className="text-sm text-gray-700">
              PM Kareem Centre, No 15/1031 Wonderla Road,
            </p>
            <p className="text-sm text-gray-700">
              Athani Junction, Kakkanad, Ernakulam, PIN 682030, Kerala India
            </p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
            <h3 className="font-bold text-gray-800 mb-2">CUSTOMER</h3>
            <p className="text-sm text-gray-700">
              {order?.user?.name || "N/A"}
            </p>
            <p className="text-sm text-gray-700">
              {order?.shippingAddress?.addressLine1 || "N/A"}
            </p>
            <p className="text-sm text-gray-700">
              {order?.shippingAddress?.addressLine2 || ""}
            </p>
            <p className="text-sm text-gray-700">
              {order?.shippingAddress?.city || ""}, {order?.shippingAddress?.state || ""}
            </p>
            <p className="text-sm text-gray-700">
              {order?.shippingAddress?.pincode || ""}
            </p>
            <p className="text-sm text-gray-700">
              {order?.shippingAddress?.country || ""}
            </p>
          </div>
        </div>

        {/* Invoice Info */}
        <div className="grid grid-cols-2 gap-8 mb-6">
          <div>
            <p className="text-sm text-gray-700">
              <span className="font-bold">Invoice Number & Date:</span>{" "}
              {orderId} - {order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-bold">Buyer&apos;s Order No. & Date:</span>{" "}
              {orderId} - {order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-bold">GSTIN:</span> 32AAOPC2609R1ZW
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-700">
              <span className="font-bold">IE Code:</span> AAOPC2609R
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-bold">Bank AD Code:</span> 63610859701431
            </p>
             <p className="text-sm text-gray-700">
              <span className="font-bold">LUT Code:</span> 63610859701431
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-blue-50">
                <th className="border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800">
                  SL No
                </th>
                <th className="border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800">
                  Description of Goods
                </th>
                <th className="border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800">
                  HSN Code
                </th>
                <th className="border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800">
                  UOM
                </th>
                {/* Removed Unit column as per feedback */}
                <th className="border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800">
                  Quantity
                </th>
                <th className="border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800">
                  Unit Rate (USD)
                </th>
                <th className="border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800">
                  Amount (USD)
                </th>
              </tr>
            </thead>
            <tbody>
              {order?.items?.map((item: any, index: number) => {
                const price = item.product.offerPrice && item.product.offerPrice > 0
                  ? item.product.offerPrice
                  : item.product.price;
                const amount = price * item.quantity;
                return (
                  <tr key={index}>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">
                      {index + 1}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">
                      {item.product.name}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">
                      {item.product.hsnCode || "N/A"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">
                      {item.product.uom || "N/A"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">
                      {item.product.unit || "N/A"}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">
                      {item.quantity}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">
                      ${price.toFixed(2)}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">
                      ${amount.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
              <tr>
                <td
                  colSpan={7}
                  className="border border-gray-300 px-4 py-2 text-right font-bold text-gray-800"
                >
                  Total Amount
                </td>
                <td className="border border-gray-300 px-4 py-2 text-gray-800 font-bold">
                  ${totalAmount.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="mt-8 text-sm text-gray-700">
          <p>Amount Inwords: {formatAmountInWords(totalAmount)}</p>
          <p className="text-blue-600 font-medium mt-4">
            eximso.com - shop global feel local
          </p>
        </div>

        {/* Download Button */}
        <div className="mt-8 flex justify-end">
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
          >
            Download Invoice
          </button>
        </div>
      </div>
    </div>
  );
}
