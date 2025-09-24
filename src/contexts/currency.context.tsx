"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useQuery } from "@tanstack/react-query";
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

const ONE_WEEK = 60 * 60 * 24 * 7;

export function CurrencyProvider({ children }: { children: ReactNode }) {
  // read BOTH cookies: explicit user "currency" and geo-derived "default_currency"
  const [cookies, setCookie] = useCookies(["currency", "default_currency"]);
  const [isMounted, setIsMounted] = useState(false);

  // base you query against (keep INR unless you have a reason to change)
  const [baseCurrency] = useState("INR");

  // the currency you display/convert to
  const [currentCurrency, setCurrentCurrency] = useState("INR");

  // initialize currentCurrency with precedence: currency -> default_currency -> INR
  useEffect(() => {
    // normalize to 3-letter uppercase if present
    const normalize = (v?: string) =>
      (v || "").trim().toUpperCase().slice(0, 3) || undefined;

    const cookieCurrency = normalize(cookies.currency);
    const cookieDefault = normalize(cookies.default_currency);

    const initial = cookieCurrency || cookieDefault || "INR";
    setCurrentCurrency(initial);

    // if user didn't have an explicit currency, persist what we chose
    if (!cookieCurrency) {
      setCookie("currency", initial, { path: "/", maxAge: ONE_WEEK });
    }

    setIsMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cookies.currency, cookies.default_currency]);

  // optional: if you want to ensure default_currency exists in dev,
  // you can ping your /api/geo once on mount (safe to omit in prod)
  // useEffect(() => {
  //   if (!cookies.default_currency) {
  //     fetch("/api/geo", { cache: "no-store" }).catch(() => {});
  //   }
  // }, [cookies.default_currency]);

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

    // if the currentCurrency equals the base, price is unchanged
    if (currentCurrency === (data.base || baseCurrency)) return amount;

    const rate = data.rates?.[currentCurrency];
    if (typeof rate === "number" && !Number.isNaN(rate)) {
      return amount * rate;
    }
    // graceful fallback when rate missing
    return amount;
  };

  const handleSetCurrency = (currency: string) => {
    const normalized = currency.trim().toUpperCase().slice(0, 3) || "INR";
    setCurrentCurrency(normalized);
    setCookie("currency", normalized, { path: "/", maxAge: ONE_WEEK });
  };

  if (!isMounted) return null;

  return (
    <CurrencyContext.Provider
      value={{
        baseCurrency: data?.base || baseCurrency,
        currentCurrency,
        rates: data?.rates || {},
        // TODO: wire a symbol map if you have one
        symbol: "",
        setCurrency: handleSetCurrency,
        convertPrice,
        isLoading,
        error: (error as Error) ?? null,
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
