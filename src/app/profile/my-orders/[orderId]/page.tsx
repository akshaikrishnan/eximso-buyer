import OrderDetails from "@/components/profile/order-details";
import React from "react";

export default function OrderDetailPage({ params }: any) {
  return <OrderDetails orderId={params?.orderId} />;
}
