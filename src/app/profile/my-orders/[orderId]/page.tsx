import OrderDetails from "@/components/profile/order-details";
import React from "react";

export default async function Page({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  return <OrderDetails orderNumber={orderId} />;
}
