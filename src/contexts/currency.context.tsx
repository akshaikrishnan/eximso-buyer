"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import api from "@/lib/api/axios.interceptor";

interface CurrencyRate {
  [key: string]: number;
}

interface CurrencyApiResponse {
  base: string;
  rates: CurrencyRate;
  updatedAt: string;
}

interface CurrencyContextType {
  baseCurrency: string;
  currentCurrency: string;
  rates: CurrencyRate;
  symbol: string;
  setCurrency: (currency: string) => void;
  convertPrice: (amount: number) => number;
  isLoading: boolean;
  error: Error | null;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined
);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [cookies, setCookie] = useCookies(["currency"]);
  const [baseCurrency, setBaseCurrency] = useState("INR");
  const [isMounted, setIsMounted] = useState(false);
  const [currentCurrency, setCurrentCurrency] = useState("INR"); // Default value

  // Get initial currency from cookies AFTER mount
  useEffect(() => {
    const savedCurrency = document.cookie
      .split("; ")
      .find((row) => row.startsWith("currency="))
      ?.split("=")[1];

    if (savedCurrency) {
      setCurrentCurrency(savedCurrency);
    }
    setIsMounted(true);
  }, []);

  // ... rest of your context logic

  const { data, isLoading, error } = useQuery<CurrencyApiResponse>({
    queryKey: ["exchangeRates", baseCurrency],
    queryFn: async () => {
      const response = await api.get<CurrencyApiResponse>("/rates/currency", {
        params: { base: baseCurrency },
      });
      return response.data;
    },
    staleTime: 3600000, // 1 hour
    retry: 2,
  });

  const convertPrice = (amount: number): number => {
    if (!data || isLoading || error) return amount;
    const rate = data.rates[currentCurrency];
    return amount * rate;
  };

  const handleSetCurrency = (currency: string) => {
    setCurrentCurrency(currency);
    setCookie("currency", currency, { path: "/", maxAge: 604800 }); // 1 week
  };

  if (!isMounted) return null;

  return (
    <CurrencyContext.Provider
      value={{
        baseCurrency: data?.base || "INR",
        currentCurrency,
        rates: data?.rates || {},
        symbol: "", // You can add symbol mapping
        setCurrency: handleSetCurrency,
        convertPrice,
        isLoading,
        error: error as Error | null,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};
