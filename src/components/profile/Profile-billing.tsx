"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api/axios.interceptor";
import { endpoints } from "@/lib/data/endpoints";
import { Price } from "@/components/common/price";
import { useReactToPrint } from "react-to-print";

type OrderItem = {
  product: {
    name: string;
    price: number;
    offerPrice?: number;
    hsnCode?: string;
    uom?: string;
  };
  quantity: number;
};

type Order = {
  _id: string;
  orderNumber: string;
  createdAt?: string;
  user?: { name?: string };
  shippingAddress?: {
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    pincode?: string;
    country?: string;
  };
  items: OrderItem[];
};

interface ExportInvoiceProps {
  orderId?: string;
}

export default function ExportInvoice({ orderId: propOrderId }: ExportInvoiceProps = {}) {
  const params = useParams<{ orderId: string }>();
  const orderId = propOrderId || params?.orderId;

  
  const componentRef = React.useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    // If you're on react-to-print v2, use: content: () => componentRef.current
    contentRef: componentRef,
    documentTitle: `Invoice_${orderId}`,
  });

  const { data: order, isLoading, isError } = useQuery<Order>({
    queryKey: ["order", orderId],
    enabled: !!orderId,
    queryFn: async () => {
      const res = await api.get(`${endpoints.order}/${orderId}`);
      // Support either {result: {...}} or plain {...}
      return (res.data?.result ?? res.data) as Order;
    },
  });

  const totalAmount =
    order?.items?.reduce((sum, item) => {
      const unit =
        item.product?.offerPrice && item.product.offerPrice > 0
          ? item.product.offerPrice
          : item.product?.price ?? 0;
      return sum + unit * (item.quantity ?? 0);
    }, 0) ?? 0;

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 bg-gray-50 min-h-screen flex justify-center items-center">
        <div className="bg-white shadow-lg rounded-xl p-4 md:p-8">
          <p>Loading invoice details...</p>
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="p-4 md:p-6 bg-gray-50 min-h-screen flex justify-center items-center">
        <div className="bg-white shadow-lg rounded-xl p-4 md:p-8">
          <p>{isError ? "Error loading invoice details" : "No order data found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen flex flex-col justify-center items-center space-y-4">
      <div ref={componentRef} className="bg-white shadow-lg rounded-xl p-4 md:p-8 w-full max-w-5xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 border-b-2 border-gray-200 pb-4">
          <div>
            <div className="flex items-center space-x-4">
              <img src="/images/common/logo.png" alt="EXIMSO Logo" className="h-10 w-auto" />
              <h1 className="text-xl md:text-2xl font-extrabold text-blue-600">
                EXIMSO INTERNATIONAL PVT LTD
              </h1>
            </div>
            <p className="text-sm text-gray-700">PM Kareem Centre, No 15/1031 Wonderla Road,</p>
            <p className="text-sm text-gray-700">
              Athani Junction, Kakkanad, Ernakulam, PIN 682030, Kerala India
            </p>
            <p className="text-sm text-gray-700">
              Phone: +91 9037535940, contact@eximso.com, www.eximso.com
            </p>
            <p className="text-sm text-gray-700">CIN: U46909KL2023PTC084715</p>
          </div>
          <div className="self-end md:self-auto text-right">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-400">EXPORT INVOICE</h2>
            <h5 className="text-xl md:text-2xl font-semibold text-gray-800">
              #{order.orderNumber}
            </h5>
          </div>
        </div>

        {/* Shipper and Customer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
            <h3 className="font-bold text-gray-800 mb-2">SHIPPER</h3>
            <p className="text-sm text-gray-700">EXIMSO INTERNATIONAL PVT LTD,</p>
            <p className="text-sm text-gray-700">PM Kareem Centre, No 15/1031 Wonderla Road,</p>
            <p className="text-sm text-gray-700">
              Athani Junction, Kakkanad, Ernakulam, PIN 682030, Kerala India
            </p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
            <h3 className="font-bold text-gray-800 mb-2">CUSTOMER</h3>
            <p className="text-sm text-gray-700">{order?.user?.name || "N/A"},</p>
            <p className="text-sm text-gray-700">{order?.shippingAddress?.addressLine1 || "N/A"}</p>
            {order?.shippingAddress?.addressLine2 && (
              <p className="text-sm text-gray-700">{order.shippingAddress.addressLine2}</p>
            )}
            <p className="text-sm text-gray-700">
              {[order?.shippingAddress?.city, order?.shippingAddress?.state].filter(Boolean).join(", ")}
            </p>
            <p className="text-sm text-gray-700">{order?.shippingAddress?.pincode || ""}</p>
            <p className="text-sm text-gray-700">{order?.shippingAddress?.country || ""}</p>
          </div>
        </div>

        {/* Invoice Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          <div>
            <p className="text-sm text-gray-700">
              <span className="font-bold">Invoice Number &amp; Date:</span>{" "}
              {order.orderNumber} -{" "}
              {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-bold">Buyer&apos;s Order No. &amp; Date:</span>{" "}
              {order.orderNumber} -{" "}
              {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}
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

        {/* Items Table */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-blue-50">
                <th className="border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800">SL No</th>
                <th className="border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800">Description of Goods</th>
                <th className="border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800">HSN Code</th>
                <th className="border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800">UOM</th>
                <th className="border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800">Quantity</th>
                <th className="border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800">Unit Rate (USD)</th>
                <th className="border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800">Amount (USD)</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((item, index) => {
                const unit =
                  item.product?.offerPrice && item.product.offerPrice > 0
                    ? item.product.offerPrice
                    : item.product?.price ?? 0;
                const amount = unit * (item.quantity ?? 0);
                return (
                  <tr key={`${item.product?.name}-${index}`}>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">{index + 1}</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">{item.product?.name}</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">{item.product?.hsnCode || "N/A"}</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">{item.product?.uom || "N/A"}</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">{item.quantity}</td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">
                      <Price amount={unit} />
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">
                      <Price amount={amount} />
                    </td>
                  </tr>
                );
              })}
              <tr>
                <td
                  colSpan={6}
                  className="border border-gray-300 px-4 py-2 text-right font-bold text-gray-800"
                >
                  Total Amount
                </td>
                <td className="border border-gray-300 px-4 py-2 text-gray-800 font-bold">
                  <Price amount={totalAmount} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="mt-8 text-sm text-gray-700 flex justify-between items-center">
          <p className="text-blue-600 font-medium mt-4">eximso.com - shop global feel local</p>
        </div>

        <div className="mt-8 text-sm text-gray-700 flex justify-end items-center">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-eximblue-600 text-white rounded-md hover:bg-eximblue-700 transition print:hidden"
          >
            Download Invoice
          </button>
        </div>
      </div>
    </div>
  );
}
