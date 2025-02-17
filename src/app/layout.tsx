import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppNavBar from "@/components/navbar/app-navbar";
import Footer from "@/components/layout/footer";
import ManagedDrawer from "@/components/ui/managed-drawer";
import { Providers } from "@/contexts/providers";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "@/components/ui/toaster";
import { Suspense } from "react";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title:
    "Online Shopping India Mobile, Cameras, Lifestyle & more Online | Eximso.com | b2b & b2c",
  description:
    "India's leading online platform for B2C and B2B needs. Find the widest selection of Mobiles, Fashion, Electronics, Appliances, Books, Homeware, Furniture, Groceries, Jewelry, Sporting Goods, Beauty & Personal Care, and more! We offer the largest brand selection at unbeatable prices in India.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <body className={`${inter.className} overflow-x-hidden`}>
        <Providers>
          <AppNavBar />
          <Suspense>{children}</Suspense>
          <Footer />
          <ManagedDrawer />
          <Toaster />
          <Analytics />
          <ReactQueryDevtools initialIsOpen={false} />
        </Providers>
      </body>
    </html>
  );
}
