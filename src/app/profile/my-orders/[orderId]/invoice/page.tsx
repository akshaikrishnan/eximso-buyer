import ExportInvoice from "@/components/profile/Profile-billing";
import React from "react";

export default async function Invoice(props: any) {
  const params = await props.params;
  return <ExportInvoice orderId={params?.orderId} />;
}
