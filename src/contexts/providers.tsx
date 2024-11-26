"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UIProvider } from "./ui.context";
const queryClient = new QueryClient();

export function Providers({ children }: any) {
  return (
    <UIProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </UIProvider>
  );
}
