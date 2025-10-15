"use client";

import api from "@/lib/api/axios.interceptor";
import { endpoints } from "@/lib/data/endpoints";
import { useQuery } from "@tanstack/react-query";
import Loader from "@/components/common/loader/loader";
import EmptyOrder from "@/components/profile/empty-order";
import { useRouter } from "next/navigation";
import { Price } from "../common/price";
import Link from "next/link";

interface OrderItem {
  product: string;
  quantity: number;
  price: number;
  offerPrice?: number;
  image?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: string;
  total: string;
  itemsTotal?: number;
  shippingPrice?: number;
  orderTotal?: number;
  items: OrderItem[];
}

interface OrderGroup {
  groupName?: string;
  orders: Order[];
}

const MyOrders = () => {
  const router = useRouter();

  const { data: orderGroups, isLoading, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: async (): Promise<OrderGroup[]> => {
      const res = await api.get(`${endpoints.order}/grouped`);
      console.log("getGroupedOrders-res", res);

      return res.data.result.data.map((group: any) => ({
        groupName: group.groupName || " Grouped Orders",
        orders: group.orders.map((order: any) => ({
          id: order._id || "N/A",
          orderNumber: order.orderNumber || "N/A",
          date: order.createdAt
            ? new Date(order.createdAt).toLocaleDateString()
            : "Unknown Date",
          status: order.status || "Pending",
          itemsTotal: order.itemsTotal ?? 0,
          shippingPrice: order.shippingPrice ?? 0,
          orderTotal: order.orderTotal ?? 0,
          total: `$${order.orderTotal?.toFixed(2) || "0.00"}`,
          items:
            order.items?.map((item: any) => ({
              product: item.product?.name || "Unknown Product",
              quantity: item.quantity || 0,
              price: item.price ?? item.product?.price ?? 0,
              offerPrice: item.product?.offerPrice ?? 0,
              image:
                item.product?.images?.[0] || item.product?.thumbnail,
            })) || [],
        })),
      }));
    },
  });

  if (isLoading) return <Loader fullScreen />;
  if (!orderGroups || isError || orderGroups.length === 0) return <EmptyOrder />;

  const handleOrderClick = (orderNumber: string) => {
    router.push(`/profile/my-orders/${orderNumber}`);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold text-gray-800">My Orders</h1>

      <div className="mt-6 space-y-8">
        {orderGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-6 pb-2 border-b border-gray-100">
              {group.groupName}
            </h2>

            <div className="space-y-6">
              {group.orders.map((order) => (
                <div
                  key={order.id}
                  role="button"
                  onClick={() => handleOrderClick(order.orderNumber)}
                  className="p-5 shadow-xs ring-1 ring-gray-900/5 sm:rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        Order #{order.orderNumber}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Placed on {order.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">
                        Total:{" "}
                        <Price
                          amount={parseFloat(order.total.replace("$", ""))}
                        />
                      </p>
                      <p
                        className={`text-sm font-medium ${
                          order.status === "Delivered"
                            ? "text-green-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {order.status}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <div className="shrink-0">
                          <img
                            src={item.image}
                            alt={item.product}
                            className="h-20 w-20 rounded object-contain"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src =
                                "https://via.placeholder.com/80";
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-md font-medium text-gray-800">
                            {item.product}
                          </h4>
                          <p className="text-sm text-gray-500">
                            Quantity: {item.quantity}
                          </p>
                          <p className="text-sm text-gray-500">
                            {(item.offerPrice ?? 0) > 0 ? (
                              <div className="flex items-center gap-1">
                                <span className="font-semibold">
                                  <Price amount={item.offerPrice ?? 0} />
                                </span>
                                <span className="line-through text-gray-400">
                                  <Price amount={item.price} />
                                </span>
                                <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full ml-2">
                                  {item.price > 0
                                    ? Math.round(
                                        ((item.price -
                                          (item.offerPrice ?? 0)) /
                                          item.price) *
                                          100
                                      )
                                    : 0}
                                  % OFF
                                </span>
                              </div>
                            ) : (
                              <Price amount={item.price} />
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

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
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
