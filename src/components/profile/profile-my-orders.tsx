"use client";

import api from "@/lib/api/axios.interceptor";
import { endpoints } from "@/lib/data/endpoints";
import { useQuery } from "@tanstack/react-query";
import Loader from "@/components/common/loader/loader";
import { useRouter } from "next/navigation";
import { Price } from "../common/price";
import Link from "next/link";

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: string;
  total: string;
  items: {
    product: string;
    quantity: number;
    price: number;
    image?: string;
  }[];
}

const MyOrders = () => {
  const router = useRouter();

  const { data: orders, isLoading, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await api.get(endpoints.order);
      return res.data.result.map((order: any) => ({
        id: order._id || "N/A",
        orderNumber: order.orderNumber || "N/A",
        date: order.createdAt
          ? new Date(order.createdAt).toLocaleDateString()
          : "Unknown Date",
        status: order.status || "Pending",
        total: `$${
          (order.items?.reduce(
            (sum: number, item: any) =>
              sum + ((item.price ?? item.product?.price ?? 0) * (item.quantity || 1)),
            0
          ) ?? 0).toFixed(2)
        }`,
        items:
          order.items?.map((item: any) => ({
            product: item.product?.name || "Unknown Product",
            quantity: item.quantity || 0,
            price: item.price ?? item.product?.price ?? 0,
            image:
              item.product?.images?.[0] ||
              item.product?.thumbnail ||
              "https://via.placeholder.com/80",
          })) || [],
      }));
    },
  });

  if (isLoading) return <Loader fullScreen />;

  if (isError || !orders?.length) {
    return (
      <div className="text-center py-10 text-red-600">
        {isError ? "An error occurred while fetching orders." : "No orders found."}
      </div>
    );
  }

  const handleOrderClick = (orderNumber: string) => {
    router.push(`/profile/my-orders/${orderNumber}`);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold text-gray-800">
        My Orders ({orders.length})
      </h1>
      <div className="mt-6 space-y-4">
        {orders.map((order: Order) => (
          <div
            key={order.id}
            role="button"
            onClick={() => handleOrderClick(order.orderNumber)}
            className="p-5 shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Order #{order.orderNumber}
                </h3>
                <p className="text-sm text-gray-500">Placed on {order.date}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900">
                  Total: <Price amount={parseFloat(order.total.replace("$", ""))} />
                </p>
                <p
                  className={`text-sm font-medium ${
                    order.status === "Delivered" ? "text-green-600" : "text-yellow-600"
                  }`}
                >
                  {order.status}
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.product}
                      className="h-20 w-20 rounded object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "https://via.placeholder.com/80";
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-md font-medium text-gray-800">{item.product}</h4>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    <p className="text-sm text-gray-500">
                      Price: <Price amount={item.price} />
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* (Optional) Dedicated details link */}
            <div className="mt-3">
              <Link
                href={`/profile/my-orders/${order.orderNumber}`}
                className="text-sm text-blue-700 hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                View details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
