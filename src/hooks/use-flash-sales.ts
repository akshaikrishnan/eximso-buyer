"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import api from "@/lib/api/axios.interceptor";
import { endpoints } from "@/lib/data/endpoints";

export interface FlashSaleProduct {
  _id?: string;
  name?: string;
  slug?: string;
  shortDescription?: string;
  detailedDescription?: string;
  price?: number;
  offerPrice?: number;
  flashPrice?: number;
  thumbnail?: string;
  images?: string[];
  stock?: number;
  flashSaleId?: string;
  flashSaleHidden?: boolean;
  isFlashSaleVariant?: boolean;
  maxUnitsPerUser?: number;
  totalUnits?: number;
  claimedUnits?: number;
  endDate?: string;
}

export interface FlashSaleItem {
  flashSaleId: string;
  label?: string;
  endDate?: string;
  totalUnits?: number;
  claimedUnits?: number;
  maxUnitsPerUser?: number;
  flashPrice?: number;
  product: FlashSaleProduct;
  originalProduct?: FlashSaleProduct;
}

interface FlashSaleResponse {
  success?: boolean;
  result?: FlashSaleItem[];
  data?: FlashSaleItem[];
}

const fetchFlashSales = async (): Promise<FlashSaleItem[]> => {
  const res = await api.get<FlashSaleResponse>(endpoints.flashSale);
  if (Array.isArray(res.data?.result)) return res.data.result;
  if (Array.isArray(res.data?.data)) return res.data.data;
  return [];
};

export const useFlashSales = () =>
  useQuery({
    queryKey: ["flashsale"],
    queryFn: fetchFlashSales,
    staleTime: 60 * 1000,
    refetchInterval: 60 * 1000,
  });

export const useFlashSaleForProduct = (
  productId?: string,
  flashSaleId?: string | null,
) => {
  const query = useFlashSales();

  const sale = useMemo(() => {
    if (!query.data || (!productId && !flashSaleId)) return undefined;

    return query.data.find((item) => {
      if (flashSaleId && item.flashSaleId === flashSaleId) return true;
      return (
        item.product?._id === productId ||
        item.originalProduct?._id === productId
      );
    });
  }, [flashSaleId, productId, query.data]);

  return { ...query, sale } as const;
};

export const isFlashSaleActive = (sale?: FlashSaleItem | null) => {
  if (!sale) return false;

  if (sale.product?.flashSaleHidden) return false;

  if (!sale.endDate) return true;
  const endTime = Date.parse(sale.endDate);
  if (Number.isNaN(endTime)) return true;

  return endTime > Date.now();
};

export const getFlashSaleProgress = (sale?: FlashSaleItem | null) => {
  if (!sale) {
    return { claimed: 0, total: 0, left: 0, percentClaimed: 0 } as const;
  }

  const claimed = Number(sale.claimedUnits ?? sale.product?.claimedUnits ?? 0);
  const total = Number(sale.totalUnits ?? sale.product?.totalUnits ?? 0);
  const normalizedTotal = Number.isFinite(total) && total > 0 ? total : 0;
  const normalizedClaimed = Math.min(
    Number.isFinite(claimed) && claimed > 0 ? claimed : 0,
    normalizedTotal,
  );

  const left = Math.max(normalizedTotal - normalizedClaimed, 0);
  const percentClaimed =
    normalizedTotal > 0
      ? Math.min(100, (normalizedClaimed / normalizedTotal) * 100)
      : 0;

  return { claimed: normalizedClaimed, total: normalizedTotal, left, percentClaimed } as const;
};
