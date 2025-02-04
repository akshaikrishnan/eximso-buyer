import ExportInvoice from "@/components/profile/Profile-billing";
import React from "react";

export default function Invoice({ params }: any) {
  return <ExportInvoice orderId={params?.orderId} />;
}
