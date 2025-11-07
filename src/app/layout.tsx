import type { Metadata, Viewport } from "next";
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
import { SpeedInsights } from "@vercel/speed-insights/next";
import MobileDoc from "@/components/navbar/MobileDoc";
import PushNotificationHandler from "@/components/PushNotificationHandler";
import InstallPrompt from "@/components/InstallPromt";

const inter = Inter({ subsets: ["latin"] });
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#521dd3",
  viewportFit: "cover",
};
const APP_NAME = "Eximso";
const APP_DEFAULT_TITLE = "The Most Trusted Platform for Global Shopping";
const APP_TITLE_TEMPLATE = "%s - PWA App";
const APP_DESCRIPTION =
  "India's leading online platform for B2C and B2B needs. Find the widest selection of Mobiles, Fashion, Electronics, Appliances, Books, Homeware, Furniture, Groceries, Jewelry, Sporting Goods, Beauty & Personal Care, and more! We offer the largest brand selection at unbeatable prices in India.";
export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" className="scroll-smooth">
      <head>
        <meta name="apple-mobile-web-app-title" content="Eximso" />
      </head>
      <body className={`${inter.className} overflow-x-hidden`}>
        <Providers>
          <PushNotificationHandler />
          <AppNavBar />
          <Suspense>{children}</Suspense>
          <Footer />
          <ManagedDrawer />
          <Toaster />
          <InstallPrompt />
          <Analytics />
          <SpeedInsights />
          <ReactQueryDevtools initialIsOpen={false} />
          <MobileDoc />
        </Providers>
      </body>
    </html>
  );
}
