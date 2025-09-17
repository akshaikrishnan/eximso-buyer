"use client";
import React, { useRef } from "react";
import { useQuery } from '@tanstack/react-query';
import api from "@/lib/api/axios.interceptor";
import { endpoints } from "@/lib/data/endpoints";
import { Price } from "@/components/common/price";
import { useReactToPrint } from 'react-to-print';

export default function ExportInvoice({ orderId }: { orderId: string }) {
  const componentRef = React.useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Invoice_${orderId}`,
  });

  const { data: orderData, isLoading, isError } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => api.get(endpoints.order, { params: { orderId } }).then(res => res.data.result),
    enabled: !!orderId,
  });

  if (isLoading) {
    return <div className="p-4 md:p-6 bg-gray-50 min-h-screen flex justify-center items-center">
      <div className="bg-white shadow-lg rounded-xl p-4 md:p-8">
        <p>Loading invoice details...</p>
      </div>
    </div>;
  }

  if (isError) {
    return <div className="p-4 md:p-6 bg-gray-50 min-h-screen flex justify-center items-center">
      <div className="bg-white shadow-lg rounded-xl p-4 md:p-8">
        <p>Error loading invoice details</p>
      </div>
    </div>;
  }

  // If orderData is an array, find the order matching orderId
  const order = Array.isArray(orderData)
    ? orderData.find((order: any) => order._id === orderId || order.id === orderId)
    : orderData;

  if (!order) {
    return <div className="p-4 md:p-6 bg-gray-50 min-h-screen flex justify-center items-center">
      <div className="bg-white shadow-lg rounded-xl p-4 md:p-8">
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

  // Function to convert number to words
  const numberToWords = (num: number): string => {
    const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    const scales = ['', 'thousand', 'million', 'billion'];

    if (num === 0) return 'zero dollars';

    let words = '';
    let integerPart = Math.floor(num);
    let decimalPart = Math.round((num - integerPart) * 100);

    let i = 0;
    while (integerPart > 0) {
      if (integerPart % 1000 !== 0) {
        words = helper(integerPart % 1000) + scales[i] + ' ' + words;
      }
      integerPart = Math.floor(integerPart / 1000);
      i++;
    }
    words = words.trim();

    if (decimalPart > 0) {
      words += ' dollars and ' + helper(decimalPart) + ' cents';
    } else {
      words += ' dollars';
    }

    return words.charAt(0).toUpperCase() + words.slice(1);

    function helper(n: number): string {
      if (n === 0) return '';
      if (n < 10) return ones[n] + ' ';
      if (n < 20) return teens[n - 10] + ' ';
      if (n < 100) return tens[Math.floor(n / 10)] + ' ' + helper(n % 10);
      return ones[Math.floor(n / 100)] + ' hundred ' + helper(n % 100);
    }
  };

  // Format amount in words
  const formatAmountInWords = (amount: number) => {
    return numberToWords(amount);
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen flex flex-col justify-center items-center space-y-4">
      <div ref={componentRef} className="bg-white shadow-lg rounded-xl p-4 md:p-8 w-full max-w-5xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 border-b-2 border-gray-200 pb-4">
          <div>
            <div className="flex items-center space-x-4">
              <img
                src="/images/common/logo.png"
                alt="EXIMSO Logo"
                className="h-10 w-auto"
              />
              <h1 className="text-xl md:text-2xl font-extrabold text-blue-600">
                EXIMSO INTERNATIONAL PVT LTD
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
          <div className="self-end md:self-auto">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-400">
              EXPORT INVOICE
            </h2>
            <h5 className="text-xl md:text-2xl font-semibold text-gray-800">#{orderId}</h5>
          </div>
        </div>

        {/* Shipper and Customer */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          <div className="bg-gray-100 p-4 rounded-lg shadow-sm">
            <h3 className="font-bold text-gray-800 mb-2">SHIPPER</h3>
            <p className="text-sm text-gray-700">
              EXIMSO INTERNATIONAL PVT LTD, 
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
              {order?.user?.name || "N/A"},
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
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
          <table className="table-auto w-full min-w-full border-collapse border border-gray-300">
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
                      <Price amount={price} />
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">
                      <Price amount={amount} />
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
                  <Price amount={totalAmount} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="mt-8 text-sm text-gray-700 flex justify-between items-center">
          {/* <p>Amount Inwords: <Price amount={totalAmount} /></p> */}
          <p className="text-blue-600 font-medium mt-4">
            eximso.com - shop global feel local
          </p>
          
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
