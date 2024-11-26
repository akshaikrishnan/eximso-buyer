import ProductDetail from "@/components/products/product-detail";
import api from "@/lib/api/axios.interceptor";
import { endpoints } from "@/lib/data/endpoints";
import React from "react";

export default async function page({ params }: any) {
  if (params.slug) {
    const res: any = await api.get(`${endpoints.products}/${params.slug}`);
    const data = await res.data.result;
    if (res.success === false) return <div className="">Product not found</div>;
    return <ProductDetail product={data} />;
  }
  return <div className="">Product not found</div>;
}
