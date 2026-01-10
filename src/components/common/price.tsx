"use client";

import { useCurrency } from "@/contexts/currency.context";
import { Skeleton } from "@/components/ui/skeleton";

interface PriceProps {
  amount: number;
  className?: string;
  isLoadingExternal?: boolean;
}

export function Price({ amount, className, isLoadingExternal }: PriceProps) {
  const { convertPrice, currentCurrency, isLoading, error } = useCurrency();

  if (isLoadingExternal || isLoading) {
    return <Skeleton className={`h-6 w-20 ${className}`} />;
  }

  if (error) {
    return <span className={className}>Price unavailable</span>;
  }

  const convertedAmount = convertPrice(amount);

  return (
    <span className={className}>
      {new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: currentCurrency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(convertedAmount)}
    </span>
  );
}
