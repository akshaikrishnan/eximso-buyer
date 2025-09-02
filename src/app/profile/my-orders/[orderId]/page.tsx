import OrderDetails from "@/components/profile/order-details";
import React from "react";

export default async function OrderDetailPage(props: any) {
  const params = await props.params;
  return <OrderDetails orderId={params?.orderId} />;
}
