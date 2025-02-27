"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UIProvider } from "./ui.context";
import AuthProvider from "./auth-provider";
import { CurrencyProvider } from "./currency.context";
const queryClient = new QueryClient();

export function Providers({ children }: any) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CurrencyProvider>
          <UIProvider>{children}</UIProvider>
        </CurrencyProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
