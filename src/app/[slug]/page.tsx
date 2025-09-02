import ProductDetail from "@/components/products/product-detail";
import api from "@/lib/api/axios.interceptor";
import { endpoints } from "@/lib/data/endpoints";
import { notFound } from "next/navigation";
import React from "react";

export default async function page(props: any) {
  const params = await props.params;
  try {
    if (params.slug) {
      const res: any = await api.get(
        `${process.env.NEXT_PUBLIC_API_URL + endpoints.products}/${params.slug}`
      );
      const data = await res.data.result;
      console.log(res);
      if (res.success === false)
        return <div className="">Product not found</div>;
      return <ProductDetail product={data} />;
    } else {
      return <div className="">Product not found</div>;
    }
  } catch (err) {
    notFound();
  }
}
