import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function redirectToLogin({ from }: { from?: string }) {
  if (typeof window === "undefined")
    return new URL(
      `${process.env.NEXT_PUBLIC_SELLER_URL}/auth/login?from=${from}&userType=Buyer`
    );
  const path = from ?? window.location.pathname;
  const sellerDomain = process.env.NEXT_PUBLIC_SELLER_URL;
  //localhost:3001/auth/login?from=/dell-or-g15-gaming-laptop&userType=Buyer
  const loginUrl = new URL(
    `${sellerDomain}/auth/login?from=${path}&userType=Buyer`
  );
  window.location.href = loginUrl.toString();
}
