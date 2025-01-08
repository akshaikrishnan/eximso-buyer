"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UIProvider } from "./ui.context";
import AuthProvider from "./auth-provider";
const queryClient = new QueryClient();

export function Providers({ children }: any) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <UIProvider>{children}</UIProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
