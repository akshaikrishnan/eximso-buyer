"use client";

import { UIProvider } from "./ui.context";

export function Providers({ children }: any) {
  return <UIProvider>{children}</UIProvider>;
}
