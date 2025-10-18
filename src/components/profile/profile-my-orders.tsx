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
  GrandTotal?: string;
  orders: Order[];
}

const MyOrders = () => {
  const router = useRouter();

  const { data: orderGroups, isLoading, isError } = useQuery({
    queryKey: ["orders"],
    queryFn: async (): Promise<OrderGroup[]> => {
      const res = await api.get(`${endpoints.order}/grouped`);
      return res.data.result.data.map((group: any) => ({
        GrandTotal: group.groupGrandTotal || "Grouped Orders",
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
          items:
            order.items?.map((item: any) => ({
              product: item.product?.name || "Unknown Product",
              quantity: item.quantity || 0,
              price: item.product?.price ?? 0,
              offerPrice: item.product?.offerPrice ?? 0,
              image: item.product?.images?.[0] || item.product?.thumbnail,
            })) || [],
        })),
      }));
    },
  });

  if (isLoading) return <Loader fullScreen />;
  if (!orderGroups || isError || orderGroups.length === 0)
    return <EmptyOrder />;

  const handleOrderClick = (orderNumber: string) => {
    router.push(`/profile/my-orders/${orderNumber}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 max-w-7xl">
        {/* Page Header */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
            My Orders
          </h1>
          <p className="text-xs sm:text-sm lg:text-base text-gray-600 mt-1 sm:mt-2">
            View and track your order history
          </p>
        </div>

        {/* Order Groups */}
        <div className="space-y-4 sm:space-y-5 lg:space-y-6">
          {orderGroups.map((group, groupIndex) => (
            <div
              key={groupIndex}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* Group Header */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 sm:px-5 lg:px-6 py-3 sm:py-4 border-b border-gray-200">
                <div className="flex items-center justify-end">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xs sm:text-sm text-gray-600 font-medium">
                      Grand Total:
                    </span>
                    <span className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">

                      <Price amount={Number(group.GrandTotal) || 0} />
                    </span>
                  </div>
                </div>
              </div>

              {/* Orders List */}
              <div className="divide-y divide-gray-100">
                {group.orders.map((order) => (
                  <div
                    key={order.id}
                    role="button"
                    onClick={() => handleOrderClick(order.orderNumber)}
                    className="bg-white hover:bg-gray-50 transition-all duration-200 cursor-pointer"
                  >
                    {/* Order Header */}
                    <div className="px-4 sm:px-5 lg:px-6 py-4 sm:py-5 border-b border-gray-100">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                          <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900">
                            Order #{order.orderNumber}
                          </h3>
                          <span
                            className={`inline-flex items-center px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-xs font-medium w-fit ${order.status === "Delivered"
                              ? "bg-green-100 text-green-800"
                              : order.status === "Shipped"
                                ? "bg-blue-100 text-blue-800"
                                : order.status === "Cancelled"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                          >
                            {order.status}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-500">
                          Placed on {order.date}
                        </p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="px-4 sm:px-5 lg:px-6 py-4 space-y-3 sm:space-y-4">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex gap-3 sm:gap-4 lg:gap-6 pb-3 sm:pb-4 last:pb-0 border-b border-gray-100 last:border-0"
                        >
                          {/* Product Image */}
                          <div className="shrink-0">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                              <img
                                src={item.image}
                                alt={item.product}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).src =
                                    "https://via.placeholder.com/80";
                                }}
                              />
                            </div>
                          </div>

                          {/* Product Details - Desktop Layout */}
                          <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm sm:text-base lg:text-lg font-medium text-gray-900 line-clamp-2 mb-1">
                                {item.product}
                              </h4>
                              <p className="text-xs sm:text-sm text-gray-500">
                                Quantity: {item.quantity}
                              </p>
                            </div>

                            {/* Price Section - Aligned Right on Desktop */}
                            <div className="shrink-0 sm:text-right">
                              {item.offerPrice && item.offerPrice > 0 ? (
                                <div className="space-y-1">
                                  <div className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">
                                    <Price amount={item.offerPrice} />
                                  </div>
                                  <div className="flex sm:justify-end items-center gap-2">
                                    <span className="text-xs sm:text-sm line-through text-gray-400">
                                      <Price amount={item.price} />
                                    </span>
                                    <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-md text-xs font-semibold bg-red-100 text-red-700">
                                      {Math.round(((item.price - item.offerPrice) / item.price) * 100)}% OFF
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <div className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">
                                  <Price amount={item.price} />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* View Details Footer */}
                    <div className="px-4 sm:px-5 lg:px-6 py-3 sm:py-4 bg-gray-50 border-t border-gray-100">
                      <Link
                        href={`/profile/my-orders/${order.orderNumber}`}
                        className="inline-flex items-center justify-center sm:justify-start w-full sm:w-auto text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span>View Order Details</span>
                        <svg
                          className="ml-1.5 w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;